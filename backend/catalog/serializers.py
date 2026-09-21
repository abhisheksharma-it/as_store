from rest_framework import serializers
from .models import Department, Category, Product

# --- NAYA CODE: MEGA MENU KE LIYE ---

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
        # Sirf un categories ko fetch karega jinka koi parent nahi hai (Main Categories)
        main_categories = obj.categories.filter(parent__isnull=True)
        return CategoryMenuSerializer(main_categories, many=True, context=self.context).data


# --- TERA PEHLE SE LIKHA HUA CODE ---

class ProductSearchSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'discount_price', 'image_url', 'is_new', 'category_name', 'stock', 'in_stock']

    def get_image_url(self, obj):
        request = self.context.get('request')
        
        # 1. Sabse pehle main image field check karega (Jo tune admin me upload ki hai)
        if hasattr(obj, 'image') and obj.image:
            return request.build_absolute_uri(obj.image.url) if request else f"http://127.0.0.1:8000{obj.image.url}"
            
        # 2. Agar main image nahi hai, tab gallery (images) check karega
        elif hasattr(obj, 'images') and obj.images.exists():
            first_image = obj.images.first()
            if first_image and first_image.image:
                return request.build_absolute_uri(first_image.image.url) if request else f"http://127.0.0.1:8000{first_image.image.url}"
                
        return None