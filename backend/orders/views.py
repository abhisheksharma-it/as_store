import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Order, OrderItem, ShippingAddress
from .serializers import OrderSerializer, ShippingAddressSerializer
from cart.models import Cart


class CheckoutAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        address_id = request.data.get('address_id')

        if not address_id:
            return Response({"error": "address_id provide karna mandatory hai."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            shipping_address = ShippingAddress.objects.get(id=address_id, user=user)
        except ShippingAddress.DoesNotExist:
            return Response({"error": "Address exist nahi karta ya aapka nahi hai."}, status=status.HTTP_404_NOT_FOUND)

        try:
            cart, created = Cart.objects.get_or_create(user=user)
            cart_items = cart.items.all()

            if not cart_items.exists():
                return Response({"error": "Aapka cart khali hai!"}, status=status.HTTP_400_BAD_REQUEST)

            total_amount = sum(item.product.price * item.quantity for item in cart_items if item.product)

            order = Order.objects.create(
                user=user,
                shipping_address=shipping_address,
                total_amount=total_amount
            )

            for item in cart_items:
                if item.product:
                    OrderItem.objects.create(
                        order=order,
                        product=item.product,
                        product_name=item.product.title,
                        price=item.product.price,
                        quantity=item.quantity
                    )

            cart_items.delete()

            serializer = OrderSerializer(order)
            return Response({
                "message": "Order successfully place ho gaya! 🎉",
                "order": serializer.data
            }, status=status.HTTP_201_CREATED)

        except Cart.DoesNotExist:
            return Response({"error": "Cart nahi mila."}, status=status.HTTP_404_NOT_FOUND)


# 1. Mock Payment Initiation
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

        # Realistic Mock Order ID Generate karo (bina kisi external API call ke)
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


# 2. Mock Payment Verification & Status Update
class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        razorpay_order_id = request.data.get('razorpay_order_id')
        payment_status = request.data.get('status', 'success')  # success / failed simulate kar sakte ho

        if not razorpay_order_id:
            return Response({"error": "razorpay_order_id mandatory hai."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(razorpay_order_id=razorpay_order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({"error": "Invalid order reference."}, status=status.HTTP_404_NOT_FOUND)

        if payment_status == 'success':
            # Simulated payment successful
            order.razorpay_payment_id = f"pay_mock_{uuid.uuid4().hex[:14]}"
            order.razorpay_signature = f"sig_mock_{uuid.uuid4().hex[:20]}"
            order.status = 'Paid'
            order.save()

            serializer = OrderSerializer(order)
            return Response({
                "message": "Payment verified successfully! Order Paid.",
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