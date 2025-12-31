# Script PowerShell para copiar Prisma Client para a versao 7.2.0
# Resolve o erro: Module not found: Can't resolve '.prisma/client/default'

Write-Host "Corrigindo Prisma Client para versao 7.2.0..." -ForegroundColor Cyan
Write-Host ""

$rootDir = "C:\Users\Mateus\Desktop\Bora UI"
$sourcePath = "$rootDir\node_modules\.pnpm\@prisma+client@5.22.0_prisma@5.22.0\node_modules\.prisma"
$targetPath = "$rootDir\node_modules\.pnpm\@prisma+client@7.2.0_prisma@5.22.0_typescript@5.9.3\node_modules\.prisma"

# Verificar se a fonte existe
if (-not (Test-Path $sourcePath)) {
    Write-Host "Prisma Client nao encontrado em: $sourcePath" -ForegroundColor Red
    Write-Host "Execute primeiro: cd packages/db && npx prisma generate" -ForegroundColor Yellow
    exit 1
}

# Criar diretorio de destino se nao existir
$targetParent = Split-Path $targetPath -Parent
if (-not (Test-Path $targetParent)) {
    Write-Host "Criando diretorio: $targetParent" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $targetParent -Force | Out-Null
}

# Remover destino antigo se existir
if (Test-Path $targetPath) {
    Write-Host "Removendo Prisma Client antigo..." -ForegroundColor Yellow
    Remove-Item -Path $targetPath -Recurse -Force -ErrorAction SilentlyContinue
}

# Copiar Prisma Client
Write-Host "Copiando Prisma Client..." -ForegroundColor Yellow
Copy-Item -Path $sourcePath -Destination $targetPath -Recurse -Force

if (Test-Path "$targetPath\client") {
    Write-Host "Prisma Client copiado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Localizacao: $targetPath\client" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Agora voce pode iniciar o web-admin:" -ForegroundColor Green
    Write-Host "   cd apps/web-admin" -ForegroundColor White
    Write-Host "   npx next dev -p 3000" -ForegroundColor White
} else {
    Write-Host "Erro ao copiar Prisma Client" -ForegroundColor Red
    exit 1
}
