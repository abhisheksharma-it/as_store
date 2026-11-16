from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Wishlist
from .serializers import WishlistSerializer
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)
        except IntegrityError:
            raise ValidationError({"message": "Yeh product pehle se aapki wishlist me hai!"})

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        product_id = request.data.get('product_id')
        
        if not product_id:
            return Response({"error": "product_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check karo ki kya user ne ye item pehle se save kiya hai?
        wishlist_item = Wishlist.objects.filter(user=request.user, product_id=product_id).first()
        
        if wishlist_item:
            # Agar hai, toh delete kar do (Remove from wishlist)
            wishlist_item.delete()
            return Response({"message": "Removed from wishlist", "status": "removed"}, status=status.HTTP_200_OK)
        else:
            # FIX: Qwen's recommendation -> Use get_or_create to prevent 500 server error on rapid double-clicks (race conditions)
            item, created = Wishlist.objects.get_or_create(
                user=request.user, 
                product_id=product_id
            )
            
            if created:
                return Response({"message": "Added to wishlist", "status": "added"}, status=status.HTTP_201_CREATED)
            else:
                # Agar race condition ki wajah se already ban gaya tha, tab bhi gracefully handle karo
                return Response({"message": "Already in wishlist", "status": "added"}, status=status.HTTP_200_OK)