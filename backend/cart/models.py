from django.db import models
from django.conf import settings
from catalog.models import Product  # Dhyan rakhna ki tera Product model catalog app me ho

class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='cart',
        null=True, 
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart - {self.user.username if self.user else 'Guest'}"
class CartItem(models.Model):
    # Ek cart me bohot saare items ho sakte hain
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        # Ek cart me ek product ki do alag rows nahi banegi, balki uski quantity badhegi
        unique_together = ('cart', 'product')

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"