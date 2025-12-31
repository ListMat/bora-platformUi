# Script para instalar react-admin com ambiente limpo

Write-Host "Limpando variaveis npm_config..." -ForegroundColor Yellow

# Limpar todas as variáveis npm_config
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config*" } | ForEach-Object { 
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue 
}

Write-Host "OK - Variaveis limpas!" -ForegroundColor Green
Write-Host ""

# Navegar para web-admin
Set-Location "apps\web-admin"

Write-Host "Instalando react-admin..." -ForegroundColor Cyan
pnpm install react-admin@^5.13.2

Write-Host ""
Write-Host "Instalacao concluida!" -ForegroundColor Green

