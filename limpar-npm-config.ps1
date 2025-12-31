# Script para limpar variáveis npm_config corrompidas
# Execute este script antes de rodar comandos do Expo para reduzir avisos

Write-Host "🧹 Limpando variáveis npm_config..." -ForegroundColor Yellow

# Remove todas as variáveis npm_config do ambiente atual
Get-ChildItem Env: | Where-Object { $_.Name -like 'npm_config*' } | ForEach-Object {
    Write-Host "   Removendo: $($_.Name)" -ForegroundColor Gray
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue
}

Write-Host "✅ Variáveis npm_config limpas!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Dica: Para tornar isso permanente, adicione ao seu perfil do PowerShell:" -ForegroundColor Cyan
Write-Host '   function Clear-NpmConfig { Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config*" } | ForEach-Object { Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue } }' -ForegroundColor White
Write-Host ""

