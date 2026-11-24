from as_project.media_utils import resolve_media_url
from rest_framework import serializers
from .models import Wishlist


class WishlistSerializer(serializers.ModelSerializer):
    product_title = serializers.ReadOnlyField(source='product.title')
    product_price = serializers.ReadOnlyField(source='product.price')
    product_image = serializers.SerializerMethodField()

    class Meta:
        model = Wishlist
        fields = [
            'id',
            'product',
            'product_title',
            'product_price',
            'product_image',
            'created_at',
        ]
        read_only_fields = ['user']

    def get_product_image(self, obj):
        product = getattr(obj, 'product', None)
        if not product:
            return None

        request = self.context.get('request')
        
        # 1. ProductSerializer ka original logic
        if hasattr(product, 'image') and product.image:
            return resolve_media_url(request, product.image.url)
            
        # 2. Check direct string image_url (fallback)
        if getattr(product, 'image_url', None):
            return product.image_url

        return None