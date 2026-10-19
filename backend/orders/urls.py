from django.urls import path
from .views import (
    AddressListCreateView,
    AddressDetailView,  # 🔴 FIX: Yahan is naye view ko import kiya hai
    CheckoutAPIView,
    InitiatePaymentView,
    VerifyPaymentView,
    OrderListView,
    OrderDetailView
)
from .views import RequestReturnView

urlpatterns = [
    path('address/', AddressListCreateView.as_view(), name='address-list-create'),
    
    # 🔴 FIX: Ye route Edit (PUT) aur Delete (DELETE) requests ko pakdega
    path('address/<int:pk>/', AddressDetailView.as_view(), name='address-detail'),
    
    path('checkout/', CheckoutAPIView.as_view(), name='checkout'),
    path('payment/initiate/', InitiatePaymentView.as_view(), name='initiate-payment'),
    path('payment/verify/', VerifyPaymentView.as_view(), name='verify-payment'),
    
    path('api/my-orders/', OrderListView.as_view(), name='order-list'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('return/<int:order_id>/', RequestReturnView.as_view(), name='request-return')
]