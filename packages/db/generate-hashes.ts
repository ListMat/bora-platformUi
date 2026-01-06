import bcrypt from 'bcryptjs';

async function generateHashes() {
    console.log('🔐 Gerando hashes de senhas...\n');

    const passwords = {
        'admin123': await bcrypt.hash('admin123', 10),
        'instrutor123': await bcrypt.hash('instrutor123', 10),
        'aluno123': await bcrypt.hash('aluno123', 10),
    };

    console.log('Copie estes hashes para o SQL:\n');
    console.log(`Admin (admin123):`);
    console.log(`  ${passwords['admin123']}\n`);
    console.log(`Instrutor (instrutor123):`);
    console.log(`  ${passwords['instrutor123']}\n`);
    console.log(`Aluno (aluno123):`);
    console.log(`  ${passwords['aluno123']}\n`);

    // SQL pronto para copiar
    console.log('\n📋 SQL COMPLETO PARA COPIAR:\n');
    console.log(`-- Criar usuários de teste

-- 1. Admin
INSERT INTO "public"."users" (id, email, name, password, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'admin-001',
  'admin@bora.com',
  'Admin Bora',
  '${passwords['admin123']}',
  'ADMIN',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- 2. Instrutor João Silva  
INSERT INTO "public"."users" (id, email, name, password, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'user-instructor-001',
  'joao.silva@bora.com',
  'João Silva',
  '${passwords['instrutor123']}',
  'INSTRUCTOR',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- 3. Aluno Ana Costa
INSERT INTO "public"."users" (id, email, name, password, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'user-student-001',
  'ana.costa@bora.com',
  'Ana Costa',
  '${passwords['aluno123']}',
  'STUDENT',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;`);
}

generateHashes();
