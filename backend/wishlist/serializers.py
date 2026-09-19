from rest_framework import serializers
from .models import Wishlist

class WishlistSerializer(serializers.ModelSerializer):
    product_title = serializers.ReadOnlyField(source='product.title')
    product_price = serializers.ReadOnlyField(source='product.price')
    # 🔴 NAYI LINE: Image ka URL bhejne ke liye
    product_image = serializers.ReadOnlyField(source='product.image_url') 

    class Meta:
        model = Wishlist
        # 🔴 'product_image' ko is list me add kiya hai
        fields = ['id', 'product', 'product_title', 'product_price', 'product_image', 'created_at']
        read_only_fields = ['user']