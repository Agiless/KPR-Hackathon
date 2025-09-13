# chatbot_app/models.py
from django.db import models
from django.contrib.auth.models import User
import os
# from django.contrib.postgres.fields import ArrayField

class ChatSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class ChatMessage(models.Model):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=20) # 'user' or 'bot'
    message = models.TextField()
    image_data_url = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)



class Shop(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)
    shop_name = models.CharField(max_length=255)
    floor = models.IntegerField()
    category = models.CharField(max_length=100)
    description = models.TextField()
    product_tags = models.TextField(blank=True, default="[]") 
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.shop_name
    
def fixed_image_name(instance, filename):
    # Always save as 'uploads/latest_image.png'
    return 'uploads/latest_image.png'

class UploadedImage(models.Model):
    image = models.ImageField(upload_to=fixed_image_name)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Get the file path first
        file_path = os.path.join('media', 'uploads', 'latest_image.png')

        # Delete the existing file BEFORE saving the new one
        if os.path.isfile(file_path):
            os.remove(file_path)

        super().save(*args, **kwargs)