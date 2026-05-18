#!/bin/sh

# Exit on error
set -e

echo "Running migrations..."
python manage.py migrate

echo "Creating default superuser if not exists..."
python manage.py createsuperuser_if_not_exists

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting Gunicorn..."
exec "$@"
