import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Order, OrderItem, ShippingAddress
from .serializers import OrderSerializer, ShippingAddressSerializer
from cart.models import Cart
# Product model import karna padega stock check ke liye
from catalog.models import Product 

# --- orders/views.py mein CheckoutAPIView ko REPACE karna hai ---

class CheckoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        address_id = request.data.get('address_id')
        items = request.data.get('items', []) # React se direct items aayenge

        if not address_id:
            return Response({"error": "address_id provide karna mandatory hai."}, status=status.HTTP_400_BAD_REQUEST)

        if not items:
             return Response({"error": "Aapka cart khali hai (Frontend se data nahi aaya)!"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            shipping_address = ShippingAddress.objects.get(id=address_id, user=user)
        except ShippingAddress.DoesNotExist:
            return Response({"error": "Address exist nahi karta ya aapka nahi hai."}, status=status.HTTP_404_NOT_FOUND)

        # 1. Total Calculate aur Stock Check karein
        total_amount = 0
        order_items_data = []

        for item in items:
            try:
                product = Product.objects.get(id=item['product_id'])
            except Product.DoesNotExist:
                return Response({"error": f"Product ID {item['product_id']} nahi mila."}, status=status.HTTP_404_NOT_FOUND)
            
            quantity = int(item['quantity'])
            
            # Stock check
            if quantity > product.stock:
                return Response({
                    "error": f"Sorry! Checkout fail. '{product.title}' ka sirf {product.stock} stock bacha hai."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            price = float(item['price'])
            total_amount += (price * quantity)
            
            order_items_data.append({
                'product': product,
                'quantity': quantity,
                'price': price,
                'product_name': product.title
            })

        # 2. Order Create karein
        order = Order.objects.create(
            user=user,
            shipping_address=shipping_address,
            total_amount=total_amount
        )

        # 3. Order Items Create karein
        for item_data in order_items_data:
            OrderItem.objects.create(
                order=order,
                product=item_data['product'],
                product_name=item_data['product_name'],
                price=item_data['price'],
                quantity=item_data['quantity']
            )

        serializer = OrderSerializer(order)
        return Response({
            "message": "Order successfully place ho gaya! 🎉",
            "order": serializer.data
        }, status=status.HTTP_201_CREATED)


class InitiatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('order_id')
        if not order_id:
            return Response({"error": "order_id dena zaroori hai."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Order nahi mila."}, status=status.HTTP_404_NOT_FOUND)

        mock_order_id = f"order_mock_{uuid.uuid4().hex[:14]}"
        order.razorpay_order_id = mock_order_id
        order.save()

        return Response({
            "message": "Payment initiate ho gaya (Mock Mode)",
            "razorpay_order_id": mock_order_id,
            "amount": order.total_amount,
            "currency": "INR",
            "status": "created"
        }, status=status.HTTP_200_OK)


class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        payment_status = request.data.get('status', 'success')

        if not razorpay_order_id:
            return Response({"error": "razorpay_order_id mandatory hai."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(razorpay_order_id=razorpay_order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Invalid order reference."}, status=status.HTTP_404_NOT_FOUND)

        # Agar order pehle hi paid ho chuka hai, toh dobara stock minus na ho
        if order.status == 'Paid':
            return Response({"message": "Order pehle se hi Paid hai!"}, status=status.HTTP_200_OK)

        if payment_status == 'success':
            order.razorpay_payment_id = f"pay_mock_{uuid.uuid4().hex[:14]}"
            order.razorpay_signature = f"sig_mock_{uuid.uuid4().hex[:20]}"
            order.status = 'Paid'
            order.save()

            # --- NAYA LOGIC: INVENTORY STOCK DEDUCTION ---
            order_items = OrderItem.objects.filter(order=order)
            for item in order_items:
                if item.product:
                    # Database me se utni T-shirt minus kardo jitni order hui hain
                    item.product.stock -= item.quantity
                    item.product.save()

            serializer = OrderSerializer(order)
            return Response({
                "message": "Payment verified successfully! Order Paid and Stock Updated.",
                "order": serializer.data
            }, status=status.HTTP_200_OK)
        else:
            order.status = 'Failed'
            order.save()
            return Response({"error": "Payment failed!"}, status=status.HTTP_400_BAD_REQUEST)


class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
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
            return Response({"error": "Order nahi mila!"}, status=status.HTTP_404_NOT_FOUND)


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
            return Response({"message": "Address save ho gaya!", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)