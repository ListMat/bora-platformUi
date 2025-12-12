# BORA - Guia de Implementação das Melhorias Estratégicas

Este documento descreve as melhorias implementadas nas 3 fases do roadmap estratégico do BORA.

## 📋 Resumo das Implementações

### ✅ FASE 1: Monetização e Retenção (Implementada)

#### 1.1 Sistema de Pacotes de Aulas (Bundles)
- **Database**: Novos modelos `Bundle`, `BundlePurchase`, `BundlePayment`
- **API**: Router completo em `packages/api/src/routers/bundle.ts`
- **Mobile**: 
  - `apps/app-aluno/app/screens/bundles.tsx` - Listagem de pacotes
  - `apps/app-aluno/app/screens/bundlePayment.tsx` - Pagamento via Stripe
  - `apps/app-aluno/app/screens/myBundles.tsx` - Gerenciamento de créditos

**Funcionalidades:**
- ✅ Criação e venda de pacotes de aulas (5, 10, 20, 30 aulas)
- ✅ Sistema de créditos com validade opcional
- ✅ Descontos progressivos por volume
- ✅ Badge "POPULAR" para pacotes em destaque
- ✅ Integração com Stripe para pagamento
- ✅ Tracking de créditos usados vs disponíveis

#### 1.2 Chat In-App com Realtime
- **Database**: Modelo `ChatMessage`
- **API**: 
  - Router em `packages/api/src/routers/chat.ts`
  - Módulo Pusher em `packages/api/src/modules/pusher.ts`
- **Mobile**: 
  - `apps/app-aluno/app/screens/lessonChat.tsx` - Chat em tempo real

**Funcionalidades:**
- ✅ Chat entre aluno e instrutor
- ✅ Janela de tempo (1h antes até 1h depois da aula)
- ✅ Notificações em tempo real via Pusher
- ✅ Marcação de leitura de mensagens
- ✅ Prevenção de negociação "por fora"

---

### ✅ FASE 2: Diferencial Pedagógico (Implementada)

#### 2.1 Sistema de Skill Tracking
- **Database**: Modelos `Skill`, `SkillEvaluation`
- **API**: Router completo em `packages/api/src/routers/skill.ts`
- **Mobile Aluno**:
  - `apps/app-aluno/app/screens/myProgress.tsx` - Dashboard de progresso
  - `apps/app-aluno/app/screens/skillDetail.tsx` - Histórico por habilidade
- **Mobile Instrutor**:
  - `apps/app-instrutor/app/screens/evaluateLesson.tsx` - Avaliação de skills

**Funcionalidades:**
- ✅ 12 habilidades pré-definidas (Básico, Intermediário, Avançado)
- ✅ Avaliação 1-5 estrelas por habilidade
- ✅ Comentários do instrutor
- ✅ Cálculo de progresso geral ponderado
- ✅ Indicador "Pronto para o exame" (>= 70%)
- ✅ Histórico completo de evolução
- ✅ Barras de progresso visuais

**Skills Implementadas:**
- **Básico**: Embreagem, Volante, Espelhos, Freios/Aceleração
- **Intermediário**: Baliza, Conversões, Troca de Faixas, Rotatórias
- **Avançado**: Rodovia, Direção Noturna, Chuva, Estacionamento Paralelo

---

### ✅ FASE 3: Escala e Confiança (Implementada - Backend)

#### 3.1 Split de Pagamento Automatizado (Stripe Connect)
- **Database**: Modelos `PaymentSplit`, `CancellationPolicy`
- **API**: Módulo completo em `packages/api/src/modules/stripeConnect.ts`
- **Campos adicionados ao Instructor**: 
  - `stripeAccountId`, `stripeOnboarded`, `stripeChargesEnabled`, `stripePayoutsEnabled`

**Funcionalidades:**
- ✅ Criação de conta Stripe Connect Express para instrutores
- ✅ Onboarding link para configuração
- ✅ Split automático de pagamentos (25% plataforma, 75% instrutor)
- ✅ Webhook handler para eventos do Connect
- ✅ Tracking de transferências
- ✅ Modelo de política de cancelamento preparado

---

## 🗄️ Mudanças no Schema do Banco de Dados

### Novos Modelos

```prisma
// FASE 1
- Bundle (pacotes de aulas)
- BundlePurchase (compras de pacotes)
- BundlePayment (pagamentos de pacotes)
- ChatMessage (mensagens do chat)

// FASE 2
- Skill (habilidades a serem avaliadas)
- SkillEvaluation (avaliações de habilidades)

// FASE 3
- PaymentSplit (divisão de pagamentos)
- CancellationPolicy (políticas de cancelamento)
```

