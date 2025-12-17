# Script para instalar dependências do Bottom Sheet
# Limpa variáveis de ambiente corrompidas antes de instalar

Write-Host "🧹 Limpando variáveis de ambiente npm_config..." -ForegroundColor Yellow

# Remover todas as variáveis npm_config
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config_*" } | ForEach-Object {
    Remove-Item "Env:$($_.Name)"
    Write-Host "  Removido: $($_.Name)" -ForegroundColor Gray
}

Write-Host "✅ Variáveis limpas!" -ForegroundColor Green
Write-Host ""
Write-Host "🧹 Limpando cache do pnpm..." -ForegroundColor Yellow
try {
    pnpm store prune 2>&1 | Out-Null
    Write-Host "✅ Cache limpo!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Não foi possível limpar o cache (pode ser ignorado)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow

# Navegar para o diretório do app
Set-Location $PSScriptRoot

# Instalar dependências
try {
    # Tentar com pnpm primeiro
    $env:PNPM_IGNORE_SCRIPTS = "true"
    pnpm install --ignore-scripts 2>&1 | Out-String | Write-Host
    
    Write-Host ""
    Write-Host "✅ Dependências instaladas com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔄 Próximo passo: Limpar cache do Metro e reiniciar:" -ForegroundColor Cyan
    Write-Host "   npx expo start --clear" -ForegroundColor White
} catch {
    Write-Host ""
    Write-Host "❌ Erro ao instalar com pnpm. Tentando com npm..." -ForegroundColor Yellow
    
    try {
        # Fallback para npm
        npm install 2>&1 | Out-String | Write-Host
        Write-Host ""
        Write-Host "✅ Dependências instaladas com npm!" -ForegroundColor Green
        Write-Host "⚠️  Nota: Você pode voltar a usar pnpm depois" -ForegroundColor Yellow
    } catch {
        Write-Host ""
        Write-Host "❌ Erro ao instalar dependências:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Soluções alternativas:" -ForegroundColor Yellow
        Write-Host "   1. Reinicie o terminal e tente novamente" -ForegroundColor White
        Write-Host "   2. Execute como Administrador" -ForegroundColor White
        Write-Host "   3. Veja FIX_INSTALL_ERROR.md para mais opções" -ForegroundColor White
    }
}
