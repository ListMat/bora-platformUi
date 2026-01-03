# 🎯 PLANO DE IMPLEMENTAÇÃO - FLUXO CORRETO DO APP ALUNO

## 📋 SITUAÇÃO ATUAL vs ESPERADO

### ❌ **Problema Atual:**
- Botão "Solicitar aula" está no card do mapa
- Card do instrutor não abre modal bottom sheet
- Falta tela de detalhes completos do instrutor
- Dados podem estar estáticos/mockados

### ✅ **Fluxo Correto:**
1. **Mapa** → Pins de instrutores
2. **Clicar no pin** → Card preview (SEM botão de ação)
3. **Clicar no card** → Modal bottom sheet com detalhes completos
4. **Selecionar pacote + horário** → Botão "Solicitar aula" fica ativo
5. **Clicar em "Solicitar aula"** → Tela de checkout
6. **Confirmar** → Tela de sucesso + acompanhamento

---

## 🔧 IMPLEMENTAÇÃO - CHECKLIST TÉCNICO

### **Fase 1: Ajustar Card do Mapa** ✅ (JÁ IMPLEMENTADO)

**Arquivo:** `apps/app-aluno/src/components/screens/HomeScreen.native.tsx`

**Status:** ✅ **JÁ ESTÁ CORRETO!**

O card compacto já está implementado conforme especificado:
- ✅ Foto do instrutor
- ✅ Nome + verificação
- ✅ Rating + número de aulas
- ✅ Veículo (marca, modelo, placa)
- ✅ Preço por hora
- ✅ **SEM botão "Solicitar aula"**
- ✅ Ao clicar, abre o modal

---

### **Fase 2: Modal Bottom Sheet de Detalhes** ✅ (JÁ IMPLEMENTADO)

**Arquivo:** `apps/app-aluno/src/components/modals/InstructorDetailModal.tsx`

**Status:** ✅ **JÁ EXISTE!**

Componente já criado com:
- ✅ Header com foto, nome, rating
- ✅ Tags de tipo de aula
- ✅ Horários disponíveis
- ✅ Localização
- ✅ Foto grande do veículo
- ✅ Detalhes do carro
- ✅ Botão "Solicitar Aula" no rodapé

**Ajustes necessários:**
- ⚠️ Tornar dados **dinâmicos** (vindo do backend)
- ⚠️ Adicionar seleção de **pacotes**
- ⚠️ Adicionar seleção de **horários**
- ⚠️ Botão só ativa após seleções

---

### **Fase 3: Tornar Dados Dinâmicos** 🔄 (EM ANDAMENTO)

#### **3.1 Backend - Endpoints Necessários**

**Arquivo:** `packages/api/src/routers/instructor.ts`

**Endpoints a verificar/criar:**

```typescript
// ✅ JÁ EXISTE
instructor.nearby - Lista instrutores próximos

// ⚠️ VERIFICAR SE RETORNA TUDO
instructor.getById - Detalhes completos de um instrutor
  - Pacotes de aulas
  - Horários disponíveis
  - Formas de pagamento
  - Tipo de curso
  - Descrição
```

#### **3.2 Modelo de Dados - Pacotes**

**Estrutura esperada:**

```typescript
interface InstructorPackage {
  id: string;
  name: string;
  lessons: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  benefits?: string[];
  description?: string;
}
```

#### **3.3 Modelo de Dados - Horários**

```typescript
interface AvailableSchedule {
  dayOfWeek: number; // 0-6 (Dom-Sáb)
  startTime: string; // "08:00"
  endTime: string; // "18:00"
  status: 'available' | 'busy' | 'full';
}
```

---

### **Fase 4: Atualizar Modal com Seleção** 🚧 (PRÓXIMO PASSO)

**Arquivo:** `InstructorDetailModal.tsx`

**Mudanças:**

1. **Adicionar estado de seleção:**
```typescript
const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
```

2. **Renderizar pacotes dinâmicos:**
```typescript
{instructor.packages?.map(pkg => (
  <PackageCard
    key={pkg.id}
    package={pkg}
    selected={selectedPackage === pkg.id}
    onSelect={() => setSelectedPackage(pkg.id)}
  />
))}
```

