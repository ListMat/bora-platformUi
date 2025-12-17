# Script para iniciar o app-instrutor
# Resolve problemas com variáveis de ambiente corrompidas no Windows

Write-Host "🧹 Limpando variáveis de ambiente problemáticas..." -ForegroundColor Yellow

# Remover todas as variáveis npm_config que podem estar corrompidas
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config_*" } | ForEach-Object {
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue
}

# Limpar especificamente a variável problemática
$env:npm_config___i_g_n_o_r_e___w_o_r_k_s_p_a_c_e___r_o_o_t___c_h_e_c_k_ = $null
[Environment]::SetEnvironmentVariable("npm_config___i_g_n_o_r_e___w_o_r_k_s_p_a_c_e___r_o_o_t___c_h_e_c_k_", $null, "Process")

Write-Host "✅ Variáveis limpas!" -ForegroundColor Green
Write-Host "🚀 Iniciando Expo..." -ForegroundColor Cyan

# Navegar para o diretório do app
Set-Location "$PSScriptRoot"

# Executar expo start diretamente (sem pnpm para evitar o problema)
npx expo start

