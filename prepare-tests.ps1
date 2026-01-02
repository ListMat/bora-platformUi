# Script de Preparação para Testes - App Bora
# Execute este script antes de iniciar os testes

Write-Host "🧪 Preparando ambiente para testes..." -ForegroundColor Cyan
Write-Host ""

# 1. Verificar se está na raiz do projeto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script na raiz do projeto!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Diretório correto" -ForegroundColor Green

# 2. Aplicar migrations
Write-Host ""
Write-Host "📦 Aplicando migrations do Prisma..." -ForegroundColor Yellow
Set-Location packages/db
npx prisma migrate dev --name test_preparation
npx prisma generate
Set-Location ../..

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migrations aplicadas com sucesso" -ForegroundColor Green
} else {
    Write-Host "❌ Erro ao aplicar migrations" -ForegroundColor Red
    exit 1
}

# 3. Instalar dependências faltantes
Write-Host ""
Write-Host "📦 Verificando dependências..." -ForegroundColor Yellow

# QR Code
Set-Location packages/api
Write-Host "  - Instalando qrcode..." -ForegroundColor Gray
npm install qrcode @types/qrcode --silent
Set-Location ../..

# Clipboard e Notifications (App Aluno)
Set-Location apps/app-aluno
Write-Host "  - Instalando expo-clipboard..." -ForegroundColor Gray
npx expo install expo-clipboard --silent
Write-Host "  - Instalando expo-notifications..." -ForegroundColor Gray
npx expo install expo-notifications --silent
Set-Location ../..

Write-Host "✅ Dependências instaladas" -ForegroundColor Green

# 4. Verificar estrutura de arquivos
Write-Host ""
Write-Host "📁 Verificando arquivos criados..." -ForegroundColor Yellow

$files = @(
    "apps/app-aluno/app/screens/InstructorDetailsModal.tsx",
    "apps/app-aluno/src/components/QuickReplyButtons.tsx",
    "apps/app-aluno/src/components/ChatTimer.tsx",
    "apps/app-aluno/src/components/PixPayment.tsx",
    "apps/app-aluno/src/hooks/usePushNotifications.ts",
    "apps/app-instrutor/src/components/OnlineToggle.tsx",
    "apps/app-instrutor/app/screens/AcceptLessonsModal.tsx",
    "packages/api/src/modules/systemMessages.ts",
    "packages/api/src/modules/pix.ts"
)

$missing = @()
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file (FALTANDO)" -ForegroundColor Red
        $missing += $file
    }
}

if ($missing.Count -gt 0) {
    Write-Host ""
    Write-Host "⚠️  Arquivos faltando: $($missing.Count)" -ForegroundColor Yellow
    Write-Host "Verifique a implementação!" -ForegroundColor Yellow
} else {
    Write-Host "✅ Todos os arquivos criados" -ForegroundColor Green
}

# 5. Abrir Prisma Studio
Write-Host ""
Write-Host "🗄️  Abrindo Prisma Studio..." -ForegroundColor Yellow
Write-Host "  Verifique se os novos campos existem:" -ForegroundColor Gray
Write-Host "    - User: pushToken" -ForegroundColor Gray
Write-Host "    - Instructor: isOnline, acceptsOwnVehicle, bio" -ForegroundColor Gray
Write-Host "    - Lesson: pixCode, pixQrCode, pixGeneratedAt, etc." -ForegroundColor Gray
Write-Host ""

Start-Process -FilePath "npx" -ArgumentList "prisma studio" -WorkingDirectory "packages/db" -NoNewWindow

# 6. Instruções finais
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🎉 Ambiente preparado com sucesso!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 PRÓXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Iniciar servidor backend:" -ForegroundColor White
Write-Host "    npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  Iniciar app do aluno (novo terminal):" -ForegroundColor White
Write-Host "    cd apps/app-aluno" -ForegroundColor Gray
Write-Host "    npx expo start" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  Iniciar app do instrutor (novo terminal):" -ForegroundColor White
Write-Host "    cd apps/app-instrutor" -ForegroundColor Gray
Write-Host "    npx expo start" -ForegroundColor Gray
Write-Host ""
Write-Host "4️⃣  Seguir guia de testes:" -ForegroundColor White
Write-Host "    GUIA_TESTES_COMPLETO.md" -ForegroundColor Gray
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ Boa sorte com os testes! ✨" -ForegroundColor Green
Write-Host ""
