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
from django.views.decorators.csrf import csrf_exempt

class UploadedImage(APIView):
    def post(self,request):
        if request.method == 'POST':
            # The 'myImage' key must match the name attribute in your frontend form
            image_file = request.FILES.get('myImage')
            if not image_file:
                return Response({'error': 'No image file found'}, status=400)
            
            # Create a new UploadedImage instance and save the file
            new_image = UploadedImage(image=image_file)
            new_image.save()
            
            return Response({
                'message': 'Image uploaded successfully!',
                'imageUrl': new_image.image.url
            }, status=201)
        

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
    try:
        img = request.data.get('image')
        print(img,'\n',user_message)
        return Response({'\done': 'Message cannot be empty'})
    except:
        print('error')
        return Response({'error': 'Message cannot be empty'}, status=402)
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