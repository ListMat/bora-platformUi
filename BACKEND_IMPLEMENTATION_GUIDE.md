# Backend Implementation Guide - Solicitar Aula Flow

## 📋 tRPC Endpoints Necessários

### 1. `instructor.slots` (Query)

**Descrição**: Retorna os horários disponíveis de um instrutor em uma data específica

**Input**:
```typescript
{
  instructorId: string;
  date: Date;
}
```

**Output**:
```typescript
{
  availableSlots: string[]; // ["08:00", "08:30", "09:00", ...]
}
```

**Lógica**:
1. Buscar todas as aulas agendadas do instrutor na data
2. Gerar slots de 30 em 30 minutos (08:00 - 20:30)
3. Remover slots já ocupados
4. Remover slots com menos de 2h de antecedência
5. Retornar apenas slots disponíveis

**Exemplo de Implementação**:
```typescript
slots: publicProcedure
  .input(z.object({
    instructorId: z.string(),
    date: z.date(),
  }))
  .query(async ({ input, ctx }) => {
    const { instructorId, date } = input;
    
    // Buscar aulas agendadas
    const lessons = await ctx.db.lesson.findMany({
      where: {
        instructorId,
        scheduledAt: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
        status: { in: ['SCHEDULED', 'ACTIVE'] },
      },
    });
    
    // Gerar todos os slots possíveis
    const allSlots = generateTimeSlots(); // ["08:00", "08:30", ...]
    
    // Remover slots ocupados
    const occupiedSlots = lessons.map(l => 
      format(l.scheduledAt, 'HH:mm')
    );
    
    // Remover slots com menos de 2h de antecedência
    const now = new Date();
    const twoHoursFromNow = addHours(now, 2);
    
    const availableSlots = allSlots.filter(slot => {
      const slotDateTime = parse(slot, 'HH:mm', date);
      return !occupiedSlots.includes(slot) && 
             slotDateTime > twoHoursFromNow;
    });
    
    return { availableSlots };
  }),
```

---

### 2. `instructor.vehicles` (Query)

**Descrição**: Retorna os veículos cadastrados de um instrutor

**Input**:
```typescript
{
  instructorId: string;
}
```

**Output**:
```typescript
{
  vehicles: Array<{
    id: string;
    model: string;
    brand: string;
    photo: string | null;
    transmission: "MANUAL" | "AUTOMATIC";
    hasDualPedal: boolean;
    plateLast4: string | null;
  }>;
}
```

**Exemplo de Implementação**:
```typescript
vehicles: publicProcedure
  .input(z.object({
    instructorId: z.string(),
  }))
  .query(async ({ input, ctx }) => {
    const vehicles = await ctx.db.vehicle.findMany({
      where: {
        instructorId: input.instructorId,
        isActive: true,
      },
      select: {
        id: true,
        model: true,
        brand: true,
        photo: true,
        transmission: true,
        hasDualPedal: true,
        plateLast4: true,
      },
    });
    
    return { vehicles };
  }),
```

---

### 3. `student.getVehicle` (Query)

**Descrição**: Retorna o veículo cadastrado do aluno (se houver)

**Input**: Nenhum (usa ctx.session.user.id)

**Output**:
```typescript
{
  id: string;
  model: string;
  brand: string;
  photo: string | null;
  transmission: "MANUAL" | "AUTOMATIC";
  plateLast4: string | null;
} | null
```

**Exemplo de Implementação**:
```typescript
getVehicle: protectedProcedure
  .query(async ({ ctx }) => {
    const student = await ctx.db.student.findUnique({
      where: { userId: ctx.session.user.id },
      include: { vehicle: true },
    });
    
    return student?.vehicle || null;
  }),
```

---

### 4. `plan.list` (Query)

**Descrição**: Retorna os planos disponíveis (1, 5, 10 aulas)

**Input**: Nenhum (ou filtros opcionais)

