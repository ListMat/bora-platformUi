# Script para instalar tudo após reiniciar o computador
# Use este script APÓS reiniciar o computador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Instalação Completa do Projeto" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navegar para o diretório do projeto
$projectPath = "C:\Users\Mateus\Desktop\Bora UI"
Set-Location $projectPath

# Passo 1: Instalar dependências
Write-Host "📦 Passo 1: Instalando dependências..." -ForegroundColor Green
Write-Host ""
pnpm install

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    Write-Host "   Verifique se reiniciou o computador" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ Dependências instaladas!" -ForegroundColor Green
Write-Host ""

# Passo 2: Gerar Prisma Client
Write-Host "🔧 Passo 2: Gerando Prisma Client..." -ForegroundColor Green
Write-Host ""
Set-Location "packages\db"
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Erro ao gerar Prisma Client" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Prisma Client gerado!" -ForegroundColor Green
Write-Host ""

# Passo 3: Copiar Prisma Client para todas as versões
Write-Host "📋 Passo 3: Copiando Prisma Client..." -ForegroundColor Green
Write-Host ""
Set-Location $projectPath
node packages\db\copy-prisma-client.js

Write-Host ""
Write-Host "✅ Prisma Client copiado!" -ForegroundColor Green
Write-Host ""

# Passo 4: Verificar Husky
Write-Host "🪝 Passo 4: Verificando Husky..." -ForegroundColor Green
Write-Host ""
if (Test-Path ".husky") {
    Write-Host "✅ Husky já está instalado!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Husky não encontrado. Instalando..." -ForegroundColor Yellow
    npx husky install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Husky instalado!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Husky não pôde ser instalado (não crítico)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✅ Instalação Completa!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Iniciar Web Admin: cd apps\web-admin && npx next dev -p 3000" -ForegroundColor Cyan
Write-Host "  2. Iniciar App Aluno: cd apps\app-aluno && npx expo start" -ForegroundColor Cyan
Write-Host "  3. Iniciar App Instrutor: cd apps\app-instrutor && npx expo start" -ForegroundColor Cyan
Write-Host ""

