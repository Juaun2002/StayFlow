from django.db import models
from apps.users.models import User


class Property(models.Model):
    """Property listing model."""
    
    PROPERTY_TYPE_CHOICES = [
        ('apartment', 'Apartment'),
        ('house', 'House'),
        ('land', 'Land'),
        ('commercial', 'Commercial'),
    ]
    
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('sold', 'Sold'),
        ('rented', 'Rented'),
    ]
    
    # Basic Information
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    property_type = models.CharField(
        max_length=20,
        choices=PROPERTY_TYPE_CHOICES,
        default='apartment'
    )
    
    # Location
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=2)
    zip_code = models.CharField(max_length=20, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    
    # Details
    price = models.DecimalField(max_digits=12, decimal_places=2)
    area = models.FloatField()  # in square meters
    bedrooms = models.IntegerField(default=0)
    bathrooms = models.IntegerField(default=0)
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='available'
    )
    
    # Media
    image_url = models.URLField(blank=True, null=True)
    featured_image = models.ImageField(
        upload_to='properties/',
        blank=True,
        null=True
    )
    
    # Relations
    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='properties'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Property'
        verbose_name_plural = 'Properties'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['city', 'status']),
            models.Index(fields=['owner', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.city}"
