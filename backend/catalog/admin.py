from django.contrib import admin
from .models import Department, Category, Product

# Naya Department Admin
@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ['name', 'order']
    list_editable = ['order'] # Isse bahar se hi order change kar paoge

# Baaki purana wala same rahega
admin.site.register(Category)
admin.site.register(Product)

