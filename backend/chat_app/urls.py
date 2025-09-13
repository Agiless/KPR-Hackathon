from django.urls import path
from .views import UserRegistrationView, UserLoginView, chatbot_response , LogoutAPIView, ShopRegistrationView, ShopLoginView,UploadedImageCreateView
from django.urls import re_path
from . import consumers


urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('chat/', chatbot_response, name='chatbot_response'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('shop/register/', ShopRegistrationView.as_view(), name='shop-register'),
    path('shop/login/', ShopLoginView.as_view(), name='shop-login'),
    path('upload/', UploadedImageCreateView.as_view(), name='image-upload'),
]
websocket_urlpatterns = [
    re_path(r'ws/notifications/$', consumers.NotificationConsumer.as_asgi()),
]