# ============================================================================
# Script de Correcao de Dependencias e Configuracoes
# ============================================================================
# Descricao: Corrige incompatibilidades e atualiza dependencias
# Uso: .\corrigir-dependencias.ps1
# ============================================================================

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "        CORRECAO DE DEPENDENCIAS E CONFIGURACOES - EXPO        " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# ============================================================================
# PASSO 1: Corrigir app.json
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "PASSO 1: Corrigindo app.json" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

$appJsonPath = ".\apps\app-aluno\app.json"

if (Test-Path $appJsonPath) {
    Write-Host "[*] Lendo app.json..." -ForegroundColor Yellow
    $appJsonContent = Get-Content $appJsonPath -Raw | ConvertFrom-Json
    
    # Verificar versao do SDK
    $currentSdkVersion = $appJsonContent.expo.sdkVersion
    Write-Host "   Versao atual do SDK: $currentSdkVersion" -ForegroundColor Gray
    
    if ($currentSdkVersion -ne "52.0.0") {
        Write-Host "   [!] SDK incorreto! Corrigindo para 52.0.0..." -ForegroundColor Yellow
        $appJsonContent.expo.sdkVersion = "52.0.0"
        
        # Salvar backup
        $backupPath = "$appJsonPath.backup"
        Copy-Item $appJsonPath $backupPath
        Write-Host "   [*] Backup criado: $backupPath" -ForegroundColor Green
        
        # Salvar correcao
        $appJsonContent | ConvertTo-Json -Depth 10 | Set-Content $appJsonPath
        Write-Host "   [OK] app.json corrigido!" -ForegroundColor Green
    }
    else {
        Write-Host "   [OK] SDK ja esta correto (52.0.0)" -ForegroundColor Green
    }
}
else {
    Write-Host "   [X] app.json nao encontrado!" -ForegroundColor Red
    exit 1
}

# ============================================================================
# PASSO 2: Verificar escolha para react-native-maps
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "PASSO 2: Configuracao do react-native-maps" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[!] ATENCAO: react-native-maps requer codigo nativo!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Escolha uma opcao:" -ForegroundColor White
Write-Host ""
Write-Host "1. Instalar Expo Dev Client (RECOMENDADO)" -ForegroundColor Cyan
Write-Host "   - Permite usar react-native-maps" -ForegroundColor Gray
Write-Host "   - Requer build nativo (mais lento)" -ForegroundColor Gray
Write-Host "   - Nao funciona no Expo Go" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Manter como esta (para depois)" -ForegroundColor Cyan
Write-Host "   - Nao faz alteracoes agora" -ForegroundColor Gray
Write-Host "   - Voce decide depois" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Remover react-native-maps temporariamente" -ForegroundColor Cyan
Write-Host "   - Remove a dependencia" -ForegroundColor Gray
Write-Host "   - Funciona no Expo Go" -ForegroundColor Gray
Write-Host "   - Voce precisara comentar codigo que usa mapas" -ForegroundColor Gray
Write-Host ""

$choice = Read-Host "Digite sua escolha (1, 2 ou 3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "[*] Instalando expo-dev-client..." -ForegroundColor Yellow
        Set-Location ".\apps\app-aluno"
        pnpm add expo-dev-client
        Set-Location "..\..\"
        
        Write-Host "   [OK] expo-dev-client instalado!" -ForegroundColor Green
        Write-Host ""
        Write-Host "[*] IMPORTANTE: Adicione 'expo-dev-client' aos plugins no app.json:" -ForegroundColor Yellow
        Write-Host '   "plugins": ["expo-dev-client", ...]' -ForegroundColor Gray
        Write-Host ""
        Write-Host "[*] Para fazer build do dev client:" -ForegroundColor Yellow
        Write-Host "   cd apps\app-aluno" -ForegroundColor Gray
        Write-Host "   npx expo prebuild" -ForegroundColor Gray
        Write-Host "   npx expo run:android" -ForegroundColor Gray
    }
    "2" {
        Write-Host ""
        Write-Host "[i] Mantendo configuracao atual. Voce pode instalar depois." -ForegroundColor Cyan
    }
    "3" {
        Write-Host ""
        Write-Host "[*] Removendo react-native-maps..." -ForegroundColor Yellow
        Set-Location ".\apps\app-aluno"
        pnpm remove react-native-maps
        Set-Location "..\..\"
        Write-Host "   [OK] react-native-maps removido!" -ForegroundColor Green
        Write-Host ""
        Write-Host "[!] ATENCAO: Voce precisara comentar codigo que usa mapas!" -ForegroundColor Yellow
    }
    default {
        Write-Host ""
        Write-Host "[X] Opcao invalida. Mantendo configuracao atual." -ForegroundColor Red
    }
}

# ============================================================================
# PASSO 3: Atualizar dependencias RC para versoes estaveis
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "PASSO 3: Atualizando dependencias RC" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[?] Deseja atualizar tRPC e pusher-js para versoes estaveis? (s/n)" -ForegroundColor Yellow
$updateDeps = Read-Host

if ($updateDeps -eq "s" -or $updateDeps -eq "S") {
    Write-Host ""
    Write-Host "[*] Atualizando dependencias..." -ForegroundColor Yellow
    
    Set-Location ".\apps\app-aluno"
    
    # Atualizar tRPC
    Write-Host "   [*] Atualizando tRPC..." -ForegroundColor Gray
    pnpm add @trpc/client@latest @trpc/server@latest @trpc/react-query@latest
    
    # Atualizar pusher-js
    Write-Host "   [*] Atualizando pusher-js..." -ForegroundColor Gray
    pnpm add pusher-js@latest
    
    Set-Location "..\..\"
    
    Write-Host "   [OK] Dependencias atualizadas!" -ForegroundColor Green
}
else {
    Write-Host "   [i] Mantendo versoes atuais" -ForegroundColor Cyan
}

# ============================================================================
# PASSO 4: Verificar @trpc/next
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "PASSO 4: Verificando @trpc/next" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[i] @trpc/next e especifico para Next.js" -ForegroundColor Yellow
Write-Host "[?] Deseja remover @trpc/next? (s/n)" -ForegroundColor Yellow
$removeNext = Read-Host

if ($removeNext -eq "s" -or $removeNext -eq "S") {
    Write-Host ""
    Write-Host "[*] Removendo @trpc/next..." -ForegroundColor Yellow
    Set-Location ".\apps\app-aluno"
    pnpm remove @trpc/next
    Set-Location "..\..\"
    Write-Host "   [OK] @trpc/next removido!" -ForegroundColor Green
}
else {
    Write-Host "   [i] Mantendo @trpc/next" -ForegroundColor Cyan
}

# ============================================================================
# RESUMO FINAL
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "                  CORRECOES CONCLUIDAS!                         " -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "PROXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Limpar cache completo:" -ForegroundColor White
Write-Host "   .\limpar-cache-completo.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Reinstalar dependencias:" -ForegroundColor White
Write-Host "   pnpm install" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Iniciar o projeto:" -ForegroundColor White
Write-Host "   cd apps\app-aluno" -ForegroundColor Gray
Write-Host "   pnpm start" -ForegroundColor Gray
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
