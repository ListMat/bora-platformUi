# Script para configurar variáveis de ambiente do pnpm na sessão atual

Write-Host "Configurando variáveis de ambiente do pnpm..." -ForegroundColor Yellow

# Configurar PNPM_HOME
$env:PNPM_HOME = "C:\Users\Mateus\AppData\Local\pnpm"

# Adicionar ao PATH da sessão atual
if ($env:Path -notlike "*$env:PNPM_HOME*") {
    $env:Path = "$env:PNPM_HOME;$env:Path"
    Write-Host "✅ PNPM_HOME adicionado ao PATH da sessão atual" -ForegroundColor Green
} else {
    Write-Host "✅ PNPM_HOME já está no PATH" -ForegroundColor Green
}

# Verificar se pnpm está funcionando
Write-Host ""
Write-Host "Verificando instalação do pnpm..." -ForegroundColor Yellow
$pnpmVersion = pnpm --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ pnpm está funcionando! Versão: $pnpmVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao verificar pnpm" -ForegroundColor Red
    Write-Host "Solução: Feche este terminal e abra um novo para aplicar as mudanças do PATH" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   IMPORTANTE" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "As mudanças no PATH só serão permanentes após:" -ForegroundColor Yellow
Write-Host "1. Fechar este terminal" -ForegroundColor White
Write-Host "2. Abrir um NOVO terminal PowerShell" -ForegroundColor White
Write-Host "3. O pnpm funcionará automaticamente" -ForegroundColor White
Write-Host ""
Write-Host "Ou use este script antes de cada comando pnpm" -ForegroundColor Yellow
Write-Host ""

