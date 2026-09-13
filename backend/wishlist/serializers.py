from rest_framework import serializers
from .models import Wishlist

class WishlistSerializer(serializers.ModelSerializer):
    product_title = serializers.ReadOnlyField(source='product.title')
    product_price = serializers.ReadOnlyField(source='product.price')

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_title', 'product_price', 'created_at']
        read_only_fields = ['user']