"""
URL configuration for as_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from catalog.views import get_menu_api, get_subcategories_api, category_products_api

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Catalog APIs
    path('api/menu/', get_menu_api, name='menu_api'),
    path('api/category/<int:category_id>/subcategories/', get_subcategories_api, name='subcategories_api'),
    path('api/category/<int:category_id>/products/', category_products_api, name='category_products_api'),
    
    # Cart API
    path('api/cart/', include('cart.urls')),

    # Accounts API
    path('api/accounts/', include('accounts.urls')),

    # Orders API
    path('api/orders/', include('orders.urls')),

    # Wishlist API
    path('api/wishlist/', include('wishlist.urls')),
]
