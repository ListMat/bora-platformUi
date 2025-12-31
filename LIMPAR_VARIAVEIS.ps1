# Script para limpar permanentemente variáveis npm_config corrompidas

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "   Limpeza de Variaveis Corrompidas"
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# Contar variáveis antes
$countBefore = (Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config*" }).Count
Write-Host "Variaveis npm_config encontradas: $countBefore" -ForegroundColor Cyan
Write-Host ""

# Limpar TODAS as variáveis npm_config
Write-Host "Removendo variaveis npm_config..." -ForegroundColor Yellow
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config*" } | ForEach-Object { 
    Write-Host "  - Removendo: $($_.Name)" -ForegroundColor Gray
    Remove-Item "Env:\$($_.Name)" -Force -ErrorAction SilentlyContinue
}

# Limpar variáveis específicas problemáticas
$problematicVars = @(
    "npm_config___i_g_n_o_r_e___w_o_r_k_s_p_a_c_e___r_o_o_t___c_h_e_c_k_",
    "npm_config_ignore_workspace_root_check",
    "npm_config_",
    "npm_config__"
)

Write-Host ""
Write-Host "Removendo variaveis especificas problematicas..." -ForegroundColor Yellow
foreach ($var in $problematicVars) {
    if (Test-Path "Env:\$var") {
        Write-Host "  - Removendo: $var" -ForegroundColor Gray
        Remove-Item "Env:\$var" -Force -ErrorAction SilentlyContinue
    }
}

# Contar variáveis depois
$countAfter = (Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config*" }).Count

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Limpeza Concluida!"
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Variaveis removidas: $($countBefore - $countAfter)" -ForegroundColor Green
Write-Host "Variaveis restantes: $countAfter" -ForegroundColor Cyan
Write-Host ""

if ($countAfter -eq 0) {
    Write-Host "OK - Todas as variaveis npm_config foram removidas!" -ForegroundColor Green
} else {
    Write-Host "AVISO - Ainda existem $countAfter variaveis npm_config" -ForegroundColor Yellow
    Write-Host "Feche e abra um novo terminal para limpar completamente" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Proximo passo:" -ForegroundColor Cyan
Write-Host "  1. Feche TODOS os terminais" -ForegroundColor White
Write-Host "  2. Abra um NOVO terminal PowerShell" -ForegroundColor White
Write-Host "  3. Execute os comandos para iniciar o projeto" -ForegroundColor White
Write-Host ""

