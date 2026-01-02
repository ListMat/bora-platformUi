# Parar processos node anteriores para evitar conflito de porta
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue

# Web Admin
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'apps/web-admin'; Write-Host '--- INICIANDO WEB ADMIN (Porta 3000) ---' -ForegroundColor Green; pnpm dev"

# App Aluno
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'apps/app-aluno'; Write-Host '--- INICIANDO APP ALUNO (Porta 8083) ---' -ForegroundColor Cyan; npx expo start --web --port 8083 --clear"

# App Instrutor
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'apps/app-instrutor'; Write-Host '--- INICIANDO APP INSTRUTOR (Porta 8086) ---' -ForegroundColor Magenta; npx expo start --web --port 8086 --clear"

Write-Host "Comandos de inicialização enviados. Aguarde as janelas abrirem."
