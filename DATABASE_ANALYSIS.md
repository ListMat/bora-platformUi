# 📊 Análise Completa do Banco de Dados - Sistema Bora

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Tabelas Principais](#tabelas-principais)
3. [Relacionamentos](#relacionamentos)
4. [Enums](#enums)
5. [Fluxos de Dados](#fluxos-de-dados)
6. [Métricas e Estatísticas](#métricas-e-estatísticas)

---

## 🎯 Visão Geral

### Estatísticas do Schema
- **Total de Tabelas**: 23
- **Total de Enums**: 7
- **Total de Relacionamentos**: 45+
- **Banco de Dados**: PostgreSQL
- **ORM**: Prisma

### Categorias de Tabelas

| Categoria | Tabelas | Quantidade |
|-----------|---------|------------|
| **Autenticação** | User, Account, Session, VerificationToken | 4 |
| **Perfis** | Student, Instructor, InstructorAvailability | 3 |
| **Aulas** | Lesson, ChatMessage | 2 |
| **Pagamentos** | Payment, Dispute, PaymentSplit, CancellationPolicy | 4 |
| **Avaliações** | Rating, Skill, SkillEvaluation | 3 |
| **Pacotes** | Plan, Bundle, BundlePurchase, BundlePayment | 4 |
| **Outros** | Vehicle, Referral, ActivityLog | 3 |

---

## 📊 Tabelas Principais

### 1. **User** (Usuários)
**Tabela central do sistema**

| Campo | Tipo | Descrição | Índice |
|-------|------|-----------|--------|
| `id` | String (cuid) | ID único | PK |
| `email` | String | Email único | ✅ Unique |
| `name` | String? | Nome completo | - |
| `password` | String? | Senha hasheada | - |
| `role` | UserRole | Papel do usuário | ✅ Index |
| `phone` | String? | Telefone | - |
| `image` | String? | URL da foto | - |
| `pushToken` | String? | Token Expo Push | - |
| `emailVerified` | DateTime? | Data de verificação | - |
| `createdAt` | DateTime | Data de criação | - |
| `updatedAt` | DateTime | Última atualização | - |

**Relacionamentos:**
- `1:N` → Account (contas OAuth)
- `1:N` → Session (sessões ativas)
- `1:1` → Student (perfil de aluno)
- `1:1` → Instructor (perfil de instrutor)
- `1:N` → Vehicle (veículos)
- `1:N` → ActivityLog (logs de atividade)

**Roles Disponíveis:**
- `ADMIN` - Administrador do sistema
- `FINANCIAL` - Financeiro
- `SUPPORT` - Suporte
- `AUDITOR` - Auditor
- `INSTRUCTOR` - Instrutor
- `STUDENT` - Aluno

---

### 2. **Student** (Alunos)
**Perfil de aluno com gamificação**

| Campo | Tipo | Descrição | Índice |
|-------|------|-----------|--------|
| `id` | String (cuid) | ID único | PK |
| `userId` | String | Referência ao User | ✅ Unique |
| `cpf` | String? | CPF do aluno | ✅ Unique |
| `dateOfBirth` | DateTime? | Data de nascimento | - |
| `address` | String? | Endereço completo | - |
| `city` | String? | Cidade | - |
| `state` | String? | Estado | - |
| `zipCode` | String? | CEP | - |
| `points` | Int | Pontos de gamificação | - |
| `level` | Int | Nível do aluno | - |
| `badges` | String[] | Badges conquistadas | - |
| `walletBalance` | Decimal(10,2) | Saldo da carteira | - |

**Relacionamentos:**
- `N:1` → User
- `1:N` → Lesson (aulas agendadas)
- `1:N` → Payment (pagamentos)
- `1:N` → Rating (avaliações feitas)
- `1:N` → Referral (indicações feitas)
- `1:1` → Referral (indicado por)
- `1:N` → BundlePurchase (pacotes comprados)
- `1:N` → SkillEvaluation (avaliações de habilidades)

**Funcionalidades:**
- ✅ Gamificação (pontos, níveis, badges)
- ✅ Carteira digital
- ✅ Sistema de indicação
- ✅ Histórico de aulas

---

### 3. **Instructor** (Instrutores)
**Perfil de instrutor com documentação e localização**

| Campo | Tipo | Descrição | Índice |
|-------|------|-----------|--------|
| `id` | String (cuid) | ID único | PK |
| `userId` | String | Referência ao User | ✅ Unique |
| `cpf` | String? | CPF do instrutor | ✅ Unique |
| `cnhNumber` | String? | Número da CNH | ✅ Unique |
| `credentialNumber` | String? | Número da credencial | - |
| `credentialExpiry` | DateTime? | Validade da credencial | - |
| `cnhDocument` | String? | URL do documento CNH | - |
| `credentialDoc` | String? | URL da credencial | - |
| `cep` | String? | CEP | - |
| `street` | String? | Rua | - |
| `neighborhood` | String? | Bairro | - |
| `latitude` | Float? | Latitude | - |
| `longitude` | Float? | Longitude | - |
| `city` | String? | Cidade | - |
| `state` | String? | Estado | - |
| `basePrice` | Decimal(10,2) | Preço base/hora | - |
| `isAvailable` | Boolean | Disponível para aulas | ✅ Index |
| `isOnline` | Boolean | Online no momento | - |
| `acceptsOwnVehicle` | Boolean | Aceita carro do aluno | - |
| `bio` | String? | Biografia (max 200 chars) | - |
| `status` | InstructorStatus | Status do cadastro | ✅ Index |
| `averageRating` | Float | Avaliação média | - |
| `totalLessons` | Int | Total de aulas dadas | - |
| `stripeAccountId` | String? | ID Stripe Connect | ✅ Unique |
| `stripeOnboarded` | Boolean | Onboarding Stripe completo | - |
| `stripeChargesEnabled` | Boolean | Pode receber pagamentos | - |
| `stripePayoutsEnabled` | Boolean | Pode receber transferências | - |

**Status Possíveis:**
- `PENDING_VERIFICATION` - Aguardando aprovação
- `ACTIVE` - Ativo e aprovado
- `INACTIVE` - Inativo
- `SUSPENDED` - Suspenso

**Relacionamentos:**
- `N:1` → User
- `1:N` → Lesson (aulas ministradas)
- `1:N` → InstructorAvailability (disponibilidade)
- `1:N` → Plan (planos oferecidos)
- `1:N` → Rating (avaliações recebidas)
- `1:N` → SkillEvaluation (avaliações de skills)

**Funcionalidades:**
- ✅ Geolocalização (mapa)
- ✅ Sistema de aprovação
- ✅ Integração Stripe Connect
- ✅ Disponibilidade por horário
- ✅ Métricas de performance

---

### 4. **Lesson** (Aulas)
**Tabela central de agendamentos**

| Campo | Tipo | Descrição | Índice |
|-------|------|-----------|--------|
| `id` | String (cuid) | ID único | PK |
| `studentId` | String | ID do aluno | ✅ Index |
| `instructorId` | String | ID do instrutor | ✅ Index |
| `scheduledAt` | DateTime | Data/hora agendada | ✅ Index |
| `startedAt` | DateTime? | Início real | - |
| `endedAt` | DateTime? | Fim real | - |
| `duration` | Int? | Duração em minutos | - |
| `lessonType` | String? | Tipo de aula | - |
| `vehicleId` | String? | ID do veículo usado | - |
| `useOwnVehicle` | Boolean | Usa carro do aluno | - |
| `planId` | String? | ID do plano | - |
| `paymentMethod` | PaymentMethod | Método de pagamento | - |
| `installments` | Int | Parcelas | - |
| `pickupLatitude` | Float? | Lat do pickup | - |
| `pickupLongitude` | Float? | Lng do pickup | - |
| `pickupAddress` | String? | Endereço de pickup | - |
| `currentLatitude` | Float? | Lat atual (tempo real) | - |
| `currentLongitude` | Float? | Lng atual (tempo real) | - |
| `status` | LessonStatus | Status da aula | ✅ Index |
| `price` | Decimal(10,2) | Preço da aula | - |
| `usedBundleCredit` | Boolean | Usou crédito de pacote | - |
| `bundlePurchaseId` | String? | ID da compra do pacote | - |
| `recordingUrl` | String? | URL da gravação | - |
| `recordingConsent` | Boolean | Consentimento de gravação | - |
| `receiptUrl` | String? | URL do recibo | - |
| `pixCode` | String? | Código Pix | - |
| `pixQrCode` | String? | QR Code Pix | - |
| `pixGeneratedAt` | DateTime? | Quando gerou Pix | - |
| `pixExpiresAt` | DateTime? | Expiração do Pix | - |
| `pixPaidAt` | DateTime? | Quando pagou | - |
| `paymentStatus` | String | Status do pagamento | - |
| `instructorNotes` | String? | Notas do instrutor | - |
| `studentNotes` | String? | Notas do aluno | - |

**Status Possíveis:**
- `PENDING` - Aguardando resposta do instrutor
- `SCHEDULED` - Aceita pelo instrutor
- `ACTIVE` - Em andamento
- `FINISHED` - Concluída
- `CANCELLED` - Cancelada
- `EXPIRED` - Expirou (sem resposta)

**Relacionamentos:**
- `N:1` → Student
- `N:1` → Instructor
- `1:1` → Payment
- `1:1` → Rating
- `1:N` → ChatMessage
- `1:N` → SkillEvaluation

**Funcionalidades:**
- ✅ Agendamento com localização
- ✅ Rastreamento em tempo real
- ✅ Chat integrado
- ✅ Pagamento Pix
- ✅ Gravação de aula (opcional)
- ✅ Avaliação de skills

---

### 5. **Payment** (Pagamentos)
**Gestão de pagamentos e transações**

| Campo | Tipo | Descrição | Índice |
|-------|------|-----------|--------|
| `id` | String (cuid) | ID único | PK |
| `lessonId` | String | ID da aula | ✅ Unique |
| `studentId` | String | ID do aluno | ✅ Index |
| `amount` | Decimal(10,2) | Valor total | - |
| `method` | PaymentMethod | Método de pagamento | - |
| `status` | PaymentStatus | Status | ✅ Index |
| `stripePaymentId` | String? | ID Stripe | ✅ Unique |
| `stripeCustomerId` | String? | ID do cliente Stripe | - |
| `pixQrCode` | String? | QR Code Pix | - |
| `pixCopyPaste` | String? | Código Pix | - |
| `metadata` | Json? | Metadados extras | - |

**Status Possíveis:**
- `PENDING` - Pendente
- `PROCESSING` - Processando
- `COMPLETED` - Completo
- `FAILED` - Falhou
- `REFUNDED` - Reembolsado

**Métodos de Pagamento:**
- `PIX` - Pix
- `DINHEIRO` - Dinheiro
- `DEBITO` - Débito
- `CREDITO` - Crédito
- `CREDIT_CARD` - Cartão (legacy)
- `BOLETO` - Boleto (legacy)

**Relacionamentos:**
- `1:1` → Lesson
- `N:1` → Student
- `1:1` → Dispute (disputas)
- `1:1` → PaymentSplit (divisão de receita)

---

### 6. **Vehicle** (Veículos)
**Cadastro de veículos**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String (cuid) | ID único |
| `userId` | String | Dono do veículo |
| `brand` | String | Marca (Toyota, VW, etc.) |
| `model` | String | Modelo (Corolla, Gol, etc.) |
| `year` | Int | Ano (1980-2026) |
| `color` | String | Cor |
| `plateLastFour` | String | 4 últimos da placa |
| `photoUrl` | String? | Foto principal |
| `photos` | String[] | Galeria de fotos |
| `category` | VehicleCategory | Categoria |
| `transmission` | TransmissionType | Transmissão |
| `fuel` | FuelType | Combustível |
| `engine` | String | Motor |
| `horsePower` | Int? | Potência (cv) |
| `hasDualPedal` | Boolean | Tem duplo pedal |
| `pedalPhotoUrl` | String? | Foto do pedal |
| `acceptStudentCar` | Boolean | Aceita carro do aluno |
| `safetyFeatures` | String[] | Itens de segurança |
| `comfortFeatures` | String[] | Itens de conforto |
| `status` | String | active/inactive |

**Categorias:**
- `HATCH`, `SEDAN`, `SUV`, `PICKUP`, `SPORTIVO`, `COMPACTO`, `ELETRICO`, `MOTO`

**Transmissões:**
- `MANUAL`, `AUTOMATICO`, `CVT`, `SEMI_AUTOMATICO`

**Combustíveis:**
- `GASOLINA`, `ETANOL`, `FLEX`, `DIESEL`, `ELETRICO`, `HIBRIDO`

---

### 7. **Rating** (Avaliações)
**Sistema de avaliação pós-aula**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String (cuid) | ID único |
| `lessonId` | String | ID da aula |
| `studentId` | String | Quem avaliou |
| `instructorId` | String | Quem foi avaliado |
| `rating` | Int | Nota (1-5) |
| `comment` | String? | Comentário |

**Relacionamentos:**
- `1:1` → Lesson
- `N:1` → Student
- `N:1` → Instructor

---

### 8. **Skill** e **SkillEvaluation**
**Sistema de avaliação de habilidades**

**Skill** (Habilidades cadastradas):
- `name` - Nome da skill (ex: "Baliza", "Conversão")
- `category` - BASIC, INTERMEDIATE, ADVANCED
- `weight` - Peso para cálculo de progresso
- `order` - Ordem de exibição

**SkillEvaluation** (Avaliações por aula):
- `lessonId` - Aula avaliada
- `studentId` - Aluno avaliado
- `skillId` - Skill avaliada
- `instructorId` - Quem avaliou
- `rating` - Nota (1-5)
- `comment` - Comentário do instrutor

**Funcionalidade:**
- ✅ Rastreamento de progresso por habilidade
- ✅ Feedback detalhado do instrutor
- ✅ Histórico de evolução

---

### 9. **Plan** e **Bundle**
**Pacotes de aulas**

**Plan** (Planos individuais por instrutor):
- `name` - Nome do plano
- `lessons` - Quantidade de aulas
- `price` - Preço total
- `discount` - Desconto (%)
- `instructorId` - Instrutor específico

**Bundle** (Pacotes gerais da plataforma):
- `name` - Nome do pacote
- `totalLessons` - Créditos totais
- `price` - Preço
- `discount` - Desconto (%)
- `expiryDays` - Dias para expirar

**BundlePurchase** (Compras de pacotes):
- `studentId` - Quem comprou
- `bundleId` - Qual pacote
- `totalCredits` - Créditos totais
- `usedCredits` - Créditos usados
- `remainingCredits` - Créditos restantes
- `expiresAt` - Data de expiração

---

### 10. **Referral** (Indicações)
**Sistema "Indique e Ganhe"**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String (cuid) | ID único |
| `referrerId` | String | Quem indicou |
| `referredId` | String | Quem foi indicado |
| `rewardAmount` | Decimal(10,2) | Valor da recompensa |
| `rewardPaid` | Boolean | Recompensa paga |

**Relacionamentos:**
- `N:1` → Student (referrer)
- `1:1` → Student (referred)

---

### 11. **ChatMessage** (Chat)
**Mensagens entre aluno e instrutor**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String (cuid) | ID único |
| `lessonId` | String | Aula relacionada |
| `senderId` | String | Quem enviou |
| `content` | String | Conteúdo da mensagem |
| `messageType` | String | text/image/audio |
| `mediaUrl` | String? | URL da mídia |
| `mediaDuration` | Int? | Duração do áudio |
| `isRead` | Boolean | Lida |
| `readAt` | DateTime? | Quando foi lida |

---

### 12. **Dispute** (Disputas)
**Gestão de disputas de pagamento**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String (cuid) | ID único |
| `paymentId` | String | Pagamento disputado |
| `reason` | String | Motivo |
| `description` | String? | Descrição detalhada |
| `status` | DisputeStatus | Status |
| `resolution` | String? | Resolução |
| `resolvedAt` | DateTime? | Quando resolveu |
| `resolvedBy` | String? | Admin que resolveu |

**Status:**
- `OPEN` - Aberta
- `UNDER_REVIEW` - Em análise
- `RESOLVED` - Resolvida
- `CLOSED` - Fechada

---

### 13. **PaymentSplit** (Divisão de Receita)
**Split de pagamento entre plataforma e instrutor**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String (cuid) | ID único |
| `paymentId` | String | Pagamento original |
| `totalAmount` | Decimal(10,2) | Valor total |
| `platformFee` | Decimal(10,2) | Taxa da plataforma |
| `instructorAmount` | Decimal(10,2) | Valor do instrutor |
| `transferId` | String? | ID da transferência Stripe |
| `transferStatus` | String? | pending/paid/failed |
| `transferredAt` | DateTime? | Quando transferiu |

---

### 14. **CancellationPolicy** (Política de Cancelamento)
**Gestão de cancelamentos e penalidades**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String (cuid) | ID único |
| `lessonId` | String | Aula cancelada |
| `cancelledBy` | String | STUDENT ou INSTRUCTOR |
| `cancelledAt` | DateTime | Quando cancelou |
| `scheduledTime` | DateTime | Horário original |
| `hoursBeforeLesson` | Int | Horas de antecedência |
| `penaltyApplied` | Boolean | Penalidade aplicada |
| `penaltyAmount` | Decimal(10,2) | Valor da penalidade |
| `penaltyPaidTo` | String? | Quem recebeu |
| `reason` | String? | Motivo |

---

### 15. **ActivityLog** (Logs de Atividade)
**Auditoria e rastreamento de ações**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | String (cuid) | ID único |
| `userId` | String | Quem fez a ação |
| `action` | String | Tipo de ação |
| `resource` | String? | Recurso afetado |
| `metadata` | Json? | Dados extras |
| `createdAt` | DateTime | Quando ocorreu |

**Exemplos de Actions:**
- `VIEW_DOCUMENT` - Visualizou documento
- `DELETE_DATA` - Deletou dados
- `APPROVE_INSTRUCTOR` - Aprovou instrutor
- `SUSPEND_USER` - Suspendeu usuário

---

## 🔗 Relacionamentos Principais

### Diagrama de Relacionamentos

```
User (1) ──────────── (1) Student
  │                        │
  │                        ├─── (N) Lesson
  │                        ├─── (N) Payment
  │                        ├─── (N) Rating
  │                        ├─── (N) Referral
  │                        └─── (N) BundlePurchase
  │
  ├────────────── (1) Instructor
  │                        │
  │                        ├─── (N) Lesson
  │                        ├─── (N) InstructorAvailability
  │                        ├─── (N) Plan
  │                        └─── (N) Rating
  │
  ├────────────── (N) Vehicle
  ├────────────── (N) Account
  ├────────────── (N) Session
  └────────────── (N) ActivityLog

Lesson (1) ──────────── (1) Payment
  │                        │
  │                        ├─── (1) Dispute
  │                        └─── (1) PaymentSplit
  │
  ├────────────── (1) Rating
  ├────────────── (N) ChatMessage
  ├────────────── (N) SkillEvaluation
  └────────────── (1) CancellationPolicy

Bundle (1) ──────────── (N) BundlePurchase
                             │
                             └─── (1) BundlePayment

Skill (1) ───────────── (N) SkillEvaluation
```

---

## 📈 Métricas e Queries Úteis

### Queries para o Painel Admin

#### 1. Total de Usuários por Role
```sql
SELECT role, COUNT(*) as total
FROM users
GROUP BY role;
```

#### 2. Instrutores Pendentes de Aprovação
```sql
SELECT u.name, u.email, i.createdAt
FROM instructors i
JOIN users u ON i.userId = u.id
WHERE i.status = 'PENDING_VERIFICATION'
ORDER BY i.createdAt DESC;
```

#### 3. Receita Mensal
```sql
SELECT 
  DATE_TRUNC('month', createdAt) as month,
  SUM(amount) as revenue
FROM payments
WHERE status = 'COMPLETED'
GROUP BY month
ORDER BY month DESC
LIMIT 12;
```

#### 4. Top Instrutores por Avaliação
```sql
SELECT 
  u.name,
  i.averageRating,
  i.totalLessons
FROM instructors i
JOIN users u ON i.userId = u.id
WHERE i.status = 'ACTIVE'
ORDER BY i.averageRating DESC, i.totalLessons DESC
LIMIT 10;
```

#### 5. Aulas por Status
```sql
SELECT status, COUNT(*) as total
FROM lessons
GROUP BY status;
```

#### 6. Taxa de Conversão (Pending → Scheduled)
```sql
SELECT 
  COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending,
  COUNT(CASE WHEN status = 'SCHEDULED' THEN 1 END) as scheduled,
  ROUND(
    COUNT(CASE WHEN status = 'SCHEDULED' THEN 1 END)::numeric / 
    NULLIF(COUNT(CASE WHEN status = 'PENDING' THEN 1 END), 0) * 100, 
    2
  ) as conversion_rate
FROM lessons;
```

#### 7. Alunos Mais Ativos
```sql
SELECT 
  u.name,
  s.level,
  s.points,
  COUNT(l.id) as total_lessons
FROM students s
JOIN users u ON s.userId = u.id
LEFT JOIN lessons l ON s.id = l.studentId
GROUP BY s.id, u.name, s.level, s.points
ORDER BY total_lessons DESC
LIMIT 10;
```

#### 8. Disputas Abertas
```sql
SELECT 
  d.id,
  d.reason,
  p.amount,
  u.name as student_name
FROM disputes d
JOIN payments p ON d.paymentId = p.id
JOIN students s ON p.studentId = s.id
JOIN users u ON s.userId = u.id
WHERE d.status IN ('OPEN', 'UNDER_REVIEW')
ORDER BY d.createdAt DESC;
```

---

## 🎯 Índices Importantes

### Índices Existentes

| Tabela | Campo(s) | Tipo | Motivo |
|--------|----------|------|--------|
| `users` | `email` | Unique | Login |
| `users` | `role` | Index | Filtros por role |
| `instructors` | `status` | Index | Aprovação |
| `instructors` | `isAvailable` | Index | Busca de disponíveis |
| `lessons` | `studentId` | Index | Histórico do aluno |
| `lessons` | `instructorId` | Index | Histórico do instrutor |
| `lessons` | `status` | Index | Filtros de status |
| `lessons` | `scheduledAt` | Index | Ordenação por data |
| `payments` | `studentId` | Index | Histórico de pagamentos |
| `payments` | `status` | Index | Filtros de status |
| `ratings` | `instructorId` | Index | Avaliações do instrutor |

---

## ⚠️ Tabelas Faltantes (Para Implementar)

### Emergency (SOS)
**Não existe no schema atual!**

```prisma
model Emergency {
  id          String   @id @default(cuid())
  userId      String
  lessonId    String?
  status      String   @default("PENDING") // PENDING, RESOLVED
  description String?
  latitude    Float?
  longitude   Float?
  createdAt   DateTime @default(now())
  resolvedAt  DateTime?
  
  user   User    @relation(fields: [userId], references: [id])
  lesson Lesson? @relation(fields: [lessonId], references: [id])
  
  @@index([status])
  @@index([createdAt])
  @@map("emergencies")
}
```

---

## 📊 Resumo Final

### Estrutura Completa
- ✅ **23 tabelas** implementadas
- ✅ **7 enums** definidos
- ✅ **45+ relacionamentos** mapeados
- ✅ **20+ índices** para performance

### Funcionalidades Cobertas
- ✅ Autenticação (NextAuth)
- ✅ Perfis (Aluno e Instrutor)
- ✅ Agendamento de Aulas
- ✅ Pagamentos (Pix, Stripe)
- ✅ Avaliações
- ✅ Chat
- ✅ Gamificação
- ✅ Pacotes de Aulas
- ✅ Sistema de Indicação
- ✅ Veículos
- ✅ Logs de Auditoria
- ⚠️ Emergências (SOS) - **FALTA IMPLEMENTAR**

### Próximos Passos
1. ✅ Criar tabela `Emergency`
2. ✅ Adicionar índices de geolocalização
3. ✅ Implementar soft delete (se necessário)
4. ✅ Adicionar campos de auditoria extras

---

**Desenvolvido com ❤️ para Bora Platform**
