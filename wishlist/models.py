from django.db import models
from django.conf import settings  # <-- 1. Yeh naya import hai
from catalog.models import Product  # (Tera product wala import yahan jo bhi tha, wahi rakhna)

class Wishlist(models.Model):
    # 2. User ki jagah settings.AUTH_USER_MODEL aayega
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{str(self.user)} - {self.product.name}"