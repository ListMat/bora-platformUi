# Script para instalar dependências pulando scripts problemáticos
# Use este script se o husky estiver causando problemas

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Instalando Dependências" -ForegroundColor Cyan
Write-Host "  (Pulando scripts do husky)" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navegar para o diretório do projeto
$projectPath = "C:\Users\Mateus\Desktop\Bora UI"
Set-Location $projectPath

Write-Host "📦 Instalando dependências com --ignore-scripts..." -ForegroundColor Green
Write-Host ""

# Instalar dependências pulando scripts
pnpm install --ignore-scripts

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  NOTA: O husky não foi instalado devido ao erro nas variáveis." -ForegroundColor Yellow
    Write-Host "   Após reiniciar o computador, execute:" -ForegroundColor Yellow
    Write-Host "   npx husky install" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Solução: Reinicie o computador e tente novamente" -ForegroundColor Yellow
    Write-Host ""
}

