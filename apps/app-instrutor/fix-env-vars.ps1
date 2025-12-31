# Script para limpar permanentemente variáveis de ambiente corrompidas
# Execute como Administrador para limpar do sistema

Write-Host "🔧 Limpeza Permanente de Variáveis de Ambiente Corrompidas" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# Verificar se está executando como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "⚠️  AVISO: Execute este script como Administrador para limpar variáveis do sistema." -ForegroundColor Yellow
    Write-Host "   Limpando apenas variáveis da sessão atual..." -ForegroundColor Yellow
}

# Lista de variáveis problemáticas conhecidas
$problematicVars = @(
    "npm_config___i_g_n_o_r_e___w_o_r_k_s_p_a_c_e___r_o_o_t___c_h_e_c_k_",
    "npm_config_*"
)

Write-Host "`n🧹 Limpando variáveis npm_config..." -ForegroundColor Yellow

# Limpar da sessão atual
$cleared = 0
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config_*" } | ForEach-Object {
    try {
        $varName = $_.Name
        Remove-Item "Env:\$varName" -ErrorAction SilentlyContinue
        [Environment]::SetEnvironmentVariable($varName, $null, "Process")
        $cleared++
    } catch {
        Write-Host "  ⚠️  Não foi possível remover: $($_.Name)" -ForegroundColor Yellow
    }
}

Write-Host "  ✅ $cleared variáveis removidas da sessão atual" -ForegroundColor Green

# Limpar do registro do Windows (requer admin)
if ($isAdmin) {
    Write-Host "`n🔐 Limpando variáveis do registro do sistema..." -ForegroundColor Yellow
    
    $userCleared = 0
    $machineCleared = 0
    
    # Limpar do registro do usuário
    Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config_*" } | ForEach-Object {
        try {
            $varName = $_.Name
            [Environment]::SetEnvironmentVariable($varName, $null, "User")
            $userCleared++
        } catch {
            Write-Host "  ⚠️  Não foi possível remover do registro do usuário: $varName" -ForegroundColor Yellow
        }
    }
    
    # Limpar do registro da máquina
    Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config_*" } | ForEach-Object {
        try {
            $varName = $_.Name
            [Environment]::SetEnvironmentVariable($varName, $null, "Machine")
            $machineCleared++
        } catch {
            Write-Host "  ⚠️  Não foi possível remover do registro da máquina: $varName" -ForegroundColor Yellow
        }
    }
    
    Write-Host "  ✅ $userCleared variáveis removidas do registro do usuário" -ForegroundColor Green
    Write-Host "  ✅ $machineCleared variáveis removidas do registro da máquina" -ForegroundColor Green
} else {
    Write-Host "`n💡 Dica: Execute como Administrador para limpar permanentemente do sistema" -ForegroundColor Cyan
}

Write-Host "`n✅ Limpeza concluída!" -ForegroundColor Green
Write-Host "`n📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "   1. Feche e reabra o PowerShell" -ForegroundColor White
Write-Host "   2. Execute: cd 'C:\Users\Mateus\Desktop\Bora UI\apps\app-instrutor'" -ForegroundColor White
Write-Host "   3. Execute: .\start.ps1" -ForegroundColor White
Write-Host "`n   OU use diretamente: npx expo start --clear" -ForegroundColor White


