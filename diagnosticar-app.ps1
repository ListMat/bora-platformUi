# Script de Diagnostico Completo do App

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Diagnostico do App" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar Metro
Write-Host "[1/5] Verificando Metro Bundler..." -ForegroundColor Yellow
$metroPorts = @(8081, 8082, 8083)
$foundPort = $null
foreach ($port in $metroPorts) {
    $check = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($check) {
        $foundPort = $port
        break
    }
}
if ($foundPort) {
    Write-Host "  [OK] Metro esta rodando na porta $foundPort" -ForegroundColor Green
} else {
    Write-Host "  [ERRO] Metro nao esta rodando!" -ForegroundColor Red
    Write-Host "  [SOLUCAO] Execute: cd apps\app-aluno; npx expo start --clear" -ForegroundColor Yellow
}

Write-Host ""

# 2. Verificar API Backend
Write-Host "[2/5] Verificando API Backend..." -ForegroundColor Yellow
try {
    $apiResponse = Invoke-WebRequest -Uri "http://localhost:3000" -Method Get -TimeoutSec 2 -ErrorAction Stop
    Write-Host "  [OK] API esta rodando na porta 3000" -ForegroundColor Green
} catch {
    Write-Host "  [AVISO] API nao esta rodando na porta 3000" -ForegroundColor Yellow
    Write-Host "  [SOLUCAO] Execute: cd apps\web-admin; npx next dev -p 3000" -ForegroundColor Yellow
    Write-Host "  [NOTA] O app pode funcionar sem a API, mas algumas funcionalidades nao estarao disponiveis" -ForegroundColor Gray
}

Write-Host ""

# 3. Verificar Dispositivo/Emulador
Write-Host "[3/5] Verificando dispositivos Android..." -ForegroundColor Yellow
try {
    $adbCheck = adb devices 2>&1
    if ($LASTEXITCODE -eq 0) {
        $devices = $adbCheck | Where-Object { $_ -match "device$" }
        if ($devices.Count -gt 0) {
            Write-Host "  [OK] Dispositivo/Emulador conectado" -ForegroundColor Green
        } else {
            Write-Host "  [AVISO] Nenhum dispositivo conectado" -ForegroundColor Yellow
            Write-Host "  [OPCOES]:" -ForegroundColor Cyan
            Write-Host "    1. Use Expo Go no celular (mais simples)" -ForegroundColor White
            Write-Host "    2. Conecte um dispositivo Android via USB" -ForegroundColor White
            Write-Host "    3. Inicie um emulador Android" -ForegroundColor White
        }
    } else {
        Write-Host "  [AVISO] ADB nao encontrado (nao e necessario para Expo Go)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  [AVISO] ADB nao configurado (nao e necessario para Expo Go)" -ForegroundColor Yellow
}

Write-Host ""

# 4. Verificar Arquivo .env
Write-Host "[4/5] Verificando configuracao..." -ForegroundColor Yellow
$envFile = "apps\app-aluno\.env"
if (Test-Path $envFile) {
    Write-Host "  [OK] Arquivo .env encontrado" -ForegroundColor Green
} else {
    $rootEnv = ".env"
    if (Test-Path $rootEnv) {
        Write-Host "  [OK] Arquivo .env na raiz encontrado" -ForegroundColor Green
    } else {
        Write-Host "  [AVISO] Arquivo .env nao encontrado" -ForegroundColor Yellow
        Write-Host "  [NOTA] Algumas funcionalidades podem nao funcionar sem o .env" -ForegroundColor Gray
    }
}

Write-Host ""

# 5. Verificar Conexao do App
Write-Host "[5/5] Verificando se o app esta conectado ao Metro..." -ForegroundColor Yellow
try {
    # Tentar portas comuns do Metro
    $metroPorts = @(8083, 8082, 8081)
    $metroInfo = $null
    foreach ($port in $metroPorts) {
        try {
            $metroInfo = Invoke-RestMethod -Uri "http://127.0.0.1:$port/json/list" -Method Get -ErrorAction Stop
            break
        } catch {
            continue
        }
    }
    
    if ($metroInfo) {
        if ($metroInfo -and $metroInfo.Count -gt 0) {
            Write-Host "  [OK] App conectado ao Metro!" -ForegroundColor Green
            foreach ($app in $metroInfo) {
                Write-Host "    - $($app.title)" -ForegroundColor Gray
            }
        } else {
            Write-Host "  [AVISO] Metro esta rodando mas nenhum app esta conectado" -ForegroundColor Yellow
            Write-Host "  [SOLUCAO]:" -ForegroundColor Cyan
            Write-Host "    1. Abra o Expo Go no celular" -ForegroundColor White
            Write-Host "    2. Escaneie o QR code que aparece no terminal do Metro" -ForegroundColor White
            Write-Host "    3. Ou pressione 'a' no terminal do Metro para abrir no Android" -ForegroundColor White
        }
    } else {
        Write-Host "  [AVISO] Nao foi possivel verificar conexao (Metro pode estar iniciando)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  [AVISO] Nao foi possivel verificar conexao (Metro pode estar iniciando)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Resumo e Proximos Passos" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Para rodar o app:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Certifique-se de que o Metro esta rodando:" -ForegroundColor Cyan
Write-Host "   cd apps\app-aluno" -ForegroundColor White
Write-Host "   npx expo start --clear" -ForegroundColor White
Write-Host ""
Write-Host "2. Conecte o app:" -ForegroundColor Cyan
Write-Host "   - Use Expo Go: Escaneie o QR code" -ForegroundColor White
Write-Host "   - Ou pressione 'a' no terminal do Metro" -ForegroundColor White
Write-Host ""
Write-Host "3. (Opcional) Inicie a API:" -ForegroundColor Cyan
Write-Host "   cd apps\web-admin" -ForegroundColor White
Write-Host "   npx next dev -p 3000" -ForegroundColor White
Write-Host ""

