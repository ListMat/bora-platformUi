# 🔐 Guia de Configuração do .env

Arquivo `.env` criado! Agora você precisa configurar as credenciais.

## 📋 Checklist de Configuração

### ✅ 1. DATABASE (PostgreSQL) - OBRIGATÓRIO

**Opção A: PostgreSQL Local**
```env
DATABASE_URL="postgresql://postgres:NovaSenhaForte123!@localhost:5432/bora_db"
DIRECT_URL="postgresql://postgres:NovaSenhaForte123!@localhost:5432/bora_db"

```

**Opção B: Supabase Database (Recomendado)**
1. Acesse: https://supabase.com
2. Crie um projeto
3. Vá em: Settings > Database
4. Copie a "Connection String" para `DATABASE_URL`

---

### ✅ 2. NEXTAUTH - OBRIGATÓRIO

Gere um secret seguro:

**Windows PowerShell:**
```powershell
# Gerar string aleatória
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

Cole o resultado em:
```env
NEXTAUTH_SECRET="resultado-aqui"
```

---

### ✅ 3. SUPABASE - OBRIGATÓRIO

1. Acesse: https://supabase.com
2. Crie um projeto (ou use o mesmo do banco)
3. Vá em: Settings > API
4. Copie:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` (secret) → `SUPABASE_SERVICE_ROLE_KEY`

**Criar Buckets (Storage):**
```sql
-- No SQL Editor do Supabase, execute:

-- Bucket para fotos de perfil
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true);

-- Bucket para documentos de instrutores
INSERT INTO storage.buckets (id, name, public)
VALUES ('instructor-documents', 'instructor-documents', false);

-- Bucket para fotos de veículos
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-photos', 'vehicle-photos', true);

-- Bucket para chat
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-media', 'chat-media', false);
```

---

### ✅ 4. MAPBOX - OBRIGATÓRIO

1. Acesse: https://account.mapbox.com/
2. Crie uma conta (gratuito até 50k requisições/mês)
3. Vá em: Access Tokens
4. Copie o "Default public token" ou crie um novo
5. Cole em:
   ```env
   MAPBOX_TOKEN="pk.eyJ1..."
   EXPO_PUBLIC_MAPBOX_TOKEN="pk.eyJ1..."
   ```

---

### ✅ 5. STRIPE - OBRIGATÓRIO

1. Acesse: https://dashboard.stripe.com
2. Crie uma conta
3. Vá em: Developers > API Keys
4. Use as chaves de **TESTE** (começam com `sk_test_` e `pk_test_`)
5. Copie:
   - `Secret key` → `STRIPE_SECRET_KEY`
   - `Publishable key` → `STRIPE_PUBLISHABLE_KEY` e `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Configurar Webhook (opcional, para produção):**
1. Developers > Webhooks
2. Add endpoint: `https://seu-dominio.com/api/webhooks/stripe`
3. Copie o `Signing secret` → `STRIPE_WEBHOOK_SECRET`

---

### ⚠️ 6. PUSHER - OPCIONAL (Chat em tempo real)

**Se quiser chat em tempo real:**

1. Acesse: https://pusher.com
2. Crie uma conta (gratuito até 200k mensagens/dia)
3. Create Channels App
4. Copie as credenciais:
   - `app_id` → `PUSHER_APP_ID`
   - `key` → `PUSHER_KEY` e `EXPO_PUBLIC_PUSHER_KEY`
   - `secret` → `PUSHER_SECRET`
   - `cluster` → `PUSHER_CLUSTER` e `EXPO_PUBLIC_PUSHER_CLUSTER`

**Se NÃO quiser por enquanto:**
- Deixe os valores padrão
- O chat funcionará sem tempo real (apenas ao recarregar)

---

### ⚠️ 7. UPSTASH REDIS - OPCIONAL (Rate Limiting)

**Se quiser rate limiting (proteção contra spam):**

1. Acesse: https://upstash.com
2. Crie um database Redis (gratuito até 10k comandos/dia)
3. Copie:
   - `REST URL` → `UPSTASH_REDIS_REST_URL`
   - `REST Token` → `UPSTASH_REDIS_REST_TOKEN`

**Se NÃO quiser por enquanto:**
- Deixe os valores padrão
- O sistema funcionará sem rate limiting

---

## 🎯 Configuração Mínima para Rodar

Para testar localmente, você precisa **no mínimo**:

```env
# 1. Database (use Supabase ou PostgreSQL local)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# 2. NextAuth (gere um secret)
NEXTAUTH_SECRET="string-aleatoria"
NEXTAUTH_URL="http://localhost:3000"

# 3. Supabase (para storage)
NEXT_PUBLIC_SUPABASE_URL="https://..."
SUPABASE_SERVICE_ROLE_KEY="..."
EXPO_PUBLIC_SUPABASE_ANON_KEY="..."

# 4. Mapbox (para mapas)
EXPO_PUBLIC_MAPBOX_TOKEN="pk.eyJ1..."

# 5. URLs
EXPO_PUBLIC_API_URL="http://localhost:3000/api/trpc"
```

---

## ✅ Verificar Configuração

Após configurar o `.env`, execute:

```powershell
# 1. Gerar Prisma Client
cd packages/db
npx prisma generate
npx prisma migrate dev
cd ../..

# 2. Verificar se as variáveis estão carregando
cd apps/web-admin
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL ? 'OK' : 'ERRO')"
```

---

## 🔒 Segurança

- ✅ `.env` está no `.gitignore` (não será commitado)
- ✅ Use sempre chaves de **TESTE** em desenvolvimento
- ✅ Para produção, use variáveis de ambiente do serviço de hosting
- ❌ NUNCA commite o `.env` com credenciais reais
- ❌ NUNCA exponha o `SUPABASE_SERVICE_ROLE_KEY` no frontend

---

## 🆘 Troubleshooting

**Erro: "DATABASE_URL is not defined"**
- Verifique se o arquivo `.env` está na **raiz do projeto**
- Reinicie o terminal/servidor

**Erro: "Invalid Mapbox token"**
- Verifique se copiou o token completo
- Token deve começar com `pk.`

**Erro: "Supabase storage not found"**
- Crie os buckets no Supabase (SQL acima)

---

## 📞 Próximos Passos

Após configurar o `.env`:

1. Execute: `.\start-all.ps1`
2. Siga as instruções para iniciar os 3 terminais
3. Teste as novas features UX/UI!

**Documentação completa**: `START_PROJECT.md`

