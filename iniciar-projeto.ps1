# 🚀 Script para Iniciar o Projeto BORA Completo
# Este script prepara o ambiente e inicia todos os serviços

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   BORA - Inicialização Completa" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Configurar pnpm
Write-Host "Configurando pnpm..." -ForegroundColor Yellow
$env:PNPM_HOME = "C:\Users\Mateus\AppData\Local\pnpm"
if ($env:Path -notlike "*$env:PNPM_HOME*") {
    $env:Path = "$env:PNPM_HOME;$env:Path"
}

# Limpar variáveis npm_config
Write-Host "Limpando variáveis npm_config..." -ForegroundColor Yellow
$count = 0
Get-ChildItem Env: | Where-Object { $_.Name -like 'npm_config*' } | ForEach-Object { 
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue 
    $count++
}
if ($count -gt 0) {
    Write-Host "✅ $count variáveis npm_config removidas!" -ForegroundColor Green
} else {
    Write-Host "✅ Nenhuma variável npm_config encontrada" -ForegroundColor Green
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Verificando Pré-requisitos" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar .env
if (Test-Path ".env") {
    Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
} else {
    Write-Host "❌ Arquivo .env NÃO encontrado!" -ForegroundColor Red
    Write-Host "   Crie o arquivo .env com base em CONFIGURAR_ENV.md" -ForegroundColor Yellow
    exit 1
}

# Verificar node_modules
if (Test-Path "node_modules") {
    Write-Host "✅ Dependências instaladas" -ForegroundColor Green
} else {
    Write-Host "⚠️  Dependências não instaladas" -ForegroundColor Yellow
    Write-Host "   Executando pnpm install..." -ForegroundColor Yellow
    pnpm install
}

# Verificar Prisma Client
Write-Host ""
Write-Host "Verificando Prisma Client..." -ForegroundColor Yellow
$prismaPath = "node_modules\.pnpm\@prisma+client@5.22.0_prisma@5.22.0\node_modules\.prisma\client"
if (Test-Path $prismaPath) {
    Write-Host "✅ Prisma Client encontrado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Prisma Client não encontrado. Gerando..." -ForegroundColor Yellow
    cd packages\db
    pnpm prisma generate
    cd ..\..
    Write-Host "✅ Prisma Client gerado!" -ForegroundColor Green
    
    Write-Host "Copiando para todas as versões..." -ForegroundColor Yellow
    node packages/db/copy-prisma-client.js
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Instruções de Inicialização" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Abra 3 terminais PowerShell separados:" -ForegroundColor Yellow
Write-Host ""

Write-Host "Terminal 1 - Web Admin (Backend + API):" -ForegroundColor Green
Write-Host "   cd apps\web-admin" -ForegroundColor White
Write-Host "   pnpm dev" -ForegroundColor White
Write-Host ""

Write-Host "Terminal 2 - App Aluno (Expo):" -ForegroundColor Green
Write-Host "   cd apps\app-aluno" -ForegroundColor White
Write-Host "   npx expo start --clear" -ForegroundColor White
Write-Host ""

Write-Host "Terminal 3 - App Instrutor (Expo):" -ForegroundColor Green
Write-Host "   cd apps\app-instrutor" -ForegroundColor White
Write-Host "   npx expo start --clear --port 8082" -ForegroundColor White
Write-Host ""

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   URLs dos Serviços" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Admin Panel:    http://localhost:3000" -ForegroundColor Cyan
Write-Host "API tRPC:       http://localhost:3000/api/trpc" -ForegroundColor Cyan
Write-Host "Prisma Studio:  http://localhost:5555" -ForegroundColor Cyan
Write-Host "   (Execute: cd packages\db && npx prisma studio)" -ForegroundColor Gray
Write-Host ""

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Pronto para Iniciar!" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Execute os comandos acima nos 3 terminais separados." -ForegroundColor Yellow
Write-Host ""


