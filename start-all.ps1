# Script para iniciar o projeto BORA

Write-Host ""
Write-Host "====================================="
Write-Host "   BORA - Inicializacao do Projeto"
Write-Host "====================================="
Write-Host ""

# Limpar variaveis npm_config
Write-Host "Limpando variaveis npm_config..."
$count = 0
Get-ChildItem Env: | Where-Object { $_.Name -like 'npm_config*' } | ForEach-Object { 
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue 
    $count++
}

if ($count -gt 0) {
    Write-Host "OK - $count variaveis npm_config removidas!"
} else {
    Write-Host "OK - Nenhuma variavel npm_config encontrada"
}

Write-Host ""
Write-Host "====================================="
Write-Host "   Instrucoes de Inicializacao"
Write-Host "====================================="
Write-Host ""

Write-Host "Abra 3 terminais separados e execute:"
Write-Host ""

Write-Host "Terminal 1 - Backend API (Admin Panel):"
Write-Host "   cd apps/web-admin"
Write-Host "   pnpm dev"
Write-Host ""

Write-Host "Terminal 2 - App Aluno (Expo):"
Write-Host "   cd apps/app-aluno"
Write-Host "   npx expo start --clear"
Write-Host ""

Write-Host "Terminal 3 - App Instrutor (Expo):"
Write-Host "   cd apps/app-instrutor"
Write-Host "   npx expo start --clear"
Write-Host ""

Write-Host "====================================="
Write-Host "   URLs dos Servicos"
Write-Host "====================================="
Write-Host ""

Write-Host "Admin Panel:    http://localhost:3000"
Write-Host "API tRPC:       http://localhost:3000/api/trpc"
Write-Host "Prisma Studio:  http://localhost:5555"
Write-Host "   (Execute: cd packages/db, depois npx prisma studio)"

Write-Host ""
Write-Host "====================================="
Write-Host "   Checklist Pre-Inicializacao"
Write-Host "====================================="
Write-Host ""

# Verificar se .env existe
if (Test-Path ".env") {
    Write-Host "OK - Arquivo .env encontrado"
} else {
    Write-Host "ERRO - Arquivo .env NAO encontrado - crie com base em ENV_EXAMPLE.md"
}

# Verificar se node_modules existe
if (Test-Path "node_modules") {
    Write-Host "OK - Dependencias instaladas (node_modules existe)"
} else {
    Write-Host "AVISO - Dependencias NAO instaladas - execute: pnpm install"
}

# Verificar se Prisma Client foi gerado
if (Test-Path "packages/db/node_modules/.prisma") {
    Write-Host "OK - Prisma Client gerado"
} else {
    Write-Host "AVISO - Prisma Client NAO gerado - execute: cd packages/db, depois npx prisma generate"
}

Write-Host ""
Write-Host "====================================="
Write-Host "   Proximos Passos"
Write-Host "====================================="
Write-Host ""

Write-Host "1. Certifique-se de que PostgreSQL esta rodando"
Write-Host "2. Abra os 3 terminais conforme instrucoes acima"
Write-Host "3. Aguarde cada servico inicializar completamente"
Write-Host "4. Teste as novas features UX/UI implementadas!"

Write-Host ""
Write-Host "Documentacao completa: START_PROJECT.md"
Write-Host ""
Write-Host "Boa sorte!"
Write-Host ""
