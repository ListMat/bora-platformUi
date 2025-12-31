# 🧹 Script para Limpar Cache do Expo/Metro
# Resolve problemas de "Failed to start watch mode"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Limpeza de Cache Expo/Metro" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Encerrar processos Node
Write-Host "🛑 Encerrando processos Node..." -ForegroundColor Yellow
$nodeProcesses = Get-Process | Where-Object { $_.ProcessName -eq "node" -and $_.Id -ne $PID }
if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        Write-Host "  Encerrando PID: $($_.Id)" -ForegroundColor Gray
        Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
    Write-Host "✅ Processos encerrados" -ForegroundColor Green
} else {
    Write-Host "✅ Nenhum processo Node encontrado" -ForegroundColor Green
}

Write-Host ""

# Limpar cache do app-aluno
Write-Host "🧹 Limpando cache do app-aluno..." -ForegroundColor Yellow
$appAluno = "apps\app-aluno"
if (Test-Path $appAluno) {
    $cacheDirs = @(".expo", "node_modules\.cache", ".metro", "dist", "web-build")
    foreach ($dir in $cacheDirs) {
        $fullPath = Join-Path $appAluno $dir
        if (Test-Path $fullPath) {
            Remove-Item -Recurse -Force $fullPath -ErrorAction SilentlyContinue
            Write-Host "  ✅ Removido: $dir" -ForegroundColor Green
        }
    }
}

# Limpar cache do app-instrutor
Write-Host "🧹 Limpando cache do app-instrutor..." -ForegroundColor Yellow
$appInstrutor = "apps\app-instrutor"
if (Test-Path $appInstrutor) {
    $cacheDirs = @(".expo", "node_modules\.cache", ".metro", "dist", "web-build")
    foreach ($dir in $cacheDirs) {
        $fullPath = Join-Path $appInstrutor $dir
        if (Test-Path $fullPath) {
            Remove-Item -Recurse -Force $fullPath -ErrorAction SilentlyContinue
            Write-Host "  ✅ Removido: $dir" -ForegroundColor Green
        }
    }
}

# Limpar cache global
Write-Host "🧹 Limpando cache global..." -ForegroundColor Yellow
$globalCache = @("node_modules\.cache", ".turbo")
foreach ($dir in $globalCache) {
    if (Test-Path $dir) {
        Remove-Item -Recurse -Force $dir -ErrorAction SilentlyContinue
        Write-Host "  ✅ Removido: $dir" -ForegroundColor Green
    }
}

# Limpar cache do Metro
Write-Host "🧹 Limpando cache do Metro..." -ForegroundColor Yellow
$metroCache = "$env:LOCALAPPDATA\Temp\metro-*"
if (Test-Path (Split-Path $metroCache -Parent)) {
    Get-ChildItem (Split-Path $metroCache -Parent) -Filter "metro-*" -ErrorAction SilentlyContinue | ForEach-Object {
        Remove-Item -Recurse -Force $_.FullName -ErrorAction SilentlyContinue
        Write-Host "  ✅ Removido: $($_.Name)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   Limpeza Concluída!" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Agora você pode reiniciar o Expo:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  cd apps\app-aluno" -ForegroundColor White
Write-Host "  npx expo start --clear" -ForegroundColor White
Write-Host ""
Write-Host "Ou para o app-instrutor:" -ForegroundColor Yellow
Write-Host ""
Write-Host "  cd apps\app-instrutor" -ForegroundColor White
Write-Host "  npx expo start --clear --port 8082" -ForegroundColor White
Write-Host ""

