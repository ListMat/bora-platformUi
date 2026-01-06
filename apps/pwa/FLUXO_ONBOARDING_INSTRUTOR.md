# 🎯 FLUXO COMPLETO - ONBOARDING INSTRUTOR

## Regra de Ouro
**Sucesso Primeiro, Monetização Depois**

Instrutor só vê planos pagos DEPOIS de:
1. ✅ Criar 1º plano
2. ✅ Receber 1º aluno
3. ✅ Confirmar 1º pagamento

---

## 📋 Etapas do Onboarding

### 1. Cadastro Inicial
**Rota:** `/signup/instructor`

**Steps:**
1. **Dados Pessoais** - Nome, CPF, Email, Telefone
2. **Documentos** - CNH (frente/verso), Credencial DETRAN
3. **Veículo** - Foto, marca, modelo, placa
4. **Escolha de Plano** - Gratuito (padrão)

**Resultado:** Conta criada → Redireciona para `/instructor/onboarding`

---

### 2. Criar Primeiro Plano
**Rota:** `/instructor/onboarding/first-plan`

**Steps:**
1. **Horários** - Calendário semanal (mín 10h/semana)
2. **Localidade** - CEP + ViaCEP (auto-preenche)
3. **Preço** - R$/hora (mín R$ 50, sugestão R$ 79)
4. **Veículo** - Seleciona carro cadastrado
5. **Confirmação** - Resumo completo

**Validações:**
- ✅ Mínimo 10h/semana
- ✅ CEP válido
- ✅ Preço ≥ R$ 50
- ✅ Veículo cadastrado

**Resultado:** Plano criado → Status "online" → Redireciona para dashboard

---

### 3. Dashboard - Aguardando 1º Aluno
**Rota:** `/instructor/dashboard`

**Estado Inicial:**
```
┌─────────────────────────────────────┐
│ 🟢 Online          R$ 0,00          │
├─────────────────────────────────────┤
│                                     │
│  🎯 Você está online!               │
│  Aguardando primeira aula...        │
│                                     │
│  [Aceitar Aulas] (verde)            │
│                                     │
├─────────────────────────────────────┤
│ 📅 Seus Horários                    │
│  • Segunda 14:00-17:00              │
│  • Terça 09:00-12:00                │
│  • Quarta 14:00-17:00               │
├─────────────────────────────────────┤
│ 💰 Saldo: R$ 0,00                   │
│  "Você receberá 85% de cada aula"   │
└─────────────────────────────────────┘
```

---

### 4. Primeira Solicitação
**Evento:** Aluno solicita aula

**Notificações:**

#### Push Notification
```
🔔 Nova aula!
Segunda 14:00 – 1ª Habilitação – R$ 79

[Aceitar]
```

#### Chat (In-App)
```
💬 Sistema
Solicitação de Mateus
📅 Segunda 14:00
🎓 1ª Habilitação
💰 R$ 79 (Pix ao final)

[Aceitar] [Trocar horário] [Recusar]
```

#### Email
```
Assunto: Nova solicitação de aula!

Olá Carlos,

Você recebeu uma nova solicitação:
- Aluno: Mateus Silva
- Data: Segunda-feira, 14:00
- Tipo: 1ª Habilitação
- Valor: R$ 79

[Aceitar Aula]
```

**Ações:**
- **Aceitar** → Status "scheduled" → Chat aberto
- **Trocar horário** → Modal de negociação
- **Recusar** → Volta para pool

---

### 5. Após 1ª Aula Confirmada
**Evento:** Pagamento confirmado

**Dashboard Atualizado:**
```
┌─────────────────────────────────────┐
│ 🟢 Online          R$ 67,15         │
├─────────────────────────────────────┤
│ ✅ Primeira aula realizada!         │
│                                     │
│  Parabéns! Você completou sua       │
│  primeira aula com sucesso.         │
│                                     │
│  💰 R$ 67,15 creditados             │
│  (Disponível em D+1)                │
│                                     │
├─────────────────────────────────────┤
│ 🚀 Quer mais visibilidade?          │
│                                     │
│  [Ver Planos de Destaque]           │
└─────────────────────────────────────┘
```

**Push:**
```
🎉 Pagamento confirmado!
R$ 67,15 creditados

[Ver Extrato]
```

---

### 6. Upsell - Planos de Destaque
**Rota:** `/instructor/boost` (só aparece após 1º pagamento)

