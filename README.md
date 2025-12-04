# 🚗 BORA - Plataforma de Aulas de Direção

Monorepo Turborepo com Next.js 15 + Expo + shadcn/ui

## 📦 Estrutura

```
bora/
├── apps/
│   ├── web-admin        # Painel Administrativo (Next.js 15)
│   ├── web-site         # Site Institucional (Next.js 15)
│   ├── app-aluno        # App do Aluno (Expo Router)
│   └── app-instrutor    # App do Instrutor (Expo Router)
├── packages/
│   ├── ui               # Componentes shadcn/ui + BORA tokens
│   ├── db               # Prisma + Supabase
│   ├── api              # tRPC routers
│   ├── auth             # NextAuth + Expo SecureStore
│   ├── eslint-config    # Configuração ESLint
│   ├── tsconfig         # Base TypeScript config
│   └── i18n             # Traduções
```

## 🚀 Getting Started

### Pré-requisitos

- Node.js >= 18.17.0
- pnpm >= 8.0.0

### Instalação

```bash
# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# Setup do banco de dados
cd packages/db
pnpm prisma generate
pnpm prisma db push

# Desenvolvimento
pnpm dev
```

## 📱 Apps

### Web Admin (http://localhost:3000)

Painel administrativo com shadcn-admin-kit

### Web Site (http://localhost:3001)

Landing page institucional

### App Aluno

```bash
cd apps/app-aluno
pnpm start
```

### App Instrutor

```bash
cd apps/app-instrutor
pnpm start
```

## 🛠️ Stack

- **Frontend**: Next.js 15, React Native, Expo Router 3
- **UI**: shadcn/ui, Tailwind CSS, Tamagui
- **Backend**: tRPC, Prisma, Supabase
- **Auth**: NextAuth, Expo SecureStore
- **Pagamentos**: Stripe + Pix
- **CI/CD**: GitHub Actions, Vercel, Expo EAS

## 🎨 Design Tokens

Cores principais:

- Verde BORA: `#00C853` (142 100% 45%)
- Laranja BORA: `#FF6D00` (24 100% 50%)

## 📝 Scripts

```bash
pnpm dev          # Desenvolvimento
pnpm build        # Build produção
pnpm lint         # Linter
pnpm type-check   # TypeScript check
pnpm test         # Testes
pnpm format       # Prettier
```

## 📄 Licença

Proprietary - Todos os direitos reservados
