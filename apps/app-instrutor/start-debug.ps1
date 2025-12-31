# Script para iniciar o Expo com debugging, limpando variáveis npm_config corrompidas

Write-Host "🧹 Limpando variaveis npm_config..." -ForegroundColor Yellow

# Remove todas as variáveis npm_config do ambiente atual
Get-ChildItem Env: | Where-Object { $_.Name -like 'npm_config*' } | ForEach-Object {
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue
}

Write-Host "✅ Variaveis limpas!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Iniciando Expo com debugging..." -ForegroundColor Cyan
Write-Host ""

# Inicia o Expo com as flags de debugging na porta 8082
npx expo start --clear --localhost --port 8082

