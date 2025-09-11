# chatbot_app/models.py
from django.db import models
from django.contrib.auth.models import User
# from django.contrib.postgres.fields import ArrayField

class ChatSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class ChatMessage(models.Model):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=20) # 'user' or 'bot'
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)



class Shop(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    shop_name = models.CharField(max_length=255)
    floor = models.IntegerField()
    category = models.CharField(max_length=100)
    description = models.TextField()
    product_tags = models.TextField(blank=True, default="[]") 
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.shop_name