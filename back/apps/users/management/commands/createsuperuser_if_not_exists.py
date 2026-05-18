"""
Management command to create a default superuser if it doesn't exist.
"""
from django.core.management.base import BaseCommand
from apps.users.models import User


class Command(BaseCommand):
    help = 'Create a default superuser if it does not exist'

    def handle(self, *args, **options):
        if User.objects.filter(username='admin').exists():
            self.stdout.write(
                self.style.SUCCESS('Admin user already exists')
            )
        else:
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123456'
            )
            self.stdout.write(
                self.style.SUCCESS('Admin user created successfully')
            )
            self.stdout.write('Username: admin')
            self.stdout.write('Email: admin@example.com')
            self.stdout.write('Password: admin123456')
            self.stdout.write('Please change the password in production!')
