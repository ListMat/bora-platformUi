# 🎯 FLUXOS COMPLETOS - Aluno e Instrutor

## 📱 FLUXO DO ALUNO (100% Gratuito)

### 1. Cadastro (`/signup/student`)

#### Passo 1: Dados Pessoais
```
Campos:
- Nome completo
- Email
- Telefone/WhatsApp

Tempo: 30 segundos
```

#### Passo 2: Localização
```
Campos:
- CEP (com autocomplete)
- Cidade
- Estado
- Tipo de Habilitação (A, B ou AB)

Tempo: 20 segundos
```

**Total: 50 segundos para cadastro completo**

---

### 2. Busca de Instrutores (`/student/search`)

#### Tela Principal
```
┌─────────────────────────────────────┐
│  🔍 Filtros:                        │
│  • Proximidade (slider 1-50km)     │
│  • Tipo de veículo                  │
│  • Preço máximo                     │
│  • Avaliação mínima                 │
│  • Disponibilidade                  │
└─────────────────────────────────────┘

Cards de Instrutores:
┌─────────────────────────────────────┐
│  📸 Foto  │  Carlos Silva  ⭐ 4.95  │
│           │  🚗 Carro Manual        │
│           │  📍 2.3km de você       │
│           │  💰 R$ 120/aula         │
│           │  ✅ 543 aulas dadas     │
│           │  [Ver Perfil] [Agendar] │
└─────────────────────────────────────┘
```

**Algoritmo de Ordenação:**
1. Boost ativo (10x prioridade)
2. Plano (Gold > Premium > Pro > Free)
3. Proximidade
4. Avaliação
5. Taxa de resposta

---

### 3. Perfil do Instrutor (`/instructor/[id]`)

```
┌──────────────────────────────────────────┐
│  📸 Foto Grande                          │
│  Carlos Silva                    ⭐ 4.95 │
│  Badge: "PRO" + "Verificado"             │
│  📍 São Paulo, SP - 2.3km de você        │
│                                          │
│  📊 Estatísticas:                        │
│  • 543 aulas realizadas                  │
│  • 98% taxa de aprovação                 │
│  • Responde em 5 min                     │
│                                          │
│  🚗 Veículos:                            │
│  • Volkswagen Gol 2024 (Manual)          │
│  • Honda Civic 2023 (Automático)         │
│                                          │
│  ⭐ Avaliações (120):                    │
│  "Excelente instrutor, muito paciente"   │
│  - João, há 2 dias                       │
│                                          │
│  💰 Preço: R$ 120/aula                   │
│  [Agendar Aula Agora]                    │
└──────────────────────────────────────────┘
```

---

### 4. Agendamento (`/booking/new`)

#### Modal de Agendamento
```
Passo 1: Escolha Data e Horário
┌────────────────────────────┐
│  📅 14/01/2026             │
│                            │
│  Horários disponíveis:     │
│  [09:00] [10:00] [11:00]  │
│  [14:00] [15:00] [16:00]  │
└────────────────────────────┘

Passo 2: Ponto de Encontro
┌────────────────────────────┐
│  📍 Onde você quer buscar? │
│                            │
│  [ Rua Exemplo, 123  ]     │
│  [ Usa minha localização ] │
└────────────────────────────┘

Passo 3: Observações
┌────────────────────────────┐
│  📝 Alguma observação?     │
│                            │
│  [ Primeira aula...     ]  │
└────────────────────────────┘

Passo 4: Confirmação
┌────────────────────────────┐
│  Resumo:                   │
│  Instrutor: Carlos Silva   │
│  Data: 14/01 às 10:00     │
│  Local: Rua Exemplo, 123   │
│  Valor: R$ 120            │
│                            │
│  [Confirmar Agendamento]   │
└────────────────────────────┘
```

---

### 5. Dashboard do Aluno (`/student/dashboard`)

