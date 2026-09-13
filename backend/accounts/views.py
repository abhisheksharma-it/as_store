from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer

# Yahan bhi naya tarika use karenge
User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer