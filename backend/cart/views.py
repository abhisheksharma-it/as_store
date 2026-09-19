from django.shortcuts import render 
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
    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product nahi mila!"}, status=status.HTTP_404_NOT_FOUND)

        # --- NAYA LOGIC: INVENTORY/STOCK CHECK (ADD TO CART) ---
        if not product.in_stock or quantity > product.stock:
            return Response({"error": f"Out of stock! Sirf {product.stock} items godown me bache hain."}, status=status.HTTP_400_BAD_REQUEST)

        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(user=request.user)
        else:
            cart_id = request.session.get('cart_id')
            if cart_id:
                cart, created = Cart.objects.get_or_create(id=cart_id)
            else:
                cart = Cart.objects.create()
                request.session['cart_id'] = cart.id

        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            # --- NAYA LOGIC: CHECK IF TOTAL QUANTITY IN CART EXCEEDS STOCK ---
            total_quantity = cart_item.quantity + quantity
            if total_quantity > product.stock:
                return Response({"error": f"Aapke cart me pehle se item hai. Total quantity {product.stock} se zyada nahi ho sakti!"}, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity = total_quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()

        serializer = CartSerializer(cart)
        return Response({"message": "Cart me add ho gaya!", "cart": serializer.data}, status=status.HTTP_200_OK)


class CartItemDetailView(APIView):
    # PUT: Quantity update karne ke liye
    def put(self, request, product_id):
        if request.user.is_authenticated:
            try:
                cart = Cart.objects.get(user=request.user)
            except Cart.DoesNotExist:
                return Response({"error": "Cart nahi mila!"}, status=status.HTTP_404_NOT_FOUND)
        else:
            cart_id = request.session.get('cart_id')
            if not cart_id:
                return Response({"error": "Cart nahi mila!"}, status=status.HTTP_404_NOT_FOUND)
            try:
                cart = Cart.objects.get(id=cart_id)
            except Cart.DoesNotExist:
                return Response({"error": "Cart nahi mila!"}, status=status.HTTP_404_NOT_FOUND)

        try:
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
            new_quantity = int(request.data.get('quantity', 1))
            product = cart_item.product # Product object nikal liya
            
            if new_quantity <= 0:
                cart_item.delete()
                return Response({"message": "Item cart se remove ho gaya!"}, status=status.HTTP_200_OK)
            # --- NAYA LOGIC: INVENTORY CHECK (UPDATE CART) ---
            elif new_quantity > product.stock:
                return Response({"error": f"Stock Check! Sirf {product.stock} items hi available hain."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                cart_item.quantity = new_quantity
                cart_item.save()
                return Response({"message": "Quantity update ho gayi!"}, status=status.HTTP_200_OK)
                
        except CartItem.DoesNotExist:
            return Response({"error": "Item cart me nahi hai!"}, status=status.HTTP_404_NOT_FOUND)

    # DELETE: Item ko cart se hatane ke liye
    def delete(self, request, product_id):
        if request.user.is_authenticated:
            try:
                cart = Cart.objects.get(user=request.user)
            except Cart.DoesNotExist:
                return Response({"error": "Cart nahi mila!"}, status=status.HTTP_404_NOT_FOUND)
        else:
            cart_id = request.session.get('cart_id')
            if not cart_id:
                return Response({"error": "Cart nahi mila!"}, status=status.HTTP_404_NOT_FOUND)
            try:
                cart = Cart.objects.get(id=cart_id)
            except Cart.DoesNotExist:
                return Response({"error": "Cart nahi mila!"}, status=status.HTTP_404_NOT_FOUND)

        try:
            cart_item = CartItem.objects.get(cart=cart, product_id=product_id)
            cart_item.delete()
            return Response({"message": "Item successfully cart se delete ho gaya!"}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({"error": "Item cart me nahi hai!"}, status=status.HTTP_404_NOT_FOUND)

class MergeCartAPIView(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        session_cart_id = request.session.get('cart_id')
        
        if not session_cart_id:
            return Response({"message": "Merge karne ke liye koi guest cart nahi mila."}, status=200)

        try:
            guest_cart = Cart.objects.get(id=session_cart_id, user__isnull=True)
            user_cart, created = Cart.objects.get_or_create(user=request.user)
            
            if guest_cart.id != user_cart.id:
                for item in guest_cart.items.all():
                    existing_item = CartItem.objects.filter(cart=user_cart, product=item.product).first()
                    if existing_item:
                        # --- NAYA LOGIC: MERGE KARTE WAQT BHI STOCK CHECK ---
                        new_qty = existing_item.quantity + item.quantity
                        if new_qty > item.product.stock:
                            existing_item.quantity = item.product.stock # Max stock assign kar do
                        else:
                            existing_item.quantity = new_qty
                        existing_item.save()
                    else:
                        item.cart = user_cart
                        item.save()
                
                guest_cart.delete()
            
            del request.session['cart_id']
            return Response({"message": "Guest cart aapke account me successfully merge ho gaya!"}, status=200)

        except Cart.DoesNotExist:
            return Response({"error": "Guest cart nahi mila."}, status=404)