```
┌──────────────────────────────────────────┐
│  Olá, João! 👋                           │
├──────────────────────────────────────────┤
│  📅 Próxima Aula:                        │
│  14/01 às 10:00 com Carlos Silva        │
│  [Ver Detalhes] [Cancelar]              │
├──────────────────────────────────────────┤
│  📊 Seu Progresso:                       │
│  • 12 aulas realizadas                  │
│  • 4 horas de prática                   │
│  • Próximo: Prova prática em 15 dias   │
├──────────────────────────────────────────┤
│  📚 Histórico de Aulas:                  │
│  12/01 - Carlos Silva - ⭐⭐⭐⭐⭐      │
│  10/01 - Maria Santos - ⭐⭐⭐⭐⭐      │
│  08/01 - Carlos Silva - ⭐⭐⭐⭐⭐      │
├──────────────────────────────────────────┤
│  🎯 Ações Rápidas:                       │
│  [Buscar Novo Instrutor]                │
│  [Agendar Nova Aula]                    │
│  [Indicar Amigo] (ganhe R$ 20)          │
└──────────────────────────────────────────┘
```

---

### 6. Finalização da Aula (`/lesson/[id]/complete`)

#### Após a Aula
```
┌────────────────────────────┐
│  Como foi sua aula?        │
│                            │
│  ⭐⭐⭐⭐⭐                │
│                            │
│  O que achou do instrutor? │
│  [ Muito bom! Paciente... ]│
│                            │
│  [Enviar Avaliação]        │
└────────────────────────────┘

→ Instrutor recebe notificação
→ Aluno ganha pontos de fidelidade
→ Próxima aula sugerida
```

---

## 👨‍🏫 FLUXO DO INSTRUTOR

### 1. Cadastro (`/signup/instructor`)

#### Passo 1: Dados Pessoais (60s)
- Nome, Email, Telefone, CPF

#### Passo 2: Dados Profissionais (90s)
- CNH, Anos de experiência
- Tipos de veículo
- Modelo e ano do carro

#### Passo 3: Localização (45s)
- CEP, Cidade, Estado
- Raio de atendimento (5-50km)

#### Passo 4: Escolha do Plano (30s)
```
Cards com 3 opções:

┌─────────────┐  ┌──────────────┐  ┌──────────────┐
│  GRATUITO   │  │  PRO ⭐      │  │  PREMIUM 💎  │
│  R$ 0/mês   │  │  R$ 79/mês   │  │  R$ 149/mês  │
│  20% comis. │  │  15% comis.  │  │  12% comis.  │
│             │  │  3 boosts/mês│  │  10 boosts   │
│  [Começar]  │  │  [Popular]   │  │  [Escolher]  │
└─────────────┘  └──────────────┘  └──────────────┘
```

**Total: 3-4 minutos para cadastro completo**

---

### 2. Dashboard do Instrutor (`/instructor/dashboard`)

```
┌──────────────────────────────────────────────────┐
│  Olá, Carlos! 👋                      [Boost 🚀] │
├──────────────────────────────────────────────────┤
│  📊 Métricas de Hoje:                            │
│  ┌──────────┬──────────┬──────────┬───────────┐ │
│  │Views: 145│Solicit:8 │Aceitas:6 │Receita:720││
│  │  +45%    │  +120%   │  +85%    │  +30%     ││
│  └──────────┴──────────┴──────────┴───────────┘ │
├──────────────────────────────────────────────────┤
│  🔥 Status do Boost:                             │
│  Boost Semanal ativo até 18/01                   │
│  347 visualizações extras (5x normal)            │
│  [Renovar Boost] [Ver Analytics]                 │
├──────────────────────────────────────────────────┤
│  📬 Novas Solicitações (3):                      │
│                                                  │
│  João Silva - 14/01 às 10:00                    │
│  📍 2.1km de você • R$ 120                       │
│  "Primera aula, preciso de paciência"           │
│  [Aceitar] [Recusar] [Ver Perfil]              │
│                                                  │
│  Maria Santos - 15/01 às 14:00                  │
│  📍 3.5km de você • R$ 120                       │
│  [Aceitar] [Recusar]                            │
├──────────────────────────────────────────────────┤
│  📅 Aulas Agendadas Hoje (4):                    │
│  09:00 - Pedro Costa ✅ Confirmada              │
│  11:00 - Ana Lima ✅ Confirmada                 │
│  14:00 - Lucas Pereira ⏳ Aguardando            │
│  16:00 - Carla Souza ✅ Confirmada              │
│                                                  │
│  [Ver Agenda Completa]                          │
├──────────────────────────────────────────────────┤
│  💰 Financeiro do Mês:                           │
│  Faturamento Bruto: R$ 7.200                    │
│  Comissão Bora (15%): -R$ 1.080                 │
│  Líquido a Receber: R$ 6.120                    │
│                                                  │
│  [Ver Extrato] [Solicitar Saque]                │
└──────────────────────────────────────────────────┘
```

