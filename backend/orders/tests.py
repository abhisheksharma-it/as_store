from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from catalog.models import Product, Category, Department
from .models import Order, ShippingAddress

User = get_user_model()


class EcommerceSecurityAndConcurrencyTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", email="test@as.com", password="Password123!"
        )
        self.client.force_authenticate(user=self.user)

        self.department = Department.objects.create(name="Clothing")

        self.category = Category.objects.create(
            name="Men",
            department=self.department,
        )

        self.product = Product.objects.create(
            title="Oversized Wool Coat",
            price=5999.00,
            stock=5,
            category=self.category,
            department=self.department,
        )

        valid_fields = {
            f.name
            for f in ShippingAddress._meta.get_fields()
            if getattr(f, "concrete", False) and not getattr(f, "auto_created", False)
        }
        candidate_data = {
            "user": self.user,
            "full_name": "Abhishek Sharma",
            "name": "Abhishek Sharma",
            "phone_number": "9876543210",
            "phone": "9876543210",
            "address": "Mall Road",
            "address_line": "Mall Road",
            "address_line_1": "Mall Road",
            "address_line1": "Mall Road",
            "street": "Mall Road",
            "city": "Shimla",
            "state": "Himachal Pradesh",
            "pincode": "171001",
            "pin_code": "171001",
            "zip_code": "171001",
            "zipcode": "171001",
        }
        addr_kwargs = {k: v for k, v in candidate_data.items() if k in valid_fields}
        self.address = ShippingAddress.objects.create(**addr_kwargs)

    def test_prevent_client_side_price_manipulation(self):
        """Ensure hacker sending price=1 in payload is still charged true DB price (5999)."""
        payload = {
            "address_id": self.address.id,
            "payment_method": "COD",
            "items": [
                {
                    "product_id": self.product.id,
                    "quantity": 1,
                    "price": 1.00,
                    "size": "L",
                }
            ],
        }
        res = self.client.post("/api/orders/checkout/", payload, format="json")
        self.assertEqual(res.status_code, 201)
        order = Order.objects.get(id=res.data["order"]["id"])
        self.assertEqual(float(order.total_amount), 5999.00)

    def test_stock_deduction_and_idempotent_return_restock(self):
        """Verify COD deducts stock and Return Request restores stock exactly once."""
        payload = {
            "address_id": self.address.id,
            "payment_method": "COD",
            "items": [
                {
                    "product_id": self.product.id,
                    "quantity": 2,
                    "price": 5999.00,
                    "size": "M",
                }
            ],
        }
        res = self.client.post("/api/orders/checkout/", payload, format="json")

        self.assertEqual(res.status_code, 201)
        order_id = res.data["order"]["id"]

        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 3)

        # First return request succeeds and restores stock to 5
        ret_res = self.client.post(f"/api/orders/return/{order_id}/")
        self.assertEqual(ret_res.status_code, 200)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 5)

        # Duplicate return request is blocked (Idempotency guard)
        dup_res = self.client.post(f"/api/orders/return/{order_id}/")
        self.assertEqual(dup_res.status_code, 400)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 5)