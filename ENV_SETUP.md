# Configuração de Variáveis de Ambiente

Este documento lista todas as variáveis de ambiente necessárias para rodar o projeto BORA.

## Raiz do Projeto (.env)

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```bash
# Database (Supabase)
DATABASE_URL="postgresql://user:password@host:5432/database?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL="https://your-upstash-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-token"

# Twilio (for SMS/Emergency alerts)
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## App Aluno (apps/app-aluno/.env)

Crie um arquivo `.env` em `apps/app-aluno/` com:

```bash
# Expo Project ID
EXPO_PUBLIC_PROJECT_ID="your-expo-project-id"

# API Configuration
EXPO_PUBLIC_API_URL="http://localhost:3000/api/trpc"

# Stripe Publishable Key
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"

# App Environment
EXPO_PUBLIC_ENV="development"
```

## App Instrutor (apps/app-instrutor/.env)

Crie um arquivo `.env` em `apps/app-instrutor/` com:

```bash
# Expo Project ID
EXPO_PUBLIC_PROJECT_ID="your-expo-project-id"

# API Configuration
EXPO_PUBLIC_API_URL="http://localhost:3000/api/trpc"

# App Environment
EXPO_PUBLIC_ENV="development"
```

## Como Gerar Credenciais

### NextAuth Secret
```bash
openssl rand -base64 32
```

### Supabase
1. Acesse https://supabase.com/dashboard
2. Crie um novo projeto
3. Copie a DATABASE_URL de Settings > Database
4. Copie SUPABASE_URL e SUPABASE_ANON_KEY de Settings > API

### Stripe
1. Acesse https://dashboard.stripe.com
2. Modo de teste: copie as chaves de API
3. Webhook: crie um endpoint em Developers > Webhooks

### Upstash Redis
1. Acesse https://upstash.com
2. Crie um banco Redis
3. Copie a REST URL e Token

### Expo
1. Execute `npx expo login`
2. Execute `eas init` em cada app mobile
3. Copie o Project ID do app.json