---

### 3. Gerenciar Solicitação (`/instructor/requests/[id]`)

```
┌─────────────────────────────────────┐
│  Nova Solicitação de Aula           │
├─────────────────────────────────────┤
│  👤 João Silva (⭐ 4.8 como aluno)  │
│  📞 (11) 99999-9999                 │
│                                     │
│  📅 14/01/2026 às 10:00            │
│  📍 Rua Exemplo, 123 - 2.1km       │
│  💰 R$ 120                         │
│                                     │
│  📝 Observações:                    │
│  "Primera aula, preciso de pacien  │
│   cia. Tenho medo de dirigir."     │
│                                     │
│  🚦 Status: Aguardando resposta    │
│  ⏰ Responda em até 2h ou perde!   │
│                                     │
│  [✅ Aceitar Aula]                 │
│  [❌ Recusar]                      │
│  [💬 Enviar Mensagem]              │
└─────────────────────────────────────┘
```

---

### 4. Durante a Aula (`/instructor/lesson/[id]/active`)

```
┌─────────────────────────────────────┐
│  🚗 Aula em Andamento               │
├─────────────────────────────────────┤
│  Aluno: João Silva                  │
│  Início: 10:00 (há 35 minutos)     │
│                                     │
│  ⏱️ Timer: 00:35:12                │
│  📍 Localização Atual              │
│  🗺️ [Mapa em tempo real]           │
│                                     │
│  📝 Anotar Observações:            │
│  [ João tem dificuldade em...   ]  │
│                                     │
│  [Finalizar Aula] [Emergência]     │
└─────────────────────────────────────┘
```

---

### 5. Finalizar Aula (`/instructor/lesson/[id]/complete`)

```
┌─────────────────────────────────────┐
│  Finalizar Aula                     │
├─────────────────────────────────────┤
│  Aluno: João Silva                  │
│  Duração: 50 minutos               │
│                                     │
│  ✅ Avaliar Desempenho:             │
│  • Habilidade técnica: ⭐⭐⭐⭐  │
│  • Concentração: ⭐⭐⭐⭐⭐      │
│  • Confiança: ⭐⭐⭐           │
│                                     │
│  📝 Feedback para o aluno:          │
│  [João foi muito bem! Praticou...] │
│                                     │
│  🎯 Próximos pontos a trabalhar:   │
│  [☑ Baliza]                        │
│  [☑ Troca de marcha]               │
│  [☐ Estacionamento paralelo]       │
│                                     │
│  💰 Valor: R$ 120                  │
│  Você recebe: R$ 102 (85%)         │
│  Bora fica: R$ 18 (15%)            │
│                                     │
│  [Confirmar e Finalizar]           │
└─────────────────────────────────────┘

→ Aluno recebe notificação para avaliar
→ Pagamento processado automaticamente
→ Valor cai na conta em 1 dia útil
```

---

### 6. Analytics (`/instructor/analytics`)

