# StayFlow

StayFlow e uma aplicacao para gerenciamento de imoveis e reservas. O projeto esta organizado como monorepo, com frontend em Next.js e backend em Django REST Framework.

## Visao Geral

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide React e Recharts.
- Backend: Django 4.2, Django REST Framework, JWT com Simple JWT e PostgreSQL.
- Banco de dados: PostgreSQL 15, com Docker Compose disponivel no backend.
- Dominio principal: usuarios, propriedades/imoveis e reservas/agendamentos.

## Estrutura

```text
StayFlow/
  front/                  # Aplicacao web Next.js
    app/                  # Rotas, paginas e componentes
    hooks/                # Hooks React
    lib/                  # Cliente de API, tipos e servicos
    package.json

  back/                   # API Django REST
    apps/
      users/              # Usuarios, registro, login e perfil
      properties/         # CRUD e filtros de propriedades
      bookings/           # Reservas, disponibilidade e status
    core/                 # Configuracoes e rotas principais
    docker-compose.yml
    requirements.txt
```

## Funcionalidades

- Autenticacao por email e senha com JWT.
- Cadastro e consulta de perfil do usuario autenticado.
- CRUD de propriedades com filtros por cidade, tipo, status e faixa de preco.
- Listagem publica de propriedades.
- Reservas com validacao de datas, calculo de preco total e controle de status.
- Confirmacao e cancelamento de reservas.
- Consulta de datas ocupadas por propriedade.
- Dashboard web com estatisticas do portfolio de propriedades.

## Estado Atual do Projeto

O backend Django e a API em `front/lib/api.ts` representam o caminho principal atual do projeto.

Ainda existem arquivos e trechos legados relacionados ao Supabase no frontend e em documentos antigos. Alguns exemplos:

- `front/lib/supabase.ts` esta marcado como deprecated.
- `front/app/bookings/page.tsx`, `front/app/properties/new/page.tsx` e parte de `front/hooks/useAuth.ts` ainda usam chamadas no estilo Supabase.
- `front/lib/types.ts` importa tipos de `@supabase/supabase-js`, mas essa dependencia nao aparece no `front/package.json`.

Antes de considerar o frontend totalmente integrado ao backend Django, essas telas e tipos precisam ser migrados para `front/lib/api.ts`.

## Requisitos

- Node.js compativel com Next.js 16.
- npm.
- Python 3.11+.
- Docker e Docker Compose, recomendado para subir PostgreSQL e backend juntos.

## Como Rodar

### Backend com Docker

```bash
cd StayFlow/back
docker-compose up --build
```

A API ficara disponivel em:

```text
http://localhost:8000
```

Principais rotas:

```text
http://localhost:8000/admin/
http://localhost:8000/api/v1/auth/
http://localhost:8000/api/v1/properties/
http://localhost:8000/api/v1/bookings/
```

### Backend Local

```bash
cd StayFlow/back
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

> Observacao: o codigo usa `django_filters`. Se o ambiente local acusar erro de importacao, adicione `django-filter` nas dependencias e instale novamente.

### Frontend

```bash
cd StayFlow/front
npm install
npm run dev
```

O frontend ficara disponivel em:

```text
http://localhost:3000
```

Configure a URL da API em `front/.env.local` quando necessario:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_TOKEN_KEY=stayflow_token
```

## Scripts Uteis

Backend:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
python test_api.py
docker-compose up --build
docker-compose down
```

Frontend:

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Documentacao

A documentacao consolidada esta em:

- [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md)

Ela cobre arquitetura, variaveis de ambiente, endpoints, modelos principais, fluxo de autenticacao, testes e proximos ajustes recomendados.
