# 🚀 ROADMAP COMPLETO - BORA PWA

## 🎯 Objetivo
Implementar onboarding completo, backend robusto e features essenciais para lançar o MVP.

---

## 📋 FASE 1: COMPLETAR ONBOARDING (3-5 dias)

### 1.1 Calendário Semanal Interativo
**Componente:** `WeeklyCalendar.tsx`

**Features:**
- ✅ Grid 7 dias x 24 horas
- ✅ Seleção de slots de 30 minutos
- ✅ Drag para selecionar múltiplos slots
- ✅ Visual feedback (hover, selected)
- ✅ Validação: mínimo 10h/semana
- ✅ Resumo: "12 horas selecionadas"

**Tecnologia:**
```typescript
// Usar react-big-calendar ou criar custom
import { useState } from 'react';

interface TimeSlot {
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6; // Dom-Sáb
  startTime: string; // "14:00"
  endTime: string;   // "14:30"
}

const WeeklyCalendar = () => {
  const [selectedSlots, setSelectedSlots] = useState<TimeSlot[]>([]);
  // ...
};
```

**Validações:**
- Mínimo 10 horas/semana
- Slots de 30 minutos
- Sem sobreposição
- Horário comercial (6h-22h)

---

### 1.2 Upload de Fotos do Veículo
**Componente:** `VehiclePhotoUpload.tsx`

**Features:**
- ✅ Upload múltiplo (até 5 fotos)
- ✅ Preview antes de enviar
- ✅ Crop/resize automático (16:9)
- ✅ Compressão de imagem
- ✅ Validação: formato, tamanho

**Tecnologia:**
```typescript
// Usar react-dropzone + sharp (server) ou browser-image-compression
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';

const VehiclePhotoUpload = () => {
  const onDrop = async (files: File[]) => {
    const compressed = await imageCompression(files[0], {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
    });
    // Upload to storage
  };
};
```

**Storage:**
- Vercel Blob Storage (recomendado)
- Cloudinary (alternativa)
- AWS S3 (escalável)

---

### 1.3 Validações Completas
**Arquivo:** `src/lib/validations/onboarding.ts`

**Schemas (Zod):**
```typescript
import { z } from 'zod';

export const scheduleSchema = z.object({
  weeklyHours: z.array(z.object({
    day: z.number().min(0).max(6),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
  })).min(20), // 10h = 20 slots de 30min
});

export const addressSchema = z.object({
  cep: z.string().regex(/^\d{8}$/),
  street: z.string().min(3),
  city: z.string().min(2),
  state: z.string().length(2),
});

export const pricingSchema = z.object({
  pricePerHour: z.number().min(50).max(500),
});

export const vehicleSchema = z.object({
  vehicleId: z.string().uuid(),
  photos: z.array(z.string().url()).min(1).max(5),
});
```

**Validação em Tempo Real:**
```typescript
const { register, formState: { errors } } = useForm({
  resolver: zodResolver(scheduleSchema),
});
```

---

## 📋 FASE 2: IMPLEMENTAR BACKEND (5-7 dias)

### 2.1 Autenticação (NextAuth.js)
**Arquivo:** `src/app/api/auth/[...nextauth]/route.ts`

**Providers:**
```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validar com Prisma
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });
        
        if (user && await bcrypt.compare(credentials.password, user.password)) {
          return user;
        }
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
    signUp: '/signup',
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

**Proteção de Rotas:**
```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      if (req.nextUrl.pathname.startsWith('/instructor')) {
        return token?.role === 'instructor';
      }
      if (req.nextUrl.pathname.startsWith('/student')) {
        return token?.role === 'student';
      }
      return !!token;
    },
  },
});