```
┌──────────────────────────────────────────────┐
│  📊 Analytics - Últimos 30 dias              │
├──────────────────────────────────────────────┤
│  📈 Visão Geral:                             │
│  ┌─────────┬─────────┬─────────┬──────────┐ │
│  │Views    │Solicit. │Taxa Conv│Aprovação ││
│  │1.245    │45       │3.6%     │96%       ││
│  │+145%    │+85%     │+0.8pp   │+2%       ││
│  └─────────┴─────────┴─────────┴──────────┘ │
│                                              │
│  💰 Receita:                                 │
│  R$ 7.200 bruto → R$ 6.120 líquido          │
│  [Gráfico de barras por dia]                │
│                                              │
│  🔥 Impacto do Boost:                       │
│  Dias com boost: 7                          │
│  Views extras: 870 (+348%)                  │
│  ROI do Boost: +420%                        │
│                                              │
│  ⭐ Satisfação:                             │
│  Nota média: 4.95                           │
│  120 avaliações (98% positivas)             │
│                                              │
│  🎯 Recomendações:                           │
│  ✨ Seu perfil está 15% acima da média!     │
│  💡 Ative boost nas terças para +30% views  │
│  📸 Adicione mais fotos (+25% conversão)    │
└──────────────────────────────────────────────┘
```

---

## 🔄 INTEGRAÇÕES ENTRE FLUXOS

### Notificações

#### Aluno recebe:
- ✅ Instrutor aceitou sua solicitação
- 📅 Lembrete 1h antes da aula
- ⭐ Avalie sua aula
- 🎁 Ganhe R$ 20 indicando amigo

#### Instrutor recebe:
- 📬 Nova solicitação de aula
- ⚠️ Aluno está a caminho
- ⭐ Aluno te avaliou
- 🔥 Seu boost está acabando

---

### Sistema de Match

```typescript
// Algoritmo simplificado

function rankInstructors(student, instructors) {
  return instructors
    .map(instructor => ({
      instructor,
      score: calculateScore(student, instructor)
    }))
    .sort((a, b) => b.score - a.score);
}

function calculateScore(student, instructor) {
  let score = 0;
  
  // 1. Proximidade (40%)
  const distance = getDistance(student.location, instructor.location);
  score += Math.max(0, 100 - distance) * 0.4;
  
  // 2. Avaliação (30%)
  score += instructor.rating * 20 * 0.3;
  
  // 3. Taxa de resposta (15%)
  score += instructor.responseRate * 0.15;
  
  // 4. Aulas completadas (15%)
  score += Math.min(100, instructor.completedLessons) * 0.15;
  
  // BOOST MULTIPLIER
  if (instructor.activeBoost) {
    score *= instructor.boostMultiplier; // 3x, 5x ou 10x
  }
  
  // QUALITY BONUS (não pode comprar)
  if (instructor.rating >= 4.9) score += 20;
  if (instructor.responseTime < 300) score += 10;
  
  return score;
}
```

---

## 📊 MÉTRICAS DE SUCESSO

### Para Alunos
- ⏱️ **Time to Match:** < 5 minutos
- ✅ **Taxa de Conversão:** > 60%
- ⭐ **NPS:** > 70
- 🔄 **Retention Mês 2:** > 50%

### Para Instrutores
- 📈 **Aulas/Mês (Free):** 5-10
- 📈 **Aulas/Mês (Pro):** 40-60
- 📈 **Aulas/Mês (Premium):** 80-120
- 💰 **Revenue/Instrutor:** R$ 3.000-10.000/mês

---

## ✅ PRÓXIMOS PASSOS

### Esta Semana
1. [ ] Integrar autenticação real (Firebase/Auth0)
2. [ ] Conectar com backend tRPC existente
3. [ ] Implementar sistema de notificações (Push)
4. [ ] Gateway de pagamento (Stripe)

### Este Mês
1. [ ] Sistema de chat em tempo real
2. [ ] Geolocalização e mapa
3. [ ] Sistema de avaliações
4. [ ] Analytics completo

---

**Os fluxos estão prontos! Agora é conectar com o backend e começar a testar com usuários reais.** 🚀
