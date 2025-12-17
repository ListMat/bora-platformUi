# Script para instalar dependências do app-instrutor
# Resolve problemas com variáveis de ambiente corrompidas no Windows

Write-Host "Limpando variáveis de ambiente problemáticas..." -ForegroundColor Yellow

# Remover todas as variáveis npm_config que podem estar corrompidas
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config_*" } | ForEach-Object {
    Remove-Item "Env:\$($_.Name)"
    Write-Host "Removida: $($_.Name)" -ForegroundColor Gray
}

# Limpar cache do pnpm
Write-Host "`nLimpando cache do pnpm..." -ForegroundColor Yellow
pnpm store prune

# Instalar dependências específicas do app-instrutor
Write-Host "`nInstalando dependências..." -ForegroundColor Yellow
cd "$PSScriptRoot"

# Instalar dependências uma por uma para evitar problemas
pnpm add expo-device@~6.0.2 --filter app-instrutor
pnpm add expo-notifications@~0.28.19 --filter app-instrutor
pnpm add react-native-qrcode-svg@^6.3.0 --filter app-instrutor
pnpm add react-native-svg@^15.2.0 --filter app-instrutor

Write-Host "`n✅ Dependências instaladas com sucesso!" -ForegroundColor Green

