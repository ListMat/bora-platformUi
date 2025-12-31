# Script para iniciar o app-instrutor
# Resolve problemas com variáveis de ambiente corrompidas no Windows

Write-Host "🧹 Limpando variáveis de ambiente problemáticas..." -ForegroundColor Yellow

# Remover todas as variáveis npm_config da sessão atual
$npmConfigVars = Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config_*" }
foreach ($var in $npmConfigVars) {
    try {
        Remove-Item "Env:\$($var.Name)" -ErrorAction SilentlyContinue
        # Também limpar do processo atual
        [Environment]::SetEnvironmentVariable($var.Name, $null, "Process")
    } catch {
        # Ignorar erros ao remover
    }
}

# Limpar especificamente a variável problemática com bytes nulos
$problematicVar = "npm_config___i_g_n_o_r_e___w_o_r_k_s_p_a_c_e___r_o_o_t___c_h_e_c_k_"
try {
    Remove-Item "Env:\$problematicVar" -ErrorAction SilentlyContinue
    [Environment]::SetEnvironmentVariable($problematicVar, $null, "Process")
    [Environment]::SetEnvironmentVariable($problematicVar, $null, "User")
} catch {
    # Se não conseguir remover, pelo menos limpar do processo atual
    [Environment]::SetEnvironmentVariable($problematicVar, $null, "Process")
}

# Criar um novo ambiente limpo para o processo filho
$cleanEnv = @{}
Get-ChildItem Env: | Where-Object { $_.Name -notlike "npm_config_*" } | ForEach-Object {
    $cleanEnv[$_.Name] = $_.Value
}

Write-Host "✅ Variáveis limpas!" -ForegroundColor Green
Write-Host "🚀 Iniciando Expo..." -ForegroundColor Cyan

# Navegar para o diretório do app
Set-Location "$PSScriptRoot"

# Executar expo start diretamente (sem pnpm para evitar o problema)
# Usar npx com --yes para evitar prompts
npx --yes expo start --clear

