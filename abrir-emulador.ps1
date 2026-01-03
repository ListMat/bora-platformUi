$emulatorPath = "C:\Users\Mateus\AppData\Local\Android\Sdk\emulator\emulator.exe"
$avdName = "Medium_Phone_API_36.1"

Write-Host "Iniciando emulador $avdName..."

if (Test-Path $emulatorPath) {
    Start-Process -FilePath $emulatorPath -ArgumentList "-avd", $avdName
    Write-Host "Emulador iniciado."
} else {
    Write-Host "Erro: Emulador nao encontrado."
}