### Campos Adicionados

```prisma
// Student
+ bundlePurchases: BundlePurchase[]
+ skillEvaluations: SkillEvaluation[]

// Instructor
+ stripeAccountId: String?
+ stripeOnboarded: Boolean
+ stripeChargesEnabled: Boolean
+ stripePayoutsEnabled: Boolean
+ skillEvaluations: SkillEvaluation[]

// Lesson
+ usedBundleCredit: Boolean
+ bundlePurchaseId: String?
+ chatMessages: ChatMessage[]
+ skillEvaluations: SkillEvaluation[]

// Payment
+ split: PaymentSplit?
```

---

## 📦 Dependências Adicionadas

### Backend (`packages/api/package.json`)
```json
{
  "pusher": "^5.2.0"
}
```

### Mobile Apps (`apps/app-aluno` e `apps/app-instrutor`)
```json
{
  "pusher-js": "^8.4.0-rc2"
}
```

### Database (`packages/db/package.json`)
```json
{
  "tsx": "^4.7.0"
}
```

---

## 🌱 Seed do Banco de Dados

Arquivo criado: `packages/db/prisma/seed.ts`

**Dados iniciais:**
- 12 Skills (4 Básico, 4 Intermediário, 4 Avançado)
- 4 Pacotes de Aulas:
  - Iniciante: 5 aulas - R$ 350
  - Completo: 10 aulas - R$ 650 (10% desconto) ⭐ POPULAR
  - Premium: 20 aulas - R$ 1.200 (15% desconto)
  - Intensivo: 30 aulas - R$ 1.700 (20% desconto)

**Comando para rodar:**
```bash
cd packages/db
pnpm db:seed
```

---

## 🔧 Configuração de Ambiente

### Novas Variáveis Necessárias

Adicione ao `.env`:

```env
# Pusher (Chat Realtime)
PUSHER_APP_ID="seu-app-id"
PUSHER_KEY="sua-key"
PUSHER_SECRET="seu-secret"
PUSHER_CLUSTER="us2"

# Expo Public (Mobile)
EXPO_PUBLIC_PUSHER_KEY="sua-key"
EXPO_PUBLIC_PUSHER_CLUSTER="us2"
```

---

## 🚀 Como Usar as Novas Funcionalidades

### 1. Pacotes de Aulas (Aluno)

```typescript
// Listar pacotes disponíveis
const { data: bundles } = trpc.bundle.list.useQuery();

// Comprar pacote
const purchase = await trpc.bundle.purchase.mutate({
  bundleId: "...",
  method: "CREDIT_CARD"
});

// Ver meus pacotes
const { data: myPurchases } = trpc.bundle.myPurchases.useQuery();

// Usar crédito ao agendar aula
await trpc.bundle.useCredit.mutate({
  bundlePurchaseId: "...",
  lessonId: "..."
});
```

### 2. Chat (Aluno/Instrutor)

```typescript
// Listar mensagens da aula
const { data: messages } = trpc.chat.listMessages.useQuery({
  lessonId: "..."
});

// Enviar mensagem
await trpc.chat.sendMessage.mutate({
  lessonId: "...",
  content: "Olá, estou chegando!"
});

// Setup Pusher para receber mensagens em tempo real
const pusher = new Pusher(PUSHER_KEY, { cluster: "us2" });
const channel = pusher.subscribe(`lesson-${lessonId}`);
channel.bind("new-message", (data) => {
  // Atualizar UI
});
```

### 3. Skill Tracking (Instrutor)

```typescript
// Listar todas as skills
const { data: skills } = trpc.skill.list.useQuery();

// Avaliar aluno após aula
await trpc.skill.evaluateLesson.mutate({
  lessonId: "...",
  evaluations: [
    { skillId: "...", rating: 5, comment: "Excelente baliza!" },
    { skillId: "...", rating: 3, comment: "Melhorar uso de espelhos" }
  ]
});
```

### 4. Progresso do Aluno

```typescript
// Ver meu progresso
const { data: progress } = trpc.skill.myProgress.useQuery();

console.log(progress.overallProgress); // 75%
console.log(progress.readyForExam); // true
console.log(progress.skills); // [ { skill, avgRating, lastRating, ... } ]

// Histórico de uma skill específica
const { data: history } = trpc.skill.skillHistory.useQuery({
  skillId: "..."
});
```

### 5. Stripe Connect (Instrutor)

