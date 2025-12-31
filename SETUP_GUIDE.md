# 🚀 Guia de Configuração - Plataforma BORA

Este guia completo irá te ajudar a configurar todas as integrações necessárias para colocar a plataforma BORA em produção.

---

## 📋 Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Supabase Storage](#supabase-storage)
3. [Stripe Connect](#stripe-connect)
4. [Notificações Push](#notificações-push)
5. [Mapbox](#mapbox)
6. [Variáveis de Ambiente](#variáveis-de-ambiente)
7. [Deploy](#deploy)

---

## 1. Pré-requisitos

### Contas Necessárias
- ✅ [Supabase](https://supabase.com) - Banco de dados + Storage
- ✅ [Stripe](https://stripe.com) - Pagamentos e Stripe Connect
- ✅ [Mapbox](https://mapbox.com) - Mapas
- ✅ [Expo](https://expo.dev) - Push Notifications

### Ferramentas
```bash
node >= 18.x
pnpm >= 8.x
expo-cli
```

---

## 2. Supabase Storage

### 2.1. Criar Buckets

Acesse seu projeto no Supabase → Storage → Create bucket

Crie os seguintes buckets **públicos**:

1. **profile-photos**
   - Public: ✅ Yes
   - File size limit: 5MB

2. **instructor-documents**
   - Public: ✅ Yes
   - File size limit: 10MB

3. **vehicle-photos**
   - Public: ✅ Yes
   - File size limit: 5MB

4. **receipts**
   - Public: ✅ Yes
   - File size limit: 10MB

### 2.2. Configurar Políticas de Acesso (RLS)

Execute no SQL Editor do Supabase:

```sql
-- Profile Photos
CREATE POLICY "Users can upload own profile photo"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Profile photos are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-photos');

-- Instructor Documents
CREATE POLICY "Instructors can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'instructor-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admin can view instructor documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'instructor-documents' AND
  (auth.jwt() ->> 'role' = 'ADMIN' OR 
   auth.uid()::text = (storage.foldername(name))[1])
);

-- Vehicle Photos
CREATE POLICY "Instructors can upload vehicle photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vehicle-photos');

CREATE POLICY "Vehicle photos are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'vehicle-photos');

-- Receipts
CREATE POLICY "Users can upload receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'receipts');

CREATE POLICY "Users can view own receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'receipts' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

### 2.3. Obter Credenciais

1. Acesse: Project Settings → API
2. Copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

---

## 3. Stripe Connect

### 3.1. Criar Conta Stripe

1. Acesse [Stripe Dashboard](https://dashboard.stripe.com)
2. Complete o cadastro da sua empresa
3. Ative o modo de produção (quando pronto)

### 3.2. Ativar Stripe Connect

1. Dashboard → **Connect** → Settings
2. **Platform profile**: Selecione "On-demand platform"
3. **Branding**: Configure logo e cores da BORA
4. **Payout timing**: "As soon as possible" (ou customizado)

### 3.3. Configurar Webhooks

**URL do Webhook:**
```
https://seu-dominio.com/api/webhooks/stripe
```

**Eventos a monitorar:**
- `account.updated`
- `transfer.created`
- `transfer.updated`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

### 3.4. Obter Credenciais

1. Dashboard → **Developers** → **API keys**
2. Copie:
   - **Publishable key** → `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY`
3. **Webhook signing secret** → `STRIPE_WEBHOOK_SECRET`

### 3.5. Taxa da Plataforma

A taxa padrão é **20%** configurada em:
```typescript
// packages/api/src/modules/stripeConnect.ts
const platformFeePercent = 20; // 20% de taxa
```

Para alterar, edite este valor.

---

## 4. Notificações Push

### 4.1. Criar Projeto no Expo

```bash
npx expo login
cd apps/app-aluno
npx eas init
```

### 4.2. Configurar FCM (Firebase Cloud Messaging) - Android

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Crie um projeto
3. Adicione app Android:
   - **Package name**: `com.bora.aluno`
   - Baixe `google-services.json`

4. No Firebase Console → Project Settings → Cloud Messaging
5. Copie **Server Key** → `FCM_SERVER_KEY`

6. Adicione ao `app.json`:
```json
{
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

### 4.3. Configurar APNS (Apple Push Notification) - iOS

1. Apple Developer → **Certificates, Identifiers & Profiles**
2. **Keys** → Create new key
3. Enable **Apple Push Notifications service (APNs)**
4. Download `.p8` file
5. Note o **Key ID** e **Team ID**

6. No Expo Dashboard → Project → Credentials
7. Upload `.p8` file e preencha Key ID e Team ID

### 4.4. Testar Notificações

Use o [Expo Push Notification Tool](https://expo.dev/notifications):

```json
{
  "to": "ExponentPushToken[xxxxxxxxxxxxxx]",
  "title": "Test",
  "body": "Hello from BORA!"
}
```

---

## 5. Mapbox

### 5.1. Criar Conta

1. Acesse [Mapbox](https://account.mapbox.com/)
2. Create account
3. Dashboard → **Access Tokens**

### 5.2. Criar Tokens

**Token Público:**
- Name: "BORA Public Token"
- Scopes: `styles:read`, `fonts:read`, `datasets:read`
- Copy → `EXPO_PUBLIC_MAPBOX_TOKEN`

**Token de Download (SDK):**
- Name: "BORA SDK Download"
- Scopes: `downloads:read`
- Copy → `MAPBOX_DOWNLOADS_TOKEN`

### 5.3. Configurar nos Apps

**apps/app-aluno/app.json:**
```json
{
  "expo": {
    "plugins": [
      [
        "@rnmapbox/maps",
        {
          "RNMapboxMapsDownloadToken": "SEU_MAPBOX_DOWNLOAD_TOKEN"
        }
      ]
    ]
  }
}
```

**apps/app-aluno/.env:**
```bash
EXPO_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
```

---

## 6. Variáveis de Ambiente

### 6.1. Backend (packages/api)

Crie `packages/api/.env`:

```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/bora"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Auth
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="https://seu-dominio.com"

# App URLs
NEXT_PUBLIC_APP_URL="https://seu-dominio.com"
APP_URL="exp://seu-app-aluno"
```

### 6.2. App Aluno (apps/app-aluno)

Crie `apps/app-aluno/.env`:

```bash
# API
EXPO_PUBLIC_API_URL="https://seu-dominio.com/api/trpc"

# Stripe
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Mapbox
EXPO_PUBLIC_MAPBOX_TOKEN="pk.eyJ1..."

# Supabase
EXPO_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 6.3. App Instrutor (apps/app-instrutor)

Crie `apps/app-instrutor/.env`:

```bash
# API
EXPO_PUBLIC_API_URL="https://seu-dominio.com/api/trpc"

# Mapbox
EXPO_PUBLIC_MAPBOX_TOKEN="pk.eyJ1..."

# Supabase
EXPO_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 6.4. Admin Panel (apps/web-admin)

Crie `apps/web-admin/.env.local`:

```bash
# API
NEXT_PUBLIC_API_URL="https://seu-dominio.com/api/trpc"

# Auth
NEXTAUTH_SECRET="same-as-backend"
NEXTAUTH_URL="https://admin.seu-dominio.com"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 7. Deploy

### 7.1. Backend (API)

**Opção 1: Vercel**
```bash
cd apps/api
vercel --prod
```

**Opção 2: Railway**
```bash
railway init
railway up
```

**Configurar Variáveis de Ambiente:**
- No dashboard do serviço escolhido
- Adicione todas as vars do `.env`

### 7.2. Admin Panel

```bash
cd apps/web-admin
pnpm build
vercel --prod
```

### 7.3. Apps Mobile

**Build Android (APK/AAB):**
```bash
cd apps/app-aluno
eas build --platform android --profile production
```

**Build iOS (IPA):**
```bash
cd apps/app-aluno
eas build --platform ios --profile production
```

**Publicar na Loja:**
```bash
# Google Play
eas submit --platform android

# App Store
eas submit --platform ios
```

---

## 8. Checklist Pré-Lançamento

### Backend
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Database em produção (Supabase/PostgreSQL)
- [ ] Stripe Connect ativado
- [ ] Webhooks do Stripe configurados
- [ ] Rate limiting testado
- [ ] Logs de debug removidos

### Supabase
- [ ] Todos os buckets criados
- [ ] Políticas RLS configuradas
- [ ] Backup automático ativado
- [ ] Limites de storage configurados

### Stripe
- [ ] Conta empresarial verificada
- [ ] Modo de produção ativado
- [ ] Taxa da plataforma configurada
- [ ] Webhooks testados
- [ ] Dashboard de instrutor funcionando

### Push Notifications
- [ ] FCM configurado (Android)
- [ ] APNS configurado (iOS)
- [ ] Tokens de teste verificados
- [ ] Permissões solicitadas corretamente

### Apps Mobile
- [ ] Builds de produção geradas
- [ ] Ícones e splash screens configurados
- [ ] Permissões declaradas (localização, notificações)
- [ ] Deep links funcionando
- [ ] App Store / Google Play Connect configurado

### Admin Panel
- [ ] Login funcionando
- [ ] Dashboard com métricas
- [ ] Gestão de emergências
- [ ] Aprovação de instrutores
- [ ] Logs de atividade

---

## 9. Monitoramento

### Recomendações de Serviços

**Application Monitoring:**
- [Sentry](https://sentry.io) - Rastreamento de erros
- [LogRocket](https://logrocket.com) - Session replay

**Analytics:**
- [Mixpanel](https://mixpanel.com) - Product analytics
- [PostHog](https://posthog.com) - Open-source analytics

**Uptime Monitoring:**
- [UptimeRobot](https://uptimerobot.com) - Free tier disponível
- [Better Uptime](https://betteruptime.com)

---

## 10. Suporte

### Documentação Oficial
- [Expo Docs](https://docs.expo.dev)
- [Stripe Connect Docs](https://stripe.com/docs/connect)
- [Supabase Docs](https://supabase.com/docs)
- [Mapbox Docs](https://docs.mapbox.com)

### Contato
- Email: dev@bora.com.br
- Discord: [BORA Dev Community](#)

---

**Última atualização:** 19 de Dezembro de 2025
**Versão:** 1.0.0

✅ **Setup completo! Sua plataforma BORA está pronta para o lançamento!** 🚀

