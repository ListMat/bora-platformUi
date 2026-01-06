-- SQL Inteligente para Popular Dados sem erros de duplicidade
-- Executar no Query Editor do Supabase

-- 1. Criar/Atualizar Usuários
INSERT INTO "users" (id, email, name, role, "emailVerified", "createdAt", "updatedAt")
VALUES 
  (gen_random_uuid(), 'carlos@bora.com', 'Carlos Silva', 'INSTRUCTOR', NOW(), NOW(), NOW()),
  (gen_random_uuid(), 'ana@bora.com', 'Ana Souza', 'INSTRUCTOR', NOW(), NOW(), NOW()),
  (gen_random_uuid(), 'roberto@bora.com', 'Roberto Oliveira', 'INSTRUCTOR', NOW(), NOW(), NOW()),
  (gen_random_uuid(), 'mariana@bora.com', 'Mariana Costa', 'INSTRUCTOR', NOW(), NOW(), NOW()),
  (gen_random_uuid(), 'tiradentes@bora.com', 'Instrutor Tiradentes', 'INSTRUCTOR', NOW(), NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET role = 'INSTRUCTOR';

-- 2. Criar/Atualizar Instrutores (Busca userId pelo email, e usa CPF como chave única)
-- Carlos
INSERT INTO "instructors" (id, "userId", cpf, "cnhNumber", "credentialNumber", city, state, "basePrice", latitude, longitude, status, "isAvailable", "isOnline", bio, "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    (SELECT id FROM "users" WHERE email = 'carlos@bora.com'),
    '11122233344', '11122233344', '1001', 'São Paulo', 'SP', 60.00, -23.550520, -46.633308, 'ACTIVE', true, true, 'Instrutor experiente com foco em direção defensiva.', NOW(), NOW()
) ON CONFLICT (cpf) DO UPDATE SET "userId" = EXCLUDED."userId", status = 'ACTIVE', "isOnline" = true, latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude;

-- Ana
INSERT INTO "instructors" (id, "userId", cpf, "cnhNumber", "credentialNumber", city, state, "basePrice", latitude, longitude, status, "isAvailable", "isOnline", bio, "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    (SELECT id FROM "users" WHERE email = 'ana@bora.com'),
    '22233344455', '22233344455', '1002', 'São Paulo', 'SP', 85.00, -23.5615, -46.6559, 'ACTIVE', true, true, 'Aulas personalizadas para habilitados com medo de dirigir.', NOW(), NOW()
) ON CONFLICT (cpf) DO UPDATE SET "userId" = EXCLUDED."userId", status = 'ACTIVE', "isOnline" = true, latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude;

-- Roberto
INSERT INTO "instructors" (id, "userId", cpf, "cnhNumber", "credentialNumber", city, state, "basePrice", latitude, longitude, status, "isAvailable", "isOnline", bio, "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    (SELECT id FROM "users" WHERE email = 'roberto@bora.com'),
    '33344455566', '33344455566', '1003', 'São Paulo', 'SP', 70.00, -23.5986, -46.6766, 'ACTIVE', true, true, 'Paciência e didática para quem está começando.', NOW(), NOW()
) ON CONFLICT (cpf) DO UPDATE SET "userId" = EXCLUDED."userId", status = 'ACTIVE', "isOnline" = true, latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude;

-- Mariana
INSERT INTO "instructors" (id, "userId", cpf, "cnhNumber", "credentialNumber", city, state, "basePrice", latitude, longitude, status, "isAvailable", "isOnline", bio, "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    (SELECT id FROM "users" WHERE email = 'mariana@bora.com'),
    '44455566677', '44455566677', '1004', 'Osasco', 'SP', 55.00, -23.5329, -46.7917, 'ACTIVE', true, true, 'Instrutora credenciada pelo DETRAN há 10 anos.', NOW(), NOW()
) ON CONFLICT (cpf) DO UPDATE SET "userId" = EXCLUDED."userId", status = 'ACTIVE', "isOnline" = true, latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude;

-- Tiradentes
INSERT INTO "instructors" (id, "userId", cpf, "cnhNumber", "credentialNumber", city, state, "basePrice", latitude, longitude, status, "isAvailable", "isOnline", bio, "createdAt", "updatedAt")
VALUES (
    gen_random_uuid(),
    (SELECT id FROM "users" WHERE email = 'tiradentes@bora.com'),
    '55566677788', '55566677788', '1005', 'Tiradentes', 'MG', 50.00, -21.1102, -44.1731, 'ACTIVE', true, true, 'Aulas práticas em Tiradentes e região.', NOW(), NOW()
) ON CONFLICT (cpf) DO UPDATE SET "userId" = EXCLUDED."userId", status = 'ACTIVE', "isOnline" = true, latitude = EXCLUDED.latitude, longitude = EXCLUDED.longitude;


-- 3. Vehicles (Evitar duplicidade verificando placa)
-- Carlos HB20
INSERT INTO "vehicles" (id, "userId", brand, model, year, color, "plateLastFour", category, transmission, fuel, engine, status, "photoUrl", "photos", "hasDualPedal", "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Hyundai', 'HB20', 2021, 'Branco', '1234', 'HATCH', 'MANUAL', 'FLEX', '1.0', 'active', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?fit=crop&w=400&h=300', ARRAY['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?fit=crop&w=400&h=300'], true, NOW(), NOW()
FROM "users" WHERE email = 'carlos@bora.com'
AND NOT EXISTS (SELECT 1 FROM "vehicles" v JOIN "users" u ON v."userId" = u.id WHERE u.email = 'carlos@bora.com' AND v."plateLastFour" = '1234');

-- Ana Civic
INSERT INTO "vehicles" (id, "userId", brand, model, year, color, "plateLastFour", category, transmission, fuel, engine, status, "photoUrl", "photos", "hasDualPedal", "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Honda', 'Civic', 2020, 'Prata', '9876', 'SEDAN', 'AUTOMATICO', 'FLEX', '2.0', 'active', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?fit=crop&w=400&h=300', ARRAY['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?fit=crop&w=400&h=300'], true, NOW(), NOW()
FROM "users" WHERE email = 'ana@bora.com'
AND NOT EXISTS (SELECT 1 FROM "vehicles" v JOIN "users" u ON v."userId" = u.id WHERE u.email = 'ana@bora.com' AND v."plateLastFour" = '9876');

-- Roberto Onix
INSERT INTO "vehicles" (id, "userId", brand, model, year, color, "plateLastFour", category, transmission, fuel, engine, status, "photoUrl", "photos", "hasDualPedal", "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Chevrolet', 'Onix', 2022, 'Vermelho', '4567', 'HATCH', 'MANUAL', 'FLEX', '1.0 Turbo', 'active', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?fit=crop&w=400&h=300', ARRAY['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?fit=crop&w=400&h=300'], true, NOW(), NOW()
FROM "users" WHERE email = 'roberto@bora.com'
AND NOT EXISTS (SELECT 1 FROM "vehicles" v JOIN "users" u ON v."userId" = u.id WHERE u.email = 'roberto@bora.com' AND v."plateLastFour" = '4567');

-- Mariana Ford Ka
INSERT INTO "vehicles" (id, "userId", brand, model, year, color, "plateLastFour", category, transmission, fuel, engine, status, "photoUrl", "photos", "hasDualPedal", "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'Ford', 'Ka', 2019, 'Branco', '9012', 'HATCH', 'MANUAL', 'FLEX', '1.0', 'active', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?fit=crop&w=400&h=300', ARRAY['https://images.unsplash.com/photo-1502877338535-766e1452684a?fit=crop&w=400&h=300'], true, NOW(), NOW()
FROM "users" WHERE email = 'mariana@bora.com'
AND NOT EXISTS (SELECT 1 FROM "vehicles" v JOIN "users" u ON v."userId" = u.id WHERE u.email = 'mariana@bora.com' AND v."plateLastFour" = '9012');

-- Tiradentes Gol
INSERT INTO "vehicles" (id, "userId", brand, model, year, color, "plateLastFour", category, transmission, fuel, engine, status, "photoUrl", "photos", "hasDualPedal", "createdAt", "updatedAt")
SELECT gen_random_uuid(), id, 'VW', 'Gol', 2018, 'Branco', '2020', 'HATCH', 'MANUAL', 'FLEX', '1.6', 'active', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?fit=crop&w=400&h=300', ARRAY['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?fit=crop&w=400&h=300'], true, NOW(), NOW()
FROM "users" WHERE email = 'tiradentes@bora.com'
AND NOT EXISTS (SELECT 1 FROM "vehicles" v JOIN "users" u ON v."userId" = u.id WHERE u.email = 'tiradentes@bora.com' AND v."plateLastFour" = '2020');


-- 4. Disponibilidade (Insere se não existir)
-- Usar INSERT IGNORE style com ON CONFLICT (se houver chave).
-- InstructorAvailability não tem chave única composta (id é pk).
-- Vou deletar disponibilidade anterior desses instrutores para resetar.
DELETE FROM "instructor_availability" WHERE "instructorId" IN (
    SELECT i.id FROM "instructors" i JOIN "users" u ON i."userId" = u.id WHERE u.email IN ('carlos@bora.com', 'ana@bora.com', 'roberto@bora.com', 'mariana@bora.com', 'tiradentes@bora.com')
);

INSERT INTO "instructor_availability" ("id", "instructorId", "dayOfWeek", "startTime", "endTime")
SELECT gen_random_uuid(), i.id, d.day, '08:00', '18:00'
FROM "instructors" i
JOIN "users" u ON i."userId" = u.id
CROSS JOIN (VALUES (1),(2),(3),(4),(5)) AS d(day)
WHERE u.email IN ('carlos@bora.com', 'ana@bora.com', 'roberto@bora.com', 'mariana@bora.com', 'tiradentes@bora.com');
