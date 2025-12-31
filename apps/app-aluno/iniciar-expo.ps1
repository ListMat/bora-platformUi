# Script para iniciar Expo limpando variáveis corrompidas
# Este script resolve o erro das variáveis npm_config corrompidas

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Expo (App Aluno)" -ForegroundColor Cyan
Write-Host "  Limpando variáveis problemáticas..." -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Limpar TODAS as variáveis npm_config corrompidas
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

# Iniciar Expo
npx expo start --clear --no-dev

