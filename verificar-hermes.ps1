# Script para Verificar se Hermes está Funcionando
# Verifica a conexão do Metro e se o Hermes está ativo

param(
    [int]$Port = 8083
)

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Verificar Status do Hermes" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se o Metro está rodando
Write-Host "[1/3] Verificando se o Metro esta rodando na porta $Port..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/json/list" -Method Get -ErrorAction Stop
    
    if ($response -and $response.Count -gt 0) {
        Write-Host "  [OK] Metro esta rodando e ha apps conectados!" -ForegroundColor Green
        Write-Host ""
        
        # Verificar se Hermes está ativo
        Write-Host "[2/3] Verificando se Hermes esta ativo..." -ForegroundColor Yellow
        
        $hermesFound = $false
        foreach ($app in $response) {
            if ($app.vm -eq "Hermes") {
                $hermesFound = $true
                Write-Host "  [OK] Hermes detectado!" -ForegroundColor Green
                Write-Host "  Titulo: $($app.title)" -ForegroundColor Gray
                Write-Host "  VM: $($app.vm)" -ForegroundColor Gray
                Write-Host "  ID: $($app.id)" -ForegroundColor Gray
                Write-Host ""
                
                # Mostrar URL do debugger
                if ($app.webSocketDebuggerUrl) {
                    Write-Host "[3/3] Informacoes do Debugger:" -ForegroundColor Yellow
                    Write-Host "  WebSocket URL: $($app.webSocketDebuggerUrl)" -ForegroundColor Gray
                    if ($app.devtoolsFrontendUrl) {
                        Write-Host "  DevTools URL: $($app.devtoolsFrontendUrl)" -ForegroundColor Gray
                    }
                    Write-Host ""
                    Write-Host "  [DICA] Pressione 'j' no terminal do Metro para abrir o debugger" -ForegroundColor Cyan
                    Write-Host "  [DICA] Ou use o menu do Expo Go: Shake > Open JS Debugger" -ForegroundColor Cyan
                }
            }
        }
        
        if (-not $hermesFound) {
            Write-Host "  [AVISO] Hermes nao foi detectado nos apps conectados" -ForegroundColor Yellow
            Write-Host "  [DICA] Certifique-se de que 'jsEngine: hermes' esta no app.json" -ForegroundColor Cyan
            Write-Host "  [DICA] Recarregue o app no Expo Go completamente" -ForegroundColor Cyan
        }
        
    } else {
        Write-Host "  [AVISO] Metro esta rodando mas nenhum app esta conectado" -ForegroundColor Yellow
        Write-Host "  [DICA] Abra o Expo Go e escaneie o QR code" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host "  [ERRO] Nao foi possivel conectar ao Metro na porta $Port" -ForegroundColor Red
    Write-Host "  Erro: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "[DICA] Certifique-se de que o Metro esta rodando:" -ForegroundColor Yellow
    Write-Host "  cd apps\app-aluno" -ForegroundColor White
    Write-Host "  npx expo start --clear --localhost" -ForegroundColor White
    Write-Host ""
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

