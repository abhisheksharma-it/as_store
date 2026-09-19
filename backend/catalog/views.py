from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Department, Category, Product
from rest_framework import generics
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import ProductSearchSerializer

def get_menu_api(request):
    menu_data = []
    departments = Department.objects.all()
    
    for dept in departments:
        # parent__isnull=True lagane se sirf main categories ayengi, andar ki t-shirts nahi
        normal_links = list(Category.objects.filter(department=dept, is_featured=False, parent__isnull=True).values('id', 'name', 'section_name'))
        featured_links = list(Category.objects.filter(department=dept, is_featured=True, parent__isnull=True).values('id', 'name', 'image'))
        
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
        first_image = p.images.first() 
        image_url = first_image.image.url if first_image else None
        
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
        'department_name': category.department.name,
        'total_products': products.count(),
        'products': product_list
    })

# Naya Search API View
class ProductSearchAPIView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSearchSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    
    # Kin fields par search kaam karega
    search_fields = ['title', 'description', 'category__name']
    # Kin fields par sorting kaam karegi
    ordering_fields = ['price', 'created_at']
    # Kis field par exact filter lagega (e.g., is_new=True)
    filterset_fields = ['is_new']


def latest_products_api(request):
    products = Product.objects.all().order_by('-created_at')[:8]
    
    product_list = []
    for p in products:
        # Pata karo ki kya primary image 'Image' field par hai ya 'images' inline/related field mein
        image_url = None
        
        # Scenario 1: Agar 'image' seedha Product model par ek field hai
        if hasattr(p, 'image') and p.image:
             request_url = request.build_absolute_uri('/')[:-1]
             image_url = f"{request_url}{p.image.url}"
             
        # Scenario 2: Agar 'images' ek related model (inline) hai (jaise tune pehle banaya tha)
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

# Naya Product Detail API View

def product_detail_api(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    
    # Primary image nikalna
    image_url = None
    if hasattr(product, 'image') and product.image:
        request_url = request.build_absolute_uri('/')[:-1]
        image_url = f"{request_url}{product.image.url}"
    elif hasattr(product, 'images') and product.images.exists():
        first_image = product.images.first()
        request_url = request.build_absolute_uri('/')[:-1]
        image_url = f"{request_url}{first_image.image.url}"

    product_data = {
        'id': product.id,
        'title': product.title,
        'description': product.description,
        'price': str(product.price),
        'discount_price': str(product.discount_price) if product.discount_price else None,
        'image_url': image_url,
        'is_new': product.is_new,
        'stock': product.stock,
        'category': product.category.name if product.category else None,
    }
    
    return JsonResponse({
        'status': 'success',
        'product': product_data
    })