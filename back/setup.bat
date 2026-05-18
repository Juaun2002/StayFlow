@echo off
REM Script para inicializar o backend em desenvolvimento local (Windows)

echo 🚀 Iniciando configuracao do backend Django...

REM Criar ambiente virtual
if not exist "venv" (
    echo 📦 Criando ambiente virtual...
    python -m venv venv
)

REM Ativar ambiente virtual
call venv\Scripts\activate.bat

REM Instalar dependências
echo 📚 Instalando dependencias...
pip install -r requirements.txt

REM Copiar .env se não existir
if not exist ".env" (
    echo ⚙️ Criando arquivo .env...
    copy .env.example .env
    echo ⚠️ Edite o arquivo .env conforme necessario
)

REM Executar migrations
echo 🗄️ Executando migrations...
python manage.py migrate

REM Criar superusuário se não existir
echo 👤 Criando superusuario...
python manage.py createsuperuser_if_not_exists

REM Coletar arquivos estáticos
echo 📁 Coletando arquivos estaticos...
python manage.py collectstatic --noinput

echo.
echo ✅ Setup completo!
echo.
echo Para iniciar o servidor, execute:
echo   python manage.py runserver
echo.
echo Acesse em http://localhost:8000
echo Admin em http://localhost:8000/admin
