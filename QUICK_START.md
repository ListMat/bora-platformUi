# 🚀 Quick Start Guide - Solicitar Aula Flow

## Para Desenvolvedores Frontend

### Como Navegar para o Fluxo

```typescript
import { useRouter } from "expo-router";

const router = useRouter();

// Opção 1: Sem instrutor pré-selecionado
router.push("/screens/SolicitarAulaFlow");

// Opção 2: Com instrutor pré-selecionado
router.push({
  pathname: "/screens/SolicitarAulaFlow",
  params: { instructorId: "instructor-123" },
});

// Opção 3: Quick book (usa última configuração)
router.push({
  pathname: "/screens/SolicitarAulaFlow",
  params: { quickBook: "true" },
});
```

### Como Usar o Componente

```typescript
import SolicitarAulaFlow from "@/app/screens/SolicitarAulaFlow";

// Como modal
<SolicitarAulaFlow
  visible={isVisible}
  onClose={() => setIsVisible(false)}
  instructorId="instructor-123"
/>

// Como tela (via router - recomendado)
// Usar router.push conforme acima
```

---

## Para Desenvolvedores Backend

### Endpoints Necessários (tRPC)

```typescript
// 1. Horários disponíveis
const slots = await trpc.instructor.slots.useQuery({
  instructorId: "instructor-123",
  date: new Date("2026-01-15"),
});
// Retorna: { availableSlots: ["08:00", "08:30", ...] }

// 2. Veículos do instrutor
const vehicles = await trpc.instructor.vehicles.useQuery({
  instructorId: "instructor-123",
});
// Retorna: { vehicles: [...] }

// 3. Veículo do aluno
const vehicle = await trpc.student.getVehicle.useQuery();
// Retorna: { id, model, brand, ... } | null

// 4. Planos disponíveis
const plans = await trpc.plan.list.useQuery();
// Retorna: { plans: [...] }

// 5. Criar solicitação
const result = await trpc.lesson.request.mutate({
  instructorId: "instructor-123",
  scheduledAt: new Date("2026-01-15T15:30:00"),
  lessonType: "1ª Habilitação",
  vehicleId: "vehicle-456",
  useOwnVehicle: false,
  planId: "plan-1",
  paymentMethod: "PIX",
  price: 79,
  installments: 1,
});
// Retorna: { lesson, initialMessage }

// 6. Enviar mensagem
const message = await trpc.chat.sendMessage.mutate({
  lessonId: "lesson-789",
  content: "Mensagem do sistema",
});
```

---

## Estrutura de Dados

### FormData (State)

```typescript
interface FormData {
  date: Date | null;
  time: string;                    // "15:30"
  lessonType: string;              // "1ª Habilitação"
  vehicleId: string | null;
  useOwnVehicle: boolean;
  planId: string | null;           // "1", "5", "10"
  paymentMethod: "PIX" | "DINHEIRO" | "DEBITO" | "CREDITO";
  price: number;                   // 79, 355, 672
  installments: number;            // 1, 2, 3
}
```

### Lesson (Database)

```typescript
interface Lesson {
  id: string;
  instructorId: string;
  studentId: string;
  scheduledAt: Date;
  status: "PENDING" | "SCHEDULED" | "ACTIVE" | "FINISHED" | "CANCELLED" | "EXPIRED";
  lessonType: string;
  vehicleId?: string;
  useOwnVehicle: boolean;
  planId?: string;
  paymentMethod: "PIX" | "DINHEIRO" | "DEBITO" | "CREDITO";
  price: number;
  installments: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Validações

### Frontend (Implementadas)

```typescript
// Step 1: Data & Horário
if (!formData.date || !formData.time) {
  Alert.alert("Atenção", "Selecione a data e horário da aula");
  return false;
}

// Mínimo 2h de antecedência
const scheduledAt = new Date(formData.date);
const [hours, minutes] = formData.time.split(":").map(Number);
scheduledAt.setHours(hours, minutes, 0, 0);

const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);
if (scheduledAt < twoHoursFromNow) {
  Alert.alert("Atenção", "A aula deve ser agendada com pelo menos 2 horas de antecedência");
  return false;
}

// Step 2: Tipo de Aula
if (!formData.lessonType) {
  Alert.alert("Atenção", "Selecione o tipo de aula");
  return false;
}

// Step 3: Veículo
if (!formData.vehicleId && !formData.useOwnVehicle) {
  Alert.alert("Atenção", "Selecione um veículo");
  return false;
}

// Step 4: Plano
if (!formData.planId) {
  Alert.alert("Atenção", "Selecione um plano");
  return false;
}

