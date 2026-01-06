-- Atualizar instrutores sem localização para o centro de São Paulo (Temporário para testes)
UPDATE "instructors"
SET latitude = -23.550520, longitude = -46.633308
WHERE (latitude IS NULL OR longitude IS NULL) AND status = 'ACTIVE';

-- Garantir que está online também
UPDATE "instructors"
SET "isOnline" = true
WHERE status = 'ACTIVE' AND "isOnline" = false;
