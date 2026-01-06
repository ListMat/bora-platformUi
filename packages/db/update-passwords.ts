import bcrypt from 'bcryptjs';

async function generateNewHashes() {
    console.log('🔐 Gerando novos hashes de senhas...\n');

    const passwords = {
        'admin': await bcrypt.hash('admin', 10),
        'instrutor': await bcrypt.hash('instrutor', 10),
        'aluno': await bcrypt.hash('aluno', 10),
    };

    console.log('Novas senhas:\n');
    console.log(`Admin: admin`);
    console.log(`  Hash: ${passwords['admin']}\n`);
    console.log(`Instrutor: instrutor`);
    console.log(`  Hash: ${passwords['instrutor']}\n`);
    console.log(`Aluno: aluno`);
    console.log(`  Hash: ${passwords['aluno']}\n`);

    // SQL pronto para copiar
    console.log('\n📋 SQL PARA ATUALIZAR NO SUPABASE:\n');
    console.log(`-- Atualizar senhas dos usuários

-- Admin: admin
UPDATE "public"."users" 
SET "password" = '${passwords['admin']}'
WHERE email = 'admin@bora.com';

-- Instrutor: instrutor
UPDATE "public"."users" 
SET "password" = '${passwords['instrutor']}'
WHERE email = 'joao.silva@bora.com';

-- Aluno: aluno
UPDATE "public"."users" 
SET "password" = '${passwords['aluno']}'
WHERE email = 'ana.costa@bora.com';`);
}

generateNewHashes();
