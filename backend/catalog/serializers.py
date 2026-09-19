from rest_framework import serializers
from .models import Product

class ProductSearchSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        # --- FIELDS KI LIST MEIN 'stock' AUR 'in_stock' ADD HUA HAI ---
        fields = ['id', 'title', 'price', 'discount_price', 'image_url', 'is_new', 'category_name', 'stock', 'in_stock']

    def get_image_url(self, obj):
        request = self.context.get('request')
        first_image = obj.images.first()
        if first_image and first_image.image:
            return request.build_absolute_uri(first_image.image.url) if request else first_image.image.url
        return None