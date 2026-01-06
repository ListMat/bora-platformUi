const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
    console.error('❌ Arquivo .env não encontrado!');
    process.exit(1);
}

let content = fs.readFileSync(envPath, 'utf8');

// Função para extrair valor de uma chave
const getValue = (key) => {
    const match = content.match(new RegExp(`${key}="?([^"\\n]+)"?`));
    return match ? match[1] : null;
};

const dbUrl = getValue('DATABASE_URL');
const directUrl = getValue('DIRECT_URL');

if (!dbUrl) {
    console.error('❌ DATABASE_URL não encontrada!');
    process.exit(1);
}

let newDbUrl = dbUrl;
let newDirectUrl = directUrl || dbUrl; // Se não tiver direct, usa a db como base

// 1. Corrigir DATABASE_URL (Connection Pooler)
// Se usa porta 6543 (comum no Supabase Pooler) e não tem pgbouncer=true
if (newDbUrl.includes(':6543') && !newDbUrl.includes('pgbouncer=true')) {
    const separator = newDbUrl.includes('?') ? '&' : '?';
    newDbUrl = `${newDbUrl}${separator}pgbouncer=true`;
    console.log('✅ Adicionado pgbouncer=true na DATABASE_URL');
}

// 2. Corrigir DIRECT_URL (Conexão Direta)
// Se a DIRECT_URL estiver usando porta 6543, mudar para 5432 (padrão Postrges direto)
if (newDirectUrl.includes(':6543')) {
    newDirectUrl = newDirectUrl.replace(':6543', ':5432');
    // Remover pgbouncer=true da direct url se tiver (pois direct não usa pooler transaction mode da mesma forma)
    newDirectUrl = newDirectUrl.replace(/[?&]pgbouncer=true/, '');
    // Limpar ? ou & soltos no final se sobrar
    if (newDirectUrl.endsWith('?') || newDirectUrl.endsWith('&')) {
        newDirectUrl = newDirectUrl.slice(0, -1);
    }
    console.log('✅ Ajustada DIRECT_URL para porta 5432 (Conexão Direta)');
}

// Substituir no conteúdo
content = content.replace(`DATABASE_URL="${dbUrl}"`, `DATABASE_URL="${newDbUrl}"`);
if (directUrl) {
    content = content.replace(`DIRECT_URL="${directUrl}"`, `DIRECT_URL="${newDirectUrl}"`);
} else {
    // Se não tinha DIRECT_URL, adiciona
    content += `\nDIRECT_URL="${newDirectUrl}"`;
}

fs.writeFileSync(envPath, content);
console.log('🎉 Arquivo .env corrigido com sucesso!');
console.log('DATABASE_URL agora tem pgbouncer=true (se necessário)');
console.log('DIRECT_URL agora aponta para porta 5432');