export const config = {
  matcher: ['/instructor/:path*', '/student/:path*'],
};
```

---

### 2.2 Database (Prisma + PostgreSQL)
**Arquivo:** `packages/database/prisma/schema.prisma`

**Schema Completo:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  STUDENT
  INSTRUCTOR
  ADMIN
}

enum InstructorStatus {
  PENDING_ONBOARDING
  ONLINE
  OFFLINE
  SUSPENDED
}

enum LessonStatus {
  PENDING
  SCHEDULED
  CONFIRMED
  COMPLETED
  CANCELLED
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String?
  name          String
  phone         String?
  role          UserRole
  emailVerified DateTime?
  image         String?
  
  student       Student?
  instructor    Instructor?
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Student {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  
  cpf             String   @unique
  cep             String
  city            String
  state           String
  lessonType      String   // "A", "B", "AB"
  
  lessons         Lesson[]
  reviews         Review[]
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Instructor {
  id              String            @id @default(uuid())
  userId          String            @unique
  user            User              @relation(fields: [userId], references: [id])
  
  cpf             String            @unique
  cnhNumber       String            @unique
  cnhPhoto        String
  detranCredential String
  
  status          InstructorStatus  @default(PENDING_ONBOARDING)
  isOnline        Boolean           @default(false)
  
  // Localização
  cep             String
  street          String
  neighborhood    String
  city            String
  state           String
  
  // Preço
  pricePerHour    Decimal           @db.Decimal(10, 2)
  
  // Stats
  totalLessons    Int               @default(0)
  rating          Decimal?          @db.Decimal(3, 2)
  reviewCount     Int               @default(0)
  
  vehicles        Vehicle[]
  schedules       Schedule[]
  lessons         Lesson[]
  reviews         Review[]
  
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
}

model Vehicle {
  id            String     @id @default(uuid())
  instructorId  String
  instructor    Instructor @relation(fields: [instructorId], references: [id])
  
  brand         String
  model         String
  year          Int
  color         String
  plate         String
  transmission  String     // "manual", "automatic"
  hasDualPedal  Boolean    @default(true)
  
  photos        String[]   // URLs
  
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

model Schedule {
  id            String     @id @default(uuid())
  instructorId  String
  instructor    Instructor @relation(fields: [instructorId], references: [id])
  
  dayOfWeek     Int        // 0-6 (Dom-Sáb)
  startTime     String     // "14:00"
  endTime       String     // "14:30"
  
  isActive      Boolean    @default(true)
  
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  
  @@unique([instructorId, dayOfWeek, startTime])
}

model Lesson {
  id            String       @id @default(uuid())
  studentId     String
  student       Student      @relation(fields: [studentId], references: [id])
  instructorId  String
  instructor    Instructor   @relation(fields: [instructorId], references: [id])
  
  scheduledAt   DateTime
  duration      Int          @default(60) // minutos
  status        LessonStatus @default(PENDING)
  
  price         Decimal      @db.Decimal(10, 2)
  commission    Decimal      @db.Decimal(10, 2) // 15%
  instructorPay Decimal      @db.Decimal(10, 2) // 85%
  
  notes         String?
  
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

model Review {
  id            String     @id @default(uuid())
  studentId     String
  student       Student    @relation(fields: [studentId], references: [id])
  instructorId  String
  instructor    Instructor @relation(fields: [instructorId], references: [id])
  
  rating        Int        // 1-5
  comment       String?
  
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  
  @@unique([studentId, instructorId])
}
```

**Migrations:**
```bash
# Criar migration
npx prisma migrate dev --name init

# Gerar client
npx prisma generate

# Seed database
npx prisma db seed
```

---

### 2.3 API (tRPC)
**Arquivo:** `packages/api/src/root.ts`

**Routers:**
```typescript
import { createTRPCRouter } from "./trpc";
import { authRouter } from "./routers/auth";
import { instructorRouter } from "./routers/instructor";
import { studentRouter } from "./routers/student";
import { lessonRouter } from "./routers/lesson";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  instructor: instructorRouter,
  student: studentRouter,
  lesson: lessonRouter,
});

export type AppRouter = typeof appRouter;
```

**Instructor Router:**
```typescript
// packages/api/src/routers/instructor.ts
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const instructorRouter = createTRPCRouter({
  // Criar primeiro plano
  createFirstPlan: protectedProcedure
    .input(z.object({
      schedules: z.array(z.object({
        dayOfWeek: z.number().min(0).max(6),
        startTime: z.string(),
        endTime: z.string(),
      })),
      cep: z.string(),
      pricePerHour: z.number().min(50),
      vehicleId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Criar schedules
      await ctx.prisma.schedule.createMany({
        data: input.schedules.map(s => ({
          instructorId: ctx.session.user.instructorId,
          ...s,
        })),
      });
      
      // Atualizar instrutor
      await ctx.prisma.instructor.update({
        where: { id: ctx.session.user.instructorId },
        data: {
          status: 'ONLINE',
          isOnline: true,
          cep: input.cep,
          pricePerHour: input.pricePerHour,
        },
      });
      
      return { success: true };
    }),
  
  // Toggle online/offline
  toggleOnline: protectedProcedure
    .mutation(async ({ ctx }) => {
      const instructor = await ctx.prisma.instructor.findUnique({
        where: { id: ctx.session.user.instructorId },
      });
      
      return await ctx.prisma.instructor.update({
        where: { id: ctx.session.user.instructorId },
        data: { isOnline: !instructor.isOnline },
      });
    }),
  
  // Buscar solicitações pendentes
  getPendingRequests: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.lesson.findMany({
        where: {
          instructorId: ctx.session.user.instructorId,
          status: 'PENDING',
        },
        include: {
          student: {
            include: { user: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }),
});
```

---

## 📋 FASE 3: FEATURES ESSENCIAIS (7-10 dias)

### 3.1 Sistema de Busca
**Componente:** `InstructorSearch.tsx`

