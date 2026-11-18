from django.db import transaction
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Cart, CartItem
from catalog.models import Product
from .serializers import CartSerializer


class CartAPIView(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)
        else:
            cart_id = request.session.get('cart_id')
            if cart_id:
                cart, created = Cart.objects.get_or_create(id=cart_id)
            else:
                cart = Cart.objects.create()
                request.session['cart_id'] = cart.id

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # POST: Cart me item add karne ke liye
    @transaction.atomic
    def post(self, request):
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({"error": "Product ID zaroori hai!"}, status=status.HTTP_400_BAD_REQUEST)

        # CLAUDE FIX: Safe integer conversion to prevent 500 crash on invalid input
        try:
            quantity = int(request.data.get('quantity', 1))
        except (ValueError, TypeError):
            return Response({"error": "Invalid quantity format!"}, status=status.HTTP_400_BAD_REQUEST)

        if quantity <= 0:
            return Response({"error": "Quantity kam se kam 1 honi chahiye!"}, status=status.HTTP_400_BAD_REQUEST)

        size = request.data.get('size')

        try:
            product = Product.objects.get(id=product_id)
        except (Product.DoesNotExist, ValueError, TypeError):
            return Response({"error": "Product nahi mila!"}, status=status.HTTP_404_NOT_FOUND)

        if quantity > product.stock:
            return Response(
                {"error": f"Stock Check! Sirf {product.stock} items hi available hain."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)
        else:
            cart_id = request.session.get('cart_id')
            if cart_id:
                cart, created = Cart.objects.get_or_create(id=cart_id)
            else:
                cart = Cart.objects.create()
                request.session['cart_id'] = cart.id

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            size=size,
            defaults={'quantity': quantity}
        )

        if not created:
            total_quantity = cart_item.quantity + quantity
            if total_quantity > product.stock:
                return Response(
                    {"error": f"Aapke cart me pehle se item hai. Total quantity {product.stock} se zyada nahi ho sakti!"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.quantity = total_quantity
            cart_item.save()

        serializer = CartSerializer(cart)
        return Response({"message": "Cart me add ho gaya!", "cart": serializer.data}, status=status.HTTP_200_OK)


class CartItemDetailView(APIView):
    def _get_cart(self, request):
        if request.user.is_authenticated:
            return Cart.objects.filter(user=request.user).first()
        cart_id = request.session.get('cart_id')
        if not cart_id:
            return None
        return Cart.objects.filter(id=cart_id).first()

    # PUT: Quantity update karne ke liye
    @transaction.atomic
    def put(self, request, product_id):
        cart = self._get_cart(request)
        if not cart:
            return Response({"error": "Cart nahi mila!"}, status=status.HTTP_404_NOT_FOUND)

        # CLAUDE FIX: Safe integer conversion to prevent 500 error
        try:
            new_quantity = int(request.data.get('quantity', 1))
        except (ValueError, TypeError):
            return Response({"error": "Invalid quantity format!"}, status=status.HTTP_400_BAD_REQUEST)

        size = request.data.get('size')
        item_qs = CartItem.objects.select_related('product').filter(cart=cart, product_id=product_id)
        if size is not None:
            item_qs = item_qs.filter(size=size)

        cart_item = item_qs.first()
        if not cart_item:
            return Response({"error": "Item cart me nahi hai!"}, status=status.HTTP_404_NOT_FOUND)

        product = cart_item.product

        if new_quantity <= 0:
            cart_item.delete()
            return Response({"message": "Item cart se remove ho gaya!"}, status=status.HTTP_200_OK)
        elif new_quantity > product.stock:
            return Response(
                {"error": f"Stock Check! Sirf {product.stock} items hi available hain."},
                status=status.HTTP_400_BAD_REQUEST
            )
        else:
            cart_item.quantity = new_quantity
            cart_item.save()
            return Response({"message": "Quantity update ho gayi!"}, status=status.HTTP_200_OK)

    # DELETE: Item ko cart se hatane ke liye
    @transaction.atomic
    def delete(self, request, product_id):
        cart = self._get_cart(request)
        if not cart:
            return Response({"error": "Cart nahi mila!"}, status=status.HTTP_404_NOT_FOUND)

        size = request.data.get('size') or request.query_params.get('size')
        item_qs = CartItem.objects.filter(cart=cart, product_id=product_id)
        if size is not None:
            item_qs = item_qs.filter(size=size)

        if not item_qs.exists():
            return Response({"error": "Item cart me nahi hai!"}, status=status.HTTP_404_NOT_FOUND)

        item_qs.delete()
        return Response({"message": "Item successfully cart se delete ho gaya!"}, status=status.HTTP_200_OK)


class MergeCartAPIView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def get(self, request):
        session_cart_id = request.session.get('cart_id')

        if not session_cart_id:
            return Response({"message": "Merge karne ke liye koi guest cart nahi mila."}, status=status.HTTP_200_OK)

        try:
            guest_cart = Cart.objects.get(id=session_cart_id, user__isnull=True)
            user_cart, created = Cart.objects.get_or_create(user=request.user)

            if guest_cart.id != user_cart.id:
                for item in guest_cart.items.select_related('product').all():
                    # CLAUDE FIX: Match both product AND size when merging guest cart into user cart
                    existing_item = CartItem.objects.filter(
                        cart=user_cart,
                        product=item.product,
                        size=item.size
                    ).first()

                    if existing_item:
                        new_qty = existing_item.quantity + item.quantity
                        existing_item.quantity = min(new_qty, item.product.stock)
                        existing_item.save()
                    else:
                        if item.quantity > item.product.stock:
                            item.quantity = item.product.stock
                        item.cart = user_cart
                        item.save()

                guest_cart.delete()

            request.session.pop('cart_id', None)
            return Response({"message": "Guest cart aapke account me successfully merge ho gaya!"}, status=status.HTTP_200_OK)

        except Cart.DoesNotExist:
            request.session.pop('cart_id', None)
            return Response({"error": "Guest cart nahi mila."}, status=status.HTTP_404_NOT_FOUND)