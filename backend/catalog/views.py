from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Department, Category, Product
# 🔴 YAHAN MAINEY ProductSerializer KO BHI IMPORT ME JOD DIYA HAI
from .serializers import ProductSearchSerializer, ProductSerializer

def get_menu_api(request):
    menu_data = []
    departments = Department.objects.all()
    
    for dept in departments:
        # parent__isnull=True lagane se sirf main categories ayengi, andar ki t-shirts nahi
        normal_links = list(Category.objects.filter(
            department=dept, 
            is_featured=False, 
            parent__isnull=True
        ).values('id', 'name', 'section_name'))
        
        featured_links = list(Category.objects.filter(
            department=dept, 
            is_featured=True, 
            parent__isnull=True
        ).values('id', 'name', 'image'))
        
        menu_data.append({
            'department': dept.name,
            'slug': dept.slug,
            'left_side_links': normal_links,
            'right_side_images': featured_links
        })
        
    return JsonResponse({'status': 'success', 'menu': menu_data})


def get_subcategories_api(request, category_id):
    parent_category = get_object_or_404(Category, id=category_id)
    subcategories = parent_category.subcategories.all()

    sections = {}
    for sub in subcategories:
        sec = sub.section_name or 'General'
        if sec not in sections:
            sections[sec] = []
        sections[sec].append({
            'id': sub.id,
            'name': sub.name
        })

    return JsonResponse({
        'status': 'success',
        'parent': parent_category.name,
        'sections': sections
    })


def category_products_api(request, category_id):
    category = get_object_or_404(Category, id=category_id)
    products = Product.objects.filter(category=category)
    
    product_list = []
    for p in products:
        image_url = None
        if hasattr(p, 'image') and p.image:
             request_url = request.build_absolute_uri('/')[:-1]
             image_url = f"{request_url}{p.image.url}"
        elif hasattr(p, 'images') and p.images.exists():
             first_image = p.images.first()
             request_url = request.build_absolute_uri('/')[:-1]
             image_url = f"{request_url}{first_image.image.url}"
             
        product_list.append({
            'id': p.id,
            'title': p.title,
            'price': str(p.price),
            'discount_price': str(p.discount_price) if p.discount_price else None,
            'image_url': image_url,
            'is_new': p.is_new
        })
        
    return JsonResponse({
        'status': 'success',
        'category_name': category.name,
        'department_name': category.department.name if category.department else None,
        'total_products': products.count(),
        'products': product_list
    })


# MAIN SEARCH API VIEW
class ProductSearchAPIView(generics.ListAPIView):
    serializer_class = ProductSearchSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    
    search_fields = ['title', 'description', 'category__name', 'category__department__name']
    ordering_fields = ['price', 'created_at']

    def get_queryset(self):
        queryset = Product.objects.all().order_by('-created_at')
        
        # URL parameters lo
        dept = self.request.query_params.get('department')
        cat = self.request.query_params.get('category')

        if dept:
            # Hyphen ko space me convert karo aur icontains lagao
            dept = dept.replace("-", " ") 
            queryset = queryset.filter(category__department__name__icontains=dept)
            
        if cat:
            # "new-in" ban jayega "new in", jo "NEW IN" se match ho jayega
            cat = cat.replace("-", " ") 
            queryset = queryset.filter(category__name__icontains=cat)

        return queryset


def latest_products_api(request):
    products = Product.objects.all().order_by('-created_at')[:8]
    
    product_list = []
    for p in products:
        image_url = None
        
        if hasattr(p, 'image') and p.image:
             request_url = request.build_absolute_uri('/')[:-1]
             image_url = f"{request_url}{p.image.url}"
             
        elif hasattr(p, 'images') and p.images.exists():
             first_image = p.images.first()
             request_url = request.build_absolute_uri('/')[:-1]
             image_url = f"{request_url}{first_image.image.url}"
             
        product_list.append({
            'id': p.id,
            'title': p.title,
            'price': str(p.price),
            'discount_price': str(p.discount_price) if p.discount_price else None,
            'image_url': image_url,
            'is_new': p.is_new
        })
        
    return JsonResponse({
        'status': 'success',
        'products': product_list
    })


# 🔴 PERMANENT BUG FIX: MANUAL DICTIONARY HATA KAR SERIALIZER LAGA DIYA
def product_detail_api(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    
    # Serializer automatically tere materials, delivery, colors aur saari photos (gallery_images) nikal lega
    serializer = ProductSerializer(product, context={'request': request})
    
    return JsonResponse({
        'status': 'success',
        'product': serializer.data
    })