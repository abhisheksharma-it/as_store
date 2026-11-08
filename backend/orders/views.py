import os
from pathlib import Path
import razorpay
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db import transaction

from .models import Order, OrderItem, ShippingAddress
from .serializers import OrderSerializer, ShippingAddressSerializer
from catalog.models import Product

# Load backend/.env automatically
env_path = Path(__file__).resolve().parent.parent / '.env'
if env_path.exists():
    for line in env_path.read_text().splitlines():
        if '=' in line and not line.strip().startswith('#'):
            k, v = line.strip().split('=', 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

# SECURE: Keys are fetched from environment only
RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "")

FREE_SHIPPING_THRESHOLD = 4999.0
STANDARD_SHIPPING_FEE = 199.0


class CheckoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        user = request.user
        address_id = request.data.get('address_id')
        items = request.data.get('items', [])
        payment_method = request.data.get('payment_method', 'ONLINE')

        if not address_id or not items:
            return Response(
                {"error": "Shipping address and cart items are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            shipping_address = ShippingAddress.objects.get(id=address_id, user=user)
        except ShippingAddress.DoesNotExist:
            return Response({"error": "Invalid shipping address."}, status=status.HTTP_404_NOT_FOUND)

        subtotal = 0.0
        order_items_data = []

        for item in items:
            # FIX: Row-level lock on Product to prevent race condition during stock check
            try:
                product = Product.objects.select_for_update().get(id=item['product_id'])
            except Product.DoesNotExist:
                return Response(
                    {"error": f"Product ID {item.get('product_id')} not found."},
                    status=status.HTTP_404_NOT_FOUND
                )

            quantity = int(item.get('quantity', 1))
            if quantity <= 0 or quantity > product.stock:
                return Response(
                    {"error": f"Only {product.stock} left in stock for '{product.title}'."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # SECURITY FIX: Always use DB price, never trust frontend payload price
            db_price = float(product.price)
            subtotal += db_price * quantity

            selected_size = item.get('size') or 'Standard'
            order_items_data.append({
                'product': product,
                'quantity': quantity,
                'price': db_price,
                'product_name': f"{product.title} ({selected_size})",
            })

        shipping_fee = 0.0 if subtotal >= FREE_SHIPPING_THRESHOLD else STANDARD_SHIPPING_FEE
        total_amount = subtotal + shipping_fee

        order = Order.objects.create(
            user=user,
            shipping_address=shipping_address,
            total_amount=total_amount,
            status='COD' if payment_method == 'COD' else 'Pending'
        )

        for item_data in order_items_data:
            OrderItem.objects.create(
                order=order,
                product=item_data['product'],
                product_name=item_data['product_name'],
                price=item_data['price'],
                quantity=item_data['quantity']
            )
            if payment_method == 'COD':
                prod = item_data['product']
                prod.stock = max(0, prod.stock - item_data['quantity'])
                prod.save()

        return Response({
            "message": "Order created securely!",
            "order": OrderSerializer(order).data
        }, status=status.HTTP_201_CREATED)


class InitiatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        if not order_id:
            return Response(
                {"error": "order_id dena zaroori hai."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order nahi mila."},
                status=status.HTTP_404_NOT_FOUND
            )

        client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
        amount_in_paise = int(order.total_amount * 100)

        data = {
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": f"rcpt_{order.id}"
        }

        try:
            razorpay_order = client.order.create(data=data)
            order.razorpay_order_id = razorpay_order['id']
            order.save()

            return Response({
                "message": "Payment initiated securely",
                "razorpay_order_id": razorpay_order['id'],
                "amount": amount_in_paise,
                "currency": "INR"
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"Razorpay API Error: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )


class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')

        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return Response(
                {"error": "Incomplete payment data."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # FIX: Row-level lock on Order to prevent duplicate webhook/double-click race condition
            order = Order.objects.select_for_update().get(
                razorpay_order_id=razorpay_order_id,
                user=request.user
            )
        except Order.DoesNotExist:
            return Response(
                {"error": "Invalid order reference."},
                status=status.HTTP_404_NOT_FOUND
            )

        if order.status == 'Paid':
            return Response(
                {"message": "Order already verified.", "order": OrderSerializer(order).data},
                status=status.HTTP_200_OK
            )

        client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

        try:
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })

            order.razorpay_payment_id = razorpay_payment_id
            order.razorpay_signature = razorpay_signature
            order.status = 'Paid'
            order.save()

            order_items = OrderItem.objects.select_related('product').filter(order=order)
            for item in order_items:
                if item.product_id:
                    # FIX: Row-level lock before deducting stock on successful online payment
                    product = Product.objects.select_for_update().get(id=item.product_id)
                    product.stock = max(0, product.stock - item.quantity)
                    product.save()

            return Response({
                "message": "Payment verified securely!",
                "order": OrderSerializer(order).data
            }, status=status.HTTP_200_OK)

        except razorpay.errors.SignatureVerificationError:
            order.status = 'Failed'
            order.save()
            return Response(
                {"error": "Payment signature verification failed."},
                status=status.HTTP_400_BAD_REQUEST
            )


class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # N+1 Query Fix: Fetches orders, shipping address, and nested items efficiently
        orders = (
            Order.objects.filter(
                user=request.user,
                status__in=['Paid', 'COD', 'Return Requested', 'Refunded']
            )
            .select_related('shipping_address')
            .prefetch_related('items__product')
            .order_by('-created_at')
        )
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.get(id=pk, user=request.user)
            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order nahi mila!"},
                status=status.HTTP_404_NOT_FOUND
            )


class RequestReturnView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, order_id):
        try:
            # FIX: Lock order row so user cannot spam return requests
            order = Order.objects.select_for_update().get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if order.status not in ['Paid', 'COD']:
            return Response(
                {"error": "Order is not eligible for return."},
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = 'Return Requested'
        order.save()

        # Stock wapas inventory mein add karein
        order_items = OrderItem.objects.filter(order=order)
        for item in order_items:
            if item.product_id:
                product = Product.objects.select_for_update().get(id=item.product_id)
                product.stock += item.quantity
                product.save()

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AddressListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        addresses = ShippingAddress.objects.filter(user=request.user)
        serializer = ShippingAddressSerializer(addresses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = ShippingAddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                {"message": "Address save ho gaya!", "data": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddressDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return ShippingAddress.objects.get(id=pk, user=user)
        except ShippingAddress.DoesNotExist:
            return None

    def get(self, request, pk):
        address = self.get_object(pk, request.user)
        if not address:
            return Response(
                {"error": "Address nahi mila."},
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = ShippingAddressSerializer(address)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        address = self.get_object(pk, request.user)
        if not address:
            return Response(
                {"error": "Address nahi mila."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ShippingAddressSerializer(address, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Address update ho gaya!", "data": serializer.data},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        address = self.get_object(pk, request.user)
        if not address:
            return Response(
                {"error": "Address nahi mila."},
                status=status.HTTP_404_NOT_FOUND
            )

        address.delete()
        return Response(
            {"message": "Address delete ho gaya!"},
            status=status.HTTP_204_NO_CONTENT
        )