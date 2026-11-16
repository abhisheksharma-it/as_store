from rest_framework import serializers
from .models import Cart, CartItem
from catalog.models import Product

# Cart me product ki details dikhane ke liye
class ProductCartSerializer(serializers.ModelSerializer):
    # 🔴 FIX: Yahan frontend ko image ka full path aur color name denge
    image_url = serializers.SerializerMethodField()
    color_name = serializers.CharField(read_only=True)

    class Meta:
        model = Product
        # 🔴 FIX: Fields me 'image_url' aur 'color_name' add kar diya
        fields = ['id', 'title', 'price', 'discount_price', 'image_url', 'color_name'] 

    def get_image_url(self, obj):
        request = self.context.get('request')
        if hasattr(obj, 'image') and obj.image:
            return request.build_absolute_uri(obj.image.url) if request else f"http://127.0.0.1:8000{obj.image.url}"
        return None

# Har cart item (Product + Quantity + item total)
class CartItemSerializer(serializers.ModelSerializer):
    # GET request (dekhne) ke liye yeh puri details dega
    product = ProductCartSerializer(read_only=True)
    
    # POST request (add karne) ke liye hum ID bhejenge
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), 
        source='product', 
        write_only=True
    )
    
    # 🔴 NAYA FIX: Frontend ko size chahiye (update / delete properly karne ke liye)
    size = serializers.CharField(required=False, allow_null=True)
    
    item_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        # 🔴 FIX: size field include kiya taaki CartPage me size dhik sake
        fields = ['id', 'product', 'product_id', 'quantity', 'size', 'item_total']

    def get_item_total(self, obj):
        # Agar discount hai toh wo use karo, warna original price
        price = obj.product.discount_price if obj.product.discount_price else obj.product.price
        return float(price) * obj.quantity

# Pura Cart (Saare items + Final Total)
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    cart_total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'cart_total']

    def get_cart_total(self, obj):
        total = 0
        for item in obj.items.all():
            price = item.product.discount_price if item.product.discount_price else item.product.price
            total += (float(price) * item.quantity)
        return total