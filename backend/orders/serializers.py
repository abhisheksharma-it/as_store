from rest_framework import serializers
from .models import Order, OrderItem, ShippingAddress
from catalog.models import Product  # 🔴 Zaroori: Product image laane ke liye import kiya

class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'
        read_only_fields = ['user']

class OrderItemSerializer(serializers.ModelSerializer):
    # 🔴 FIX 1: Frontend ko 'name' aur 'image' field chahiye hoti hai
    name = serializers.CharField(source='product_name', read_only=True)
    image = serializers.SerializerMethodField()
    
    # 🔴 FIX 2: Agar size model me nahi hai, toh abhi 'Standard' default de raha hu error bachane ke liye
    size = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        # Humne 'name', 'image' aur 'size' add kar diye hain jo frontend ko chahiye
        fields = ['id', 'product_name', 'name', 'price', 'quantity', 'image', 'size']

    def get_image(self, obj):
        request = self.context.get('request')
        try:
            # product_name ka use karke Product model se image dhoondhne ki koshish
            product = Product.objects.filter(title=obj.product_name).first()
            if product and product.image:
                return request.build_absolute_uri(product.image.url) if request else f"http://127.0.0.1:8000{product.image.url}"
        except Exception:
            pass
        
        # Agar image na mile, toh pexels ka placeholder tak ki frontend toot na jaye
        return "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&w=200"

    def get_size(self, obj):
        # Agar tere OrderItem model me size hai toh usko check karega, warna 'Standard' return karega
        if hasattr(obj, 'size') and getattr(obj, 'size'):
             return obj.size
        return 'Standard'

class OrderSerializer(serializers.ModelSerializer):
    # Frontend ko ye exact details milni chahiye
    items = OrderItemSerializer(many=True, read_only=True)
    shipping_address = ShippingAddressSerializer(read_only=True)
    
    # 🔴 FIX 3: Frontend date format match karna (Apr 30, 2026 format me aayega)
    date = serializers.DateTimeField(source='created_at', format="%d %b, %Y", read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'total_amount', 'status', 'created_at', 'date',
            'shipping_address', 'items',
            'razorpay_order_id', 'razorpay_payment_id'
        ]