from django.urls import path
from .views import (
    CheckoutAPIView, 
    OrderListView, 
    OrderDetailView, 
    AddressListCreateView,
    InitiatePaymentView,
    VerifyPaymentView
)

urlpatterns = [
    path('checkout/', CheckoutAPIView.as_view(), name='checkout'),
    path('', OrderListView.as_view(), name='order-list'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('addresses/', AddressListCreateView.as_view(), name='address-list'),
    path('payment/initiate/', InitiatePaymentView.as_view(), name='initiate-payment'),
    path('payment/verify/', VerifyPaymentView.as_view(), name='verify-payment'),
]