#!/bin/bash
# Script para inicializar o backend em desenvolvimento local

echo "🚀 Iniciando configuração do backend Django..."

# Criar ambiente virtual
if [ ! -d "venv" ]; then
    echo "📦 Criando ambiente virtual..."
    python3.11 -m venv venv
fi

# Ativar ambiente virtual
source venv/bin/activate

# Instalar dependências
echo "📚 Instalando dependências..."
pip install -r requirements.txt

# Copiar .env se não existir
if [ ! -f ".env" ]; then
    echo "⚙️ Criando arquivo .env..."
    cp .env.example .env
    echo "⚠️ Edite o arquivo .env conforme necessário"
fi

# Executar migrations
echo "🗄️ Executando migrations..."
python manage.py migrate

# Criar superusuário se não existir
echo "👤 Criando superusuário..."
python manage.py createsuperuser_if_not_exists

# Coletar arquivos estáticos
echo "📁 Coletando arquivos estáticos..."
python manage.py collectstatic --noinput

echo ""
echo "✅ Setup completo!"
echo ""
echo "Para iniciar o servidor, execute:"
echo "  python manage.py runserver"
echo ""
echo "Acesse em http://localhost:8000"
echo "Admin em http://localhost:8000/admin"
