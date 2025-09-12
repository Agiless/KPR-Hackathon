from rest_framework import generics,status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .serializers import UserSerializer
from .utils import get_chatbot_response
from rest_framework.decorators import api_view
from .models import ChatSession, ChatMessage
from .serializers import ShopRegistrationSerializer
from .models import Shop,UploadedImage
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt
from .serializers import UploadedImageSerializer
from rest_framework.parsers import MultiPartParser, FormParser
import os
from django.conf import settings

# Rename the view to avoid collision and use a generic view for simplicity
from .models import UploadedImage
from .serializers import UploadedImageSerializer

# Your recommendation pipeline
from .similarity import (
    load_model,
    connect_to_db,
    run_fashion_advisor
)

# Load model & DB once
clip_model = load_model()
db_connection = connect_to_db()

class UploadedImageCreateView(generics.CreateAPIView):
    queryset = UploadedImage.objects.all()
    serializer_class = UploadedImageSerializer
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        instance = serializer.save()
        image_path = os.path.join(settings.MEDIA_ROOT, str(instance.image))

        try:
            # Run the recommendation system
            recommended_image_url = run_fashion_advisor(image_path, db_connection, clip_model)
            self.recommended_image_url = recommended_image_url
        except Exception as e:
            print("Error in run_fashion_advisor:", e)
            self.recommended_image_url = None

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response({
            "uploaded_image": self.request.build_absolute_uri(serializer.data['image']),
            "recommended_image": self.recommended_image_url
        }, status=status.HTTP_201_CREATED)


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        else:
            return Response({'error': 'Invalid Credentials'}, status=400)

class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        logout(request)
        return Response({"detail": "Logged out"}, status=status.HTTP_200_OK)


class ShopRegistrationView(generics.CreateAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopRegistrationSerializer

class ShopLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            shop = Shop.objects.get(email=email)
            user = authenticate(request, username=shop.owner.username, password=password)
            if user is not None:
                login(request, user)
                token, created = Token.objects.get_or_create(user=user)
                return Response({'token': token.key})
            else:
                return Response({'error': 'Invalid credentials'}, status=400)
        except Shop.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=400)

@api_view(["POST"])
def chatbot_response(request):
    user_message = request.data.get('message')
    if not user_message:
        return Response({'error': 'Message cannot be empty'}, status=400)

    # Get the user's current chat session or create a new one
    try:
        session = ChatSession.objects.get(user=request.user)
    except ChatSession.DoesNotExist:
        session = ChatSession.objects.create(user=request.user)

    # Save the user's message
    ChatMessage.objects.create(session=session, sender='user', message=user_message)

    # Call the new function to get the bot's response
    bot_response_text = get_chatbot_response(user_message)

    # Save the bot's response
    ChatMessage.objects.create(session=session, sender='bot', message=bot_response_text)

    return Response({'response': bot_response_text})