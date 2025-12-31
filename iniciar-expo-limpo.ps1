# Script universal para iniciar Expo limpando variáveis corrompidas
# Uso: .\iniciar-expo-limpo.ps1 -App aluno
#      .\iniciar-expo-limpo.ps1 -App instrutor

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("aluno", "instrutor")]
    [string]$App
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Expo (App $App)" -ForegroundColor Cyan
Write-Host "  Limpando variáveis problemáticas..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navegar para o diretório do app
$appPath = "apps\app-$App"
if (-not (Test-Path $appPath)) {
    Write-Host "❌ Diretório não encontrado: $appPath" -ForegroundColor Red
    exit 1
}

Set-Location $appPath

# Limpar TODAS as variáveis npm_config corrompidas
Write-Host "🧹 Limpando variáveis npm_config..." -ForegroundColor Yellow
$removed = 0
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config*" } | ForEach-Object {
    try {
        Remove-Item "Env:\$($_.Name)" -Force -ErrorAction SilentlyContinue
        $removed++
    } catch {
        # Ignorar erros
    }
}

if ($removed -gt 0) {
    Write-Host "✅ Removidas $removed variáveis corrompidas" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Nenhuma variável npm_config encontrada" -ForegroundColor Cyan
}

# Desabilitar validação de dependências
$env:EXPO_NO_DOCTOR = "1"

Write-Host ""
Write-Host "🚀 Iniciando Expo..." -ForegroundColor Green
Write-Host ""

# Tentar usar node diretamente para evitar problemas com npx
$nodePath = (Get-Command node -ErrorAction SilentlyContinue).Source
if ($nodePath) {
    # Encontrar expo no node_modules
    $expoPath = "..\..\node_modules\.pnpm\@expo+cli@*\node_modules\@expo\cli\build\bin\cli.js"
    $expoFiles = Get-ChildItem -Path "..\..\node_modules\.pnpm" -Recurse -Filter "cli.js" -ErrorAction SilentlyContinue | 
                 Where-Object { $_.FullName -like "*@expo*cli*" } | 
                 Select-Object -First 1
    
    if ($expoFiles) {
        Write-Host "📦 Usando Expo do node_modules..." -ForegroundColor Cyan
        & $nodePath $expoFiles.FullName start --clear --no-dev
    } else {
        # Fallback para npx
        Write-Host "📦 Usando npx..." -ForegroundColor Cyan
        npx expo start --clear --no-dev
    }
} else {
    # Fallback para npx
    Write-Host "📦 Usando npx..." -ForegroundColor Cyan
    npx expo start --clear --no-dev
}

