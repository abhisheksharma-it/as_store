from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from django.urls import reverse

User = get_user_model()

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="test_auth", 
            email="auth@as.com", 
            password="SecurePassword123!"
        )
        
        # FIX: Dynamically resolving the token URL to prevent hardcoded 404 errors. 
        # Make sure 'token_obtain_pair' matches the name= attribute in your urls.py for SimpleJWT
        try:
            self.token_url = reverse('token_obtain_pair')
        except:
            # Fallback if reverse doesn't work depending on your URL config
            self.token_url = '/api/accounts/login/' 
            # Or whatever your login/token URL actually is. Try '/api/token/' or '/api/login/' if this fails.

    def test_jwt_token_generation(self):
        """Test that a valid user can obtain JWT access and refresh tokens"""
        response = self.client.post(self.token_url, {
            'email': 'auth@as.com',
            'password': 'SecurePassword123!'
        })
        # Adding a helpful error message to debug if it fails again
        self.assertEqual(response.status_code, 200, f"Failed at {self.token_url}. Response: {response.data}")
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        
    def test_invalid_login_rejected(self):
        """Test that invalid credentials are rejected securely"""
        response = self.client.post(self.token_url, {
            'email': 'auth@as.com',
            'password': 'WrongPassword!'
        })
        self.assertEqual(response.status_code, 401)