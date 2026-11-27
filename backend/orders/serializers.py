import re
from as_project.media_utils import resolve_media_url
from rest_framework import serializers
from .models import Order, OrderItem, ShippingAddress
from catalog.models import Product

FALLBACK_IMAGE = (
    "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg"
    "?auto=compress&cs=tinysrgb&w=200"
)


class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = "__all__"
        read_only_fields = ["user"]


class OrderItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="product_name", read_only=True)
    product_id = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product_id",
            "product_name",
            "name",
            "price",
            "quantity",
            "image",
            "size",
        ]

    def _get_product(self, obj):
        if hasattr(obj, "_cached_product"):
            return obj._cached_product

        product = obj.product if obj.product_id else None
        if not product:
            raw_name = (obj.product_name or "").strip()
            if raw_name:
                base_title = re.sub(r"\s*\([^)]*\)\s*$", "", raw_name).strip()
                product = (
                    Product.objects.filter(title__iexact=raw_name).first()
                    or Product.objects.filter(title__iexact=base_title).first()
                )

        obj._cached_product = product
        return product

    def get_product_id(self, obj):
        if obj.product_id:
            return obj.product_id
        product = self._get_product(obj)
        return product.id if product else None

    def get_image(self, obj):
        request = self.context.get("request")
        try:
            product = self._get_product(obj)
            if product:
                if product.image:
                    return resolve_media_url(request, product.image.url)
                first_gallery = product.gallery_images.first()
                if first_gallery and first_gallery.image:
                    return resolve_media_url(request, first_gallery.image.url)
        except Exception:
            pass
        return FALLBACK_IMAGE

    def get_size(self, obj):
        if hasattr(obj, "size") and getattr(obj, "size"):
            return obj.size
        match = re.search(r"\(([^)]+)\)\s*$", obj.product_name or "")
        return match.group(1).strip() if match else "Standard"


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    shipping_address = ShippingAddressSerializer(read_only=True)
    date = serializers.DateTimeField(
        source="created_at", format="%d %b, %Y", read_only=True
    )

    class Meta:
        model = Order
        fields = [
            "id",
            "total_amount",
            "status",
            "created_at",
            "date",
            "shipping_address",
            "items",
            "razorpay_order_id",
            "razorpay_payment_id",
        ]