# ============================================================================
# Script de Limpeza Completa de Cache - Expo + Metro + pnpm
# ============================================================================
# Descricao: Limpa TODOS os caches do projeto para garantir ambiente limpo
# Uso: .\limpar-cache-completo.ps1
# ============================================================================

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "     LIMPEZA COMPLETA DE CACHE - EXPO + METRO + PNPM           " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Continue"
$startTime = Get-Date

# ============================================================================
# FUNCAO: Remover diretorio com tratamento de erro
# ============================================================================
function Remove-DirectorySafe {
    param (
        [string]$Path,
        [string]$Description
    )
    
    if (Test-Path $Path) {
        Write-Host "[*] Removendo: $Description" -ForegroundColor Yellow
        try {
            Remove-Item -Path $Path -Recurse -Force -ErrorAction Stop
            Write-Host "   [OK] Removido com sucesso" -ForegroundColor Green
        }
        catch {
            Write-Host "   [!] Erro ao remover: $_" -ForegroundColor Red
            Write-Host "   [*] Tentando metodo alternativo..." -ForegroundColor Yellow
            
            # Metodo alternativo usando cmd
            $cmdPath = $Path.Replace('/', '\')
            cmd /c "rmdir /s /q `"$cmdPath`"" 2>$null
            
            if (-not (Test-Path $Path)) {
                Write-Host "   [OK] Removido com metodo alternativo" -ForegroundColor Green
            }
            else {
                Write-Host "   [X] Falha ao remover. Tente manualmente." -ForegroundColor Red
            }
        }
    }
    else {
        Write-Host "[i] Nao encontrado: $Description" -ForegroundColor Gray
    }
}

# ============================================================================
# PASSO 1: Parar processos do Metro e Expo
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "PASSO 1: Parando processos do Metro e Expo" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$processesToKill = @("node", "expo", "metro", "watchman")

foreach ($processName in $processesToKill) {
    $processes = Get-Process -Name $processName -ErrorAction SilentlyContinue
    if ($processes) {
        Write-Host "[*] Parando processos: $processName" -ForegroundColor Yellow
        $processes | Stop-Process -Force -ErrorAction SilentlyContinue
        Write-Host "   [OK] Processos parados" -ForegroundColor Green
    }
}

Start-Sleep -Seconds 2

# ============================================================================
# PASSO 2: Limpar cache do Metro Bundler
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "PASSO 2: Limpando cache do Metro Bundler" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Cache do Metro no projeto
Remove-DirectorySafe -Path ".\apps\app-aluno\.expo" -Description "Cache .expo do app-aluno"
Remove-DirectorySafe -Path ".\apps\app-aluno\node_modules\.cache" -Description "Cache do Metro no app-aluno"
Remove-DirectorySafe -Path ".\.metro" -Description "Cache .metro raiz"

# Cache temporario do Metro
$metroCaches = Get-ChildItem -Path $env:TEMP -Filter "metro-*" -Directory -ErrorAction SilentlyContinue
if ($metroCaches) {
    Write-Host "[*] Removendo caches temporarios do Metro" -ForegroundColor Yellow
    $metroCaches | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   [OK] Caches temporarios removidos" -ForegroundColor Green
}

# ============================================================================
# PASSO 3: Limpar cache do Expo
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "PASSO 3: Limpando cache do Expo" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Cache global do Expo
$expoCache = Join-Path $env:USERPROFILE ".expo"
Remove-DirectorySafe -Path $expoCache -Description "Cache global do Expo (~/.expo)"

# Cache do Expo CLI
$expoCLICache = Join-Path $env:LOCALAPPDATA "expo"
Remove-DirectorySafe -Path $expoCLICache -Description "Cache do Expo CLI (AppData/Local/expo)"

# Cache do Expo no AppData Roaming
$expoRoamingCache = Join-Path $env:APPDATA "expo"
Remove-DirectorySafe -Path $expoRoamingCache -Description "Cache do Expo (AppData/Roaming/expo)"

# ============================================================================
# PASSO 4: Limpar cache do pnpm
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "PASSO 4: Limpando cache do pnpm" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[*] Executando: pnpm store prune" -ForegroundColor Yellow
pnpm store prune
Write-Host "   [OK] Store do pnpm limpo" -ForegroundColor Green

# ============================================================================
# PASSO 5: Limpar node_modules
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "PASSO 5: Limpando node_modules" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# node_modules raiz
Remove-DirectorySafe -Path ".\node_modules" -Description "node_modules raiz"

# node_modules do app-aluno
Remove-DirectorySafe -Path ".\apps\app-aluno\node_modules" -Description "node_modules do app-aluno"

# node_modules de outros apps
$appsDir = ".\apps"
if (Test-Path $appsDir) {
    Get-ChildItem -Path $appsDir -Directory | ForEach-Object {
        $nodeModulesPath = Join-Path $_.FullName "node_modules"
        if (Test-Path $nodeModulesPath) {
            Remove-DirectorySafe -Path $nodeModulesPath -Description "node_modules de $($_.Name)"
        }
    }
}

# node_modules dos packages
$packagesDir = ".\packages"
if (Test-Path $packagesDir) {
    Get-ChildItem -Path $packagesDir -Directory | ForEach-Object {
        $nodeModulesPath = Join-Path $_.FullName "node_modules"
        if (Test-Path $nodeModulesPath) {
            Remove-DirectorySafe -Path $nodeModulesPath -Description "node_modules de packages/$($_.Name)"
        }
    }
}

# ============================================================================
# PASSO 6: Limpar cache do Turbo
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "PASSO 6: Limpando cache do Turbo" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Remove-DirectorySafe -Path ".\.turbo" -Description "Cache do Turbo"

# ============================================================================
# PASSO 7: Limpar lockfiles e builds
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "PASSO 7: Limpando arquivos temporarios" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# Remover builds do Android/iOS se existirem
Remove-DirectorySafe -Path ".\apps\app-aluno\android" -Description "Build Android"
Remove-DirectorySafe -Path ".\apps\app-aluno\ios" -Description "Build iOS"

# ============================================================================
# PASSO 8: Limpar cache do React Native
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "PASSO 8: Limpando cache do React Native" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$rnCaches = Get-ChildItem -Path $env:TEMP -Filter "react-*" -ErrorAction SilentlyContinue
if ($rnCaches) {
    Write-Host "[*] Removendo caches do React Native" -ForegroundColor Yellow
    $rnCaches | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   [OK] Caches do React Native removidos" -ForegroundColor Green
}

# ============================================================================
# PASSO 9: Limpar cache do Haste Map
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "PASSO 9: Limpando cache do Haste Map" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$hasteCaches = Get-ChildItem -Path $env:TEMP -Filter "haste-map-*" -ErrorAction SilentlyContinue
if ($hasteCaches) {
    Write-Host "[*] Removendo caches do Haste Map" -ForegroundColor Yellow
    $hasteCaches | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   [OK] Caches do Haste Map removidos" -ForegroundColor Green
}

# ============================================================================
# RESUMO FINAL
# ============================================================================
$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "                    LIMPEZA CONCLUIDA!                          " -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "[i] Tempo total: $($duration.TotalSeconds) segundos" -ForegroundColor Cyan
Write-Host ""
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Reinstalar dependencias:" -ForegroundColor White
Write-Host "   pnpm install" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Iniciar o projeto:" -ForegroundColor White
Write-Host "   cd apps\app-aluno" -ForegroundColor Gray
Write-Host "   pnpm start" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Ou usar o script de inicializacao limpa:" -ForegroundColor White
Write-Host "   .\iniciar-expo-limpo.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
