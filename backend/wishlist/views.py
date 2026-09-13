from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Wishlist
from .serializers import WishlistSerializer

class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]
    queryset = Wishlist.objects.all()

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)