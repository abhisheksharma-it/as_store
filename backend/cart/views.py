from django.shortcuts import render 
from rest_framework.permissions import IsAuthenticated
# Create your views here.
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

        # FIX: Token hai toh account me daalo, warna session me
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
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        cart_item.save()

        # Item add hone ke baad pura updated cart wapas bhej do
        serializer = CartSerializer(cart)
        return Response({"message": "Cart me add ho gaya!", "cart": serializer.data}, status=status.HTTP_200_OK)

class CartItemDetailView(APIView):
    # PUT: Quantity update karne ke liye (jaise + ya - dabane par)
    def put(self, request, product_id):
        cart_id = request.session.get('cart_id')
        if not cart_id:
            return Response({"error": "Cart nahi mila!"}, status=status.HTTP_404_NOT_FOUND)

        try:
            cart_item = CartItem.objects.get(cart_id=cart_id, product_id=product_id)
            new_quantity = int(request.data.get('quantity', 1))
            
            if new_quantity <= 0:
                cart_item.delete() # Agar quantity 0 kar di, toh item delete kar do
                return Response({"message": "Item cart se remove ho gaya!"}, status=status.HTTP_200_OK)
            else:
                cart_item.quantity = new_quantity
                cart_item.save()
                return Response({"message": "Quantity update ho gayi!"}, status=status.HTTP_200_OK)
                
        except CartItem.DoesNotExist:
            return Response({"error": "Item cart me nahi hai!"}, status=status.HTTP_404_NOT_FOUND)

    # DELETE: Item ko cart se poori tarah hatane ke liye (Trash icon dabane par)
    def delete(self, request, product_id):
        cart_id = request.session.get('cart_id')
        if not cart_id:
            return Response({"error": "Cart nahi mila!"}, status=status.HTTP_404_NOT_FOUND)

        try:
            cart_item = CartItem.objects.get(cart_id=cart_id, product_id=product_id)
            cart_item.delete()
            return Response({"message": "Item successfully cart se delete ho gaya!"}, status=status.HTTP_200_OK)
        except CartItem.DoesNotExist:
            return Response({"error": "Item cart me nahi hai!"}, status=status.HTTP_404_NOT_FOUND)

class MergeCartAPIView(APIView):
    # Yeh API sirf wahi chala sakta hai jiske paas Access Token ho (Logged in ho)
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        session_cart_id = request.session.get('cart_id')
        
        if not session_cart_id:
            return Response({"message": "Merge karne ke liye koi guest cart nahi mila."}, status=200)

        try:
            # Guest cart uthao
            guest_cart = Cart.objects.get(id=session_cart_id, user__isnull=True)
            
            # User ka asli account wala cart uthao (ya naya banao)
            user_cart, created = Cart.objects.get_or_create(user=request.user)
            
            # Agar dono alag carts hain, toh merge karo
            if guest_cart.id != user_cart.id:
                for item in guest_cart.items.all():
                    # Check karo ki kya yeh product pehle se account cart me hai
                    existing_item = CartItem.objects.filter(cart=user_cart, product=item.product).first()
                    if existing_item:
                        existing_item.quantity += item.quantity
                        existing_item.save()
                    else:
                        item.cart = user_cart
                        item.save()
                
                # Purana khali guest cart delete kar do
                guest_cart.delete()
            
            # Session se cart ID hata do kyunki ab cart account me save ho gaya hai
            del request.session['cart_id']
            
            return Response({"message": "Guest cart aapke account me successfully merge ho gaya!"}, status=200)

        except Cart.DoesNotExist:
            return Response({"error": "Guest cart nahi mila."}, status=404)