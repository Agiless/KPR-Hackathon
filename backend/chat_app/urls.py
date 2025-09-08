from django.urls import path
from .views import UserRegistrationView, UserLoginView, chatbot_response

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('chat/', chatbot_response, name='chatbot_response'),
]