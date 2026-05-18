from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Property
from .serializers import PropertySerializer, PropertyListSerializer


class PropertyViewSet(viewsets.ModelViewSet):
    """ViewSet for Property CRUD operations."""
    
    queryset = Property.objects.all()
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['city', 'property_type', 'status']
    search_fields = ['title', 'description', 'address', 'city']
    ordering_fields = ['price', 'created_at', 'area']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Return different serializers based on action."""
        if self.action == 'list':
            return PropertyListSerializer
        return PropertySerializer
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        """Filter properties based on user."""
        queryset = Property.objects.all()
        
        # Filter by owner if user_properties action
        if self.action == 'user_properties':
            queryset = queryset.filter(owner=self.request.user)
        
        # Filter by price range if provided
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            queryset = queryset.filter(price__gte=float(min_price))
        if max_price:
            queryset = queryset.filter(price__lte=float(max_price))
        
        return queryset
    
    def perform_create(self, serializer):
        """Set owner when creating property."""
        serializer.save(owner=self.request.user)
    
    def perform_update(self, serializer):
        """Update property."""
        if serializer.instance.owner != self.request.user:
            return Response(
                {'detail': 'You do not have permission to update this property.'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer.save()
    
    def perform_destroy(self, instance):
        """Delete property."""
        if instance.owner != self.request.user:
            return Response(
                {'detail': 'You do not have permission to delete this property.'},
                status=status.HTTP_403_FORBIDDEN
            )
        instance.delete()
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def user_properties(self, request):
        """Get all properties owned by the current user."""
        properties = self.get_queryset()
        serializer = self.get_serializer(properties, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def details(self, request, pk=None):
        """Get detailed information about a property."""
        property_obj = self.get_object()
        serializer = PropertySerializer(property_obj, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_city(self, request):
        """Get properties by city."""
        city = request.query_params.get('city')
        if not city:
            return Response(
                {'detail': 'City parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        properties = self.get_queryset().filter(city__icontains=city)
        serializer = self.get_serializer(properties, many=True)
        return Response(serializer.data)
