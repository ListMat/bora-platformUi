# Script para Resolver Problemas de Watch Mode do Metro
# Resolve "Failed to start watch mode" no Windows

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Resolver Watch Mode - Metro" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Passo 1: Limpar processos Node
Write-Host "[PASSO 1] Limpando processos Node..." -ForegroundColor Yellow
$nodeProcesses = Get-Process | Where-Object { $_.ProcessName -eq "node" -and $_.Id -ne $PID } -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Write-Host "  Terminando PID: $($_.Id)" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
    Write-Host "  [OK] Processos terminados" -ForegroundColor Green
} else {
    Write-Host "  [OK] Nenhum processo Node encontrado" -ForegroundColor Green
}

Write-Host ""

# Passo 2: Limpar caches
Write-Host "[PASSO 2] Limpando caches..." -ForegroundColor Yellow
& "$PSScriptRoot\limpar-cache-expo.ps1" | Out-Null
Write-Host "  [OK] Caches limpos" -ForegroundColor Green

Write-Host ""

# Passo 3: Verificar variáveis de ambiente
Write-Host "[PASSO 3] Verificando variaveis de ambiente..." -ForegroundColor Yellow
$npmConfigVars = Get-ChildItem Env: | Where-Object { $_.Name -like 'npm_config*' }
if ($npmConfigVars) {
    Write-Host "  [AVISO] Encontradas variaveis npm_config (podem causar problemas)" -ForegroundColor Yellow
    Write-Host "  [DICA] Execute: .\limpar-npm-config.ps1" -ForegroundColor Cyan
} else {
    Write-Host "  [OK] Nenhuma variavel npm_config encontrada" -ForegroundColor Green
}

Write-Host ""

# Passo 4: Verificar limites do sistema
Write-Host "[PASSO 4] Verificando configuracoes do sistema..." -ForegroundColor Yellow

# Verificar se há muitos arquivos no projeto
$fileCount = (Get-ChildItem -Recurse -File -ErrorAction SilentlyContinue | Measure-Object).Count
Write-Host "  Arquivos no projeto: $fileCount" -ForegroundColor Gray

if ($fileCount -gt 50000) {
    Write-Host "  [AVISO] Muitos arquivos detectados (pode causar problemas no watch mode)" -ForegroundColor Yellow
    Write-Host "  [DICA] Considere adicionar mais diretorios ao .gitignore" -ForegroundColor Cyan
} else {
    Write-Host "  [OK] Numero de arquivos esta OK" -ForegroundColor Green
}

Write-Host ""

# Passo 5: Instruções finais
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Proximos Passos" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Limpe variaveis npm_config (se necessario):" -ForegroundColor Yellow
Write-Host "   .\limpar-npm-config.ps1" -ForegroundColor White
Write-Host ""
Write-Host "2. Inicie o Expo com cache limpo:" -ForegroundColor Yellow
Write-Host "   cd apps\app-aluno" -ForegroundColor White
Write-Host "   npx expo start --clear" -ForegroundColor White
Write-Host ""
Write-Host "   OU" -ForegroundColor Gray
Write-Host ""
Write-Host "   cd apps\app-instrutor" -ForegroundColor White
Write-Host "   npx expo start --clear --port 8082" -ForegroundColor White
Write-Host ""
Write-Host "3. Se o problema persistir:" -ForegroundColor Yellow
Write-Host "   - Reinicie o computador (resolve problemas de locks de arquivos)" -ForegroundColor White
Write-Host "   - Verifique se ha antivirus bloqueando o acesso aos arquivos" -ForegroundColor White
Write-Host "   - Tente executar o PowerShell como Administrador" -ForegroundColor White
Write-Host ""
