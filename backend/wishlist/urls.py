from django.urls import path
from .views import WishlistViewSet

urlpatterns = [
    path('', WishlistViewSet.as_view({'get': 'list', 'post': 'create'})),
    path('<int:pk>/', WishlistViewSet.as_view({
        'get': 'retrieve', 
        'put': 'update', 
        'patch': 'partial_update', 
        'delete': 'destroy'
    })),
]