# Arquitetura do Sistema BORA

Este documento descreve a arquitetura técnica da plataforma BORA.

## Visão Geral

A plataforma BORA é construída como um monorepo Turborepo com múltiplas aplicações e pacotes compartilhados, seguindo princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**.

## Diagrama de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                        │
├──────────────┬──────────────┬──────────────┬───────────────┤
│  Web Admin   │   Web Site   │  App Aluno   │ App Instrutor │
│  (Next.js)   │  (Next.js)   │   (Expo)     │    (Expo)     │
└──────────────┴──────────────┴──────────────┴───────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         API LAYER                            │
│                         (tRPC)                               │
├──────────────┬──────────────┬───────────────┬──────────────┤
│    User      │    Lesson    │   Payment     │   Emergency  │
│   Router     │   Router     │   Router      │    Router    │
└──────────────┴──────────────┴───────────────┴──────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC                          │
├──────────────┬──────────────┬───────────────┬──────────────┤
│ Gamification │ Rate Limiter │   Receipts    │   Storage    │
│    Module    │    Module    │   Generator   │   Module     │
└──────────────┴──────────────┴───────────────┴──────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
├──────────────┬──────────────┬───────────────┬──────────────┤
│   Prisma     │   Supabase   │    Upstash    │    Stripe    │
│   (ORM)      │  (Storage)   │    (Redis)    │     (API)    │
└──────────────┴──────────────┴───────────────┴──────────────┘
```

## Camadas da Arquitetura

### 1. Frontend Layer

#### Web Applications (Next.js 15)
- **web-admin**: Painel administrativo
  - Server Components para renderização otimizada
  - Route Handlers para API endpoints
  - NextAuth para autenticação
  - shadcn/ui para componentes

- **web-site**: Site institucional
  - Landing pages estáticas
  - SEO otimizado
  - Forms de cadastro

#### Mobile Applications (Expo Router 3)
- **app-aluno**: App do estudante
  - Navegação nativa com Expo Router
  - Maps com react-native-maps
  - Pagamentos com Stripe
  - SecureStore para tokens

- **app-instrutor**: App do instrutor
  - Location tracking com expo-location
  - Gestão de disponibilidade
  - Recebimentos e finanças

**Comunicação:**
- tRPC client com type-safety
- TanStack Query para cache e state
- Superjson para serialização

### 2. API Layer (tRPC)

Camada de API type-safe construída com tRPC.

#### Routers

**User Router** (`packages/api/src/routers/user.ts`)
- Autenticação e autorização
- Perfil de usuário
- Gamificação (pontos, medals)
- Sistema de referral
- LGPD (exclusão de dados)

**Lesson Router** (`packages/api/src/routers/lesson.ts`)
- CRUD de aulas
- Iniciar/finalizar aulas
- Tracking de localização
- Geração de recibos
- Integração com gamificação

**Payment Router** (`packages/api/src/routers/payment.ts`)
- Criação de pagamentos
- Stripe Payment Intents
- Pix QR Code
- Confirmação e wallet
- Rate limiting

**Instructor Router** (`packages/api/src/routers/instructor.ts`)
- Listagem e busca
- Instrutores próximos (geolocation)
- Aprovação de credenciais
- Gestão de disponibilidade

**Rating Router** (`packages/api/src/routers/rating.ts`)
- Avaliações bidirecionais
- Média de ratings
- Validação de aulas finalizadas

**Emergency Router** (`packages/api/src/routers/emergency.ts`)
- SOS em aulas ativas
- Registro de emergências
- Notificações (futuro)

#### Middlewares

```typescript
// Autenticação
protectedProcedure: Requer sessão válida
studentProcedure: Requer perfil de aluno
instructorProcedure: Requer perfil de instrutor
adminProcedure: Requer role ADMIN

// Rate Limiting (aplicado em routers críticos)
checkRateLimit(key, config)
```

### 3. Business Logic Layer

Módulos que encapsulam lógica de negócio complexa.

#### Gamification Module
**Responsabilidades:**
- Cálculo e atribuição de pontos
- Verificação de level-up
- Concessão de medalhas
- Triggers pós-aula/avaliação

**Configurações:**
```typescript
POINTS_CONFIG = {
  LESSON_COMPLETED: 10,
  FIRST_LESSON: 50,
  RATING_GIVEN: 5,
  PERFECT_RATING_RECEIVED: 20,
  REFERRAL_SIGNUP: 100,
}

