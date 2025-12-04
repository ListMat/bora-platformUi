# 🚀 Próximos Passos - BORA MVP

O projeto BORA MVP foi criado com sucesso! Aqui estão os próximos passos para colocar em produção.

## ✅ O que foi criado

### 📦 Monorepo Turborepo

- ✅ Estrutura completa de packages e apps
- ✅ Configuração de build cache e pipeline
- ✅ ESLint, Prettier, TypeScript configurados
- ✅ Husky + lint-staged para pre-commit hooks

### 🎨 Design System (@bora/ui)

- ✅ Tokens BORA (verde #00C853, laranja #FF6D00)
- ✅ Componentes shadcn/ui base (Button, Card, Input, Dialog, Label)
- ✅ Tailwind CSS configurado

### 🗄️ Backend (@bora/db + @bora/api)

- ✅ Prisma schema completo com todas as entidades
- ✅ tRPC routers (user, lesson, instructor, payment)
- ✅ Middlewares de autenticação e autorização
- ✅ Zod validation em todas as procedures

### 🔐 Autenticação (@bora/auth)

- ✅ NextAuth configurado (Credentials + Google OAuth)
- ✅ Suporte para JWT (mobile)

### 🌐 Web Apps

- ✅ **web-admin**: Painel administrativo com dashboard
- ✅ **web-site**: Landing page institucional

### 📱 Mobile Apps

- ✅ **app-aluno**: App do aluno com bottom tabs
- ✅ **app-instrutor**: App do instrutor com tabs de agenda/financeiro

### 🔄 CI/CD

- ✅ GitHub Actions para lint, type-check, test e build
- ✅ Deploy automático web (Vercel)
- ✅ Deploy automático mobile (Expo EAS)

### 📚 Documentação

- ✅ README.md completo
- ✅ CONTRIBUTING.md
- ✅ docs/SETUP.md
- ✅ docs/ARCHITECTURE.md
- ✅ docs/API.md

## 🔧 Setup Inicial (Faça Agora)

### 1. Instalar Dependências

```bash
pnpm install
```

### 2. Configurar Ambiente

```bash
cp .env.example .env
```

Edite `.env` e preencha:

**Supabase:**

- `DATABASE_URL`
- `DIRECT_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`

**NextAuth:**

- `NEXTAUTH_SECRET` (gere com `openssl rand -base64 32`)
- `NEXTAUTH_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

**Stripe:**

- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

### 3. Setup do Banco de Dados

```bash
cd packages/db
pnpm prisma generate
pnpm prisma db push
```

### 4. Rodar em Desenvolvimento

```bash
# Voltar para raiz
cd ../..

# Rodar todos os apps
pnpm dev
```

**Portas:**

- Web Admin: http://localhost:3000
- Web Site: http://localhost:3001

**Mobile:**

```bash
# Terminal separado para app aluno
cd apps/app-aluno
pnpm start

# Terminal separado para app instrutor
cd apps/app-instrutor
pnpm start
```

## 🎯 Features Prioritárias (Semanas 1-4)

### Semana 1: Infraestrutura

- [ ] Popular banco com seed (admin, instrutores, alunos de teste)
- [ ] Configurar Stripe webhooks local (`stripe listen`)
- [ ] Testar fluxo completo de autenticação
- [ ] Configurar storage do Supabase (buckets para CNH, fotos)

### Semana 2: Admin Panel

- [ ] Implementar páginas de Usuários, Instrutores, Aulas
- [ ] Dashboard com métricas reais (GMV, aulas ativas)
- [ ] Painel de aprovação de instrutores
- [ ] Exportação de relatórios (CSV)

### Semana 3: App Aluno

- [ ] Integrar mapa real (React Native Maps + Geolocalização)
- [ ] Implementar busca de instrutores
- [ ] Fluxo completo de agendamento
- [ ] Integração de pagamento (Stripe + PIX)
- [ ] Tela de avaliação pós-aula

### Semana 4: App Instrutor

- [ ] Calendário de disponibilidade
- [ ] Aceite/recusa de corridas
- [ ] Navegação em tempo real (Waze/Maps)
- [ ] Dashboard financeiro (receita, saldo)
- [ ] Upload de documentos (CNH, credencial)

## 🧪 Testes (Pós-MVP)

### Setup de Testes

```bash
# Instalar Vitest
pnpm add -D vitest @vitest/ui -w

# Instalar Playwright (E2E)
pnpm add -D @playwright/test -w
```

### Criar Testes

1. **Unitários**: `packages/api/src/routers/__tests__/user.test.ts`
2. **Integração**: `apps/web-admin/__tests__/auth.test.ts`
3. **E2E**: `e2e/lesson-flow.spec.ts`

## 🚢 Deploy em Produção

### Vercel (Web Apps)

```bash
# Instalar Vercel CLI
pnpm add -g vercel

# Deploy web-admin
cd apps/web-admin
vercel --prod

# Deploy web-site
cd ../web-site
vercel --prod
```

Configure secrets no Vercel dashboard.

### Expo EAS (Mobile Apps)

```bash
# Instalar EAS CLI
pnpm add -g eas-cli

# Login
eas login

# Configurar projeto
cd apps/app-aluno
eas build:configure

# Build produção
eas build --platform all --profile production

# Submit para stores
eas submit --platform all
```

### GitHub Secrets

Configure no repositório (Settings > Secrets):

**Vercel:**

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID_ADMIN`
- `VERCEL_PROJECT_ID_SITE`

**Expo:**

- `EXPO_TOKEN`

**Variáveis de Ambiente:**

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `STRIPE_SECRET_KEY`
- etc.

## 🔐 Segurança (Crítico antes de lançar)

- [ ] Implementar rate limiting (Upstash Redis)
- [ ] Criptografia AES-256 para documentos CNH
- [ ] Configurar CSP headers no Next.js
- [ ] Audit de segurança no código
- [ ] Compliance LGPD (revisar logs, endpoint de exclusão)
- [ ] Penetration testing

## 📊 Analytics & Monitoring

### Setup Recomendado

1. **Vercel Analytics** (já incluso)
2. **PostHog** (analytics + feature flags)
3. **Sentry** (error tracking)
4. **LogRocket** (session replay)
5. **Grafana Cloud** (metrics + traces)

## 💰 Integrações Adicionais

### Stripe PIX (Brasil)

```bash
# Ativar PIX no dashboard Stripe BR
# Configurar webhook para eventos pix.*
```

### Notificações Push

```bash
pnpm add expo-notifications

# Configurar FCM (Android) + APNS (iOS)
```

### Mapas em Tempo Real

```bash
pnpm add @pusher/pusher-js pusher

# Ou WebSocket nativo
```

### OCR de CNH

```bash
pnpm add @google-cloud/vision

# Ou AWS Textract
```

## 📈 Escalabilidade (Pós-lançamento)

### Otimizações de Performance

- [ ] Implementar Redis cache para queries frequentes
- [ ] CDN para assets estáticos (Cloudflare)
- [ ] Image optimization (next/image + Cloudinary)
- [ ] Database connection pooling (PgBouncer - Supabase já tem)

### Arquitetura de Microserviços (Opcional)

Se GMV > R$ 1M/mês:

- [ ] Separar payment service
- [ ] Queue de processamento (BullMQ)
- [ ] API Gateway (Kong)

## 🎓 Recursos de Aprendizado

- [Turborepo Handbook](https://turbo.build/repo/docs/handbook)
- [tRPC Best Practices](https://trpc.io/docs/server/best-practices)
- [Next.js 15 Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading)
- [Expo Router Tutorial](https://docs.expo.dev/router/introduction/)

## 🐛 Troubleshooting Comum

### Erro de Build no Turborepo

```bash
rm -rf node_modules .turbo
pnpm install
pnpm build
```

### Erro no Prisma

```bash
cd packages/db
pnpm prisma generate
pnpm prisma db push --force-reset
```

### Erro no Expo

```bash
cd apps/app-aluno
rm -rf node_modules .expo
pnpm install
pnpm start --clear
```

## 🎉 Checklist de Lançamento

- [ ] Ambiente de dev rodando 100%
- [ ] Todas as variáveis de ambiente configuradas
- [ ] Banco populado com dados de seed
- [ ] Testes E2E passando
- [ ] Deploy em staging funcionando
- [ ] Security audit completo
- [ ] LGPD compliance verificado
- [ ] Performance benchmarks ok (<2s TTFB)
- [ ] Mobile apps testados em devices reais
- [ ] Documentação atualizada
- [ ] Plano de rollback definido
- [ ] Suporte 24/7 configurado
- [ ] Marketing preparado (landing page, SEO)

## 📞 Suporte

Para dúvidas, abra uma issue no GitHub ou contate a equipe:

- Email: dev@bora.com
- Slack: #bora-dev

---

**Boa sorte com o lançamento do BORA! 🚗💨**
