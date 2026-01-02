# 🎉 Backend Implementado - Fluxo "Solicitar Aula"

## ✅ Status: COMPLETO

---

## 📊 Resumo das Implementações

### 1. **Schema Prisma Atualizado**

#### Enums Modificados

**LessonStatus**
```prisma
enum LessonStatus {
  PENDING    // ✅ NOVO - Aguardando resposta do instrutor
  SCHEDULED  // Aceita pelo instrutor
  ACTIVE     // Em andamento
  FINISHED   // Concluída
  CANCELLED  // Cancelada
  EXPIRED    // ✅ NOVO - Expirou (sem resposta em 2 min)
}
```

**PaymentMethod**
```prisma
enum PaymentMethod {
  PIX          // ✅ Mantido
  DINHEIRO     // ✅ NOVO
  DEBITO       // ✅ NOVO
  CREDITO      // ✅ NOVO
  CREDIT_CARD  // Compatibilidade
  BOLETO       // Compatibilidade
}
```

#### Modelo Lesson Atualizado

```prisma
model Lesson {
  // ... campos existentes ...
  
  // ✅ NOVOS CAMPOS
  lessonType       String?      // "1ª Habilitação", "Direção via pública", etc.
  vehicleId        String?      // ID do veículo (instrutor ou aluno)
  useOwnVehicle    Boolean      @default(false)
  planId           String?      // ID do plano (1, 5, 10 aulas)
  paymentMethod    PaymentMethod @default(PIX)
  installments     Int          @default(1)
  
  status           LessonStatus @default(PENDING) // ✅ Alterado de SCHEDULED para PENDING
}
```

#### Novo Modelo Plan

```prisma
model Plan {
  id          String   @id @default(cuid())
  name        String   // "1 Aula", "Pacote 5 Aulas", "Pacote 10 Aulas"
  description String?
  lessons     Int      // 1, 5, 10
  price       Decimal  @db.Decimal(10, 2)
  discount    Int      @default(0) // % desconto
  isActive    Boolean  @default(true)
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

### 2. **Routers tRPC Implementados/Atualizados**

#### **instructor.ts** ✅

**Queries Existentes (já implementadas)**:
- `slots` - Retorna horários disponíveis do instrutor
- `vehicles` - Retorna veículos do instrutor

**Implementação**:
```typescript
// Já estava implementado!
slots: protectedProcedure
  .input(z.object({
    instructorId: z.string(),
    date: z.date(),
  }))
  .query(async ({ ctx, input }) => {
    // Gera slots de 30 em 30 minutos
    // Filtra por disponibilidade do instrutor
    // Remove slots ocupados
    // Remove slots com menos de 2h de antecedência
    return slots;
  }),

vehicles: protectedProcedure
  .input(z.object({
    instructorId: z.string(),
  }))
  .query(async ({ ctx, input }) => {
    // Retorna veículos ativos do instrutor
    return instructor.user.vehicles;
  }),
