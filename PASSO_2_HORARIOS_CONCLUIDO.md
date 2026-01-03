# ✅ PASSO 2 CONCLUÍDO: Seleção de Horários

## 🎯 O que foi implementado:

### **1. Seção de Horários Disponíveis**

Adicionada após a seção de pacotes:

- ✅ Título: "Horários Disponíveis"
- ✅ Subtítulo: "Escolha o melhor horário para você"

### **2. Seletor de Dias da Semana (Horizontal Scroll)**

Cards de dias com:
- ✅ **Nome do dia** (Seg, Ter, Qua, etc.)
- ✅ **Data** (06/01, 07/01, etc.)
- ✅ **Estados visuais:**
  - Normal: Fundo cinza escuro
  - Indisponível: Opacidade 40%, não clicável
  - Selecionado: Borda amarela, fundo amarelo transparente

### **3. Slots de Horário (Condicional)**

Aparecem APENAS quando um dia é selecionado:

**3 períodos disponíveis:**
- ✅ **Manhã** (08:00 - 12:00)
- ✅ **Tarde** (13:00 - 17:00)
- ✅ **Noite** (18:00 - 21:00) - Lotado

**Cada slot mostra:**
- ✅ Nome do período
- ✅ Horário
- ✅ Badge "Lotado" quando não disponível
- ✅ Checkmark amarelo quando selecionado

### **4. Lógica de Seleção**

**Fluxo:**
1. Usuário clica em um **dia** → Seleciona automaticamente "Manhã"
2. Slots de horário aparecem
3. Usuário pode trocar para "Tarde" ou "Noite"
4. Clicar no mesmo dia novamente → Desmarca

**ID do Schedule:**
```typescript
`${dayId}-${slotId}`
// Exemplos:
// "seg-morning"
// "ter-afternoon"
// "sex-evening"
```

### **5. Botão Atualizado - Validação Dupla**

**Agora exige PACOTE + HORÁRIO:**

**Estados do botão:**
1. **Nenhum selecionado:**
   - Texto: "Selecione um pacote"
   - Cinza, desabilitado

2. **Só pacote selecionado:**
   - Texto: "Selecione um horário"
   - Cinza, desabilitado

3. **Pacote + Horário selecionados:**
   - Texto: "Solicitar Aula"
   - Amarelo, ativo
   - Com ícone de carro

### **6. Passagem de Parâmetros Completa**

```typescript
{
  instructorId: instructor.id,
  packageId: selectedPackage,    // "1", "5", ou "10"
  scheduleId: selectedSchedule,  // "seg-morning", "ter-afternoon", etc.
}
```

---

## 📊 Dados Mockados

### **Dias da Semana:**
```typescript
[
  { id: 'seg', label: 'Seg', date: '06/01', available: true },
  { id: 'ter', label: 'Ter', date: '07/01', available: true },
  { id: 'qua', label: 'Qua', date: '08/01', available: false }, // ← Indisponível
  { id: 'qui', label: 'Qui', date: '09/01', available: true },
  { id: 'sex', label: 'Sex', date: '10/01', available: true },
  { id: 'sab', label: 'Sáb', date: '11/01', available: true },
  { id: 'dom', label: 'Dom', date: '12/01', available: false }, // ← Indisponível
]
```

### **Slots de Horário:**
```typescript
[
  { id: 'morning', label: 'Manhã', time: '08:00 - 12:00', available: true },
  { id: 'afternoon', label: 'Tarde', time: '13:00 - 17:00', available: true },
  { id: 'evening', label: 'Noite', time: '18:00 - 21:00', available: false }, // ← Lotado
]
```

---

## 🎨 Estilos Adicionados

### **Dias:**
- `daysScroll` - Container horizontal
- `dayCard` - Card individual
- `dayCardDisabled` - Dia indisponível
- `dayCardSelected` - Dia selecionado
- `dayLabel` - Nome do dia
- `dayLabelDisabled` - Nome desabilitado
- `dayLabelSelected` - Nome selecionado
- `dayDate` - Data
- `dayDateDisabled` - Data desabilitada
- `dayDateSelected` - Data selecionada

### **Slots:**
- `timeSlotsContainer` - Container dos slots
- `timeSlotsTitle` - Título "Selecione o horário"
- `timeSlots` - Lista de slots
- `timeSlot` - Slot individual
- `timeSlotDisabled` - Slot lotado
- `timeSlotSelected` - Slot selecionado
- `timeSlotHeader` - Cabeçalho do slot
- `timeSlotLabel` - Nome do período
- `timeSlotLabelDisabled` - Nome desabilitado
- `timeSlotLabelSelected` - Nome selecionado
- `timeSlotTime` - Horário
- `timeSlotTimeDisabled` - Horário desabilitado
- `timeSlotTimeSelected` - Horário selecionado
- `slotBadge` - Badge "Lotado"
- `slotBadgeText` - Texto do badge

---

## 🎬 Fluxo Completo de Uso

### **Cenário 1: Fluxo Ideal**
1. ✅ Usuário abre modal
2. ✅ Rola até "Pacotes Disponíveis"
3. ✅ Clica no pacote de **5 aulas** → Borda amarela
4. ✅ Botão muda: "Selecione um horário"
5. ✅ Rola até "Horários Disponíveis"
6. ✅ Clica em **"Seg 06/01"** → Borda amarela, slots aparecem
7. ✅ Clica em **"Tarde"** → Checkmark amarelo
8. ✅ Botão muda: "Solicitar Aula" (amarelo, ativo)
9. ✅ Clica no botão → Navega para checkout

### **Cenário 2: Mudança de Horário**
1. ✅ Usuário já selecionou "Seg - Manhã"
2. ✅ Clica em **"Ter 07/01"** → Troca para Terça
3. ✅ Automaticamente seleciona "Manhã" de Terça
4. ✅ Pode trocar para "Tarde" de Terça

### **Cenário 3: Tentativa de Horário Lotado**
1. ✅ Usuário clica em "Seg 06/01"
2. ✅ Tenta clicar em **"Noite"** → Não funciona (desabilitado)
3. ✅ Badge "Lotado" em vermelho
4. ✅ Opacidade 50%

---

## 📸 Como Testar

1. **Abrir modal** do instrutor
2. **Selecionar pacote** de 5 aulas
3. **Ver botão** mudar para "Selecione um horário"
4. **Rolar até horários**
5. **Clicar em "Seg"** → Ver slots aparecerem
6. **Clicar em "Tarde"** → Ver checkmark
7. **Ver botão** mudar para "Solicitar Aula"
8. **Tentar clicar em "Noite"** → Não deve funcionar (lotado)
9. **Clicar em "Ter"** → Ver seleção mudar
10. **Clicar em "Solicitar Aula"** → Navegar

---

## 🚀 Próximos Passos

### **Passo 3: Tornar Dados Dinâmicos** (PRÓXIMO)
- [ ] Buscar pacotes do backend
- [ ] Buscar horários do backend
- [ ] Substituir dados mockados por API real

### **Passo 4: Tela de Checkout**
- [ ] Criar `LessonCheckout.tsx`
- [ ] Exibir resumo (instrutor, pacote, horário)
- [ ] Formas de pagamento dinâmicas
- [ ] Botão confirmar

### **Passo 5: Tela de Confirmação**
- [ ] Criar `LessonConfirmation.tsx`
- [ ] Mensagem de sucesso
- [ ] Status "Aguardando confirmação"
- [ ] Navegação

---

**Status:** ✅ **PASSO 2 COMPLETO!**

**Tempo estimado:** ~20 minutos

**Próxima ação:** Tornar dados dinâmicos ou criar tela de checkout?
