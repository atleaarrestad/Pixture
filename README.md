# Pixture

Pixture is a plain monorepo starter with:

- `apps/backend/Pixture.Api`: ASP.NET Core Web API with controllers
- `apps/frontend`: Angular 21 app scaffolded with Angular CLI
- `apps/frontend/src/app/ui`: reusable frontend component library
- `.github/copilot-instructions.md`: repository guidance for Copilot and agents
- `docs/`: project architecture and development notes

## Repository layout

```text
Pixture/
  apps/
    backend/
      Pixture.Api/
    frontend/
  docs/
  .github/
    copilot-instructions.md
  global.json
  package.json
  Pixture.slnx
```

## Prerequisites

- .NET SDK 10
- Node.js 22+
- npm 10+

## Getting started

Run the backend:

```powershell
dotnet run --project apps\backend\Pixture.Api
```

Run the frontend:

```powershell
npm run start --prefix apps\frontend
```

If you work directly inside `apps\frontend`, use `npm run start`, `npm run build`, and `npm run test -- --watch=false`. This repo does not require a globally installed `ng` command.

Useful starter endpoints:

- `http://localhost:5168/health`
- `http://localhost:5168/api/system/info`
- `http://localhost:5168/openapi/v1.json` in development

## Root scripts

You can also use the root `package.json` shortcuts:

```powershell
npm run frontend:start
npm run frontend:build
npm run frontend:test
npm run backend:build
npm run backend:run
```

## Documentation

- `docs/architecture.md`
- `docs/design-system.md`
- `docs/development.md`
- `.github/copilot-instructions.md`
