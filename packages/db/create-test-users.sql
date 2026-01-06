-- Criar usuários de teste no Supabase

-- 1. Admin
INSERT INTO "public"."users" (id, email, name, password, role, "emailVerified", "createdAt", "updatedAt")
VALUES (
  'admin-001',
  'admin@bora.com',
  'Admin Bora',
  '$2a$10$YourHashedPasswordHere',  -- Você precisa gerar o hash
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
  '$2a$10$YourHashedPasswordHere',  -- Você precisa gerar o hash
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
  '$2a$10$YourHashedPasswordHere',  -- Você precisa gerar o hash
  'STUDENT',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- NOTA: Você precisa gerar os hashes das senhas usando bcrypt
-- Senha: instrutor123 -> Hash: $2a$10$...
-- Senha: aluno123 -> Hash: $2a$10$...
-- Senha: admin123 -> Hash: $2a$10$...
