# 📡 API Documentation - BORA

Documentação dos routers tRPC disponíveis.

## 🔗 Endpoint Base

```
http://localhost:3000/api/trpc
```

## 🔐 Autenticação

Todas as procedures protegidas requerem sessão NextAuth válida.

**Headers:**

```
Cookie: next-auth.session-token=...
```

Para mobile, use JWT:

```
Authorization: Bearer <token>
```

## 👤 User Router

### `user.me`

Retorna o usuário autenticado.

**Query**

```typescript
const user = await trpc.user.me.useQuery();
```

**Response**

```json
{
  "id": "cuid",
  "email": "usuario@bora.com",
  "name": "Nome do Usuário",
  "role": "STUDENT",
  "student": { ... },
  "instructor": null
}
```

---

### `user.list`

Lista todos os usuários (apenas admin).

**Query**

```typescript
const { users, nextCursor } = await trpc.user.list.useQuery({
  limit: 10,
  cursor: undefined,
  role: "INSTRUCTOR",
});
```

**Input**

```typescript
{
  limit?: number; // 1-100, default 10
  cursor?: string;
  role?: UserRole;
}
```

**Response**

```json
{
  "users": [...],
  "nextCursor": "cuid"
}
```

---

### `user.updateProfile`

Atualiza perfil do usuário.

**Mutation**

```typescript
const user = await trpc.user.updateProfile.useMutation({
  name: "Novo Nome",
  phone: "+5511999999999",
});
```

---

### `user.deleteMyData`

Deleta todos os dados do usuário (LGPD).

**Mutation**

```typescript
await trpc.user.deleteMyData.useMutation();
```

## 📚 Lesson Router

### `lesson.create`

Cria uma nova aula (apenas aluno).

**Mutation**

```typescript
const lesson = await trpc.lesson.create.useMutation({
  instructorId: "cuid",
  scheduledAt: new Date("2024-01-20T14:00:00"),
  pickupLatitude: -23.5505,
  pickupLongitude: -46.6333,
  pickupAddress: "Av Paulista, 1000",
  price: 100.0,
});
```

---

### `lesson.start`

Inicia uma aula (apenas instrutor).

**Mutation**

```typescript
const lesson = await trpc.lesson.start.useMutation({
  lessonId: "cuid",
});
```

---

### `lesson.end`

Finaliza uma aula (apenas instrutor).

**Mutation**

```typescript
const lesson = await trpc.lesson.end.useMutation({
  lessonId: "cuid",
  instructorNotes: "Aluno dirigiu bem, precisa melhorar baliza",
});
```

---

### `lesson.myLessons`

Lista aulas do aluno autenticado.

**Query**

```typescript
const { lessons, nextCursor } = await trpc.lesson.myLessons.useQuery({
  limit: 10,
  cursor: undefined,
  status: "SCHEDULED",
});
```

---

### `lesson.instructorLessons`

Lista aulas do instrutor autenticado.

**Query**

```typescript
const { lessons, nextCursor } = await trpc.lesson.instructorLessons.useQuery({
  limit: 10,
  status: "ACTIVE",
});
```

---

### `lesson.cancel`

Cancela uma aula.

**Mutation**

```typescript
await trpc.lesson.cancel.useMutation({
  lessonId: "cuid",
});
```

## 🚗 Instructor Router

### `instructor.list`

Lista instrutores disponíveis.

**Query**

```typescript
const instructors = await trpc.instructor.list.useQuery({
  latitude: -23.5505,
  longitude: -46.6333,
  limit: 10,
});
```

---

### `instructor.getById`

Detalhes de um instrutor específico.

**Query**

```typescript
const instructor = await trpc.instructor.getById.useQuery({
  id: "cuid",
});
```

**Response**

```json
{
  "id": "cuid",
  "user": { ... },
  "basePrice": 100.00,
  "averageRating": 4.8,
  "totalLessons": 150,
  "availability": [...],
  "ratings": [...]
}
```

---

### `instructor.create`

Cria perfil de instrutor.

**Mutation**

