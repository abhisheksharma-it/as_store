from django.urls import path
from .views import (
    get_menu_api, 
    get_subcategories_api, 
    category_products_api, 
    ProductSearchAPIView, 
    latest_products_api,
    product_detail_api  # 🔥 Naya import add kar diya yahan
)

urlpatterns = [
    path('menu/', get_menu_api, name='menu-api'),
    path('category/<int:category_id>/subcategories/', get_subcategories_api, name='subcategories-api'),
    path('category/<int:category_id>/products/', category_products_api, name='category-products-api'),
    path('search/', ProductSearchAPIView.as_view(), name='product-search'),
    
    # Route Home page products ke liye:
    path('latest-products/', latest_products_api, name='latest-products-api'),
    
    # 🔥 Naya Route Product Detail page ke liye:
    path('product/<int:product_id>/', product_detail_api, name='product-detail-api'),
]