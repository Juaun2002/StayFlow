from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serialize User data."""
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'first_name',
            'last_name',
            'role',
            'phone',
            'bio',
            'profile_image',
            'is_verified',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_verified']


class RegisterSerializer(serializers.ModelSerializer):
    """Serialize User registration."""
    
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = [
            'email',
            'username',
            'password',
            'password2',
            'first_name',
            'last_name',
        ]
    
    def validate(self, data):
        """Validate passwords match."""
        if data['password'] != data.pop('password2'):
            raise serializers.ValidationError(
                {"password": "Passwords do not match."}
            )
        return data
    
    def create(self, validated_data):
        """Create new user."""
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user


class LoginSerializer(serializers.Serializer):
    """Serialize user login."""
    
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        """Validate user credentials."""
        user = authenticate(
            username=data['email'],
            password=data['password']
        )
        
        if not user:
            raise serializers.ValidationError(
                "Invalid email or password."
            )
        
        data['user'] = user
        return data
