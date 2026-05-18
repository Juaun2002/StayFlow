from django.db import models
from apps.users.models import User
from apps.properties.models import Property


class Booking(models.Model):
    """Booking/Reservation model for properties."""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    # Relations
    property = models.ForeignKey(
        Property,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    
    # Dates
    start_date = models.DateField()
    end_date = models.DateField()
    
    # Rental options
    is_monthly_rental = models.BooleanField(default=False)
    rental_duration_months = models.IntegerField(default=0, blank=True, null=True)
    
    # Price
    total_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True
    )
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    
    # Additional info
    message = models.TextField(blank=True, null=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Booking'
        verbose_name_plural = 'Bookings'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['property', 'start_date']),
            models.Index(fields=['user', '-created_at']),
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(end_date__gte=models.F('start_date')),
                name='end_date_gte_start_date',
            ),
        ]
    
    def __str__(self):
        return f"Booking {self.id}: {self.property.title} ({self.start_date} to {self.end_date})"
    
    @property
    def days_count(self):
        """Calculate number of days for the booking."""
        delta = self.end_date - self.start_date
        return delta.days
