// Script para gerar assets básicos para o Expo
// Execute: node generate-assets.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, 'assets');

// Criar diretório assets se não existir
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Cores do BORA
const BORA_GREEN = '#00C853';
const BORA_ORANGE = '#FF6D00';

// Determinar cor baseado no nome do app
const appName = path.basename(__dirname);
const primaryColor = appName.includes('aluno') ? BORA_GREEN : BORA_ORANGE;

// Função para criar uma imagem PNG simples
async function createImage(width, height, color, filename) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) * 0.15}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">BORA</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(assetsDir, filename));

  console.log(`✅ Criado: ${filename} (${width}x${height}px)`);
}

async function generateAssets() {
  try {
    console.log('🎨 Gerando assets para o Expo...\n');

    // Icon (1024x1024)
    await createImage(1024, 1024, primaryColor, 'icon.png');

    // Splash screen (1284x2778 - iPhone 14 Pro Max)
    await createImage(1284, 2778, primaryColor, 'splash.png');

    // Adaptive icon (1024x1024)
    await createImage(1024, 1024, primaryColor, 'adaptive-icon.png');

    // Favicon (96x96)
    await createImage(96, 96, primaryColor, 'favicon.png');

    console.log('\n✨ Todos os assets foram gerados com sucesso!');
    console.log('💡 Nota: Estes são placeholders. Substitua por assets finais quando disponíveis.');
  } catch (error) {
    console.error('❌ Erro ao gerar assets:', error.message);
    console.log('\n💡 Alternativa: Crie os assets manualmente usando:');
    console.log('   - https://appicon.co/');
    console.log('   - https://www.appicon.build/');
  }
}

generateAssets();

