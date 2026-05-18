"""
Migrations for Property model
"""
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Property',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('description', models.TextField(blank=True, null=True)),
                ('property_type', models.CharField(choices=[('apartment', 'Apartment'), ('house', 'House'), ('land', 'Land'), ('commercial', 'Commercial')], default='apartment', max_length=20)),
                ('address', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=100)),
                ('state', models.CharField(max_length=2)),
                ('zip_code', models.CharField(blank=True, max_length=20, null=True)),
                ('latitude', models.FloatField(blank=True, null=True)),
                ('longitude', models.FloatField(blank=True, null=True)),
                ('price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('area', models.FloatField()),
                ('bedrooms', models.IntegerField(default=0)),
                ('bathrooms', models.IntegerField(default=0)),
                ('status', models.CharField(choices=[('available', 'Available'), ('sold', 'Sold'), ('rented', 'Rented')], default='available', max_length=20)),
                ('image_url', models.URLField(blank=True, null=True)),
                ('featured_image', models.ImageField(blank=True, null=True, upload_to='properties/')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='properties', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Property',
                'verbose_name_plural': 'Properties',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddIndex(
            model_name='property',
            index=models.Index(fields=['city', 'status'], name='properties_city_6a5b3e_idx'),
        ),
        migrations.AddIndex(
            model_name='property',
            index=models.Index(fields=['owner', '-created_at'], name='properties_owner_1c2d3e_idx'),
        ),
    ]
