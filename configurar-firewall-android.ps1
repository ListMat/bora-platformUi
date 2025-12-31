# Script para configurar Firewall do Windows para Android Emulator
# Execute como Administrador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Configurando Firewall para Android" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está rodando como administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ ERRO: Este script precisa ser executado como Administrador!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Como executar como Administrador:" -ForegroundColor Yellow
    Write-Host "1. Clique com botão direito no PowerShell" -ForegroundColor White
    Write-Host "2. Selecione 'Executar como Administrador'" -ForegroundColor White
    Write-Host "3. Execute novamente: .\configurar-firewall-android.ps1" -ForegroundColor White
    Write-Host ""
    pause
    exit 1
}

Write-Host "✅ Executando como Administrador" -ForegroundColor Green
Write-Host ""

# Caminho do Android SDK
$androidSdk = "$env:LOCALAPPDATA\Android\Sdk"
$emulatorPath = "$androidSdk\emulator\qemu-system-x86_64.exe"
$adbPath = "$androidSdk\platform-tools\adb.exe"

# Verificar se os arquivos existem
if (-not (Test-Path $emulatorPath)) {
    Write-Host "⚠️  Emulador não encontrado em: $emulatorPath" -ForegroundColor Yellow
    Write-Host "   Continuando mesmo assim..." -ForegroundColor Yellow
}

if (-not (Test-Path $adbPath)) {
    Write-Host "⚠️  ADB não encontrado em: $adbPath" -ForegroundColor Yellow
    Write-Host "   Continuando mesmo assim..." -ForegroundColor Yellow
}

Write-Host "Criando regras de firewall..." -ForegroundColor Yellow
Write-Host ""

# Remover regras antigas se existirem
Write-Host "1. Removendo regras antigas (se existirem)..." -ForegroundColor Cyan
Remove-NetFirewallRule -DisplayName "Android Emulator - Outbound" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "Android Emulator - Inbound" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "Android ADB - Outbound" -ErrorAction SilentlyContinue
Remove-NetFirewallRule -DisplayName "Android ADB - Inbound" -ErrorAction SilentlyContinue

# Criar regras para o emulador
Write-Host "2. Criando regra de saída para o Emulador..." -ForegroundColor Cyan
New-NetFirewallRule -DisplayName "Android Emulator - Outbound" `
    -Direction Outbound `
    -Program $emulatorPath `
    -Action Allow `
    -Profile Any `
    -Enabled True `
    -Description "Permite que o Android Emulator acesse a internet"

Write-Host "3. Criando regra de entrada para o Emulador..." -ForegroundColor Cyan
New-NetFirewallRule -DisplayName "Android Emulator - Inbound" `
    -Direction Inbound `
    -Program $emulatorPath `
    -Action Allow `
    -Profile Any `
    -Enabled True `
    -Description "Permite conexões de entrada para o Android Emulator"

# Criar regras para o ADB
Write-Host "4. Criando regra de saída para o ADB..." -ForegroundColor Cyan
New-NetFirewallRule -DisplayName "Android ADB - Outbound" `
    -Direction Outbound `
    -Program $adbPath `
    -Action Allow `
    -Profile Any `
    -Enabled True `
    -Description "Permite que o ADB acesse a internet"

Write-Host "5. Criando regra de entrada para o ADB..." -ForegroundColor Cyan
New-NetFirewallRule -DisplayName "Android ADB - Inbound" `
    -Direction Inbound `
    -Program $adbPath `
    -Action Allow `
    -Profile Any `
    -Enabled True `
    -Description "Permite conexões de entrada para o ADB"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ Firewall Configurado com Sucesso!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Regras criadas:" -ForegroundColor Cyan
Write-Host "  ✅ Android Emulator - Outbound" -ForegroundColor Green
Write-Host "  ✅ Android Emulator - Inbound" -ForegroundColor Green
Write-Host "  ✅ Android ADB - Outbound" -ForegroundColor Green
Write-Host "  ✅ Android ADB - Inbound" -ForegroundColor Green
Write-Host ""

Write-Host "Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Feche o emulador Android se estiver aberto" -ForegroundColor White
Write-Host "2. Reinicie o emulador" -ForegroundColor White
Write-Host "3. Teste a conexão: adb shell ping -c 3 google.com" -ForegroundColor White
Write-Host ""

pause
