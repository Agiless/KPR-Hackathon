from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .serializers import UserSerializer
from .utils import get_chatbot_response
from rest_framework.decorators import api_view
from .models import ChatSession, ChatMessage

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