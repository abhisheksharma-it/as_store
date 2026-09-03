from rest_framework import serializers
from .models import Cart, CartItem
from catalog.models import Product

# Cart me product ki details dikhane ke liye
class ProductCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'discount_price', ] # Baad me image bhi add kar lenge

# Har cart item (Product + Quantity + item total)
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductCartSerializer(read_only=True)
    item_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity', 'item_total']

    def get_item_total(self, obj):
        # Agar discount hai toh wo use karo, warna original price
        price = obj.product.discount_price if obj.product.discount_price else obj.product.price
        return float(price) * obj.quantity

# Pura Cart (Saare items + Final Total)
class CartSerializer(serializers.ModelSerializer):
    # Yahan source='cartitem_set' hata diya kyunki models me related_name='items' hai
    items = CartItemSerializer(many=True, read_only=True)
    cart_total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'cart_total']

    def get_cart_total(self, obj):
        total = 0
        # Yahan bhi obj.items.all() aayega
        for item in obj.items.all():
            price = item.product.discount_price if item.product.discount_price else item.product.price
            total += (float(price) * item.quantity)
        return total