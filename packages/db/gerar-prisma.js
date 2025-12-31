// Script para gerar Prisma Client limpando variáveis de ambiente problemáticas
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔧 Gerando Prisma Client...\n');

// Limpar variáveis npm_config problemáticas
const env = { ...process.env };
Object.keys(env).forEach(key => {
  if (key.startsWith('npm_config_')) {
    delete env[key];
  }
});

// Garantir que NODE_ENV não está definido ou está correto
env.NODE_ENV = env.NODE_ENV || 'development';

// Encontrar o Prisma
const rootDir = path.join(__dirname, '../..');
const possiblePaths = [
  path.join(rootDir, 'node_modules/.pnpm/prisma@5.22.0/node_modules/prisma/build/index.js'),
  path.join(rootDir, 'node_modules/.pnpm/prisma@5.8.1/node_modules/prisma/build/index.js'),
  path.join(rootDir, 'node_modules/prisma/build/index.js'),
];

let prismaPath = null;
for (const testPath of possiblePaths) {
  if (fs.existsSync(testPath)) {
    prismaPath = testPath;
    console.log('✅ Prisma encontrado:', testPath);
    break;
  }
}

if (!prismaPath) {
  console.error('❌ Prisma não encontrado. Verifique se está instalado.');
  process.exit(1);
}

// Executar Prisma Generate
try {
  console.log('\n🔄 Executando prisma generate...\n');
  
  // Usar execSync com ambiente limpo
  const result = execSync(`node "${prismaPath}" generate`, {
    cwd: __dirname,
    env: env,
    stdio: 'inherit',
    encoding: 'utf8',
    shell: true
  });
  
  console.log('\n✅ Prisma Client gerado com sucesso!');
  
  // Verificar se foi gerado
  const generatedPath = path.join(rootDir, 'node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma/client');
  if (fs.existsSync(generatedPath)) {
    console.log('✅ Verificado em:', generatedPath);
  }
  
} catch (error) {
  console.error('\n❌ Erro ao gerar Prisma Client');
  console.error('Mensagem:', error.message);
  console.log('\n💡 Solução: Reinicie o computador e execute novamente');
  process.exit(1);
}

