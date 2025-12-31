# Script para instalar Husky limpando variáveis problemáticas
# Use este script APÓS reiniciar o computador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Instalando Husky" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navegar para o diretório do projeto
$projectPath = "C:\Users\Mateus\Desktop\Bora UI"
Set-Location $projectPath

# Tentar limpar variáveis npm_config problemáticas
Write-Host "🧹 Limpando variáveis problemáticas..." -ForegroundColor Yellow
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config*" } | ForEach-Object {
    Remove-Item "Env:\$($_.Name)" -Force -ErrorAction SilentlyContinue
}

Write-Host "📦 Instalando Husky..." -ForegroundColor Green
Write-Host ""

# Tentar instalar usando npx diretamente (pula o pnpm)
try {
    $env:npm_config_ignore_workspace_root_check = $null
    npx husky install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Husky instalado com sucesso!" -ForegroundColor Green
        Write-Host ""
    } else {
        throw "Erro ao instalar"
    }
} catch {
    Write-Host ""
    Write-Host "❌ Erro ao instalar Husky" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 SOLUÇÃO: Reinicie o computador e execute novamente" -ForegroundColor Yellow
    Write-Host "   Ou execute manualmente após reiniciar:" -ForegroundColor Yellow
    Write-Host "   npx husky install" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

