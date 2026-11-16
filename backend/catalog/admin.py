from django.contrib import admin
from .models import Department, Category, Product, ProductImage

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    # Fixed IDE warning: Changed mutable list [] to immutable tuple ()
    list_display = ('name', 'order')
    list_editable = ('order',)

admin.site.register(Category)

# --- 🔴 INLINE GALLERY UPLOADER ---
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 4  # Provides 4 empty upload slots by default in the UI

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'department', 'category', 'stock', 'is_new')
    list_filter = ('department', 'category', 'is_new')
    search_fields = ('title', 'color_name', 'variant_group_id')
    
    # 🔴 ATTACHES THE GALLERY TO THE PRODUCT PAGE
    inlines = [ProductImageInline]