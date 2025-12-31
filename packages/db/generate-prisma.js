// Script para gerar Prisma Client diretamente via Node.js
// Evita problemas com variáveis npm_config corrompidas

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

// Tentar encontrar o Prisma
const possiblePaths = [
  path.join(__dirname, '../../node_modules/.pnpm/prisma@5.22.0/node_modules/prisma/build/index.js'),
  path.join(__dirname, '../../node_modules/.pnpm/prisma@5.8.1/node_modules/prisma/build/index.js'),
  path.join(__dirname, '../../node_modules/prisma/build/index.js'),
  path.join(__dirname, 'node_modules/prisma/build/index.js'),
];

let prismaPath = null;
for (const testPath of possiblePaths) {
  if (fs.existsSync(testPath)) {
    prismaPath = testPath;
    console.log('✅ Prisma encontrado em:', testPath);
    break;
  }
}

if (!prismaPath) {
  console.error('❌ Prisma não encontrado. Tentando via npx...');
  try {
    execSync('node -e "require(\'prisma/build/index.js\')"', {
      cwd: __dirname,
      env,
      stdio: 'inherit'
    });
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n💡 Solução: Execute manualmente após reiniciar o PC:');
    console.log('   cd packages/db');
    console.log('   npx prisma generate');
    process.exit(1);
  }
}

// Executar Prisma Generate
try {
  console.log('\n🔄 Executando prisma generate...\n');
  execSync(`node "${prismaPath}" generate`, {
    cwd: __dirname,
    env,
    stdio: 'inherit'
  });
  console.log('\n✅ Prisma Client gerado com sucesso!');
} catch (error) {
  console.error('\n❌ Erro ao gerar Prisma Client:', error.message);
  console.log('\n💡 Solução: Reinicie o computador e execute:');
  console.log('   cd packages/db');
  console.log('   npx prisma generate');
  process.exit(1);
}

