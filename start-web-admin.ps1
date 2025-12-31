# Script para iniciar o web-admin com ambiente limpo

Write-Host "Limpando variaveis de ambiente npm_config..."
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config*" } | ForEach-Object { 
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue 
}

# Limpar variáveis específicas problemáticas
$problematicVars = @(
    "npm_config___i_g_n_o_r_e___w_o_r_k_s_p_a_c_e___r_o_o_t___c_h_e_c_k_",
    "npm_config_ignore_workspace_root_check"
)

foreach ($var in $problematicVars) {
    if (Test-Path "Env:\$var") {
        Remove-Item "Env:\$var" -ErrorAction SilentlyContinue
        Write-Host "Removida: $var"
    }
}

Write-Host ""
Write-Host "Iniciando web-admin..."
Write-Host ""

cd "apps\web-admin"
pnpm dev

