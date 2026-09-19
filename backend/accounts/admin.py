from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Yeh tere custom User model ko Django admin panel mein register karega
admin.site.register(User, UserAdmin)