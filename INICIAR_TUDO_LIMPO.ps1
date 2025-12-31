# Script para iniciar TODOS os serviços em um ambiente limpo

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BORA - Inicializacao Completa"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Limpar variáveis npm_config
Write-Host "1. Limpando variaveis npm_config..." -ForegroundColor Yellow
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config*" } | ForEach-Object { 
    Remove-Item "Env:\$($_.Name)" -Force -ErrorAction SilentlyContinue
}
Write-Host "   OK - Variaveis limpas!" -ForegroundColor Green
Write-Host ""

# Gerar Prisma Client
Write-Host "2. Gerando Prisma Client..." -ForegroundColor Yellow
Set-Location "packages\db"
npx --yes prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK - Prisma Client gerado!" -ForegroundColor Green
} else {
    Write-Host "   ERRO - Falha ao gerar Prisma Client" -ForegroundColor Red
}
Set-Location "..\..\"
Write-Host ""

# Instruções para iniciar os 3 serviços
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Proximo Passo: Iniciar Servicos"
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Abra 3 NOVOS terminais PowerShell e execute:" -ForegroundColor Yellow
Write-Host ""

Write-Host "Terminal 1 - Web Admin:" -ForegroundColor Cyan
Write-Host '  cd "C:\Users\Mateus\Desktop\Bora UI\apps\web-admin"' -ForegroundColor White
Write-Host "  npx next dev -p 3000" -ForegroundColor White
Write-Host ""

Write-Host "Terminal 2 - App Aluno:" -ForegroundColor Cyan
Write-Host '  cd "C:\Users\Mateus\Desktop\Bora UI\apps\app-aluno"' -ForegroundColor White
Write-Host "  npx expo start --clear" -ForegroundColor White
Write-Host ""

Write-Host "Terminal 3 - App Instrutor:" -ForegroundColor Cyan
Write-Host '  cd "C:\Users\Mateus\Desktop\Bora UI\apps\app-instrutor"' -ForegroundColor White
Write-Host "  npx expo start --clear" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "   URLs dos Servicos"
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Admin Panel:  http://localhost:3000" -ForegroundColor White
Write-Host "  App Aluno:    Porta 8081 (QR Code)" -ForegroundColor White
Write-Host "  App Instrutor: Porta 8082 (QR Code)" -ForegroundColor White
Write-Host ""

Write-Host "IMPORTANTE: Configure o .env antes de testar!" -ForegroundColor Yellow
Write-Host "Veja: CONFIGURAR_ENV.md" -ForegroundColor Yellow
Write-Host ""

