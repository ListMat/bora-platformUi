# Bora Admin - Painel Administrativo

Painel administrativo completo para gerenciar o sistema Bora.

## 🚀 Funcionalidades

### Dashboard
- **Métricas em Tempo Real**: Total de alunos, instrutores ativos, aulas do dia, receita mensal
- **Gráficos Interativos**: Visão geral de receita dos últimos 12 meses
- **Atividades Recentes**: Log de ações no sistema
- **SOS Monitor**: Acompanhamento de emergências ativas

### Gestão de Instrutores
- ✅ **Aprovação de Cadastros**: Aprovar/rejeitar novos instrutores
- 🔒 **Suspensão**: Suspender instrutores quando necessário
- 📊 **Métricas**: Visualizar avaliações, total de aulas e preço/hora
- 🔍 **Filtros**: Por status (Pendente, Ativo, Inativo, Suspenso)

### Gestão de Alunos
- 📋 **Lista Completa**: Todos os alunos cadastrados
- 📊 **Gamificação**: Pontos, nível e badges
- 💰 **Saldo**: Visualizar carteira digital

### Gestão de Aulas
- 📅 **Agendamentos**: Visualizar todas as aulas
- 🔍 **Filtros**: Por status (Pendente, Agendada, Ativa, Finalizada, Cancelada)
- 💳 **Pagamentos**: Status de pagamento de cada aula
- 📍 **Localização**: Endereço de pickup

### Gestão de Pagamentos
- 💰 **Transações**: Todas as transações do sistema
- 📊 **Status**: Pendente, Processando, Completo, Falhou, Reembolsado
- 🔍 **Detalhes**: Método de pagamento (Pix, Cartão, Dinheiro)
- 📈 **Splits**: Divisão de receita entre plataforma e instrutor

### Gestão de Emergências (SOS)
- 🚨 **Alertas**: Visualizar todos os SOS acionados
- 📍 **Localização**: Lat/Lng da emergência
- ✅ **Resolução**: Marcar como resolvido
- 📝 **Descrição**: Detalhes do problema

### Gestão de Avaliações
- ⭐ **Ratings**: Todas as avaliações pós-aula
- 💬 **Comentários**: Feedback dos alunos
- 📊 **Estatísticas**: Média de avaliações por instrutor

### Gestão de Indicações
- 🎁 **Programa de Referral**: "Indique e Ganhe"
- 💰 **Créditos**: Valor de recompensa por indicação
- ✅ **Status**: Pendente/Pago

### Gestão de Veículos
- 🚗 **Cadastro**: Todos os veículos dos instrutores
- 🔧 **Especificações**: Marca, modelo, ano, transmissão
- 🎨 **Fotos**: Galeria de imagens do veículo
- ✅ **Duplo Pedal**: Verificação obrigatória

## 🎨 Design

- **Dark Mode**: Tema claro/escuro automático
- **Responsivo**: Desktop e tablet
- **Shadcn/UI**: Componentes modernos e acessíveis
- **Tailwind CSS**: Estilização rápida e consistente

## 📦 Instalação

### 1. Instalar Dependências

```bash
cd apps/admin
pnpm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz de `apps/admin`:

```env
# Database (compartilhado com PWA)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="seu-secret-aqui"
NEXTAUTH_URL="http://localhost:3001"

# Admin Credentials (primeiro acesso)
ADMIN_EMAIL="admin@bora.com"
ADMIN_PASSWORD="admin123"
```

### 3. Rodar o Projeto

```bash
pnpm dev
```

O painel estará disponível em: `http://localhost:3001`

## 🔐 Autenticação

O painel admin usa NextAuth com autenticação por email/senha.

**Primeiro Acesso:**
- Email: `admin@bora.com`
- Senha: `admin123`

⚠️ **IMPORTANTE**: Altere a senha após o primeiro login!

## 📊 Estrutura de Pastas

```
apps/admin/
├── src/
│   ├── app/
│   │   ├── (dashboard)/          # Rotas protegidas
│   │   │   ├── page.tsx           # Dashboard principal
│   │   │   ├── instructors/       # Gestão de instrutores
│   │   │   ├── students/          # Gestão de alunos
│   │   │   ├── lessons/           # Gestão de aulas
│   │   │   ├── payments/          # Gestão de pagamentos
│   │   │   ├── emergencies/       # Gestão de SOS
│   │   │   ├── ratings/           # Gestão de avaliações
│   │   │   ├── referrals/         # Gestão de indicações
│   │   │   └── vehicles/          # Gestão de veículos
│   │   ├── api/
│   │   │   └── trpc/              # API tRPC
│   │   └── auth/                  # Páginas de autenticação
│   ├── components/
│   │   ├── dashboard/             # Componentes do dashboard
│   │   ├── layout/                # Sidebar, Header
│   │   └── ui/                    # Componentes shadcn
│   ├── lib/
│   │   ├── api.ts                 # Cliente tRPC
│   │   └── utils.ts               # Utilitários
│   └── server/
│       ├── routers/               # Routers tRPC
│       ├── trpc.ts                # Configuração tRPC
│       └── root.ts                # Router principal
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🔧 Tecnologias

- **Next.js 16**: Framework React
- **TypeScript**: Tipagem estática
- **tRPC**: API type-safe
- **Prisma**: ORM
- **Tailwind CSS**: Estilização
- **Shadcn/UI**: Componentes
- **React Query**: Cache e estado
- **NextAuth**: Autenticação
- **Recharts**: Gráficos

## 📝 Próximos Passos

### Funcionalidades Pendentes

1. **Exportação de Dados**
   - CSV/PDF de qualquer tabela
   - Relatórios personalizados

2. **Gestão de Emergências**
   - Criar tabela `Emergency` no Prisma
   - Implementar CRUD completo
   - Notificações em tempo real

3. **Configurações**
   - Gerenciar taxas da plataforma
   - Configurar políticas de cancelamento
   - Personalizar emails

4. **Analytics Avançado**
   - Funil de conversão
   - Churn rate
   - LTV (Lifetime Value)

## 🐛 Troubleshooting

### Erro de Conexão com Banco

Se você ver erros de "prepared statement already exists":

1. Verifique se `DIRECT_URL` está configurada no `.env`
2. Reinicie o servidor dev

### Erro de Autenticação

Se não conseguir fazer login:

1. Verifique se `NEXTAUTH_SECRET` está configurada
2. Limpe os cookies do navegador
3. Reinicie o servidor

## 📄 Licença

Propriedade da Bora Platform.