**Output**:
```typescript
{
  plans: Array<{
    id: string;
    lessons: number;
    price: number;
    discount: number;
  }>;
}
```

**Exemplo de Implementação**:
```typescript
list: publicProcedure
  .query(async ({ ctx }) => {
    const plans = await ctx.db.plan.findMany({
      where: { isActive: true },
      orderBy: { lessons: 'asc' },
    });
    
    return { plans };
  }),
```

---

### 5. `lesson.request` (Mutation)

**Descrição**: Cria uma nova solicitação de aula

**Input**:
```typescript
{
  instructorId: string;
  scheduledAt: Date;
  lessonType: string;
  vehicleId?: string;
  useOwnVehicle: boolean;
  planId?: string;
  paymentMethod: "PIX" | "DINHEIRO" | "DEBITO" | "CREDITO";
  price: number;
  installments: number;
}
```

**Output**:
```typescript
{
  lesson: {
    id: string;
    status: "PENDING";
    scheduledAt: Date;
    // ... outros campos
  };
  initialMessage: string;
}
```

**Lógica**:
1. Validar se horário está disponível
2. Validar se é pelo menos 2h no futuro
3. Criar registro de aula com status "PENDING"
4. Criar chat entre aluno e instrutor
5. Gerar mensagem inicial formatada
6. Enviar notificação push para instrutor
7. Iniciar timer de 2 minutos para resposta

**Exemplo de Implementação**:
```typescript
request: protectedProcedure
  .input(z.object({
    instructorId: z.string(),
    scheduledAt: z.date(),
    lessonType: z.string(),
    vehicleId: z.string().optional(),
    useOwnVehicle: z.boolean(),
    planId: z.string().optional(),
    paymentMethod: z.enum(["PIX", "DINHEIRO", "DEBITO", "CREDITO"]),
    price: z.number(),
    installments: z.number(),
  }))
  .mutation(async ({ input, ctx }) => {
    const { instructorId, scheduledAt, ...rest } = input;
    
    // Validar horário disponível
    const existingLesson = await ctx.db.lesson.findFirst({
      where: {
        instructorId,
        scheduledAt,
        status: { in: ['SCHEDULED', 'ACTIVE', 'PENDING'] },
      },
    });
    
    if (existingLesson) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Horário já está ocupado',
      });
    }
    
    // Validar 2h mínimo
    const twoHoursFromNow = addHours(new Date(), 2);
    if (scheduledAt < twoHoursFromNow) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Aula deve ser agendada com pelo menos 2h de antecedência',
      });
    }
    
    // Buscar aluno
    const student = await ctx.db.student.findUnique({
      where: { userId: ctx.session.user.id },
      include: { user: true },
    });
    
    if (!student) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Aluno não encontrado',
      });
    }
    
    // Criar aula
    const lesson = await ctx.db.lesson.create({
      data: {
        instructorId,
        studentId: student.id,
        scheduledAt,
        status: 'PENDING',
        lessonType: rest.lessonType,
        vehicleId: rest.vehicleId,
        useOwnVehicle: rest.useOwnVehicle,
        planId: rest.planId,
        paymentMethod: rest.paymentMethod,
        price: rest.price,
        installments: rest.installments,
      },
      include: {
        instructor: {
          include: { user: true },
        },
        vehicle: true,
      },
    });
    
    // Criar chat
    await ctx.db.chat.create({
      data: {
        lessonId: lesson.id,
        participants: {
          connect: [
            { id: student.userId },
            { id: lesson.instructor.userId },
          ],
        },
      },
    });
    
    // Gerar mensagem inicial
    const initialMessage = `Solicitação de ${student.user.name}