LEVELS = [
  { level: 1, minPoints: 0, name: "Iniciante" },
  { level: 2, minPoints: 100, name: "Aprendiz" },
  // ...
]
```

#### Rate Limiter Module
**Responsabilidades:**
- Proteção contra abuse
- Rate limiting por usuário/IP
- Configurações por endpoint

**Configurações:**
```typescript
RATE_LIMITS = {
  AUTH: { maxRequests: 5, windowMs: 15min },
  PAYMENT: { maxRequests: 5, windowMs: 1hour },
  EMERGENCY: { maxRequests: 3, windowMs: 1hour },
}
```

**Implementação:**
- Upstash Redis para armazenamento
- Sorted Sets para janelas deslizantes
- Cleanup automático com TTL

#### Receipt Generator Module
**Responsabilidades:**
- Geração de PDFs de recibo
- Formatação de dados
- Nomeação de arquivos

**Stack:**
- pdfkit para geração
- Buffer streaming
- Metadata estruturada

#### Supabase Storage Module
**Responsabilidades:**
- Upload de recibos
- Geração de URLs públicas
- Gestão de buckets

### 4. Data Layer

#### Prisma ORM
**Schema principal:**
```prisma
model User {
  role: UserRole
  student: Student?
  instructor: Instructor?
}

model Student {
  points: Int
  level: Int
  medals: Json
  walletBalance: Decimal
}

model Lesson {
  status: LessonStatus
  currentLatitude: Float?
  receiptUrl: String?
  recordingConsent: Boolean
}

model Payment {
  status: PaymentStatus
  stripePaymentIntentId: String?
}
```

**Relações:**
- User 1:1 Student/Instructor
- Lesson N:1 Student
- Lesson N:1 Instructor
- Payment N:1 Lesson
- Rating N:1 Lesson

#### Supabase
**Serviços utilizados:**
- **Database**: PostgreSQL gerenciado
- **Storage**: Bucket de recibos
- **Auth** (futuro): Autenticação adicional

**Buckets:**
- `receipts/`: PDFs de recibos de aulas

#### Upstash Redis
**Uso:**
- Rate limiting (sorted sets)
- Cache de sessões (futuro)
- Real-time pubsub (futuro)

#### Stripe
**Integrações:**
- Payment Intents (cartão)
- Pix (boleto)
- Webhooks para confirmação

## Fluxos Principais

### Fluxo de Aula Completa

```
1. Aluno busca instrutor
   ↓ instructor.nearby (geolocation)
2. Aluno agenda aula
   ↓ lesson.create
3. Pagamento
   ↓ payment.create → payment.createIntent/Pix
4. Instrutor aceita
   ↓ lesson.start (recordingConsent)
5. Aula em andamento
   ↓ lesson.updateLocation (tracking)
6. Finalizar aula
   ↓ lesson.end → receiptGenerator → supabaseStorage
7. Gamificação
   ↓ gamification.processLessonCompletion
8. Avaliação
   ↓ rating.create → gamification.processRating
```

### Fluxo de Pagamento

```
1. Criar pagamento
   ↓ payment.create (DB record)
2. Gerar intent
   ↓ payment.createIntent (Stripe API)
   ou payment.createPix (Stripe Pix)
3. Client processa
   ↓ Stripe SDK (mobile)
4. Confirmar
   ↓ payment.confirm → creditWallet
```

### Fluxo de Emergência (SOS)

```
1. Botão SOS pressionado
   ↓ emergency.create (rate limited)
2. Log de emergência
   ↓ activityLog (latitude, longitude)
3. Notificações
   ↓ Push para ambas as partes (futuro)
   ↓ Alerta para admin (futuro)
```

## Segurança

### Autenticação
- **Web**: NextAuth (session-based)
- **Mobile**: SecureStore (token-based)

### Autorização
- Role-based (ADMIN, INSTRUCTOR, STUDENT)
- Procedure-level checks
- Resource ownership validation

### Rate Limiting
- Per-user limits em endpoints críticos
- Proteção contra DDoS
- Graceful degradation

### LGPD
- Soft-delete com `deleteMyData`
- Logs de ações sensíveis
- Consentimento de gravação opt-in

## Performance

### Otimizações
- Server Components (Next.js)
- TanStack Query cache
- Prisma query optimization
- Redis caching (futuro)

### Monitoramento
- Error tracking (futuro: Sentry)
- Performance metrics (futuro: Vercel Analytics)
- Real-time logs

## Escalabilidade

### Horizontal Scaling
- Stateless API (tRPC)
- Database connection pooling (Supabase)
- CDN para assets (Vercel)

### Vertical Scaling
- Database indexes
- Query optimization
- Lazy loading

## Tecnologias e Versões

```json
{
  "next": "15.x",
  "react": "19.x",
  "expo": "~52.x",
  "@trpc/server": "11.x",
  "@prisma/client": "5.x",
  "typescript": "5.x"
}
```

## Roadmap Arquitetural

### Curto Prazo
- [ ] WebSocket para real-time (lesson tracking)
- [ ] Notification service (Push + SMS)
- [ ] Redis caching layer

### Médio Prazo
- [ ] Microservices (notification, analytics)
- [ ] Event-driven architecture
- [ ] CQRS para queries complexas

### Longo Prazo
- [ ] Multi-tenancy (franquias)
- [ ] GraphQL federation
- [ ] Kubernetes deployment

## Referências

- [tRPC Docs](https://trpc.io/)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Next.js Architecture](https://nextjs.org/docs/app/building-your-application)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
