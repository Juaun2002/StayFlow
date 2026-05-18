from django.contrib import admin
from .models import Property


@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ['title', 'city', 'price', 'status', 'owner', 'created_at']
    list_filter = ['status', 'property_type', 'city', 'created_at']
    search_fields = ['title', 'description', 'address', 'city']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {'fields': ('title', 'description', 'property_type', 'status')}),
        ('Location', {'fields': ('address', 'city', 'state', 'zip_code', 'latitude', 'longitude')}),
        ('Details', {'fields': ('price', 'area', 'bedrooms', 'bathrooms')}),
        ('Media', {'fields': ('image_url', 'featured_image')}),
        ('Relations', {'fields': ('owner',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
