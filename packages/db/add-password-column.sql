-- Adicionar coluna password à tabela users
ALTER TABLE "public"."users" 
ADD COLUMN IF NOT EXISTS "password" TEXT;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS "users_password_idx" ON "public"."users"("password");