${format(scheduledAt, "EEEE, dd/MM 'às' HH:mm", { locale: ptBR })}
${rest.lessonType} – ${lesson.vehicle?.model || 'Carro próprio'}
R$ ${rest.price.toFixed(2)} (${rest.paymentMethod} ao final)`;
    
    // Enviar notificação push para instrutor
    await sendPushNotification({
      userId: lesson.instructor.userId,
      title: 'Nova solicitação de aula!',
      body: `${student.user.name} quer agendar uma aula`,
      data: { lessonId: lesson.id },
    });
    
    // Iniciar timer de 2 minutos
    setTimeout(async () => {
      const currentLesson = await ctx.db.lesson.findUnique({
        where: { id: lesson.id },
      });
      
      if (currentLesson?.status === 'PENDING') {
        await ctx.db.lesson.update({
          where: { id: lesson.id },
          data: { status: 'EXPIRED' },
        });
        
        // Notificar aluno
        await sendPushNotification({
          userId: student.userId,
          title: 'Solicitação expirada',
          body: 'O instrutor não respondeu a tempo. Tente outro instrutor.',
        });
      }
    }, 2 * 60 * 1000); // 2 minutos
    
    return {
      lesson,
      initialMessage,
    };
  }),
```

---

### 6. `chat.sendMessage` (Mutation)

**Descrição**: Envia uma mensagem no chat da aula

**Input**:
```typescript
{
  lessonId: string;
  content: string;
}
```

**Output**:
```typescript
{
  message: {
    id: string;
    content: string;
    createdAt: Date;
    // ... outros campos
  };
}
```

**Exemplo de Implementação**:
```typescript
sendMessage: protectedProcedure
  .input(z.object({
    lessonId: z.string(),
    content: z.string(),
  }))
  .mutation(async ({ input, ctx }) => {
    const message = await ctx.db.message.create({
      data: {
        lessonId: input.lessonId,
        senderId: ctx.session.user.id,
        content: input.content,
        type: 'SYSTEM', // ou 'USER'
      },
    });
    
    return { message };
  }),
```

---

## 🔔 Notificações Push

### Eventos que Disparam Notificações

1. **Nova solicitação de aula** (para instrutor)
   - Título: "Nova solicitação de aula!"
   - Corpo: "{Nome do aluno} quer agendar uma aula"
   - Data: `{ lessonId }`

2. **Aula aceita** (para aluno)
   - Título: "Aula confirmada!"
   - Corpo: "{Dia} às {Hora}. Te espero lá!"
   - Data: `{ lessonId }`

3. **Aula recusada** (para aluno)
   - Título: "Solicitação recusada"
   - Corpo: "{Nome do instrutor} não pode no momento"
   - Data: `{ lessonId }`

4. **Solicitação expirada** (para aluno)
   - Título: "Solicitação expirada"
   - Corpo: "O instrutor não respondeu a tempo. Tente outro instrutor."
   - Data: `{ lessonId }`

---

## 🗄️ Schema Prisma Sugerido

