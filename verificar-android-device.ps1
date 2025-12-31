# Script para Verificar Dispositivos Android Conectados

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Verificar Dispositivos Android" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se adb está no PATH
Write-Host "[1/3] Verificando se ADB esta instalado..." -ForegroundColor Yellow

try {
    $adbVersion = adb version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] ADB encontrado!" -ForegroundColor Green
        Write-Host "  Versao: $($adbVersion[0])" -ForegroundColor Gray
    } else {
        Write-Host "  [ERRO] ADB nao encontrado no PATH" -ForegroundColor Red
        Write-Host ""
        Write-Host "  [SOLUCAO] Configure o Android SDK:" -ForegroundColor Yellow
        Write-Host "    1. Execute: .\configurar-android-sdk.ps1" -ForegroundColor White
        Write-Host "    2. Ou adicione manualmente ao PATH:" -ForegroundColor White
        Write-Host "       C:\Users\$env:USERNAME\AppData\Local\Android\Sdk\platform-tools" -ForegroundColor Gray
        Write-Host ""
        exit 1
    }
} catch {
    Write-Host "  [ERRO] ADB nao encontrado" -ForegroundColor Red
    Write-Host "  [SOLUCAO] Instale o Android SDK e configure o PATH" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host ""

# Verificar dispositivos conectados
Write-Host "[2/3] Verificando dispositivos conectados..." -ForegroundColor Yellow

try {
    $devices = adb devices 2>&1
    $deviceList = $devices | Where-Object { $_ -match "device$" -or $_ -match "unauthorized" }
    
    if ($deviceList.Count -eq 0) {
        Write-Host "  [AVISO] Nenhum dispositivo encontrado" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  [OPCOES]:" -ForegroundColor Cyan
        Write-Host "    1. Conecte um dispositivo Android via USB" -ForegroundColor White
        Write-Host "    2. Inicie um emulador Android" -ForegroundColor White
        Write-Host "    3. Use Expo Go (nao requer dispositivo)" -ForegroundColor White
        Write-Host ""
        Write-Host "  [DICA] Para usar Expo Go:" -ForegroundColor Yellow
        Write-Host "    cd apps\app-aluno" -ForegroundColor Gray
        Write-Host "    npx expo start" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host "  [OK] Dispositivos encontrados:" -ForegroundColor Green
        Write-Host ""
        
        foreach ($device in $deviceList) {
            if ($device -match "unauthorized") {
                $deviceId = ($device -split "\s+")[0]
                Write-Host "    $deviceId - [NAO AUTORIZADO]" -ForegroundColor Red
                Write-Host "      [SOLUCAO] Aceite a permissao no dispositivo Android" -ForegroundColor Yellow
            } elseif ($device -match "device$") {
                $deviceId = ($device -split "\s+")[0]
                $deviceType = if ($deviceId -match "emulator") { "Emulador" } else { "Dispositivo Fisico" }
                Write-Host "    $deviceId - [$deviceType]" -ForegroundColor Green
                
                # Obter informações do dispositivo
                try {
                    $androidVersion = adb -s $deviceId shell getprop ro.build.version.release 2>&1
                    $deviceModel = adb -s $deviceId shell getprop ro.product.model 2>&1
                    Write-Host "      Modelo: $deviceModel" -ForegroundColor Gray
                    Write-Host "      Android: $androidVersion" -ForegroundColor Gray
                } catch {
                    # Ignorar erros ao obter informações
                }
            }
        }
        Write-Host ""
    }
} catch {
    Write-Host "  [ERRO] Nao foi possivel verificar dispositivos" -ForegroundColor Red
    Write-Host "  Erro: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

Write-Host ""

# Verificar se pode rodar o app
Write-Host "[3/3] Status:" -ForegroundColor Yellow

$hasDevice = $false
try {
    $devices = adb devices 2>&1
    $deviceList = $devices | Where-Object { $_ -match "device$" }
    if ($deviceList.Count -gt 0) {
        $hasDevice = $true
    }
} catch {
    # Ignorar
}

if ($hasDevice) {
    Write-Host "  [OK] Pronto para rodar o app!" -ForegroundColor Green
    Write-Host ""
    Write-Host "  [PROXIMO PASSO]:" -ForegroundColor Cyan
    Write-Host "    cd apps\app-aluno" -ForegroundColor White
    Write-Host "    npx expo run:android" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "  [AVISO] Nenhum dispositivo disponivel" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  [OPCOES]:" -ForegroundColor Cyan
    Write-Host "    1. Conecte um dispositivo e habilite USB debugging" -ForegroundColor White
    Write-Host "    2. Inicie um emulador Android" -ForegroundColor White
    Write-Host "    3. Use Expo Go: npx expo start" -ForegroundColor White
    Write-Host ""
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

