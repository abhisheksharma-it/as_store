import os
import django
import sqlite3

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'as_project.settings')
django.setup()

from catalog.models import Department, Category, Product

conn = sqlite3.connect('db.sqlite3')
cursor = conn.cursor()

try:
    cursor.execute("SELECT id, name FROM catalog_department")
    for r in cursor.fetchall():
        Department.objects.using('default').get_or_create(id=r[0], name=r[1])
except Exception as e:
    print("Dep error:", e)

try:
    cursor.execute("SELECT id, name, department_id FROM catalog_category")
    for r in cursor.fetchall():
        Category.objects.using('default').get_or_create(id=r[0], name=r[1], department_id=r[2])
except Exception as e:
    print("Cat error:", e)

try:
    cursor.execute("SELECT id, title, price, discount_price, is_new, category_id FROM catalog_product")
    for r in cursor.fetchall():
        cat = Category.objects.using('default').get(id=r[5])
        Product.objects.using('default').get_or_create(
            id=r[0], title=r[1], price=r[2], discount_price=r[3], is_new=bool(r[4]), category_id=r[5], department_id=cat.department_id
        )
    print("DATA SUCCESSFULLY MIGRATED!")
except Exception as e:
    print("Prod error:", e)