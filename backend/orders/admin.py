from django.contrib import admin
from .models import Order, OrderItem, ShippingAddress

# Yeh OrderItem ko Order ke andar hi dikhane ke liye hai (Inline feature)
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['product', 'product_name', 'price', 'quantity']

# Yeh Order table ko thoda professional tarike se show karega
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['user__email', 'id']
    inlines = [OrderItemInline]

# Models ko register karna
admin.site.register(Order, OrderAdmin)
admin.site.register(ShippingAddress)