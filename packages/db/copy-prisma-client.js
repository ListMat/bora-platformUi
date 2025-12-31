// Script para copiar Prisma Client gerado para todas as versões instaladas
const fs = require('fs');
const path = require('path');

console.log('📦 Copiando Prisma Client para todas as versões...\n');

const rootDir = path.join(__dirname, '../..');
const sourcePrisma = path.join(rootDir, 'node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma');

if (!fs.existsSync(sourcePrisma)) {
  console.error('❌ Prisma Client não encontrado em:', sourcePrisma);
  console.log('💡 Execute primeiro: cd packages/db && npx prisma generate');
  process.exit(1);
}

// Encontrar todas as versões do @prisma/client
const pnpmDir = path.join(rootDir, 'node_modules/.pnpm');
const clientDirs = fs.readdirSync(pnpmDir)
  .filter(dir => dir.startsWith('@prisma+client@'))
  .map(dir => path.join(pnpmDir, dir, 'node_modules', '.prisma'));

console.log(`✅ Encontradas ${clientDirs.length} versões do @prisma/client\n`);

let copied = 0;
for (const targetDir of clientDirs) {
  const targetParent = path.dirname(targetDir);
  if (!fs.existsSync(targetParent)) {
    console.log(`⏭️  Pulando (diretório não existe): ${targetDir}`);
    continue;
  }

  try {
    // Remover diretório antigo se existir
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }

    // Copiar recursivamente
    fs.mkdirSync(targetDir, { recursive: true });
    copyRecursiveSync(sourcePrisma, targetDir);
    copied++;
    console.log(`✅ Copiado para: ${path.basename(path.dirname(path.dirname(targetDir)))}`);
  } catch (error) {
    console.error(`❌ Erro ao copiar para ${targetDir}:`, error.message);
  }
}

console.log(`\n✅ Prisma Client copiado para ${copied} versões!`);

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

