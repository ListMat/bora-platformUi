# Script PowerShell para configurar PostgreSQL no Windows
# Execute: .\scripts\setup-postgresql.ps1

Write-Host "🐘 Configuração do PostgreSQL para BORA" -ForegroundColor Cyan
Write-Host ""

# Verificar se o PostgreSQL está instalado
Write-Host "Verificando instalação do PostgreSQL..." -ForegroundColor Yellow
try {
    $psqlVersion = psql --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ PostgreSQL encontrado: $psqlVersion" -ForegroundColor Green
    } else {
        Write-Host "✗ PostgreSQL não encontrado no PATH" -ForegroundColor Red
        Write-Host "  Certifique-se de que o PostgreSQL está instalado e adicionado ao PATH" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "✗ Erro ao verificar PostgreSQL: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Solicitar informações do banco
Write-Host "Por favor, forneça as seguintes informações:" -ForegroundColor Cyan
$dbUser = Read-Host "Usuário PostgreSQL (padrão: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUser)) {
    $dbUser = "postgres"
}

$dbPassword = Read-Host "Senha do PostgreSQL" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword)
)

$dbName = Read-Host "Nome do banco de dados (padrão: bora_db)"
if ([string]::IsNullOrWhiteSpace($dbName)) {
    $dbName = "bora_db"
}

$dbHost = Read-Host "Host (padrão: localhost)"
if ([string]::IsNullOrWhiteSpace($dbHost)) {
    $dbHost = "localhost"
}

$dbPort = Read-Host "Porta (padrão: 5432)"
if ([string]::IsNullOrWhiteSpace($dbPort)) {
    $dbPort = "5432"
}

Write-Host ""
Write-Host "Criando banco de dados '$dbName'..." -ForegroundColor Yellow

# Criar variável de ambiente temporária para senha
$env:PGPASSWORD = $dbPasswordPlain

# Tentar criar o banco de dados
try {
    $createDbQuery = "CREATE DATABASE $dbName;"
    $result = psql -U $dbUser -h $dbHost -p $dbPort -d postgres -c $createDbQuery 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Banco de dados '$dbName' criado com sucesso!" -ForegroundColor Green
    } elseif ($result -match "already exists") {
        Write-Host "⚠ Banco de dados '$dbName' já existe" -ForegroundColor Yellow
    } else {
        Write-Host "✗ Erro ao criar banco de dados:" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
        $env:PGPASSWORD = $null
        exit 1
    }
} catch {
    Write-Host "✗ Erro ao criar banco de dados: $_" -ForegroundColor Red
    $env:PGPASSWORD = $null
    exit 1
} finally {
    # Limpar senha da memória
    $env:PGPASSWORD = $null
}

Write-Host ""

# Gerar conteúdo do .env
Write-Host "Gerando configuração para .env..." -ForegroundColor Yellow

$envContent = @"
# Database - PostgreSQL Local
DATABASE_URL="postgresql://$dbUser`:$dbPasswordPlain@$dbHost`:$dbPort/$dbName"
DIRECT_URL="postgresql://$dbUser`:$dbPasswordPlain@$dbHost`:$dbPort/$dbName"

# NextAuth
# Gere uma chave secreta com: openssl rand -base64 32
NEXTAUTH_SECRET="change-this-to-a-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (Payment Processing) - Opcional para desenvolvimento
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Pusher (Realtime Chat) - Opcional para desenvolvimento
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="us2"

# Supabase (Storage) - Opcional para desenvolvimento
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Upstash Redis (Rate Limiting) - Opcional para desenvolvimento
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Application URLs
APP_URL="http://localhost:3000"
EXPO_PUBLIC_API_URL="http://localhost:3000/api/trpc"

# Expo Public Keys (Mobile Apps)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
EXPO_PUBLIC_PUSHER_KEY="your-pusher-key"
EXPO_PUBLIC_PUSHER_CLUSTER="us2"
EXPO_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
"@

# Verificar se .env já existe
$envPath = Join-Path $PSScriptRoot "..\.env"
if (Test-Path $envPath) {
    $overwrite = Read-Host "Arquivo .env já existe. Deseja sobrescrever? (s/N)"
    if ($overwrite -ne "s" -and $overwrite -ne "S") {
        Write-Host "Operação cancelada. Mantendo .env existente." -ForegroundColor Yellow
        exit 0
    }
}

# Salvar .env
try {
    $envContent | Out-File -FilePath $envPath -Encoding utf8 -NoNewline
    Write-Host "✓ Arquivo .env criado em: $envPath" -ForegroundColor Green
} catch {
    Write-Host "✗ Erro ao criar arquivo .env: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Configuração concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Execute: cd packages/db" -ForegroundColor White
Write-Host "2. Execute: pnpm prisma generate" -ForegroundColor White
Write-Host "3. Execute: pnpm prisma db push" -ForegroundColor White
Write-Host "4. (Opcional) Execute: pnpm prisma db seed" -ForegroundColor White
Write-Host ""

