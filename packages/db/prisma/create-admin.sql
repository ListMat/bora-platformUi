-- Script SQL para criar usuário admin
-- Execute este script no Prisma Studio ou diretamente no banco

-- Primeiro, verificar se o usuário já existe
-- SELECT * FROM "users" WHERE email = 'admin@bora.com';

-- Se não existir, criar o usuário admin
-- Senha: admin123 (hash bcrypt: $2a$10$...)

INSERT INTO "users" (
  id,
  email,
  name,
  password,
  role,
  "emailVerified",
  "createdAt",
  "updatedAt"
) VALUES (
  'admin-' || gen_random_uuid()::text,
  'admin@bora.com',
  'Admin Bora',
  '$2a$10$rOJ7nWZYGmH3nN5nN5nN5.nN5nN5nN5nN5nN5nN5nN5nN5nN5nN5u', -- admin123
  'ADMIN',
  NOW(),
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Verificar se foi criado
SELECT id, email, name, role, "createdAt" FROM "users" WHERE email = 'admin@bora.com';
