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
    description = models.TextField() # Isko 'Description & Fit' ki tarah use karenge
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_new = models.BooleanField(default=True)
    
    # Ye tera main thumbnail image rahega (grid aur default dikhane ke liye)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    
    # 🔴 H&M COLOR VARIANT LOGIC
    color_name = models.CharField(max_length=100, blank=True, null=True, help_text="e.g. Dark purple/Checked")
    variant_group_id = models.CharField(max_length=100, blank=True, null=True, help_text="Same product ke alag colors link karne ke liye common ID (e.g. SHIRT-01)")

    # 🔴 H&M ACCORDION FIELDS
    materials = models.TextField(blank=True, null=True, help_text="Materials content")
    delivery_and_payment = models.TextField(blank=True, null=True, help_text="Delivery and payment content")
    
    stock = models.PositiveIntegerField(default=10, help_text="Kitne items godown me bache hain")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.color_name or 'Default'}"

    @property
    def in_stock(self):
        return self.stock > 0

class ProductImage(models.Model):
    # 🔴 MULTIPLE GALLERY IMAGES
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='gallery_images') # related_name thoda clear kiya hai
    image = models.ImageField(upload_to='products/gallery/')
    alt_text = models.CharField(max_length=200, blank=True, null=True)

    def __str__(self):
        return f"Gallery Image for {self.product.title}"