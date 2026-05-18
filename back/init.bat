@echo off
REM Setup script para Windows

setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║       APS Backend - Django REST API Setup                  ║
echo ║                                                            ║
echo ║  Sistema de Gerenciamento de Imóveis                      ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check Docker
echo Verificando pré-requisitos...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Docker não encontrado. Por favor instale Docker.
    echo   https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Docker Compose não encontrado.
    pause
    exit /b 1
)

echo ✓ Docker instalado
echo ✓ Docker Compose instalado
echo.

REM Check .env file
echo Verificando arquivo .env...
if not exist ".env" (
    echo Criando arquivo .env...
    copy .env.example .env
    echo ✓ Arquivo .env criado
) else (
    echo ✓ Arquivo .env já existe
)

echo.
echo Iniciando containers Docker...
docker-compose down >nul 2>&1
docker-compose build

echo.
echo Aguarde enquanto os containers iniciam...
timeout /t 15 /nobreak

REM Run migrations
echo.
echo Executando migrations...
docker-compose exec -T web python manage.py migrate

REM Create superuser
echo.
echo Criando usuário admin...
docker-compose exec -T web python manage.py createsuperuser_if_not_exists

REM Collect static files
echo.
echo Coletando arquivos estáticos...
docker-compose exec -T web python manage.py collectstatic --noinput >nul 2>&1

REM Print success message
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║              ✓ Setup Concluído com Sucesso!               ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

echo URLs Importantes:
echo   API       : http://localhost:8000/api/v1
echo   Admin     : http://localhost:8000/admin
echo   Database  : localhost:5432
echo.

echo Credenciais Padrão:
echo   Usuário   : admin
echo   Senha     : admin123456
echo   ⚠️  Mude a senha em produção!
echo.

echo Comandos Úteis:
echo   make logs              - Ver logs do backend
echo   make migrate           - Rodar migrations
echo   make createsuperuser   - Criar novo admin
echo   make down              - Parar containers
echo   make clean             - Limpar cache
echo.

echo Próximos Passos:
echo   1. Consulte API_DOCS.md para documentação da API
echo   2. Consulte INTEGRATION_GUIDE.md para integrar frontend
echo   3. Acesse http://localhost:8000/admin para gerenciar dados
echo.

echo Backend pronto para uso! 🚀
echo.

pause
