# Script para iniciar web-admin usando npx (evita problema com pnpm)

Write-Host "====================================="
Write-Host "   Iniciando Web Admin (NPX)"
Write-Host "====================================="
Write-Host ""

# Limpar TODAS as variáveis de ambiente problemáticas
Write-Host "Limpando variaveis de ambiente..." -ForegroundColor Yellow

# Remover variáveis npm_config
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config*" } | ForEach-Object { 
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue 
}

# Remover variáveis específicas problemáticas
$problematicVars = @(
    "npm_config___i_g_n_o_r_e___w_o_r_k_s_p_a_c_e___r_o_o_t___c_h_e_c_k_",
    "npm_config_ignore_workspace_root_check",
    "npm_config_",
    "npm_config__"
)

foreach ($var in $problematicVars) {
    if (Test-Path "Env:\$var") {
        Remove-Item "Env:\$var" -ErrorAction SilentlyContinue
    }
}

Write-Host "OK - Variaveis limpas!" -ForegroundColor Green
Write-Host ""

# Navegar para web-admin
Set-Location "apps\web-admin"

Write-Host "Diretorio: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""

# Iniciar com npx (evita o problema do pnpm)
Write-Host "Iniciando Next.js com npx..." -ForegroundColor Green
Write-Host ""

npx next dev -p 3000