```typescript
// Backend - criar conta Connect
import { createConnectAccount } from "@/modules/stripeConnect";

const account = await createConnectAccount(instructorId);

// Gerar link de onboarding
const onboardingLink = await createConnectOnboardingLink(instructorId);

// Verificar status
const status = await checkConnectAccountStatus(instructorId);
```

---

## 📊 Métricas de Negócio

### KPIs Habilitados pelas Melhorias

**FASE 1 - Monetização:**
- ✅ LTV (Lifetime Value) aumentado com pacotes
- ✅ Churn reduzido (lock-in de créditos)
- ✅ Cash flow antecipado
- ✅ Taxa de conversão de pacotes
- ✅ Retenção de usuários no app (chat)

**FASE 2 - Pedagógico:**
- ✅ Taxa de aprovação no exame
- ✅ NPS do ensino (skill ratings)
- ✅ Engajamento do aluno (tracking de progresso)
- ✅ Qualidade dos instrutores (médias de avaliações)

**FASE 3 - Operacional:**
- ✅ Tempo de pagamento aos instrutores (automático)
- ✅ Taxa de cancelamentos
- ✅ Prevenção de fraudes (KYC preparado)

---

## 🎯 Próximos Passos Recomendados

### Curto Prazo
1. **Testar flows completos**:
   - Compra de pacote → Uso de crédito → Aula → Avaliação
   - Chat durante aula
   
2. **Configurar Pusher**:
   - Criar conta em pusher.com
   - Adicionar chaves ao `.env`

3. **Configurar Stripe Connect**:
   - Ativar Connect no dashboard Stripe
   - Testar onboarding de instrutor

### Médio Prazo
1. **UI Admin**:
   - Dashboard de pacotes vendidos
   - Gestão de skills
   - Aprovação manual de instrutores (KYC)

2. **Notificações Push**:
   - Nova mensagem no chat
   - Créditos expirando
   - Avaliação de skills disponível

3. **Analytics**:
   - Tracking de conversão de pacotes
   - Heatmap de skills mais fracas
   - Progresso médio por instrutor

### Longo Prazo
1. **KYC Automatizado**:
   - Validação de CNH via OCR
   - Background check de instrutores

2. **IA/ML**:
   - Recomendação de skills a praticar
   - Previsão de sucesso no exame
   - Matching aluno-instrutor otimizado

---

## 🧪 Testes

### Testar FASE 1 - Pacotes

```bash
# 1. Rodar migrations
cd packages/db
pnpm db:push

# 2. Rodar seed
pnpm db:seed

# 3. Testar API (no backend)
# GET /api/trpc/bundle.list

# 4. Testar Mobile
cd apps/app-aluno
pnpm start
# Navegar para /screens/bundles
```

### Testar FASE 2 - Skills

```bash
# 1. Verificar skills no banco (via Prisma Studio)
cd packages/db
pnpm db:studio

# 2. Testar avaliação (app instrutor)
cd apps/app-instrutor
pnpm start
# Navegar para /screens/evaluateLesson?lessonId=...

# 3. Ver progresso (app aluno)
cd apps/app-aluno
pnpm start
# Navegar para /screens/myProgress
```

---

## 📚 Referências

- **Prisma Schema**: `packages/db/prisma/schema.prisma`
- **API Routers**: `packages/api/src/routers/`
- **Mobile Screens**: `apps/app-aluno/app/screens/` e `apps/app-instrutor/app/screens/`
- **Stripe Connect**: https://stripe.com/docs/connect
- **Pusher**: https://pusher.com/docs

---

## 🐛 Troubleshooting

### Erro: "Pusher key not configured"
**Solução**: Adicionar `EXPO_PUBLIC_PUSHER_KEY` e `PUSHER_KEY` ao `.env`

### Erro: "Instructor Stripe account not ready"
**Solução**: Executar `createConnectAccount()` e completar onboarding

### Erro: "No credits available"
**Solução**: Comprar um pacote ou verificar se o pacote não expirou

### Erro ao compilar Prisma
**Solução**: 
```bash
cd packages/db
pnpm prisma generate
pnpm db:push
```

---

## ✨ Contribuindo

Ao adicionar novas features:
1. Atualize o schema do Prisma
2. Rode migrations: `pnpm db:push`
3. Crie os routers tRPC
4. Adicione as screens mobile
5. Atualize este guia
6. Adicione testes

---

**Implementação completa! 🎉**

Todas as 3 fases do roadmap estratégico foram implementadas. O BORA agora possui:
- ✅ Sistema de monetização robusto (pacotes)
- ✅ Diferencial pedagógico competitivo (skill tracking)
- ✅ Infraestrutura para escala (Stripe Connect, chat realtime)

