from rest_framework import serializers
from .models import Property


class PropertySerializer(serializers.ModelSerializer):
    """Serialize Property data."""
    
    owner_name = serializers.CharField(
        source='owner.get_full_name',
        read_only=True
    )
    owner_email = serializers.CharField(
        source='owner.email',
        read_only=True
    )
    
    class Meta:
        model = Property
        fields = [
            'id',
            'title',
            'description',
            'property_type',
            'address',
            'city',
            'state',
            'zip_code',
            'latitude',
            'longitude',
            'price',
            'area',
            'bedrooms',
            'bathrooms',
            'status',
            'image_url',
            'featured_image',
            'owner',
            'owner_name',
            'owner_email',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at', 'owner_name', 'owner_email']
    
    def create(self, validated_data):
        """Create a new property."""
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)


class PropertyListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing properties."""
    
    owner_name = serializers.CharField(
        source='owner.get_full_name',
        read_only=True
    )
    
    class Meta:
        model = Property
        fields = [
            'id',
            'title',
            'price',
            'city',
            'area',
            'bedrooms',
            'bathrooms',
            'property_type',
            'status',
            'image_url',
            'featured_image',
            'owner_name',
            'created_at',
        ]
