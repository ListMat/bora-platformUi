# 💰 Estratégias de Monetização - PWA Bora

## 🎯 Modelos de Receita para Marketplace de Aulas de Direção

---

## 1. 💳 **Comissão por Transação** (Modelo Principal - Recomendado)

### Como Funciona
Você cobra uma **comissão** de cada aula agendada através da plataforma.

### Estrutura de Preços
```
┌─────────────────────────────────────────┐
│ Aula: R$ 120                            │
│ ├─ Instrutor recebe: R$ 102 (85%)      │
│ └─ Bora fica com: R$ 18 (15%)          │
└─────────────────────────────────────────┘
```

### Taxas Sugeridas
- **Nível Iniciante:** 10-12% (primeiros 6 meses)
- **Nível Padrão:** 15% (modelo Airbnb/Uber)
- **Nível Premium:** 18-20% (com mais ferramentas)

### Vantagens
✅ Escalável (cresce com o volume)
✅ Win-win (você só ganha se o instrutor ganhar)
✅ Modelo comprovado (Airbnb, Uber, 99)
✅ Fluxo de caixa recorrente

### Implementação Técnica
```typescript
// apps/pwa/src/lib/pricing.ts

export interface PricingTier {
  name: string;
  commissionRate: number; // 0.15 = 15%
  features: string[];
}

export const PRICING_TIERS: PricingTier[] = [
  {
    name: 'Básico',
    commissionRate: 0.15,
    features: [
      'Perfil na plataforma',
      'Agendamento online',
      'Pagamento via Pix',
      'Suporte por email',
    ],
  },
  {
    name: 'Premium',
    commissionRate: 0.12, // Taxa menor
    features: [
      'Tudo do Básico',
      'Destaque nos resultados',
      'Analytics avançado',
      'Suporte prioritário',
      'Badge de verificado',
    ],
  },
];

export function calculateCommission(
  lessonPrice: number,
  tier: PricingTier
): {
  instructorReceives: number;
  platformFee: number;
} {
  const platformFee = lessonPrice * tier.commissionRate;
  const instructorReceives = lessonPrice - platformFee;
  
  return {
    instructorReceives,
    platformFee,
  };
}
```

**Receita Estimada:**
- 100 aulas/dia × R$ 18 comissão = **R$ 1.800/dia**
- **R$ 54.000/mês** 🚀

---

## 2. 📊 **Planos de Assinatura para Instrutores**

### Como Funciona
Instrutores pagam mensalidade para ter acesso à plataforma.

### Estrutura de Planos

#### **Plano Gratuito**
- ✅ Perfil básico
- ✅ Até 5 aulas/mês
- ❌ Sem destaque
- ❌ Comissão: 20%

#### **Plano Pro** - R$ 49/mês
- ✅ Perfil completo com fotos
- ✅ Aulas ilimitadas
- ✅ Comissão reduzida: 12%
- ✅ Analytics básico
- ✅ Badge "Pro"

#### **Plano Premium** - R$ 99/mês
- ✅ Tudo do Pro
- ✅ Destaque nos resultados
- ✅ Comissão: 8%
- ✅ Analytics avançado
- ✅ Suporte prioritário
- ✅ Marketing personalizado
- ✅ Badge "Verificado"

#### **Plano Escola** - R$ 299/mês
- ✅ Até 10 instrutores
- ✅ Painel administrativo
- ✅ Comissão: 5%
- ✅ White-label
- ✅ API dedicada
- ✅ Gerente de conta

### Implementação
```typescript
// apps/pwa/src/components/PricingPlans.tsx

export function PricingPlans() {
  const plans = [
    {
      name: 'Gratuito',
      price: 0,
      commission: 20,
      features: [
        'Perfil básico',
        'Até 5 aulas/mês',
        'Suporte por email',
      ],
      cta: 'Começar Grátis',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: 49,
      commission: 12,
      features: [
        'Perfil completo',
        'Aulas ilimitadas',
        'Badge "Pro"',
        'Analytics básico',
        'Suporte prioritário',
      ],
      cta: 'Começar Teste Grátis',
      highlighted: true,
    },
    {
      name: 'Premium',
      price: 99,
      commission: 8,
      features: [
        'Tudo do Pro',
        'Destaque nos resultados',
        'Badge "Verificado"',
        'Analytics avançado',
        'Marketing personalizado',
      ],
      cta: 'Falar com Vendas',
      highlighted: false,
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <PricingCard key={plan.name} plan={plan} />
      ))}
    </div>
  );
}
```

**Receita Estimada:**
- 500 instrutores pagantes
- Ticket médio: R$ 70/mês
- **R$ 35.000/mês** recorrente 💰

---

## 3. 🎯 **Leads Qualificados** (Pay-per-Lead)

### Como Funciona
Instrutores pagam por cada aluno interessado que você envia.

