import bcrypt from 'bcryptjs';

async function createNewTestUsers() {
    console.log('🔐 Gerando novas credenciais de teste...\n');

    const users = {
        admin: {
            email: 'admin@bora.app',
            password: 'bora2026',
            hash: await bcrypt.hash('bora2026', 10),
        },
        instructor: {
            email: 'carlos.mendes@bora.app',
            password: 'prof2026',
            hash: await bcrypt.hash('prof2026', 10),
        },
        student: {
            email: 'julia.santos@bora.app',
            password: 'aluna2026',
            hash: await bcrypt.hash('aluna2026', 10),
        },
    };

    console.log('📋 NOVAS CREDENCIAIS:\n');
    console.log('🔑 Admin:');
    console.log(`   Email: ${users.admin.email}`);
    console.log(`   Senha: ${users.admin.password}\n`);

    console.log('🚗 Instrutor:');
    console.log(`   Email: ${users.instructor.email}`);
    console.log(`   Senha: ${users.instructor.password}\n`);

    console.log('🎓 Aluno:');
    console.log(`   Email: ${users.student.email}`);
    console.log(`   Senha: ${users.student.password}\n`);

    console.log('\n📋 SQL PARA EXECUTAR NO SUPABASE:\n');
    console.log(`-- Criar novos usuários de teste

-- 1. Admin
INSERT INTO "public"."users" (id, email, name, password, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'admin-new-001',
  '${users.admin.email}',
  'Admin Bora',
  '${users.admin.hash}',
  'ADMIN',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password;

-- 2. Instrutor Carlos Mendes
INSERT INTO "public"."users" (id, email, name, password, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'instructor-new-001',
  '${users.instructor.email}',
  'Carlos Mendes',
  '${users.instructor.hash}',
  'INSTRUCTOR',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password;

-- 3. Aluna Julia Santos
INSERT INTO "public"."users" (id, email, name, password, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'student-new-001',
  '${users.student.email}',
  'Julia Santos',
  '${users.student.hash}',
  'STUDENT',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE 
SET password = EXCLUDED.password;`);
}

createNewTestUsers();
