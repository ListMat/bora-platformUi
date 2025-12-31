# Como Alterar a Porta do Metro Bundler

## Porta Padrão vs Portas Configuradas

| App | Porta Padrão | Porta Configurada |
|-----|--------------|-------------------|
| App Aluno | 8081 | **8083** |
| App Instrutor | 8081 | **8082** |

## Como Usar uma Porta Específica

### Opção 1: Via Flag `--port`

```powershell
cd apps\app-aluno
npx expo start --port 8083
```

### Opção 2: Via Scripts do package.json

Os scripts já estão configurados com as portas:

**App Aluno:**
```powershell
pnpm start              # Porta 8083
pnpm start:debug        # Porta 8083
pnpm start:tunnel       # Porta 8083
```

**App Instrutor:**
```powershell
pnpm start              # Porta padrão (8081 ou 8082)
pnpm start:debug        # Porta 8082
pnpm start:tunnel       # Porta 8082
```

### Opção 3: Via Variável de Ambiente

```powershell
$env:RCT_METRO_PORT = "8083"
cd apps\app-aluno
npx expo start
```

## Portas Configuradas no Projeto

### App Aluno
- **Porta padrão**: 8083
- Configurado em: `apps/app-aluno/package.json`
- Script: `apps/app-aluno/start-debug.ps1`

### App Instrutor
- **Porta padrão**: 8082
- Configurado em: `apps/app-instrutor/package.json`
- Script: `apps/app-instrutor/start-debug.ps1`

## Verificar Qual Porta Está Sendo Usada

```powershell
# Verificar portas em uso
Get-NetTCPConnection -LocalPort 8081,8082,8083 | Select-Object LocalPort, State, OwningProcess
```

## Mudar a Porta Permanentemente

### 1. Atualizar package.json

Edite `apps/app-aluno/package.json`:

```json
{
  "scripts": {
    "start": "expo start --no-dev --port 8083",
    "start:debug": "powershell -ExecutionPolicy Bypass -File ./start-debug.ps1",
    "start:debug:direct": "expo start --clear --localhost --port 8083",
    "start:tunnel": "expo start --clear --tunnel --port 8083"
  }
}
```

### 2. Atualizar Script PowerShell

Edite `apps/app-aluno/start-debug.ps1`:

```powershell
npx expo start --clear --localhost --port 8083
```

### 3. Atualizar Scripts de Verificação

Se você tiver scripts que verificam a porta, atualize:

```powershell
# diagnosticar-app.ps1
$metroPort = Get-NetTCPConnection -LocalPort 8083 -ErrorAction SilentlyContinue

# verificar-hermes.ps1
.\verificar-hermes.ps1 -Port 8083
```

## Portas Recomendadas

- **8081** - Porta padrão do Metro (pode estar em uso)
- **8082** - App Instrutor
- **8083** - App Aluno
- **8084-8090** - Portas alternativas disponíveis

## Troubleshooting

### Erro: "Port already in use"

Se a nova porta também estiver em uso:

1. **Verificar qual processo está usando:**
   ```powershell
   Get-NetTCPConnection -LocalPort 8083 | Select-Object OwningProcess
   ```

2. **Liberar a porta:**
   ```powershell
   .\liberar-porta.ps1 -Porta 8083
   ```

3. **Ou usar outra porta:**
   ```powershell
   npx expo start --port 8084
   ```

### O Expo pergunta sobre mudar a porta

Se você ver:
```
Port 8081 is being used by another process
Use port 8083 instead? (Y/n)
```

Digite `Y` para aceitar a nova porta.

## Referências

- [Expo CLI - Port Options](https://docs.expo.dev/workflow/configuration/#port)
- [Metro Bundler Configuration](https://facebook.github.io/metro/docs/configuration)

