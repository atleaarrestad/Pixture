# Development guide

## Local commands

Backend:

```powershell
dotnet build apps\backend\Pixture.Api\Pixture.Api.csproj
dotnet run --project apps\backend\Pixture.Api
```

Frontend:

```powershell
npm install --prefix apps\frontend
npm run start --prefix apps\frontend
npm run build --prefix apps\frontend
npm run test --prefix apps\frontend -- --watch=false
```

If you `Set-Location apps\frontend`, use the local scripts instead of a global Angular CLI:

```powershell
npm run start
npm run build
npm run test -- --watch=false
```

Root shortcuts:

```powershell
npm run backend:build
npm run backend:run
npm run frontend:start
npm run frontend:build
npm run frontend:test
```

## Notes

- The Angular app manages its own `node_modules` inside `apps/frontend`
- The backend solution file is `Pixture.slnx`, which is the default solution format produced by the installed .NET SDK
- Update `.github/copilot-instructions.md` and `README.md` if repository conventions change
