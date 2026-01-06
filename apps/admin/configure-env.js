const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Caminhos
const dbEnvPath = path.join(__dirname, '../../packages/db/.env');
const adminEnvPath = path.join(__dirname, '.env');

console.log('🔄 Iniciando configuração do .env para o Admin...');

// 1. Tentar ler o .env do packages/db para pegar a URL do banco
let databaseUrl = '';
let directUrl = '';

if (fs.existsSync(dbEnvPath)) {
    const dbEnvContent = fs.readFileSync(dbEnvPath, 'utf8');

    const dbUrlMatch = dbEnvContent.match(/DATABASE_URL="?([^"\n]+)"?/);
    if (dbUrlMatch) databaseUrl = dbUrlMatch[1];

    const directUrlMatch = dbEnvContent.match(/DIRECT_URL="?([^"\n]+)"?/);
    if (directUrlMatch) directUrl = directUrlMatch[1];

    console.log('✅ Credenciais do banco de dados encontradas no packages/db');
} else {
    console.log('⚠️ Arquivo .env não encontrado em packages/db. Usando valores de exemplo.');
    databaseUrl = 'postgresql://usuario:senha@host:5432/banco';
    directUrl = 'postgresql://usuario:senha@host:5432/banco';
}

// 2. Gerar NEXTAUTH_SECRET seguro
const nextAuthSecret = crypto.randomBytes(32).toString('base64');
console.log('✅ NEXTAUTH_SECRET gerado com segurança');

// 3. Montar o conteúdo do .env
const envContent = `# Database (Copiado do packages/db)
DATABASE_URL="${databaseUrl}"
DIRECT_URL="${directUrl}"

# NextAuth Configuration
NEXTAUTH_SECRET="${nextAuthSecret}"
NEXTAUTH_URL="http://localhost:3001"

# Admin Credentials (Padrão para primeiro acesso)
ADMIN_EMAIL="admin@bora.com"
ADMIN_PASSWORD="admin123"

# Environment
NODE_ENV="development"
`;

// 4. Escrever o arquivo
fs.writeFileSync(adminEnvPath, envContent);

console.log('🎉 Arquivo apps/admin/.env configurado com sucesso!');
console.log('🔒 Agora o Admin está conectado ao mesmo banco do App.');
