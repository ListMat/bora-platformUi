# Bora Admin - Setup Script

Write-Host "🚀 Configurando Bora Admin..." -ForegroundColor Cyan

# 1. Instalar dependências
Write-Host "`n📦 Instalando dependências..." -ForegroundColor Yellow
Set-Location "apps/admin"
pnpm install

# 2. Verificar .env
Write-Host "`n🔧 Verificando variáveis de ambiente..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  Arquivo .env não encontrado!" -ForegroundColor Red
    Write-Host "Criando .env de exemplo..." -ForegroundColor Yellow
    
    @"
# Database (compartilhado com PWA)
DATABASE_URL="postgresql://user:password@localhost:5432/bora"
DIRECT_URL="postgresql://user:password@localhost:5432/bora"

# NextAuth
NEXTAUTH_SECRET="your-secret-here-change-this"
NEXTAUTH_URL="http://localhost:3001"

# Admin Credentials
ADMIN_EMAIL="admin@bora.com"
ADMIN_PASSWORD="admin123"
"@ | Out-File -FilePath ".env" -Encoding UTF8
    
    Write-Host "✅ Arquivo .env criado!" -ForegroundColor Green
    Write-Host "⚠️  IMPORTANTE: Configure as variáveis antes de continuar!" -ForegroundColor Red
    exit
}

# 3. Criar usuário admin no banco (se não existir)
Write-Host "`n👤 Criando usuário admin..." -ForegroundColor Yellow
Set-Location "../.."
npx tsx -e "
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@bora.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  
  const existing = await prisma.user.findUnique({ where: { email } });
  
  if (existing) {
    console.log('✅ Admin já existe!');
    return;
  }
  
  const hashedPassword = await hash(password, 10);
  
  await prisma.user.create({
    data: {
      email,
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });
  
  console.log('✅ Admin criado com sucesso!');
  console.log('Email:', email);
  console.log('Senha:', password);
}

createAdmin().finally(() => prisma.\$disconnect());
"

# 4. Rodar o projeto
Write-Host "`n🎉 Tudo pronto! Iniciando servidor..." -ForegroundColor Green
Write-Host "`nPainel admin disponível em: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Email: admin@bora.com" -ForegroundColor Cyan
Write-Host "Senha: admin123" -ForegroundColor Cyan
Write-Host "`n⚠️  Altere a senha após o primeiro login!`n" -ForegroundColor Yellow

Set-Location "apps/admin"
pnpm dev