3. **Renderizar horários dinâmicos:**
```typescript
{instructor.schedules?.map(schedule => (
  <ScheduleSlot
    key={schedule.id}
    schedule={schedule}
    selected={selectedSchedule === schedule.id}
    onSelect={() => setSelectedSchedule(schedule.id)}
  />
))}
```

4. **Botão condicional:**
```typescript
<Button
  disabled={!selectedPackage || !selectedSchedule}
  onPress={handleRequestLesson}
>
  Solicitar Aula
</Button>
```

---

### **Fase 5: Tela de Checkout** 🆕 (CRIAR)

**Arquivo:** `apps/app-aluno/app/screens/LessonCheckout.tsx` (NOVO)

**Estrutura:**

```typescript
export default function LessonCheckout() {
  const { instructorId, packageId, scheduleId } = useLocalSearchParams();
  
  // Buscar dados
  const instructor = useInstructor(instructorId);
  const package = instructor.packages.find(p => p.id === packageId);
  const schedule = instructor.schedules.find(s => s.id === scheduleId);
  
  return (
    <View>
      {/* Resumo */}
      <Summary
        instructor={instructor}
        package={package}
        schedule={schedule}
      />
      
      {/* Formas de pagamento */}
      <PaymentMethods
        methods={instructor.paymentMethods}
        onSelect={setPaymentMethod}
      />
      
      {/* Botão confirmar */}
      <Button onPress={handleConfirm}>
        Confirmar Solicitação
      </Button>
    </View>
  );
}
```

---

### **Fase 6: Tela de Confirmação** 🆕 (CRIAR)

**Arquivo:** `apps/app-aluno/app/screens/LessonConfirmation.tsx` (NOVO)

**Estrutura:**

```typescript
export default function LessonConfirmation() {
  const { lessonId } = useLocalSearchParams();
  
  return (
    <View>
      <SuccessIcon />
      <Text>Solicitação enviada!</Text>
      <Text>Aguardando confirmação do instrutor</Text>
      
      <Button onPress={() => router.push('/lessons')}>
        Acompanhar Solicitação
      </Button>
      
      <Button variant="outline" onPress={() => router.push('/(tabs)')}>
        Voltar ao Mapa
      </Button>
    </View>
  );
}
```

---

### **Fase 7: Backend - Criar Solicitação** 🔄 (VERIFICAR)

**Arquivo:** `packages/api/src/routers/lesson.ts`

**Endpoint:**

```typescript
lesson.create: protectedProcedure
  .input(z.object({
    instructorId: z.string(),
    packageId: z.string(),
    scheduleId: z.string(),
    paymentMethod: z.enum(['PIX', 'CARD', 'CASH']),
    pickupAddress: z.string().optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    // Criar lesson com status PENDING
    // Notificar instrutor
    // Retornar lessonId
  })
```

---

## 📊 PRIORIDADES

### **🔴 Alta Prioridade (Fazer Agora)**
1. ✅ Verificar se modal já abre ao clicar no card
2. 🔄 Tornar pacotes dinâmicos no modal
3. 🔄 Tornar horários dinâmicos no modal
4. 🔄 Adicionar lógica de seleção (pacote + horário)

### **🟡 Média Prioridade (Próximos Passos)**
5. 🆕 Criar tela de Checkout
6. 🆕 Criar tela de Confirmação
7. 🔄 Implementar endpoint de criação de lesson

### **🟢 Baixa Prioridade (Melhorias Futuras)**
8. 🆕 Notificações push
9. 🆕 Acompanhamento de status
10. 🆕 Filtros no mapa

---

## 🎯 PRÓXIMA AÇÃO IMEDIATA

**Vou começar por:**

1. ✅ Verificar se o modal já está abrindo corretamente
2. 🔄 Atualizar `InstructorDetailModal` para aceitar dados dinâmicos
3. 🔄 Adicionar componentes de seleção de pacote e horário
4. 🔄 Implementar validação do botão

**Quer que eu comece agora?** 🚀
