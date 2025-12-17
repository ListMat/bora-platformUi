# Script para limpar variáveis npm_config corrompidas e iniciar o Expo
Write-Host "Limpando variáveis npm_config corrompidas..." -ForegroundColor Yellow

# Remover todas as variáveis npm_config
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config_*" } | ForEach-Object {
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue
    Write-Host "Removida: $($_.Name)" -ForegroundColor Gray
}

# Limpar variável específica problemática
Remove-Item Env:npm_config___i_g_n_o_r_e___w_o_r_k_s_p_a_c_e___r_o_o_t___c_h_e_c_k_ -ErrorAction SilentlyContinue
$env:npm_config___i_g_n_o_r_e___w_o_r_k_s_p_a_c_e___r_o_o_t___c_h_e_c_k_ = $null

Write-Host "`nIniciando Expo..." -ForegroundColor Green
npx expo start --clear