```

---

#### **lesson.ts** ✅ ATUALIZADO

**Mutation `request` - Atualizada**:
```typescript
request: studentProcedure
  .input(z.object({
    instructorId: z.string(),
    scheduledAt: z.date(),
    lessonType: z.string(),
    vehicleId: z.string().optional(),
    useOwnVehicle: z.boolean().default(false),
    planId: z.string().optional(),
    paymentMethod: z.enum(["PIX", "DINHEIRO", "DEBITO", "CREDITO"]),
    installments: z.number().int().min(1).max(3).default(1), // ✅ NOVO
    price: z.number().positive(),
    // ... outros campos
  }))
  .mutation(async ({ ctx, input }) => {
    // ✅ Validar horário (mínimo 2h no futuro)
    const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);
    if (input.scheduledAt < twoHoursFromNow) {
      throw new Error("A aula deve ser agendada com pelo menos 2 horas de antecedência");
    }

    // ✅ Verificar se horário já está ocupado
    const existingLesson = await ctx.prisma.lesson.findFirst({
      where: {
        instructorId: input.instructorId,
        scheduledAt: input.scheduledAt,
        status: { in: ["PENDING", "SCHEDULED", "ACTIVE"] },
      },
    });

    if (existingLesson) {
      throw new Error("Horário já está ocupado");
    }

    // ✅ Criar aula com status PENDING
    const lesson = await ctx.prisma.lesson.create({
      data: {
        studentId: user.student.id,
        instructorId: input.instructorId,
        scheduledAt: input.scheduledAt,
        price: input.price,
        status: "PENDING", // ✅ Aguardando resposta do instrutor
        lessonType: input.lessonType,
        vehicleId: input.vehicleId,
        useOwnVehicle: input.useOwnVehicle,
        planId: input.planId,
        paymentMethod: input.paymentMethod,
        installments: input.installments,
      },
    });

    // ✅ Gerar mensagem inicial formatada
    const initialMessage = `Solicitação de ${user.name}
${dateStr} às ${timeStr}
${input.lessonType} – ${vehicleStr}
R$ ${input.price.toFixed(2)} (${paymentMethodLabel} ao final)`;

    // ✅ Timer de 2 minutos para expiração
    setTimeout(async () => {
      const currentLesson = await ctx.prisma.lesson.findUnique({
        where: { id: lesson.id },
      });

      if (currentLesson?.status === "PENDING") {
        await ctx.prisma.lesson.update({
          where: { id: lesson.id },
          data: { status: "EXPIRED" },
        });
        
        // TODO: Enviar notificação push para o aluno
      }
    }, 2 * 60 * 1000); // 2 minutos

    // TODO: Enviar notificação push para o instrutor

    return { lesson, initialMessage };
  }),
