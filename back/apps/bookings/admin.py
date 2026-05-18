from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'property', 'user', 'start_date', 'end_date', 'status', 'created_at']
    list_filter = ['status', 'is_monthly_rental', 'created_at']
    search_fields = ['property__title', 'user__email']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Booking Details', {'fields': ('property', 'user', 'start_date', 'end_date')}),
        ('Rental Options', {'fields': ('is_monthly_rental', 'rental_duration_months')}),
        ('Payment', {'fields': ('total_price', 'status')}),
        ('Message', {'fields': ('message',)}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )
