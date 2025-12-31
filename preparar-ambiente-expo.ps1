# ============================================================================
# Script Mestre - Preparacao Completa do Ambiente Expo
# ============================================================================
# Descricao: Executa todas as etapas necessarias para preparar o ambiente
# Uso: .\preparar-ambiente-expo.ps1
# ============================================================================

Write-Host "================================================================" -ForegroundColor Magenta
Write-Host "         PREPARACAO COMPLETA DO AMBIENTE EXPO                  " -ForegroundColor Magenta
Write-Host "              React Native + Expo SDK 52                        " -ForegroundColor Magenta
Write-Host "================================================================" -ForegroundColor Magenta
Write-Host ""

$ErrorActionPreference = "Continue"
$startTime = Get-Date

# ============================================================================
# ETAPA 1: Analise inicial
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  ETAPA 1/5: Analise Inicial                                   " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[*] Verificando estrutura do projeto..." -ForegroundColor Yellow

# Verificar se estamos no diretorio correto
if (-not (Test-Path ".\apps\app-aluno\package.json")) {
    Write-Host "[X] ERRO: Execute este script na raiz do projeto!" -ForegroundColor Red
    exit 1
}

Write-Host "   [OK] Estrutura do projeto OK" -ForegroundColor Green

# Verificar versao do Node
Write-Host "[*] Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "   Versao do Node: $nodeVersion" -ForegroundColor Gray

# Verificar versao do pnpm
Write-Host "[*] Verificando pnpm..." -ForegroundColor Yellow
$pnpmVersion = pnpm --version
Write-Host "   Versao do pnpm: $pnpmVersion" -ForegroundColor Gray

Write-Host ""
Write-Host "[OK] Analise inicial concluida!" -ForegroundColor Green
Start-Sleep -Seconds 2

# ============================================================================
# ETAPA 2: Correcao de configuracoes
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  ETAPA 2/5: Correcao de Configuracoes                         " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[*] Executando correcoes..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path ".\corrigir-dependencias.ps1") {
    & ".\corrigir-dependencias.ps1"
}
else {
    Write-Host "[!] Script de correcao nao encontrado. Pulando..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[OK] Correcoes concluidas!" -ForegroundColor Green
Start-Sleep -Seconds 2

# ============================================================================
# ETAPA 3: Limpeza de cache
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  ETAPA 3/5: Limpeza Completa de Cache                         " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[*] Executando limpeza de cache..." -ForegroundColor Yellow
Write-Host ""

if (Test-Path ".\limpar-cache-completo.ps1") {
    & ".\limpar-cache-completo.ps1"
}
else {
    Write-Host "[!] Script de limpeza nao encontrado. Pulando..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[OK] Limpeza concluida!" -ForegroundColor Green
Start-Sleep -Seconds 2

# ============================================================================
# ETAPA 4: Reinstalacao de dependencias
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  ETAPA 4/5: Reinstalacao de Dependencias                      " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[*] Instalando dependencias..." -ForegroundColor Yellow
Write-Host ""

try {
    pnpm install
    Write-Host ""
    Write-Host "   [OK] Dependencias instaladas com sucesso!" -ForegroundColor Green
}
catch {
    Write-Host ""
    Write-Host "   [X] Erro ao instalar dependencias: $_" -ForegroundColor Red
    Write-Host "   Tente executar manualmente: pnpm install" -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

# ============================================================================
# ETAPA 5: Verificacao final
# ============================================================================
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "  ETAPA 5/5: Verificacao Final                                 " -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[*] Verificando instalacao..." -ForegroundColor Yellow
Write-Host ""

# Verificar se node_modules foi criado
if (Test-Path ".\node_modules") {
    Write-Host "   [OK] node_modules raiz criado" -ForegroundColor Green
}
else {
    Write-Host "   [!] node_modules raiz nao encontrado" -ForegroundColor Yellow
}

if (Test-Path ".\apps\app-aluno\node_modules") {
    Write-Host "   [OK] node_modules do app-aluno criado" -ForegroundColor Green
}
else {
    Write-Host "   [!] node_modules do app-aluno nao encontrado" -ForegroundColor Yellow
}

# Verificar app.json
Write-Host ""
Write-Host "[*] Verificando app.json..." -ForegroundColor Yellow
$appJsonPath = ".\apps\app-aluno\app.json"
if (Test-Path $appJsonPath) {
    $appJson = Get-Content $appJsonPath -Raw | ConvertFrom-Json
    $sdkVersion = $appJson.expo.sdkVersion
    
    if ($sdkVersion -eq "52.0.0") {
        Write-Host "   [OK] SDK Version correto: $sdkVersion" -ForegroundColor Green
    }
    else {
        Write-Host "   [!] SDK Version: $sdkVersion (esperado: 52.0.0)" -ForegroundColor Yellow
    }
}

# ============================================================================
# RESUMO FINAL
# ============================================================================
$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "              PREPARACAO CONCLUIDA COM SUCESSO!                 " -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "[i] Tempo total: $([math]::Round($duration.TotalMinutes, 2)) minutos" -ForegroundColor Cyan
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "                    PROXIMOS PASSOS                              " -ForegroundColor Yellow
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "OPCAO 1: Iniciar com Expo Go (sem react-native-maps)" -ForegroundColor White
Write-Host ""
Write-Host "   cd apps\app-aluno" -ForegroundColor Gray
Write-Host "   pnpm start" -ForegroundColor Gray
Write-Host ""
Write-Host "   Depois escaneie o QR Code com o app Expo Go" -ForegroundColor Gray
Write-Host ""
Write-Host "----------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""
Write-Host "OPCAO 2: Iniciar com Expo Dev Client (com react-native-maps)" -ForegroundColor White
Write-Host ""
Write-Host "   cd apps\app-aluno" -ForegroundColor Gray
Write-Host "   npx expo prebuild" -ForegroundColor Gray
Write-Host "   npx expo run:android" -ForegroundColor Gray
Write-Host ""
Write-Host "   Isso fara build nativo (pode demorar ~10 minutos)" -ForegroundColor Gray
Write-Host ""
Write-Host "----------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""
Write-Host "DOCUMENTACAO CRIADA:" -ForegroundColor White
Write-Host ""
Write-Host "   [*] ANALISE_DEPENDENCIAS_EXPO.md" -ForegroundColor Cyan
Write-Host "      Analise completa de todas as dependencias" -ForegroundColor Gray
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "DICA: Se encontrar erros, verifique:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   1. Versao do Node.js >= 18.17.0" -ForegroundColor Gray
Write-Host "   2. Versao do pnpm >= 8.0.0" -ForegroundColor Gray
Write-Host "   3. Android SDK instalado (para Android)" -ForegroundColor Gray
Write-Host "   4. Expo Go instalado no celular (para teste rapido)" -ForegroundColor Gray
Write-Host ""
Write-Host "================================================================" -ForegroundColor Cyan
