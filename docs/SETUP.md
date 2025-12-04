# 🛠️ Setup Completo - BORA

Guia passo a passo para configurar o ambiente de desenvolvimento.

## 1️⃣ Instalar Dependências

### Node.js e pnpm

```bash
# Instalar Node.js 18+ via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Instalar pnpm
npm install -g pnpm@8
```

### Clone do Repositório

```bash
git clone https://github.com/seu-usuario/bora.git
cd bora
pnpm install
```

## 2️⃣ Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. No painel, vá em **Settings > Database**
3. Copie a **Connection String** (modo direto e pooler)
4. No arquivo `.env`:

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

5. Rode as migrations:

```bash
cd packages/db
pnpm prisma generate
pnpm prisma db push
```

## 3️⃣ Configurar NextAuth

### Google OAuth

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um projeto
3. Vá em **APIs & Services > Credentials**
4. Crie **OAuth 2.0 Client ID**
5. Configure **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://seu-dominio.com/api/auth/callback/google`
6. No arquivo `.env`:

```env
GOOGLE_CLIENT_ID="seu-client-id"
GOOGLE_CLIENT_SECRET="seu-client-secret"
```

### NextAuth Secret

```bash
openssl rand -base64 32
```

```env
NEXTAUTH_SECRET="<output do comando acima>"
NEXTAUTH_URL="http://localhost:3000"
```

## 4️⃣ Configurar Stripe

1. Acesse [dashboard.stripe.com](https://dashboard.stripe.com)
2. Ative o **Test Mode**
3. Vá em **Developers > API keys**
4. Copie as chaves:

```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

5. Configure webhook local (opcional):

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copie o webhook secret:

```env
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### PIX no Stripe (Brasil)

1. Ative o PIX no dashboard do Stripe Brasil
2. Configure webhook para eventos de PIX

## 5️⃣ Configurar Supabase Storage

1. No painel do Supabase, vá em **Storage**
2. Crie buckets:
   - `cnh-documents` (private)
   - `credentials` (private)
   - `profile-images` (public)
3. Configure policies de RLS conforme necessário
4. No arquivo `.env`:

```env
SUPABASE_URL="https://seu-projeto.supabase.co"
SUPABASE_ANON_KEY="sua-anon-key"
SUPABASE_SERVICE_KEY="sua-service-key"
```

## 6️⃣ Configurar Rate Limiting (Opcional)

### Upstash Redis

1. Acesse [upstash.com](https://upstash.com)
2. Crie um database Redis
3. Copie as credenciais REST:

```env
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

## 7️⃣ Rodar o Projeto

### Web Apps

```bash
# Web Admin (porta 3000)
pnpm --filter web-admin dev

# Web Site (porta 3001)
pnpm --filter web-site dev

# Ou rodar todos juntos
pnpm dev
```

### Mobile Apps

```bash
# App Aluno
cd apps/app-aluno
pnpm start

# App Instrutor
cd apps/app-instrutor
pnpm start
```

## 8️⃣ Popular Banco de Dados (Seed)

Crie um arquivo `packages/db/prisma/seed.ts`:

```typescript
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Criar admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@bora.com",
      name: "Admin BORA",
      role: UserRole.ADMIN,
    },
  });

  console.log("Admin criado:", admin);

  // Criar instrutor de teste
  const instructor = await prisma.user.create({
    data: {
      email: "instrutor@bora.com",
      name: "João Silva",
      role: UserRole.INSTRUCTOR,
      instructor: {
        create: {
          cpf: "12345678900",
          cnhNumber: "12345678900",
          credentialNumber: "CRED-12345",
          credentialExpiry: new Date("2025-12-31"),
          city: "São Paulo",
          state: "SP",
          basePrice: 100,
          status: "ACTIVE",
          isAvailable: true,
        },
      },
    },
  });

  console.log("Instrutor criado:", instructor);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Rode:

```bash
cd packages/db
pnpm prisma db seed
```

## 9️⃣ Verificar Instalação

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Build
pnpm build
```

## 🎉 Pronto!

Acesse:

- Web Admin: http://localhost:3000
- Web Site: http://localhost:3001
- Apps Mobile: Expo Go no celular

## 🐛 Troubleshooting

### Erro de conexão com banco

- Verifique se as credenciais do Supabase estão corretas
- Teste a conexão direta (DIRECT_URL)

### Erro no Prisma

```bash
cd packages/db
pnpm prisma generate
pnpm prisma db push --force-reset
```

### Erro no Next.js

```bash
rm -rf .next
pnpm dev
```

### Erro no Expo

```bash
cd apps/app-aluno
rm -rf node_modules .expo
pnpm install
pnpm start --clear
```