**Modal:**
```
┌─────────────────────────────────────┐
│ 🚀 Destaque seu Perfil              │
├─────────────────────────────────────┤
│                                     │
│ 📍 Destaque no Mapa                 │
│ R$ 5/dia                            │
│ • Aparece no topo do mapa           │
│ • Badge "Patrocinado"               │
│ • 5x mais visualizações             │
│                                     │
│ [Ativar por 7 dias - R$ 35]        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ 🔍 Destaque na Busca                │
│ R$ 3/dia                            │
│ • Aparece no topo da lista          │
│ • Badge "Destaque"                  │
│ • 3x mais cliques                   │
│                                     │
│ [Ativar por 7 dias - R$ 21]        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ ⭐ Perfil Destacado                 │
│ R$ 100/mês                          │
│ • Aparece na homepage               │
│ • Seção "Instrutores Premium"       │
│ • 10x mais solicitações             │
│                                     │
│ [Assinar - R$ 100/mês]              │
│                                     │
└─────────────────────────────────────┘
```

---

## 📊 KPIs de Sucesso

| KPI | Meta | Como Medir |
|-----|------|------------|
| 1ª aula realizada | > 80% | `instructor.first_lesson_rate` |
| Taxa de aceitação | > 85% | `instructor.acceptance_rate` |
| NPS instrutor | > 75 | Survey pós-pagamento |
| Upsell conversão | > 25% | `instructor.upsell_rate` |
| Tempo até 1ª aula | < 48h | `instructor.time_to_first_lesson` |

---

## 🎯 Fluxo Visual

```
Cadastro
   ↓
Criar 1º Plano (obrigatório)
   ↓
Status "Online"
   ↓
Dashboard (aguardando)
   ↓
Recebe Solicitação
   ↓
Aceita Aula
   ↓
Realiza Aula
   ↓
Pagamento Confirmado ✅
   ↓
UPSELL (planos de destaque)
```

---

## 💡 Princípios de UX

### 1. Sucesso Primeiro
- ❌ Não mostrar planos pagos antes do 1º sucesso
- ✅ Focar em criar plano e receber aluno
- ✅ Celebrar primeira aula

### 2. Onboarding Claro
- ✅ Stepper visual (1/5, 2/5, etc)
- ✅ Validações em tempo real
- ✅ Mensagens de ajuda contextuais

### 3. Prova Social
- ✅ "Você receberá 85% de cada aula"
- ✅ "Instrutores ganham em média R$ 2.400/mês"
- ✅ Depoimentos de outros instrutores

### 4. Redução de Fricção
- ✅ CEP auto-preenche endereço
- ✅ Calendário visual (não texto)
- ✅ Sugestão de preço (R$ 79)
- ✅ Upload de fotos fácil

---

## 🚀 Implementação

### Rotas a Criar
```
/signup/instructor              ✅ Já existe
/instructor/onboarding          🆕 Criar
/instructor/onboarding/first-plan  🆕 Criar
/instructor/dashboard           ✅ Já existe (atualizar)
/instructor/boost               🆕 Criar (só após 1º pagamento)
```

### Componentes a Criar
```
- WeeklyCalendar.tsx           # Calendário semanal
- TimeSlotPicker.tsx           # Seletor de horários
- AddressAutocomplete.tsx      # CEP + ViaCEP
- VehicleSelector.tsx          # Seletor de veículo
- FirstPlanStepper.tsx         # Stepper do primeiro plano
- OnboardingProgress.tsx       # Barra de progresso
- BoostModal.tsx               # Modal de upsell
```

### Estados a Gerenciar
```typescript
type InstructorStatus = 
  | 'pending_onboarding'    // Cadastrou mas não criou plano
  | 'online'                // Plano criado, aguardando aluno
  | 'first_lesson_scheduled'// 1ª aula agendada
  | 'active'                // 1ª aula confirmada
  | 'premium'               // Assinou plano pago
```

---

## ✅ Checklist de Implementação

### Fase 1: Onboarding
- [ ] Criar rota `/instructor/onboarding`
- [ ] Criar rota `/instructor/onboarding/first-plan`
- [ ] Componente WeeklyCalendar
- [ ] Componente TimeSlotPicker
- [ ] Componente AddressAutocomplete
- [ ] Integração ViaCEP
- [ ] Validações de formulário

### Fase 2: Dashboard
- [ ] Atualizar dashboard instrutor
- [ ] Estado "aguardando 1º aluno"
- [ ] Toggle online/offline
- [ ] Lista de horários
- [ ] Saldo R$ 0,00

### Fase 3: Notificações
- [ ] Push notification (Web Push API)
- [ ] Chat in-app
- [ ] Email (template)

### Fase 4: Upsell
- [ ] Rota `/instructor/boost`
- [ ] Modal de planos
- [ ] Integração pagamento
- [ ] Analytics de conversão

---

**Próximo passo:** Implementar componentes e páginas! 🚀
