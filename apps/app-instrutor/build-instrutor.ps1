# Script Automatizado: Build App Instrutor
# Execute este script após o build do app-aluno completar

Write-Host "🚀 Preparando Build do App INSTRUTOR..." -ForegroundColor Cyan
Write-Host ""

# 1. Navegar para o diretório
Write-Host "📁 Navegando para app-instrutor..." -ForegroundColor Yellow
Set-Location "c:\Users\Mateus\Desktop\Bora UI\apps\app-instrutor"

# 2. Remover pasta android se existir
Write-Host "🧹 Limpando pasta android antiga..." -ForegroundColor Yellow
Remove-Item -Path "android" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "ios" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Verificar se expo-dev-client está instalado
Write-Host "📦 Verificando expo-dev-client..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" | ConvertFrom-Json
if (-not $packageJson.dependencies.'expo-dev-client') {
    Write-Host "⚠️  expo-dev-client não encontrado, já foi adicionado!" -ForegroundColor Green
}

# 4. Inicializar projeto EAS (se necessário)
Write-Host ""
Write-Host "🔧 Inicializando projeto no EAS..." -ForegroundColor Cyan
Write-Host "Se pedir para criar novo projeto, escolha 'Yes'" -ForegroundColor Yellow
Write-Host ""

# Aguardar usuário pressionar Enter
Read-Host "Pressione Enter para iniciar o build do App INSTRUTOR"

# 5. Iniciar build
Write-Host ""
Write-Host "🏗️  Iniciando build do App INSTRUTOR..." -ForegroundColor Cyan
Write-Host "Isso vai demorar ~15-20 minutos" -ForegroundColor Yellow
Write-Host ""

eas build --platform android --profile development

Write-Host ""
Write-Host "✅ Build iniciado!" -ForegroundColor Green
Write-Host "Acompanhe em: https://expo.dev" -ForegroundColor Cyan
