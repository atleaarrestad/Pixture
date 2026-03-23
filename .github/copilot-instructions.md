# Pixture repository instructions

## Project overview

Pixture is a plain monorepo with:

- An ASP.NET Core backend in `apps/backend/Pixture.Api`
- An Angular frontend in `apps/frontend`
- Supporting documentation in `docs/`

## Backend conventions

- Keep backend code inside `apps/backend/`
- Prefer DDD-style separation when backend code starts growing
- Keep shared domain and model types in separate backend projects instead of nesting many types inside the API project
- Prefer one C# type per file
- Avoid keeping multiple classes, records, or interfaces in a single backend file unless there is a very strong reason
- Keep API contracts separate from domain models
- Prefer small, composable API controllers over large multi-purpose controllers
- Keep controllers thin and let services/domain code own behavior
- When refactoring backend structure, prefer clear project boundaries over convenience shortcuts

## Frontend conventions

- Keep frontend application code inside `apps/frontend/src`
- Keep frontend components focused and avoid adding unnecessary state management early
- Reuse the shared UI components in `apps/frontend/src/app/ui`
- Use the centralized tokens in `apps/frontend/src/styles/_design-tokens.scss` for colors, spacing, typography, borders, radii, and shadows
- Do not hard-code new frontend colors or one-off visual values when an existing token or component can be reused

## General working conventions

- Document architectural changes in `docs/architecture.md`
- Update `README.md` when setup, tooling, or start commands change

## Starter assumptions

- The frontend and backend run separately in development
- The backend listens on `http://localhost:5168` by default
- The frontend uses Angular CLI tooling inside `apps/frontend`
- Development CORS is currently enabled for `http://localhost:4200`

## When extending this repo

- Reuse the monorepo layout instead of creating new top-level app folders casually
- Add tests alongside meaningful new behavior
- Prefer explicit configuration and clear docs over hidden conventions
- Extend the shared design system before introducing page-local UI patterns