```typescript
const instructor = await trpc.instructor.create.useMutation({
  cpf: "12345678900",
  cnhNumber: "12345678900",
  credentialNumber: "CRED-12345",
  credentialExpiry: new Date("2025-12-31"),
  city: "São Paulo",
  state: "SP",
  basePrice: 100.0,
});
```

---

### `instructor.updateAvailability`

Atualiza disponibilidade on/off.

**Mutation**

```typescript
await trpc.instructor.updateAvailability.useMutation({
  isAvailable: true,
});
```

---

### `instructor.updateLocation`

Atualiza localização em tempo real.

**Mutation**

```typescript
await trpc.instructor.updateLocation.useMutation({
  latitude: -23.5505,
  longitude: -46.6333,
});
```

---

### `instructor.approve`

Aprova instrutor (apenas admin).

**Mutation**

```typescript
await trpc.instructor.approve.useMutation({
  instructorId: "cuid",
});
```

---

### `instructor.suspend`

Suspende instrutor (apenas admin).

**Mutation**

```typescript
await trpc.instructor.suspend.useMutation({
  instructorId: "cuid",
});
```

## 💳 Payment Router

### `payment.create`

Cria um pagamento.

**Mutation**

```typescript
const payment = await trpc.payment.create.useMutation({
  lessonId: "cuid",
  method: "CREDIT_CARD",
  amount: 100.0,
});
```

**Payment Methods**

- `CREDIT_CARD`
- `PIX`
- `BOLETO`

---

### `payment.list`

Lista pagamentos (apenas admin).

**Query**

```typescript
const { payments, nextCursor } = await trpc.payment.list.useQuery({
  limit: 20,
  status: "COMPLETED",
});
```

---

### `payment.myPayments`

Lista pagamentos do usuário autenticado.

**Query**

```typescript
const { payments, nextCursor } = await trpc.payment.myPayments.useQuery({
  limit: 10,
});
```

## 🔍 Filtros e Paginação

### Cursor-based Pagination

```typescript
const [data, setData] = useState([]);
const [cursor, setCursor] = useState<string | undefined>();

const { data: result } = trpc.user.list.useQuery({
  limit: 10,
  cursor,
});

useEffect(() => {
  if (result) {
    setData([...data, ...result.users]);
    setCursor(result.nextCursor);
  }
}, [result]);
```

### Filtros por Status

```typescript
// Aulas agendadas
trpc.lesson.myLessons.useQuery({ status: "SCHEDULED" });

// Pagamentos concluídos
trpc.payment.myPayments.useQuery({ status: "COMPLETED" });
```

## ⚠️ Error Handling

### Estrutura de Erro

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Not authenticated",
    "data": {
      "zodError": null
    }
  }
}
```

### Códigos de Erro

- `UNAUTHORIZED`: Não autenticado
- `FORBIDDEN`: Sem permissão
- `NOT_FOUND`: Recurso não encontrado
- `BAD_REQUEST`: Validação falhou (ver `zodError`)
- `INTERNAL_SERVER_ERROR`: Erro inesperado

### Tratamento no Client

```typescript
const mutation = trpc.lesson.create.useMutation({
  onError: (error) => {
    if (error.data?.code === "UNAUTHORIZED") {
      router.push("/auth/signin");
    } else if (error.data?.zodError) {
      // Erros de validação
      console.log(error.data.zodError.fieldErrors);
    } else {
      toast.error(error.message);
    }
  },
});
```

## 🚀 Rate Limiting

- **IP**: 100 req/min
- **Session**: 10 req/min (mutations)

Resposta quando excedido:

```json
{
  "error": {
    "code": "TOO_MANY_REQUESTS",
    "message": "Rate limit exceeded"
  }
}
```

## 📊 Webhooks (Stripe)

### Endpoint

```
POST /api/webhooks/stripe
```

### Eventos Suportados

- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`
- `pix.payment.succeeded` (Stripe BR)

### Payload Exemplo

```json
{
  "id": "evt_...",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_...",
      "amount": 10000,
      "metadata": {
        "lessonId": "cuid"
      }
    }
  }
}
```
