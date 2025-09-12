from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Shop, UploadedImage
import json

class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ['id', 'image', 'uploaded_at']
        read_only_fields = ['id', 'uploaded_at']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class ShopRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    owner_name = serializers.CharField(write_only=True)
    # This field will handle the list input from the frontend
    product_tags = serializers.ListField(
        child=serializers.CharField(max_length=50),
        allow_empty=True
    )

    class Meta:
        model = Shop
        fields = ['shop_name', 'floor', 'category', 'description', 'product_tags', 'email', 'password', 'owner_name']

    def create(self, validated_data):
        owner_name = validated_data.pop('owner_name')
        password = validated_data.pop('password')
        email = validated_data.get('email')
        
        # Pop the product_tags and convert the list to a JSON string
        product_tags_list = validated_data.pop('product_tags', [])
        validated_data['product_tags'] = json.dumps(product_tags_list)

        # Create the underlying Django User instance
        user = User.objects.create_user(username=owner_name, password=password, email=email)

        # Create the Shop instance linked to the new User
        shop = Shop.objects.create(owner=user, **validated_data)
        return shop

    def to_representation(self, instance):
        # This method is for when you retrieve data, converting the string back to a list
        ret = super().to_representation(instance)
        try:
            ret['product_tags'] = json.loads(instance.product_tags)
        except (TypeError, json.JSONDecodeError):
            ret['product_tags'] = []
        return ret