```

**Mutation `acceptRequest` - Atualizada**:
```typescript
acceptRequest: instructorProcedure
  .input(z.object({
    lessonId: z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    const lesson = await ctx.prisma.lesson.findUnique({
      where: { id: input.lessonId },
    });

    // ✅ Verificar se está PENDING
    if (lesson.status !== "PENDING") {
      throw new Error("Lesson already processed");
    }

    // ✅ Mudar para SCHEDULED
    const updatedLesson = await ctx.prisma.lesson.update({
      where: { id: input.lessonId },
      data: { status: "SCHEDULED" },
    });

    // TODO: Enviar notificação push para o aluno

    return updatedLesson;
  }),
```

---

#### **student.ts** ✅ ATUALIZADO

**Nova Query `getVehicle`**:
```typescript
getVehicle: protectedProcedure.query(async ({ ctx }) => {
  const user = await ctx.prisma.user.findUnique({
    where: { email: ctx.session.user.email! },
    include: {
      student: true,
      vehicles: {
        where: { status: "active" },
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user?.student || !user.vehicles || user.vehicles.length === 0) {
    return null;
  }

  const vehicle = user.vehicles[0];

  return {
    id: vehicle.id,
    model: vehicle.model,
    brand: vehicle.brand,
    photo: vehicle.photoUrl,
    transmission: vehicle.transmission,
    plateLast4: vehicle.plateLastFour,
  };
}),
```

---

#### **plan.ts** ✅ JÁ IMPLEMENTADO

**Query `list`**:
```typescript
list: protectedProcedure.query(async ({ ctx }) => {
  // Planos fixos para MVP
  const plans = [
    {
      id: "1",
      name: "1 aula",
      lessons: 1,
      price: 79,
      discount: 0,
      originalPrice: 79,
    },
    {
      id: "5",
      name: "5 aulas",
      lessons: 5,
      price: 355,
      discount: 10,
      originalPrice: 395,
    },
    {
      id: "10",
      name: "10 aulas",
      lessons: 10,
      price: 672,
      discount: 15,
      originalPrice: 790,
    },
  ];

  return plans;
}),
```

---

#### **chat.ts** ✅ ATUALIZADO

**Mutation `sendMessage` - Atualizada**:
```typescript
sendMessage: protectedProcedure
  .input(z.object({
    lessonId: z.string(),
    content: z.string().min(1).max(1000),
  }))
  .mutation(async ({ ctx, input }) => {
    // ... validações ...

    // ✅ Permitir chat para status PENDING e SCHEDULED
    if (lesson.status === "PENDING" || lesson.status === "SCHEDULED") {
      // Permitir chat sem restrição de tempo
    } else {
      // Restrições de tempo para outros status
    }

    const message = await ctx.prisma.chatMessage.create({
      data: {
        lessonId: input.lessonId,
        senderId: user.id,
        content: input.content,
      },
    });

    // Notificar via Pusher
    await sendChatNotification(input.lessonId, CHAT_EVENTS.NEW_MESSAGE, {
      id: message.id,
      senderId: user.id,
      senderName: user.name,
      content: message.content,
      createdAt: message.createdAt,
    });

    return message;
  }),
```

---

## 🔌 Endpoints Disponíveis

### Queries

| Router | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| `instructor` | `slots` | Horários disponíveis do instrutor | ✅ |
| `instructor` | `vehicles` | Veículos do instrutor | ✅ |
| `student` | `getVehicle` | Veículo do aluno | ✅ |
| `plan` | `list` | Planos disponíveis | ✅ |

### Mutations

| Router | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| `lesson` | `request` | Criar solicitação de aula | ✅ |
| `lesson` | `acceptRequest` | Aceitar solicitação (instrutor) | ✅ |
| `lesson` | `rejectRequest` | Recusar solicitação (instrutor) | ✅ |
| `lesson` | `reschedule` | Reagendar aula (instrutor) | ✅ |
| `chat` | `sendMessage` | Enviar mensagem no chat | ✅ |

---

## 🎯 Validações Implementadas

### Backend

1. ✅ **Horário mínimo de 2h de antecedência**
   ```typescript
   const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);
   if (input.scheduledAt < twoHoursFromNow) {
     throw new Error("A aula deve ser agendada com pelo menos 2 horas de antecedência");
   }
   ```

2. ✅ **Verificação de horário ocupado**
   ```typescript
   const existingLesson = await ctx.prisma.lesson.findFirst({
     where: {
       instructorId: input.instructorId,
       scheduledAt: input.scheduledAt,
       status: { in: ["PENDING", "SCHEDULED", "ACTIVE"] },
     },
   });
   ```

3. ✅ **Instrutor disponível**
   ```typescript
   if (!instructor || !instructor.isAvailable) {
     throw new Error("Instructor not available");
   }
   ```

4. ✅ **Status PENDING para aceitar**
   ```typescript
   if (lesson.status !== "PENDING") {
     throw new Error("Lesson already processed");
   }
   ```

---

## ⏱️ Timer de Expiração

### Implementação Atual (Desenvolvimento)

```typescript
setTimeout(async () => {
  const currentLesson = await ctx.prisma.lesson.findUnique({
    where: { id: lesson.id },
  });

  if (currentLesson?.status === "PENDING") {
    await ctx.prisma.lesson.update({
      where: { id: lesson.id },
      data: { status: "EXPIRED" },
    });
    
    // TODO: Enviar notificação push para o aluno
    console.log(`Lesson ${lesson.id} expired`);
  }
}, 2 * 60 * 1000); // 2 minutos
```

### Recomendação para Produção

⚠️ **IMPORTANTE**: Em produção, substituir `setTimeout` por:

1. **Bull/BullMQ** (Recomendado)
   ```typescript
   import { Queue } from 'bullmq';
   
   const lessonQueue = new Queue('lesson-expiration');
   
   await lessonQueue.add('expire-lesson', {
     lessonId: lesson.id,
   }, {
     delay: 2 * 60 * 1000, // 2 minutos
   });
   ```

2. **Cron Job** (Alternativa)
   ```typescript
   // Rodar a cada minuto
   cron.schedule('* * * * *', async () => {
     const expiredLessons = await prisma.lesson.findMany({
       where: {
         status: 'PENDING',
         createdAt: {
           lt: new Date(Date.now() - 2 * 60 * 1000),
         },
       },
     });
     
     for (const lesson of expiredLessons) {
       await prisma.lesson.update({
         where: { id: lesson.id },
         data: { status: 'EXPIRED' },
       });
     }
   });
   ```

---

## 🔔 Notificações Push (TODO)

### Eventos que Precisam de Notificações

1. **Nova solicitação** (para instrutor)
   ```typescript
   await sendPushNotification({
     userId: instructor.userId,
     title: "Nova solicitação de aula!",
     body: `${student.user.name} quer agendar uma aula`,
     data: { lessonId: lesson.id },
   });
   ```

2. **Aula aceita** (para aluno)
   ```typescript
   await sendPushNotification({
     userId: student.userId,
     title: "Aula confirmada!",
     body: `${dateStr} às ${timeStr}. Te espero lá!`,
     data: { lessonId: lesson.id },
   });
   ```

3. **Aula recusada** (para aluno)
   ```typescript
   await sendPushNotification({
     userId: student.userId,
     title: "Solicitação recusada",
     body: `${instructor.user.name} não pode no momento`,
     data: { lessonId: lesson.id },
   });
   ```

4. **Solicitação expirada** (para aluno)
   ```typescript
   await sendPushNotification({
     userId: student.userId,
     title: "Solicitação expirada",
     body: "O instrutor não respondeu a tempo",
     data: { lessonId: lesson.id },
   });
   ```

### Implementação Sugerida

```typescript
// packages/api/src/modules/pushNotifications.ts
import * as Notifications from 'expo-notifications';

export async function sendPushNotification({
  userId,
  title,
  body,
  data,
}: {
  userId: string;
  title: string;
  body: string;
  data?: any;
}) {
  // Buscar push token do usuário
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { pushToken: true },
  });

  if (!user?.pushToken) {
    console.log(`No push token for user ${userId}`);
    return;
  }

  // Enviar notificação via Expo
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: user.pushToken,
      title,
      body,
      data,
      sound: 'default',
    }),
  });
}
```

---

## 📝 Migration Prisma

### Comando para Aplicar

```bash
cd packages/db
npx prisma migrate dev --name add_lesson_request_flow
```

### Mudanças na Migration

1. Adicionar valores `PENDING` e `EXPIRED` ao enum `LessonStatus`
2. Adicionar valores `DINHEIRO`, `DEBITO`, `CREDITO` ao enum `PaymentMethod`
3. Adicionar colunas ao modelo `Lesson`:
   - `lessonType` (String, nullable)
   - `vehicleId` (String, nullable)
   - `useOwnVehicle` (Boolean, default false)
   - `planId` (String, nullable)
   - `paymentMethod` (PaymentMethod, default PIX)
   - `installments` (Int, default 1)
4. Alterar default de `status` em `Lesson` de `SCHEDULED` para `PENDING`
5. Criar tabela `Plan`

---

## ✅ Checklist de Implementação

### Backend
- [x] Atualizar schema Prisma
- [x] Adicionar enum `PENDING` e `EXPIRED` em `LessonStatus`
- [x] Adicionar novos valores em `PaymentMethod`
- [x] Adicionar campos em `Lesson`
- [x] Criar modelo `Plan`
- [x] Atualizar mutation `lesson.request`
- [x] Atualizar mutation `lesson.acceptRequest`
- [x] Adicionar query `student.getVehicle`
- [x] Atualizar `chat.sendMessage` para PENDING
- [x] Implementar timer de expiração
- [ ] Criar migration Prisma
- [ ] Aplicar migration no banco
- [ ] Implementar notificações push
- [ ] Substituir setTimeout por job queue (produção)
- [ ] Adicionar testes unitários
- [ ] Adicionar testes de integração

### Frontend (já implementado ✅)
- [x] Todos os 6 steps
- [x] FAB na home
- [x] Validações
- [x] Navegação
- [x] Persistência

---

## 🚀 Como Testar

### 1. Aplicar Migration

```bash
cd packages/db
npx prisma migrate dev
npx prisma generate
```

### 2. Reiniciar Servidor

```bash
# No diretório raiz
npm run dev
```

### 3. Testar Fluxo

1. Abrir app do aluno
2. Clicar no FAB "Solicitar Aula"
3. Preencher os 6 steps
4. Confirmar solicitação
5. Verificar que aula foi criada com status `PENDING`
6. Abrir app do instrutor
7. Ver solicitação pendente
8. Aceitar ou recusar
9. Verificar mudança de status

---

## 📚 Próximos Passos

### Prioridade Alta
1. ⚠️ Aplicar migration no banco de dados
2. ⚠️ Implementar notificações push
3. ⚠️ Testar fluxo completo end-to-end

### Prioridade Média
1. Substituir `setTimeout` por Bull/BullMQ
2. Adicionar logs estruturados
3. Implementar retry logic para notificações

### Prioridade Baixa
1. Adicionar testes automatizados
2. Melhorar mensagens de erro
3. Adicionar analytics/tracking

---

**Implementado em**: 2026-01-01  
**Versão**: 1.0.0  
**Status**: ✅ Backend Completo | ⏳ Migration Pendente