```prisma
model Lesson {
  id            String   @id @default(cuid())
  instructorId  String
  studentId     String
  scheduledAt   DateTime
  status        LessonStatus @default(PENDING)
  lessonType    String
  vehicleId     String?
  useOwnVehicle Boolean  @default(false)
  planId        String?
  paymentMethod PaymentMethod
  price         Float
  installments  Int      @default(1)
  
  instructor    Instructor @relation(fields: [instructorId], references: [id])
  student       Student    @relation(fields: [studentId], references: [id])
  vehicle       Vehicle?   @relation(fields: [vehicleId], references: [id])
  plan          Plan?      @relation(fields: [planId], references: [id])
  chat          Chat?
  messages      Message[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum LessonStatus {
  PENDING    // Aguardando resposta do instrutor
  SCHEDULED  // Aceita pelo instrutor
  ACTIVE     // Em andamento
  FINISHED   // Concluída
  CANCELLED  // Cancelada
  EXPIRED    // Expirou (2 min sem resposta)
}

enum PaymentMethod {
  PIX
  DINHEIRO
  DEBITO
  CREDITO
}

model Vehicle {
  id            String   @id @default(cuid())
  instructorId  String?
  studentId     String?
  brand         String
  model         String
  photo         String?
  transmission  Transmission
  hasDualPedal  Boolean  @default(false)
  plateLast4    String?
  isActive      Boolean  @default(true)
  
  instructor    Instructor? @relation(fields: [instructorId], references: [id])
  student       Student?    @relation(fields: [studentId], references: [id])
  lessons       Lesson[]
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum Transmission {
  MANUAL
  AUTOMATIC
}

model Plan {
  id       String  @id @default(cuid())
  lessons  Int
  price    Float
  discount Int     @default(0)
  isActive Boolean @default(true)
  
  lessonsPurchased Lesson[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Chat {
  id        String   @id @default(cuid())
  lessonId  String   @unique
  
  lesson    Lesson   @relation(fields: [lessonId], references: [id])
  messages  Message[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Message {
  id        String      @id @default(cuid())
  chatId    String
  lessonId  String
  senderId  String
  content   String
  type      MessageType @default(USER)
  
  chat      Chat     @relation(fields: [chatId], references: [id])
  lesson    Lesson   @relation(fields: [lessonId], references: [id])
  sender    User     @relation(fields: [senderId], references: [id])
  
  createdAt DateTime @default(now())
}

enum MessageType {
  SYSTEM
  USER
}
```

---

## ✅ Checklist de Implementação

### Backend
- [ ] Criar migrations do Prisma
- [ ] Implementar `instructor.slots` query
- [ ] Implementar `instructor.vehicles` query
- [ ] Implementar `student.getVehicle` query
- [ ] Implementar `plan.list` query
- [ ] Implementar `lesson.request` mutation
- [ ] Implementar `chat.sendMessage` mutation
- [ ] Configurar notificações push (Expo Push Notifications)
- [ ] Implementar timer de 2 minutos para expiração
- [ ] Adicionar testes unitários
- [ ] Adicionar testes de integração

### Frontend (já implementado ✅)
- [x] StepDateTime component
- [x] StepLessonType component
- [x] StepVehicle component
- [x] StepPlan component
- [x] StepPayment component
- [x] StepConfirm component
- [x] SolicitarAulaFlow main component
- [x] Floating Action Button na home
- [x] Integração com tRPC
- [x] Validações
- [x] Navegação
- [x] Persistência (AsyncStorage)

---

## 🧪 Testes Sugeridos

### Testes de Integração

```typescript
describe('Lesson Request Flow', () => {
  it('should create lesson request successfully', async () => {
    const result = await caller.lesson.request({
      instructorId: 'instructor-1',
      scheduledAt: addHours(new Date(), 3),
      lessonType: '1ª Habilitação',
      useOwnVehicle: false,
      paymentMethod: 'PIX',
      price: 79,
      installments: 1,
    });
    
    expect(result.lesson.status).toBe('PENDING');
    expect(result.initialMessage).toContain('Solicitação de');
  });
  
  it('should reject if less than 2 hours in advance', async () => {
    await expect(
      caller.lesson.request({
        instructorId: 'instructor-1',
        scheduledAt: addHours(new Date(), 1),
        // ... outros campos
      })
    ).rejects.toThrow('pelo menos 2h de antecedência');
  });
  
  it('should reject if slot is already occupied', async () => {
    const scheduledAt = addHours(new Date(), 3);
    
    // Criar primeira aula
    await caller.lesson.request({
      instructorId: 'instructor-1',
      scheduledAt,
      // ... outros campos
    });
    
    // Tentar criar segunda aula no mesmo horário
    await expect(
      caller.lesson.request({
        instructorId: 'instructor-1',
        scheduledAt,
        // ... outros campos
      })
    ).rejects.toThrow('Horário já está ocupado');
  });
});
```

---

## 📚 Referências

- [tRPC Documentation](https://trpc.io/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)
- [date-fns](https://date-fns.org/docs/Getting-Started)

---

**Criado em**: 2026-01-01
**Versão**: 1.0.0
