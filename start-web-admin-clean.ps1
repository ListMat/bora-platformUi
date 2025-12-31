# Script para iniciar web-admin em ambiente limpo
# Execute este script em um novo terminal

Write-Host "====================================="
Write-Host "   Iniciando Web Admin (Backend)"
Write-Host "====================================="
Write-Host ""

# Limpar todas as variáveis npm_config problemáticas
Write-Host "Limpando variaveis de ambiente..."
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config*" } | ForEach-Object { 
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue 
}

# Navegar para o diretório
Set-Location "apps\web-admin"

Write-Host "Diretorio: $(Get-Location)"
Write-Host ""

# Tentar iniciar com pnpm primeiro
Write-Host "Tentando iniciar com pnpm..."
try {
    pnpm dev
} catch {
    Write-Host ""
    Write-Host "Erro com pnpm, tentando com npx..."
    Write-Host ""
    npx next dev -p 3000
}

