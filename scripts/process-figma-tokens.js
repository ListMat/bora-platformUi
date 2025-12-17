const fs = require('fs');
const path = require('path');

// Caminhos dos arquivos de tokens do Figma
const tokensPath = {
  colors: 'C:/Users/Mateus/Downloads/1. Color modes/Dark mode.tokens.json',
  radius: 'C:/Users/Mateus/Downloads/2. Radius/Mode 1.tokens.json',
  spacing: 'C:/Users/Mateus/Downloads/3. Spacing/Mode 1.tokens.json',
  widths: 'C:/Users/Mateus/Downloads/4. Widths/Mode 1.tokens.json',
  containers: 'C:/Users/Mateus/Downloads/5. Containers/Value.tokens.json',
};

// Função para extrair valor hex de cor
function extractColorValue(colorObj) {
  if (typeof colorObj === 'string' && colorObj.startsWith('{')) {
    // É uma referência, retornar null para resolver depois
    return null;
  }
  if (colorObj?.$value?.hex) {
    return colorObj.$value.hex;
  }
  if (colorObj?.$value?.components) {
    const [r, g, b] = colorObj.$value.components;
    const hex = [r, g, b]
      .map(c => Math.round(c * 255).toString(16).padStart(2, '0'))
      .join('');
    return `#${hex.toUpperCase()}`;
  }
  return null;
}

// Função para processar cores
function processColors(colorsData) {
  const result = {
    text: {},
    background: {},
    foreground: {},
    border: {},
    brand: {},
    error: {},
    warning: {},
    success: {},
  };

  const categories = colorsData.Colors || {};

  // Processar Text
  if (categories.Text) {
    Object.entries(categories.Text).forEach(([key, value]) => {
      const cleanKey = key.replace(/[()]/g, '').replace(/\s+/g, '-').toLowerCase();
      const hex = extractColorValue(value);
      if (hex) {
        result.text[cleanKey] = hex;
      }
    });
  }

  // Processar Background
  if (categories.Background) {
    Object.entries(categories.Background).forEach(([key, value]) => {
      const cleanKey = key.replace(/_/g, '-');
      const hex = extractColorValue(value);
      if (hex) {
        result.background[cleanKey] = hex;
      }
    });
  }

  // Processar Foreground
  if (categories.Foreground) {
    Object.entries(categories.Foreground).forEach(([key, value]) => {
      const cleanKey = key.replace(/[()]/g, '').replace(/\s+/g, '-').replace(/_/g, '-').toLowerCase();
      const hex = extractColorValue(value);
      if (hex) {
        if (key.includes('brand')) {
          result.brand[cleanKey] = hex;
        } else if (key.includes('error')) {
          result.error[cleanKey] = hex;
        } else if (key.includes('warning')) {
          result.warning[cleanKey] = hex;
        } else if (key.includes('success')) {
          result.success[cleanKey] = hex;
        } else {
          result.foreground[cleanKey] = hex;
        }
      }
    });
  }

  // Processar Border
  if (categories.Border) {
    Object.entries(categories.Border).forEach(([key, value]) => {
      const cleanKey = key.replace(/_/g, '-');
      const hex = extractColorValue(value);
      if (hex) {
        result.border[cleanKey] = hex;
      }
    });
  }

  return result;
}

// Função para processar radius
function processRadius(radiusData) {
  const result = {};
  Object.entries(radiusData).forEach(([key, value]) => {
    if (key !== '$extensions' && value.$value !== undefined) {
      result[key] = value.$value;
    }
  });
  return result;
}

// Função para processar spacing
function processSpacing(spacingData) {
  const result = {};
  Object.entries(spacingData).forEach(([key, value]) => {
    if (key !== '$extensions' && value.$value !== undefined) {
      result[key] = value.$value;
    }
  });
  return result;
}

// Função para processar widths
function processWidths(widthsData) {
  const result = {};
  Object.entries(widthsData).forEach(([key, value]) => {
    if (key !== '$extensions' && value.$value !== undefined) {
      result[key] = value.$value;
    }
  });
  return result;
}

// Função para processar containers
function processContainers(containersData) {
  const result = {};
  Object.entries(containersData).forEach(([key, value]) => {
    if (key !== '$extensions' && value.$value !== undefined) {
      result[key] = value.$value;
    }
  });
  return result;
}

// Processar todos os tokens
try {
  console.log('📦 Processando tokens do Figma...');

  const colorsData = JSON.parse(fs.readFileSync(tokensPath.colors, 'utf8'));
  const radiusData = JSON.parse(fs.readFileSync(tokensPath.radius, 'utf8'));
  const spacingData = JSON.parse(fs.readFileSync(tokensPath.spacing, 'utf8'));
  const widthsData = JSON.parse(fs.readFileSync(tokensPath.widths, 'utf8'));
  const containersData = JSON.parse(fs.readFileSync(tokensPath.containers, 'utf8'));

  const tokens = {
    colors: processColors(colorsData),
    radius: processRadius(radiusData),
    spacing: processSpacing(spacingData),
    widths: processWidths(widthsData),
    containers: processContainers(containersData),
  };

  // Salvar tokens processados
  const outputPath = path.join(__dirname, '../packages/ui/src/tokens/figma-tokens.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(tokens, null, 2));

  console.log('✅ Tokens processados e salvos em:', outputPath);
  console.log('📊 Estatísticas:');
  console.log(`   - Cores: ${Object.keys(tokens.colors).length} categorias`);
  console.log(`   - Radius: ${Object.keys(tokens.radius).length} valores`);
  console.log(`   - Spacing: ${Object.keys(tokens.spacing).length} valores`);
  console.log(`   - Widths: ${Object.keys(tokens.widths).length} valores`);
  console.log(`   - Containers: ${Object.keys(tokens.containers).length} valores`);

} catch (error) {
  console.error('❌ Erro ao processar tokens:', error.message);
  process.exit(1);
}

