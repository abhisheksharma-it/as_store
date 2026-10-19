from rest_framework import serializers
from .models import Department, Category, Product, ProductImage

# --- MEGA MENU SERIALIZERS ---
class SubCategoryMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category 
        fields = ['id', 'name', 'section_name']

class CategoryMenuSerializer(serializers.ModelSerializer):
    subcategories = SubCategoryMenuSerializer(many=True, read_only=True)
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'section_name', 'is_featured', 'image', 'subcategories']

class DepartmentMenuSerializer(serializers.ModelSerializer):
    categories = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = ['id', 'name', 'slug', 'categories']

    def get_categories(self, obj):
        main_categories = obj.categories.filter(parent__isnull=True)
        return CategoryMenuSerializer(main_categories, many=True, context=self.context).data


# 🔴 FIX 1: MISSING IMAGE SERIALIZER ADD KIYA
class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']


# 🔴 FIX 2: DONO KO MERGE KARKE EK MASTER SERIALIZER BANA DIYA
class ProductSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    gallery_images = serializers.SerializerMethodField()
    
    # 🔴 TERA MAIN FIX: Ye dono strings ab safely frontend ko milengi
    category_name = serializers.CharField(source='category.name', read_only=True)
    department_name = serializers.CharField(source='category.department.name', read_only=True)

    class Meta:
        model = Product
        # department_name ko fields list mein bhi daalna zaroori tha!
        fields = [
            'id', 'title', 'description', 'price', 'discount_price', 'image_url', 
            'gallery_images', 'is_new', 'category_name', 'department_name', 'stock', 'in_stock',
            'color_name', 'variant_group_id', 'materials', 'delivery_and_payment'
        ]

    def get_image_url(self, obj):
        request = self.context.get('request')
        if hasattr(obj, 'image') and obj.image:
            return request.build_absolute_uri(obj.image.url) if request else f"http://127.0.0.1:8000{obj.image.url}"
        return None

    def get_gallery_images(self, obj):
        request = self.context.get('request')
        images = []
        
        if hasattr(obj, 'productimage_set'):
            images = obj.productimage_set.all()
        elif hasattr(obj, 'images'):
             images = obj.images.all()
        elif hasattr(obj, 'gallery_images'):
             images = obj.gallery_images.all()

        return ProductImageSerializer(images, many=True, context={'request': request}).data


# --- 🔥 3. SEARCH SERIALIZER ---
class ProductSearchSerializer(ProductSerializer):
    pass