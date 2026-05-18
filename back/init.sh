#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║       APS Backend - Django REST API Setup                  ║"
echo "║                                                            ║"
echo "║  Sistema de Gerenciamento de Imóveis                      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if Docker is installed
echo -e "${YELLOW}Verificando pré-requisitos...${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker não encontrado. Por favor instale Docker.${NC}"
    echo "  https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ Docker Compose não encontrado.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker instalado${NC}"
echo -e "${GREEN}✓ Docker Compose instalado${NC}"

# Check if .env exists
echo -e "${YELLOW}Verificando arquivo .env...${NC}"

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Criando arquivo .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ Arquivo .env criado${NC}"
else
    echo -e "${GREEN}✓ Arquivo .env já existe${NC}"
fi

# Build and start Docker
echo -e "${YELLOW}Iniciando containers Docker...${NC}"
docker-compose down 2>/dev/null || true
docker-compose build

echo -e "${YELLOW}Aguarde enquanto os containers iniciam...${NC}"
docker-compose up -d

# Wait for database to be ready
echo -e "${YELLOW}Aguardando banco de dados ficar pronto...${NC}"
sleep 10

# Run migrations
echo -e "${YELLOW}Executando migrations...${NC}"
docker-compose exec -T web python manage.py migrate

# Create superuser
echo -e "${YELLOW}Criando usuário admin...${NC}"
docker-compose exec -T web python manage.py createsuperuser_if_not_exists

# Collect static files
echo -e "${YELLOW}Coletando arquivos estáticos...${NC}"
docker-compose exec -T web python manage.py collectstatic --noinput 2>/dev/null || true

# Print success message
echo ""
echo -e "${GREEN}"
echo "╔════════════════════════════════════════════════════════════╗"
echo "║              ✓ Setup Concluído com Sucesso!               ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo ""
echo -e "${BLUE}URLs Importantes:${NC}"
echo -e "  ${GREEN}API${NC}         : http://localhost:8000/api/v1"
echo -e "  ${GREEN}Admin${NC}       : http://localhost:8000/admin"
echo -e "  ${GREEN}Database${NC}    : localhost:5432"
echo ""

echo -e "${BLUE}Credenciais Padrão:${NC}"
echo -e "  ${GREEN}Usuário${NC}     : admin"
echo -e "  ${GREEN}Senha${NC}       : admin123456"
echo -e "${YELLOW}  ⚠️  Mude a senha em produção!${NC}"
echo ""

echo -e "${BLUE}Comandos Úteis:${NC}"
echo "  ${GREEN}make logs${NC}              - Ver logs do backend"
echo "  ${GREEN}make migrate${NC}           - Rodar migrations"
echo "  ${GREEN}make createsuperuser${NC}   - Criar novo admin"
echo "  ${GREEN}make down${NC}              - Parar containers"
echo "  ${GREEN}make clean${NC}             - Limpar cache"
echo ""

echo -e "${BLUE}Próximos Passos:${NC}"
echo "  1. Consulte API_DOCS.md para documentação da API"
echo "  2. Consulte INTEGRATION_GUIDE.md para integrar frontend"
echo "  3. Acesse http://localhost:8000/admin para gerenciar dados"
echo ""

echo -e "${GREEN}Backend pronto para uso! 🚀${NC}"
