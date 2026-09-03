from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import Department, Category, Product

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