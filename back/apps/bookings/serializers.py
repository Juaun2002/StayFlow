from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    """Serialize Booking data."""
    
    property_title = serializers.CharField(
        source='property.title',
        read_only=True
    )
    property_price = serializers.DecimalField(
        source='property.price',
        read_only=True,
        max_digits=12,
        decimal_places=2
    )
    user_name = serializers.CharField(
        source='user.get_full_name',
        read_only=True
    )
    user_email = serializers.CharField(
        source='user.email',
        read_only=True
    )
    days_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id',
            'property',
            'property_title',
            'property_price',
            'user',
            'user_name',
            'user_email',
            'start_date',
            'end_date',
            'is_monthly_rental',
            'rental_duration_months',
            'total_price',
            'status',
            'message',
            'days_count',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'user',
            'property_title',
            'property_price',
            'user_name',
            'user_email',
            'created_at',
            'updated_at',
        ]
    
    def validate(self, data):
        """Validate booking dates."""
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        
        if start_date and end_date:
            if end_date < start_date:
                raise serializers.ValidationError(
                    "End date must be after start date."
                )
            
            if start_date < timezone.now().date():
                raise serializers.ValidationError(
                    "Start date cannot be in the past."
                )
        
        return data
    
    def create(self, validated_data):
        """Create a new booking."""
        validated_data['user'] = self.context['request'].user
        
        # Calculate total price if not provided
        if not validated_data.get('total_price'):
            property_obj = validated_data['property']
            days = (validated_data['end_date'] - validated_data['start_date']).days
            validated_data['total_price'] = property_obj.price * days
        
        return super().create(validated_data)


class BookingListSerializer(serializers.ModelSerializer):
    """Simplified serializer for listing bookings."""
    
    property_title = serializers.CharField(
        source='property.title',
        read_only=True
    )
    user_name = serializers.CharField(
        source='user.get_full_name',
        read_only=True
    )
    days_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id',
            'property',
            'property_title',
            'user_name',
            'start_date',
            'end_date',
            'status',
            'days_count',
            'total_price',
            'created_at',
        ]
