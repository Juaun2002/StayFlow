from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db import models
from .models import Booking
from .serializers import BookingSerializer, BookingListSerializer


class BookingViewSet(viewsets.ModelViewSet):
    """ViewSet for Booking CRUD operations."""
    
    queryset = Booking.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['property', 'status', 'user']
    ordering_fields = ['start_date', 'created_at', 'total_price']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Return different serializers based on action."""
        if self.action == 'list':
            return BookingListSerializer
        return BookingSerializer
    
    def get_queryset(self):
        """Filter bookings based on user."""
        if self.request.user.is_staff or self.request.user.is_superuser:
            return Booking.objects.all()
        
        # Users can only see their own bookings or bookings for their properties
        return Booking.objects.filter(
            models.Q(user=self.request.user) |
            models.Q(property__owner=self.request.user)
        )
    
    def perform_create(self, serializer):
        """Set user when creating booking."""
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        """Update booking."""
        booking = serializer.instance
        user = self.request.user
        
        # Only property owner or booking user can update
        if booking.user != user and booking.property.owner != user:
            return Response(
                {'detail': 'You do not have permission to update this booking.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer.save()
    
    def perform_destroy(self, instance):
        """Delete booking."""
        user = self.request.user
        
        # Only property owner or booking user can delete
        if instance.user != user and instance.property.owner != user:
            return Response(
                {'detail': 'You do not have permission to delete this booking.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        instance.delete()
    
    @action(detail=False, methods=['get'])
    def user_bookings(self, request):
        """Get all bookings made by the current user."""
        bookings = Booking.objects.filter(user=request.user)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def property_bookings(self, request):
        """Get all bookings for properties owned by the current user."""
        property_id = request.query_params.get('property_id')
        
        if not property_id:
            return Response(
                {'detail': 'property_id parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        bookings = Booking.objects.filter(
            property_id=property_id,
            property__owner=request.user
        )
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm a booking."""
        booking = self.get_object()
        
        # Only property owner can confirm
        if booking.property.owner != request.user:
            return Response(
                {'detail': 'Only property owner can confirm booking.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        booking.status = 'confirmed'
        booking.save()
        
        serializer = self.get_serializer(booking)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking."""
        booking = self.get_object()
        
        # Only booking user or property owner can cancel
        if booking.user != request.user and booking.property.owner != request.user:
            return Response(
                {'detail': 'You do not have permission to cancel this booking.'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        booking.status = 'cancelled'
        booking.save()
        
        serializer = self.get_serializer(booking)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def available_dates(self, request):
        """Get available dates for a property."""
        property_id = request.query_params.get('property_id')
        
        if not property_id:
            return Response(
                {'detail': 'property_id parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get all confirmed bookings for this property
        bookings = Booking.objects.filter(
            property_id=property_id,
            status__in=['confirmed', 'completed']
        )
        
        booked_dates = []
        for booking in bookings:
            current = booking.start_date
            while current <= booking.end_date:
                booked_dates.append(current.isoformat())
                current += timezone.timedelta(days=1)
        
        return Response({
            'property_id': property_id,
            'booked_dates': booked_dates,
        })