### Precificação
```
Aluno solicitou aula → R$ 15-25 por lead
├─ Instrutor aceita → Cobrança confirmada
└─ Instrutor recusa → Sem cobrança (ou crédito)
```

### Implementação
```typescript
// Sistema de créditos

interface InstructorCredits {
  instructorId: string;
  credits: number;
  pricePerLead: number;
}

// Quando aluno solicita aula
async function sendLeadToInstructor(
  studentRequest: LessonRequest,
  instructorId: string
) {
  const instructor = await getInstructor(instructorId);
  
  // Verifica se tem créditos
  if (instructor.credits < instructor.pricePerLead) {
    throw new Error('Créditos insuficientes');
  }
  
  // Envia notificação para instrutor
  await sendNotification(instructorId, studentRequest);
  
  // Debita crédito quando instrutor VISUALIZA
  await debitCredit(instructorId, instructor.pricePerLead);
}
```

**Receita Estimada:**
- 1000 leads/mês × R$ 20 = **R$ 20.000/mês**

---

## 4. 🏆 **Destaque e Anúncios**

### Como Funciona
Instrutores pagam para ter mais visibilidade.

### Opções de Destaque

#### **Destaque nos Resultados**
- Aparece no topo das buscas
- Badge "Patrocinado"
- R$ 5-10 por dia

#### **Perfil Destacado**
- Aparece na homepage
- Seção "Instrutores em Destaque"
- R$ 100-200/mês

#### **Banner Promocional**
- Banner na homepage
- R$ 500-1000/mês

### Implementação
```typescript
// apps/pwa/src/components/FeaturedInstructor.tsx

export function FeaturedInstructorCard({ instructor, sponsored }) {
  return (
    <div className="relative">
      {sponsored && (
        <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
          Patrocinado
        </span>
      )}
      
      {/* Card normal do instrutor */}
      <InstructorCard instructor={instructor} />
    </div>
  );
}
```

**Receita Estimada:**
- 50 instrutores com destaque × R$ 150/mês = **R$ 7.500/mês**

---

## 5. 📱 **App Premium para Alunos** (Freemium)

### Como Funciona
Alunos pagam por recursos extras.

### Recursos Gratuitos
- ✅ Buscar instrutores
- ✅ Ver perfis
- ✅ Mensagens básicas

### Recursos Premium (R$ 9,90/mês)
- 🎯 Busca avançada com filtros
- 🔔 Notificações prioritárias
- 📊 Histórico completo de aulas
- 💎 Desconto em aulas (5-10%)
- 🎁 Programa de fidelidade
- ⭐ Sem anúncios

### Implementação
```typescript
// Componente de paywall

export function PremiumFeature({ feature, children }) {
  const { user } = useAuth();
  const isPremium = user?.subscription === 'premium';
  
  if (!isPremium) {
    return (
      <div className="blur-sm relative">
        {children}
        <div className="absolute inset-0 flex items-center justify-center">
          <button className="bg-purple-600 text-white px-6 py-3 rounded-full">
            Desbloquear com Premium
          </button>
        </div>
      </div>
    );
  }
  
  return children;
}
```

**Receita Estimada:**
- 2000 alunos premium × R$ 9,90 = **R$ 19.800/mês**

---

## 6. 🎓 **Cursos e Conteúdo Educacional**

### Como Funciona
Venda de cursos relacionados a direção.

### Produtos Digitais
- **Curso de Legislação de Trânsito** - R$ 47
- **Simulado CNH Online** - R$ 29
- **Guia Completo para Primeira Habilitação** - R$ 39
- **Aulas em Vídeo: Baliza Perfeita** - R$ 59

### Implementação
```typescript
// E-commerce simples

export function CourseCard({ course }) {
  return (
    <div className="border rounded-2xl p-6">
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">
          R$ {course.price}
        </span>
        <button className="bg-purple-600 text-white px-6 py-3 rounded-full">
          Comprar Agora
        </button>
      </div>
    </div>
  );
}
```

**Receita Estimada:**
- 500 vendas/mês × R$ 40 ticket médio = **R$ 20.000/mês**

---

## 7. 🤝 **Parcerias e Afiliados**

### Como Funciona
Parceria com empresas do setor automotivo.

### Oportunidades

#### **Autoescolas**
- Licenciamento da plataforma
- R$ 500-2000/mês por escola
- White-label

#### **Seguradoras**
- Indicação de alunos aprovados
- R$ 50-100 por seguro vendido

#### **Montadoras**
- Banner publicitário
- R$ 2000-5000/mês

#### **Despachantes**
- Comissão por processo de habilitação
- R$ 30-50 por indicação

**Receita Estimada:**
- Parcerias diversas = **R$ 15.000-30.000/mês**

---

## 8. 📊 **Analytics e Insights Premium**

### Como Funciona
Venda de dados e relatórios para instrutores.

### Produtos
- **Dashboard Analytics** - R$ 29/mês
  - Horários de pico
  - Perfil dos alunos
  - Taxa de conversão
  - Preço médio da região