// Step 5: Pagamento
if (!formData.paymentMethod) {
  Alert.alert("Atenção", "Selecione a forma de pagamento");
  return false;
}
```

### Backend (A Implementar)

```typescript
// Validar horário disponível
const existingLesson = await db.lesson.findFirst({
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
const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000);
if (scheduledAt < twoHoursFromNow) {
  throw new TRPCError({
    code: 'BAD_REQUEST',
    message: 'Aula deve ser agendada com pelo menos 2h de antecedência',
  });
}
```

---

## Estados e Fluxos

### Status da Aula

```
PENDING    → Aguardando resposta do instrutor (2 min)
    ↓
SCHEDULED  → Aceita pelo instrutor
    ↓
ACTIVE     → Em andamento
    ↓
FINISHED   → Concluída
```

```
PENDING    → Sem resposta em 2 min
    ↓
EXPIRED    → Expirou
```

```
PENDING    → Instrutor recusou
    ↓
CANCELLED  → Cancelada
```

---

## Notificações Push

### Configuração (Expo)

```typescript
import * as Notifications from 'expo-notifications';

// Configurar handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Enviar notificação
await Notifications.scheduleNotificationAsync({
  content: {
    title: "Nova solicitação de aula!",
    body: "João quer agendar uma aula",
    data: { lessonId: "lesson-123" },
  },
  trigger: null, // Imediato
});
```

### Eventos

1. **Nova solicitação** (para instrutor)
   ```typescript
   {
     title: "Nova solicitação de aula!",
     body: "{Nome do aluno} quer agendar uma aula",
     data: { lessonId }
   }
   ```

2. **Aula aceita** (para aluno)
   ```typescript
   {
     title: "Aula confirmada!",
     body: "{Dia} às {Hora}. Te espero lá!",
     data: { lessonId }
   }
   ```

3. **Aula recusada** (para aluno)
   ```typescript
   {
     title: "Solicitação recusada",
     body: "{Nome do instrutor} não pode no momento",
     data: { lessonId }
   }
   ```

4. **Solicitação expirada** (para aluno)
   ```typescript
   {
     title: "Solicitação expirada",
     body: "O instrutor não respondeu a tempo",
     data: { lessonId }
   }
   ```

---

## Testes

### Frontend (Jest + React Native Testing Library)

```typescript
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SolicitarAulaFlow from '../SolicitarAulaFlow';

describe('SolicitarAulaFlow', () => {
  it('should navigate through all steps', async () => {
    const { getByText, getByTestId } = render(
      <SolicitarAulaFlow visible={true} onClose={jest.fn()} />
    );
    
    // Step 1: Data & Horário
    expect(getByText('Data & Horário')).toBeTruthy();
    fireEvent.press(getByTestId('next-button'));
    
    // Step 2: Tipo de Aula
    await waitFor(() => {
      expect(getByText('Tipo de Aula')).toBeTruthy();
    });
    
    // ... continuar para outros steps
  });
});
```

### Backend (Vitest + tRPC)

```typescript
import { describe, it, expect } from 'vitest';
import { createCaller } from '../trpc/router';

describe('lesson.request', () => {
  it('should create lesson successfully', async () => {
    const caller = createCaller({ session: mockSession });
    
    const result = await caller.lesson.request({
      instructorId: 'instructor-1',
      scheduledAt: new Date('2026-01-15T15:30:00'),
      lessonType: '1ª Habilitação',
      useOwnVehicle: false,
      paymentMethod: 'PIX',
      price: 79,
      installments: 1,
    });
    
    expect(result.lesson.status).toBe('PENDING');
    expect(result.initialMessage).toContain('Solicitação de');
  });
});
```

---

## Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| FAB não aparece | Verificar z-index (100) e posição (bottom-right) |
| Modal não abre | Verificar rota `/screens/SolicitarAulaFlow` |
| Erro ao confirmar | Verificar endpoints tRPC implementados |
| Horários não carregam | Verificar `instructor.slots` query |
| Validação falha | Verificar console para mensagem específica |

---

## Comandos Úteis

```bash
# Limpar cache
npx expo start -c

# Rodar em dev
npx expo start

# Rodar testes
npm test

# Build para produção
npx expo build:android
npx expo build:ios

# Ver logs
npx expo logs
```

---

## Links Rápidos

- 📄 [Documentação Completa](./apps/app-aluno/SOLICITAR_AULA_FLOW.md)
- 🔧 [Guia Backend](./BACKEND_IMPLEMENTATION_GUIDE.md)
- 📊 [Resumo Executivo](./SOLICITAR_AULA_SUMMARY.md)
- 🎨 [Diagrama de Fluxo](./solicitar_aula_flow_diagram.png)

---

**Versão**: 1.0.0  
**Última Atualização**: 2026-01-01