**Features:**
- ✅ Busca por localização (CEP/cidade)
- ✅ Filtros: preço, avaliação, tipo de carro
- ✅ Ordenação: proximidade, preço, avaliação
- ✅ Mapa interativo (Google Maps)
- ✅ Lista de resultados

**API:**
```typescript
// packages/api/src/routers/student.ts
export const studentRouter = createTRPCRouter({
  searchInstructors: publicProcedure
    .input(z.object({
      cep: z.string().optional(),
      maxDistance: z.number().default(10), // km
      minRating: z.number().min(0).max(5).optional(),
      maxPrice: z.number().optional(),
      transmission: z.enum(['manual', 'automatic']).optional(),
    }))
    .query(async ({ ctx, input }) => {
      // Buscar instrutores próximos
      // Usar PostGIS ou calcular distância
      return await ctx.prisma.instructor.findMany({
        where: {
          status: 'ONLINE',
          isOnline: true,
          pricePerHour: input.maxPrice ? { lte: input.maxPrice } : undefined,
          rating: input.minRating ? { gte: input.minRating } : undefined,
        },
        include: {
          user: true,
          vehicles: true,
        },
      });
    }),
});
```

---

### 3.2 Chat em Tempo Real
**Tecnologia:** Pusher ou Socket.io

**Componente:** `ChatWindow.tsx`

**Features:**
- ✅ Mensagens em tempo real
- ✅ Indicador de digitação
- ✅ Status online/offline
- ✅ Histórico de mensagens
- ✅ Notificações

**Setup Pusher:**
```typescript
// src/lib/pusher.ts
import Pusher from 'pusher';
import PusherClient from 'pusher-js';

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
});

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  }
);
```

**API:**
```typescript
// packages/api/src/routers/chat.ts
export const chatRouter = createTRPCRouter({
  sendMessage: protectedProcedure
    .input(z.object({
      lessonId: z.string(),
      message: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.prisma.message.create({
        data: {
          lessonId: input.lessonId,
          senderId: ctx.session.user.id,
          content: input.message,
        },
      });
      
      // Enviar via Pusher
      await pusherServer.trigger(
        `lesson-${input.lessonId}`,
        'new-message',
        message
      );
      
      return message;
    }),
});
```

---

### 3.3 Pagamentos (Stripe)
**Setup:**
```bash
pnpm add stripe @stripe/stripe-js
```

**API:**
```typescript
// packages/api/src/routers/payment.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const paymentRouter = createTRPCRouter({
  createPaymentIntent: protectedProcedure
    .input(z.object({
      lessonId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const lesson = await ctx.prisma.lesson.findUnique({
        where: { id: input.lessonId },
      });
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(lesson.price.toNumber() * 100), // centavos
        currency: 'brl',
        metadata: {
          lessonId: input.lessonId,
        },
      });
      
      return { clientSecret: paymentIntent.client_secret };
    }),
  
  confirmPayment: protectedProcedure
    .input(z.object({
      lessonId: z.string(),
      paymentIntentId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Atualizar lesson
      await ctx.prisma.lesson.update({
        where: { id: input.lessonId },
        data: { status: 'CONFIRMED' },
      });
      
      // Atualizar stats do instrutor
      await ctx.prisma.instructor.update({
        where: { id: lesson.instructorId },
        data: {
          totalLessons: { increment: 1 },
        },
      });
      
      return { success: true };
    }),
});
```

---

## 📊 CRONOGRAMA

| Fase | Duração | Prioridade |
|------|---------|------------|
| **Fase 1: Onboarding** | 3-5 dias | 🔴 Alta |
| **Fase 2: Backend** | 5-7 dias | 🔴 Alta |
| **Fase 3: Features** | 7-10 dias | 🟡 Média |
| **TOTAL** | **15-22 dias** | - |

---

## ✅ CHECKLIST GERAL

### Fase 1: Onboarding
- [ ] WeeklyCalendar component
- [ ] TimeSlotPicker component
- [ ] VehiclePhotoUpload component
- [ ] Validações Zod
- [ ] Integração ViaCEP
- [ ] Testes E2E

### Fase 2: Backend
- [ ] NextAuth setup
- [ ] Prisma schema
- [ ] Migrations
- [ ] tRPC routers
- [ ] Middleware auth
- [ ] Seed database

### Fase 3: Features
- [ ] Sistema de busca
- [ ] Mapa interativo
- [ ] Chat em tempo real
- [ ] Pagamentos Stripe
- [ ] Notificações push
- [ ] Analytics

---

## 🚀 PRÓXIMO PASSO

**Começar pela Fase 1: Completar Onboarding**

Quer que eu implemente:
1. **WeeklyCalendar** (calendário semanal interativo)
2. **VehiclePhotoUpload** (upload de fotos)
3. **Validações Zod** (schemas completos)

Qual você prefere começar?