- **Relatório de Mercado** - R$ 99/mês
  - Análise da concorrência
  - Tendências do setor
  - Oportunidades de negócio

---

## 💰 PROJEÇÃO DE RECEITA TOTAL

### Ano 1 (Crescimento Inicial)

#### Mês 1-3 (MVP)
```
Comissões:           R$ 5.000
Assinaturas:         R$ 2.000
TOTAL:              R$ 7.000/mês
```

#### Mês 4-6 (Crescimento)
```
Comissões:          R$ 15.000
Assinaturas:         R$ 8.000
Leads:               R$ 3.000
TOTAL:              R$ 26.000/mês
```

#### Mês 7-12 (Escala)
```
Comissões:          R$ 35.000
Assinaturas:        R$ 20.000
Leads:               R$ 8.000
Destaque:            R$ 5.000
Premium Alunos:      R$ 10.000
TOTAL:              R$ 78.000/mês
```

### Ano 2 (Consolidação)
```
Comissões:         R$ 120.000
Assinaturas:        R$ 50.000
Leads:              R$ 25.000
Destaque:           R$ 15.000
Premium Alunos:     R$ 35.000
Cursos:             R$ 20.000
Parcerias:          R$ 25.000
TOTAL:            R$ 290.000/mês
```

### Ano 3 (Expansão)
```
PROJEÇÃO:        R$ 500.000-800.000/mês
```

---

## 🎯 ESTRATÉGIA RECOMENDADA

### Fase 1: MVP (0-3 meses)
1. **Comissão fixa de 15%** em todas as aulas
2. **Sem planos pagos** (só gratuito)
3. Foco em **aquisição de instrutores e alunos**

### Fase 2: Monetização (3-6 meses)
1. Introduzir **planos pagos** para instrutores
2. Manter **comissão base** + opção de redução com plano
3. Testar **destaque pago**

### Fase 3: Diversificação (6-12 meses)
1. **Premium para alunos**
2. **Marketplace de cursos**
3. **Programa de afiliados**
4. **Parcerias estratégicas**

### Fase 4: Escala (12+ meses)
1. **Expansão geográfica**
2. **Licenciamento B2B**
3. **Produtos financeiros** (crédito para aulas)
4. **Seguros e serviços complementares**

---

## 🚀 IMPLEMENTAÇÃO PRÁTICA NO PWA

### 1. Criar Página de Pricing
```bash
# Criar componente
apps/pwa/src/app/pricing/page.tsx
```

### 2. Adicionar Checkout
```typescript
// Integração com Stripe/PagSeguro
import { loadStripe } from '@stripe/stripe-js';

export async function createCheckoutSession(plan: string) {
  const response = await fetch('/api/checkout', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });
  
  const session = await response.json();
  
  const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
  await stripe?.redirectToCheckout({ sessionId: session.id });
}
```

### 3. Dashboard de Receita
```typescript
// apps/pwa/src/app/admin/revenue/page.tsx

export function RevenueDashboard() {
  const stats = {
    totalRevenue: 78000,
    commissions: 35000,
    subscriptions: 20000,
    leads: 8000,
    featured: 5000,
    premium: 10000,
  };
  
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <MetricCard 
        title="Receita Total"
        value={`R$ ${stats.totalRevenue.toLocaleString()}`}
        trend="+24%"
      />
      {/* Outras métricas */}
    </div>
  );
}
```

---

## 📈 KPIs para Monitorar

### Métricas de Receita
- 💰 **MRR** (Monthly Recurring Revenue)
- 📊 **GMV** (Gross Merchandise Value)
- 💳 **AOV** (Average Order Value)
- 🔄 **Churn Rate**
- 📈 **LTV** (Lifetime Value)
- 💸 **CAC** (Customer Acquisition Cost)

### Metas de Crescimento
```
Ano 1: R$ 500k ARR (Annual Recurring Revenue)
Ano 2: R$ 3M ARR
Ano 3: R$ 10M ARR
```

---

## ✅ Próximos Passos

1. ✅ **Definir modelo principal** (Recomendo: Comissão 15%)
2. 📄 **Criar termos de uso** e política de privacidade
3. 💳 **Integrar gateway de pagamento** (Stripe/PagSeguro)
4. 📊 **Implementar analytics** (Plausible/Google Analytics)
5. 🎨 **Criar página de pricing** no PWA
6. 🧪 **Testar pricing** com primeiros usuários
7. 📢 **Validar modelo** com feedback real
8. 🚀 **Escalar** o que funcionar

---

**Lembre-se:** Comece simples, valide com usuários reais, e complexifique conforme cresce! 🚀

**Modelo mais simples e eficaz para começar:**
```
1. Comissão de 15% por aula
2. Plano gratuito para todos instrutores
3. Crescer base de usuários
4. Depois adicionar planos pagos
```

💡 **Dica de Ouro:** No Airbnb, 90% da receita vem de comissões. Foque nisso primeiro!
