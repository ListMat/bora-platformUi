# 🔧 Script para Configurar Android SDK
# Este script verifica e configura as variáveis de ambiente do Android SDK

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Configuração do Android SDK" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Locais comuns do Android SDK
$possibleLocations = @(
    "$env:LOCALAPPDATA\Android\Sdk",
    "C:\Android\Sdk",
    "$env:ProgramFiles\Android\Android Studio\sdk",
    "$env:ProgramFiles(x86)\Android\Android Studio\sdk",
    "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
)

$sdkPath = $null

# Procurar SDK instalado
Write-Host "🔍 Procurando Android SDK..." -ForegroundColor Yellow
foreach ($location in $possibleLocations) {
    if (Test-Path $location) {
        $platformTools = Join-Path $location "platform-tools"
        if (Test-Path $platformTools) {
            $sdkPath = $location
            Write-Host "✅ Android SDK encontrado em: $sdkPath" -ForegroundColor Green
            break
        }
    }
}

# Se não encontrou, perguntar ao usuário
if (-not $sdkPath) {
    Write-Host ""
    Write-Host "❌ Android SDK não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Opções:" -ForegroundColor Yellow
    Write-Host "1. Instalar Android Studio (recomendado)" -ForegroundColor White
    Write-Host "   Download: https://developer.android.com/studio" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Instalar apenas Android SDK Command Line Tools" -ForegroundColor White
    Write-Host "   Download: https://developer.android.com/studio#command-tools" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Usar Expo Go (não precisa de SDK)" -ForegroundColor White
    Write-Host "   Execute: npx expo start" -ForegroundColor Gray
    Write-Host ""
    
    $userPath = Read-Host "Digite o caminho do Android SDK (ou Enter para pular)"
    if ($userPath -and (Test-Path $userPath)) {
        $sdkPath = $userPath
    } else {
        Write-Host ""
        Write-Host "⚠️  Configuração cancelada." -ForegroundColor Yellow
        Write-Host "   Consulte INSTALAR_ANDROID_SDK.md para mais informações." -ForegroundColor Gray
        exit 0
    }
}

# Configurar variáveis de ambiente (temporário - apenas esta sessão)
Write-Host ""
Write-Host "⚙️  Configurando variáveis de ambiente (sessão atual)..." -ForegroundColor Yellow
$env:ANDROID_HOME = $sdkPath
$env:ANDROID_SDK_ROOT = $sdkPath

# Adicionar ao PATH (sessão atual)
$platformTools = Join-Path $sdkPath "platform-tools"
$tools = Join-Path $sdkPath "tools"
$toolsBin = Join-Path $sdkPath "tools\bin"

$pathsToAdd = @($platformTools, $tools, $toolsBin)
foreach ($path in $pathsToAdd) {
    if (Test-Path $path) {
        if ($env:Path -notlike "*$path*") {
            $env:Path += ";$path"
            Write-Host "✅ Adicionado ao PATH: $path" -ForegroundColor Green
        }
    }
}

# Verificar adb
Write-Host ""
Write-Host "🔍 Verificando instalação..." -ForegroundColor Yellow
try {
    $adbVersion = & adb version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ ADB funcionando!" -ForegroundColor Green
        Write-Host $adbVersion
    } else {
        Write-Host "⚠️  ADB não encontrado no PATH" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  ADB não encontrado. Verifique se platform-tools está instalado." -ForegroundColor Yellow
}

# Instruções para configuração permanente
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Configuração Permanente" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "As variáveis foram configuradas apenas para esta sessão." -ForegroundColor Yellow
Write-Host "Para tornar permanente:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Pressione Win + R, digite: sysdm.cpl" -ForegroundColor White
Write-Host "2. Vá em 'Avançado' → 'Variáveis de Ambiente'" -ForegroundColor White
Write-Host "3. Adicione as variáveis:" -ForegroundColor White
Write-Host "   - ANDROID_HOME = $sdkPath" -ForegroundColor Gray
Write-Host "   - ANDROID_SDK_ROOT = $sdkPath" -ForegroundColor Gray
Write-Host "4. Edite PATH e adicione:" -ForegroundColor White
Write-Host "   - %ANDROID_HOME%\platform-tools" -ForegroundColor Gray
Write-Host "   - %ANDROID_HOME%\tools" -ForegroundColor Gray
Write-Host "   - %ANDROID_HOME%\tools\bin" -ForegroundColor Gray
Write-Host ""
Write-Host "Ou execute este comando como Administrador:" -ForegroundColor Yellow
Write-Host ""
Write-Host '[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "' + $sdkPath + '", "User")' -ForegroundColor Cyan
Write-Host '[System.Environment]::SetEnvironmentVariable("ANDROID_SDK_ROOT", "' + $sdkPath + '", "User")' -ForegroundColor Cyan
Write-Host ""

# Verificar variáveis atuais
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Variáveis Configuradas" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "ANDROID_HOME: $env:ANDROID_HOME" -ForegroundColor Green
Write-Host "ANDROID_SDK_ROOT: $env:ANDROID_SDK_ROOT" -ForegroundColor Green
Write-Host ""

Write-Host "✅ Configuração concluída!" -ForegroundColor Green
Write-Host "   Reinicie o terminal para aplicar as mudanças permanentes." -ForegroundColor Yellow
Write-Host ""

