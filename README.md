# Astra

Aplicación web de finanzas personales. Monorepo con backend (Node + Express + TypeScript + Prisma) y frontend (React + Vite + Tailwind CSS), siguiendo un estilo visual Bento UI.

## Estructura

```text
Astra/
├── backend/          # API REST (Express, TypeScript, Prisma)
├── frontend/         # UI (React, Vite, Tailwind CSS)
├── docker-compose.yml  # PostgreSQL 16 (puerto 5433)
└── docs               # instructions.md, design.md, phases.md
```

## Requisitos

- Node.js >= 22
- npm
- Docker + Docker Compose

## Puesta en marcha

### 1. Base de datos

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Servidor disponible en `http://localhost:4000`, health check en `GET /api/health`.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend disponible en `http://localhost:5176`.

## Comandos útiles

| Acción               | Backend (`cd backend`) | Frontend (`cd frontend`) |
| -------------------- | ---------------------- | ------------------------ |
| Desarrollo           | `npm run dev`          | `npm run dev`            |
| Build                | `npm run build`        | `npm run build`          |
| Lint                 | `npm run lint`         | `npm run lint`           |
| Formatear            | `npm run format`       | `npm run format`         |

## Stack

- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, JWT, Argon2
- **Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Zustand, React Router, React Hook Form, Zod, Recharts, Lucide
