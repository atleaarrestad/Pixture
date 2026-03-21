# Architecture overview

## Current structure

- `apps/backend/Pixture.Api`: ASP.NET Core Web API starter
- `apps/frontend`: Angular frontend starter
- `.github/copilot-instructions.md`: repository instructions for Copilot and agents
- `docs/`: human-facing project documentation

## Backend

The backend currently uses:

- ASP.NET Core Web API
- Controllers as the primary API style
- OpenAPI generation in development
- A lightweight development CORS policy for the Angular dev server

Starter endpoints:

- `GET /health`
- `GET /api/system/info`

## Frontend

The frontend currently uses:

- Angular CLI workspace in `apps/frontend`
- Angular 21 packages generated during setup
- SCSS for styling
- A minimal landing page that documents the starter layout

## Monorepo approach

This repository intentionally uses a plain monorepo structure rather than Nx. Each application keeps its own native toolchain while shared documentation and repository conventions live at the root.
