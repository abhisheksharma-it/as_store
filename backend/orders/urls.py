from django.urls import path
from .views import (
    AddressListCreateView,
    CheckoutAPIView,
    InitiatePaymentView,
    VerifyPaymentView,
    OrderListView,
    OrderDetailView
)

urlpatterns = [
    path('address/', AddressListCreateView.as_view(), name='address-list-create'),
    path('checkout/', CheckoutAPIView.as_view(), name='checkout'),
    path('payment/initiate/', InitiatePaymentView.as_view(), name='initiate-payment'),
    path('payment/verify/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('my-orders/', OrderListView.as_view(), name='order-list'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
]