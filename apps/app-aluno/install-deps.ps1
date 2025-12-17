# Script para limpar variáveis npm_config corrompidas e instalar dependências
Write-Host "Limpando variáveis npm_config corrompidas..." -ForegroundColor Yellow

# Remover todas as variáveis npm_config
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config_*" } | ForEach-Object {
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue
    Write-Host "Removida: $($_.Name)" -ForegroundColor Gray
}

Write-Host "`nInstalando dependências..." -ForegroundColor Green
pnpm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Dependências instaladas com sucesso!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Erro ao instalar dependências" -ForegroundColor Red
}

