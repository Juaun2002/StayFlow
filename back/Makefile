.PHONY: help build up down logs migrate createsuperuser shell test lint format clean

help:
	@echo "APS Backend - Django Commands"
	@echo "=============================="
	@echo ""
	@echo "Docker commands:"
	@echo "  make build              Build Docker image"
	@echo "  make up                 Start containers"
	@echo "  make down               Stop containers"
	@echo "  make logs               Show container logs"
	@echo ""
	@echo "Database commands:"
	@echo "  make migrate            Run migrations"
	@echo "  make migrations         Create new migrations"
	@echo "  make createsuperuser    Create admin user"
	@echo "  make dbshell            Access database shell"
	@echo ""
	@echo "Django commands:"
	@echo "  make shell              Django shell"
	@echo "  make test               Run tests"
	@echo "  make lint               Run linting"
	@echo "  make format             Format code"
	@echo ""
	@echo "Utility:"
	@echo "  make clean              Remove cache files"
	@echo "  make setup-local        Setup local development"

# Docker commands
build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f web

# Database commands
migrate:
	docker-compose exec web python manage.py migrate

migrations:
	docker-compose exec web python manage.py makemigrations

createsuperuser:
	docker-compose exec web python manage.py createsuperuser

dbshell:
	docker-compose exec db psql -U aps_user -d aps_db

# Django commands
shell:
	docker-compose exec web python manage.py shell

test:
	docker-compose exec web python manage.py test

lint:
	docker-compose exec web flake8 apps

format:
	docker-compose exec web black apps

# Utility
clean:
	find . -type f -name '*.pyc' -delete
	find . -type d -name '__pycache__' -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name '.pytest_cache' -exec rm -rf {} + 2>/dev/null || true

setup-local:
	@echo "Setting up local development environment..."
	python -m venv venv
	./venv/Scripts/activate 2>/dev/null || . venv/bin/activate
	pip install -r requirements.txt
	cp .env.example .env
	python manage.py migrate
	python manage.py createsuperuser_if_not_exists
	@echo "Setup complete! Run 'python manage.py runserver' to start."

# Development
dev-build: build
	@echo "Docker image built successfully"

dev-start: up
	@echo "Containers started. API available at http://localhost:8000"
	@echo "Admin panel at http://localhost:8000/admin"
	@make logs

dev-stop: down
	@echo "Containers stopped"

dev-reset: down
	docker-compose down -v
	docker-compose up -d
	@echo "Database reset and containers restarted"
