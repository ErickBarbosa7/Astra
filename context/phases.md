# Roadmap y Fases de Desarrollo: Personal Finance App

Este documento detalla el orden estricto de ejecución para construir la aplicación. No se debe avanzar a una fase sin haber completado y probado la anterior.

## MVP (Minimum Viable Product)
El flujo crítico inicial debe contener: Autenticación -> Cuentas -> Categorías -> Transacciones -> Dashboard. 
El usuario debe poder registrarse, crear una cuenta, categorizar un ingreso/gasto y ver su balance actualizado.

---

## Fase 1: Setup del Proyecto e Infraestructura
* Inicializar repositorio monorepo o carpetas separadas (Frontend/Backend).
* Configurar Node.js, Express y TypeScript en Backend.
* Configurar React, Vite, TypeScript y Tailwind CSS en Frontend.
* Configurar Docker Compose con PostgreSQL.
* Inicializar Prisma ORM y conectar con la base de datos.
* Configurar variables de entorno (.env).
* Configurar Linters (ESLint, Prettier).

## Fase 2: Diseño de Base de Datos
* Crear esquema de Prisma (User, Account, Category, Transaction, Budget, Goal, RecurringTransaction).
* Aplicar tipos correctos (Decimal para moneda, no Float).
* Establecer relaciones y restricciones (Unique, Foreign Keys, Cascade).
* Generar y ejecutar la primera migración de Prisma.

## Fase 3: Autenticación y Seguridad (Core)
* Implementar registro de usuario (hasheo con Argon2).
* Implementar login y generación de JWT (Access y Refresh tokens).
* Configurar cookies HTTP-only para el Refresh Token.
* Crear Middleware de autenticación en Express.
* Proteger rutas del API.
* Implementar protección de rutas en React Router.

## Fase 4: Módulo de Cuentas Financieras
* Crear endpoints CRUD para Accounts asegurando validación de propiedad (userId).
* Construir UI Frontend: Lista de cuentas, creación, edición y vista de detalles.
* Conectar Frontend y Backend con manejo de estado (Zustand).

## Fase 5: Módulo de Transacciones y Categorías
* Crear endpoints CRUD para Categorías.
* Crear endpoints CRUD para Transacciones.
* Implementar filtros (fecha, cuenta, tipo, categoría) en el Backend.
* Construir UI Frontend: Formularios (React Hook Form + Zod) y tabla/lista de transacciones.

## Fase 6: Dashboard Principal
* Desarrollar endpoint de agregación de datos (Balance total, ingresos, gastos).
* Integrar Recharts en el Frontend.
* Construir gráficos: Distribución de gastos e Ingresos vs Gastos.
* Mostrar transacciones recientes.

## Fase 7: Presupuestos (Budgets)
* Crear endpoints CRUD para Budgets.
* Lógica backend para calcular progreso del presupuesto.
* UI Frontend: Creación de presupuestos y barras de progreso visuales (con estados de advertencia).

## Fase 8: Metas de Ahorro (Goals)
* Crear endpoints CRUD para Goals (aportes y retiros).
* Lógica de cálculo de progreso y tiempo restante.
* UI Frontend: Tarjetas de metas con porcentaje de completitud.

## Fase 9: Transacciones Recurrentes
* Crear endpoints CRUD para programar transacciones recurrentes.
* Implementar lógica para identificar y ejecutar transacciones programadas (inicialmente manual o al inicio de sesión, escalable a cron job).
* UI Frontend: Gestión de suscripciones y pagos recurrentes.

## Fase 10: Reportes y Analítica
* Desarrollar endpoints para reportes mensuales, anuales y tendencias.
* Construir vistas detalladas en Frontend con selectores de rango de fechas.

## Fase 11: Insights (Lógica de Negocios)
* Crear motor de reglas simple en backend para generar alertas (ej. "Gastaste 15% más en comida").
* Mostrar notificaciones o tarjetas de insights en el Dashboard.

## Fase 12: Calidad y Pruebas
* Escribir pruebas unitarias (Vitest) para cálculos financieros.
* Escribir pruebas de integración para endpoints críticos.
* Configurar E2E básico (Playwright) para el flujo MVP.
* Revisión de seguridad y accesibilidad.

## Fase 13: Despliegue a Producción
* Configurar variables de entorno de producción.
* Desplegar base de datos gestionada.
* Desplegar Backend (ej. Render, Railway) y Frontend (ej. Vercel, Netlify).
* Configurar CORS y HTTPS.

---

## Futuras Iteraciones (Post-Producción)
* Importación/Exportación CSV/PDF.
* Soporte multidivisa.
* Cuentas compartidas/familiares.