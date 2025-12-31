# Script para liberar portas em uso
# Uso: .\liberar-porta.ps1 -Porta 8081

param(
    [Parameter(Mandatory=$true)]
    [int]$Porta
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Liberando Porta $Porta" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se a porta está em uso
$connection = Get-NetTCPConnection -LocalPort $Porta -ErrorAction SilentlyContinue

if (-not $connection) {
    Write-Host "✅ Porta $Porta já está livre!" -ForegroundColor Green
    Write-Host ""
    exit 0
}

$processId = $connection.OwningProcess
$process = Get-Process -Id $processId -ErrorAction SilentlyContinue

if ($process) {
    Write-Host "🔍 Processo encontrado:" -ForegroundColor Yellow
    Write-Host "   ID: $($process.Id)" -ForegroundColor White
    Write-Host "   Nome: $($process.ProcessName)" -ForegroundColor White
    if ($process.Path) {
        Write-Host "   Caminho: $($process.Path)" -ForegroundColor White
    }
    Write-Host ""
    
    Write-Host "🛑 Encerrando processo..." -ForegroundColor Yellow
    try {
        Stop-Process -Id $processId -Force
        Start-Sleep -Seconds 2
        
        # Verificar se foi encerrado
        $check = Get-NetTCPConnection -LocalPort $Porta -ErrorAction SilentlyContinue
        if (-not $check) {
            Write-Host "✅ Processo encerrado! Porta $Porta está livre agora." -ForegroundColor Green
            Write-Host ""
        } else {
            Write-Host "⚠️  Processo ainda está usando a porta. Tente novamente ou reinicie o computador." -ForegroundColor Yellow
            Write-Host ""
        }
    } catch {
        Write-Host "❌ Erro ao encerrar processo: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Tente executar como Administrador ou reinicie o computador." -ForegroundColor Yellow
        Write-Host ""
    }
} else {
    Write-Host "⚠️  Processo $processId não encontrado, mas a porta ainda está em uso." -ForegroundColor Yellow
    Write-Host "💡 Tente reiniciar o computador." -ForegroundColor Yellow
    Write-Host ""
}

