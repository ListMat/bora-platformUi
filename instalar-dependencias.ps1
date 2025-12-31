# ============================================================================
# Script de Instalacao com Tratamento de Erros
# ============================================================================
# Descricao: Instala dependencias com tratamento de erros de permissao
# Uso: .\instalar-dependencias.ps1
# ============================================================================

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "           INSTALACAO DE DEPENDENCIAS COM PNPM                  " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Parar processos que podem estar bloqueando arquivos
Write-Host "[*] Parando processos que podem bloquear arquivos..." -ForegroundColor Yellow
$processesToKill = @("node", "expo", "metro", "watchman", "code")

foreach ($processName in $processesToKill) {
    $processes = Get-Process -Name $processName -ErrorAction SilentlyContinue
    if ($processes) {
        Write-Host "   [*] Parando: $processName" -ForegroundColor Gray
        $processes | Stop-Process -Force -ErrorAction SilentlyContinue
        Start-Sleep -Milliseconds 500
    }
}

Write-Host "   [OK] Processos parados" -ForegroundColor Green
Write-Host ""

# Aguardar um pouco para garantir que arquivos foram liberados
Write-Host "[*] Aguardando liberacao de arquivos..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Write-Host "   [OK] Pronto" -ForegroundColor Green
Write-Host ""

# Tentar instalar
Write-Host "[*] Instalando dependencias..." -ForegroundColor Yellow
Write-Host ""

try {
    # Primeira tentativa: instalacao normal
    pnpm install --no-frozen-lockfile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "================================================================" -ForegroundColor Green
        Write-Host "           DEPENDENCIAS INSTALADAS COM SUCESSO!                 " -ForegroundColor Green
        Write-Host "================================================================" -ForegroundColor Green
    }
    else {
        throw "Erro na instalacao"
    }
}
catch {
    Write-Host ""
    Write-Host "[!] Primeira tentativa falhou. Tentando metodo alternativo..." -ForegroundColor Yellow
    Write-Host ""
    
    # Segunda tentativa: com force
    Start-Sleep -Seconds 2
    pnpm install --force --no-frozen-lockfile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "================================================================" -ForegroundColor Green
        Write-Host "      DEPENDENCIAS INSTALADAS (metodo alternativo)              " -ForegroundColor Green
        Write-Host "================================================================" -ForegroundColor Green
    }
    else {
        Write-Host ""
        Write-Host "================================================================" -ForegroundColor Red
        Write-Host "                  ERRO NA INSTALACAO                            " -ForegroundColor Red
        Write-Host "================================================================" -ForegroundColor Red
        Write-Host ""
        Write-Host "Tente as seguintes solucoes:" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "1. Feche TODOS os programas (VS Code, navegadores, etc)" -ForegroundColor White
        Write-Host "2. Execute: Get-Process node | Stop-Process -Force" -ForegroundColor White
        Write-Host "3. Aguarde 10 segundos" -ForegroundColor White
        Write-Host "4. Execute novamente: pnpm install" -ForegroundColor White
        Write-Host ""
        exit 1
    }
}

Write-Host ""
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Iniciar o app:" -ForegroundColor White
Write-Host "   cd apps\app-aluno" -ForegroundColor Gray
Write-Host "   npx expo start --port 8083" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Ou usar pnpm:" -ForegroundColor White
Write-Host "   cd apps\app-aluno" -ForegroundColor Gray
Write-Host "   pnpm start" -ForegroundColor Gray
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
