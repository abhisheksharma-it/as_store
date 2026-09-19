from django.db import models
from django.utils.text import slugify

class Department(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=60, unique=True, blank=True)
    order = models.PositiveIntegerField(default=0) 

    class Meta:
        ordering = ['order']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Category(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='categories')
    name = models.CharField(max_length=100)
    
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories', help_text="Agar yeh subcategory hai toh parent category select karein (jaise Clothing)")
    section_name = models.CharField(max_length=100, blank=True, default="Categories", help_text="Group heading jaise 'Categories' ya 'Collections'")
    
    is_featured = models.BooleanField(default=False, help_text="Right side image ke liye")
    image = models.ImageField(upload_to='categories/', null=True, blank=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        if self.parent:
            return f"{self.department.name} -> {self.parent.name} -> {self.name}"
        return f"{self.department.name} -> {self.name}"

class Product(models.Model):
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_new = models.BooleanField(default=True)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    
    # --- YAHAN 2 NAYI LINES ADD HUI HAIN ---
    stock = models.PositiveIntegerField(default=10, help_text="Kitne items godown me bache hain")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    # --- YEH FUNCTION BHI NAYA HAI ---
    @property
    def in_stock(self):
        return self.stock > 0

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    color_match = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f"Image for {self.product.title}"