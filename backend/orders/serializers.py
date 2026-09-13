from rest_framework import serializers
from .models import Order, OrderItem, ShippingAddress
from cart.models import Cart


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'
        read_only_fields = ['user']


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.title')
    product_price = serializers.ReadOnlyField(source='product.price')

    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'product_price', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    shipping_address = ShippingAddressSerializer()

    class Meta:
        model = Order
        fields = [
            'id', 'total_amount', 'status', 'created_at', 
            'shipping_address', 'items', 
            'razorpay_order_id', 'razorpay_payment_id'
        ]
        read_only_fields = ['total_amount', 'status', 'razorpay_order_id', 'razorpay_payment_id']

    def create(self, validated_data):
        address_data = validated_data.pop('shipping_address')
        user = self.context['request'].user

        # 1. Fetch user's active cart
        cart = Cart.objects.filter(user=user).first()
        if not cart or not cart.items.exists():
            raise serializers.ValidationError({"detail": "Your cart is empty."})

        # 2. Create the Shipping Address safely
        shipping_address = ShippingAddress.objects.create(user=user, **address_data)

        # 3. Calculate total amount dynamically from database
        total_amount = sum(item.product.price * item.quantity for item in cart.items.all())

        # 4. Create the main Order instance
        order = Order.objects.create(
            user=user,
            shipping_address=shipping_address,
            total_amount=total_amount,
            **validated_data
        )

        # 5. Map cart items to order items
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                product_name=cart_item.product.title,
                price=cart_item.product.price,
                quantity=cart_item.quantity
            )

        # 6. Clear out the cart post-checkout
        cart.items.all().delete()

        return order