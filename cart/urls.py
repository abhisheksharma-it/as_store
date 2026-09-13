from django.urls import path
from .views import CartAPIView, CartItemDetailView, MergeCartAPIView

urlpatterns = [
    path('', CartAPIView.as_view(), name='cart-api'),
    path('item/<int:product_id>/', CartItemDetailView.as_view(), name='cart-item-detail'),
    path('merge/', MergeCartAPIView.as_view(), name='merge-cart'),
    

]