# 📂 Estrutura do Projeto BORA

```
bora/
│
├── 📱 apps/                           # Aplicações finais
│   ├── web-admin/                     # Painel Administrativo (Next.js 15)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── api/
│   │   │   │   │   ├── auth/[...nextauth]/  # NextAuth endpoints
│   │   │   │   │   └── trpc/[trpc]/         # tRPC endpoints
│   │   │   │   ├── auth/signin/             # Página de login
│   │   │   │   ├── layout.tsx               # Layout raiz
│   │   │   │   ├── page.tsx                 # Dashboard
│   │   │   │   ├── providers.tsx            # React Query + tRPC providers
│   │   │   │   └── globals.css              # Estilos globais + tokens BORA
│   │   │   └── lib/
│   │   │       └── trpc.ts                  # tRPC client config
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── web-site/                      # Site Institucional (Next.js 15)
│   │   ├── src/
│   │   │   └── app/
│   │   │       ├── layout.tsx               # Layout raiz
│   │   │       ├── page.tsx                 # Landing page
│   │   │       └── globals.css              # Estilos + tokens BORA
│   │   ├── next.config.js
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── app-aluno/                     # App do Aluno (Expo Router)
│   │   ├── app/
│   │   │   ├── _layout.tsx                  # Root layout
│   │   │   └── (tabs)/                      # Bottom tabs navigation
│   │   │       ├── _layout.tsx              # Tabs config
│   │   │       ├── index.tsx                # Home (mapa)
│   │   │       ├── search.tsx               # Buscar instrutores
│   │   │       ├── lessons.tsx              # Minhas aulas
│   │   │       └── profile.tsx              # Perfil
│   │   ├── src/
│   │   │   └── lib/
│   │   │       └── trpc.ts                  # tRPC client
│   │   ├── app.json                         # Expo config
│   │   ├── babel.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── app-instrutor/                 # App do Instrutor (Expo Router)
│       ├── app/
│       │   ├── _layout.tsx                  # Root layout
│       │   └── (tabs)/                      # Bottom tabs navigation
│       │       ├── _layout.tsx              # Tabs config
│       │       ├── index.tsx                # Agenda
│       │       ├── history.tsx              # Histórico
│       │       ├── finance.tsx              # Financeiro
│       │       └── profile.tsx              # Perfil
│       ├── src/
│       │   └── lib/
│       │       └── trpc.ts                  # tRPC client
│       ├── app.json                         # Expo config
│       ├── babel.config.js
│       ├── tsconfig.json
│       └── package.json
│
├── 📦 packages/                       # Packages compartilhados
│   │
│   ├── @bora/ui/                      # Design System
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── button.tsx               # Componente Button
│   │   │   │   ├── card.tsx                 # Componente Card
│   │   │   │   ├── dialog.tsx               # Componente Dialog
│   │   │   │   ├── input.tsx                # Componente Input
│   │   │   │   └── label.tsx                # Componente Label
│   │   │   ├── lib/
│   │   │   │   └── utils.ts                 # Utilidades (cn, etc)
│   │   │   ├── styles/
│   │   │   │   └── bora-tokens.css          # 🎨 Tokens BORA (verde/laranja)
│   │   │   └── index.tsx                    # Exports
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── @bora/db/                      # Prisma + Database
│   │   ├── prisma/
│   │   │   └── schema.prisma                # 🗄️ Schema completo
│   │   ├── src/
│   │   │   └── index.ts                     # Prisma client export
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── @bora/api/                     # tRPC API
│   │   ├── src/
│   │   │   ├── routers/
│   │   │   │   ├── user.ts                  # Router de usuários
│   │   │   │   ├── lesson.ts                # Router de aulas
│   │   │   │   ├── instructor.ts            # Router de instrutores
│   │   │   │   └── payment.ts               # Router de pagamentos
│   │   │   ├── trpc.ts                      # 🔧 Config tRPC + middlewares
│   │   │   └── index.ts                     # App router export
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── @bora/auth/                    # NextAuth Config
│   │   ├── src/
│   │   │   └── index.ts                     # 🔐 authOptions (Credentials + Google)
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── @bora/i18n/                    # Traduções
│   │   ├── src/
│   │   │   ├── locales/
│   │   │   │   └── pt-BR.json               # 🇧🇷 Traduções pt-BR
│   │   │   └── index.ts                     # Exports
│   │   └── package.json
│   │
│   ├── @bora/tsconfig/                # TypeScript Configs
│   │   ├── base.json                        # Config base
│   │   ├── nextjs.json                      # Config Next.js
│   │   ├── react-native.json                # Config React Native
│   │   └── package.json
│   │
│   └── @bora/eslint-config/           # ESLint Configs
│       ├── next.js                          # Config Next.js
│       ├── react-native.js                  # Config React Native
│       └── package.json
│
├── 📚 docs/                           # Documentação
│   ├── SETUP.md                             # 🛠️ Guia de setup completo
│   ├── ARCHITECTURE.md                      # 🏗️ Arquitetura técnica
│   └── API.md                               # 📡 Documentação da API tRPC
│
├── 🔄 .github/                        # CI/CD
│   └── workflows/
│       ├── ci.yml                           # Lint, type-check, test, build
│       ├── deploy-web.yml                   # Deploy Vercel (web apps)
│       └── deploy-mobile.yml                # Deploy Expo EAS (mobile apps)
│
├── 🪝 .husky/                         # Git Hooks
│   └── pre-commit                           # Roda lint-staged
│
├── 📄 Arquivos Raiz
│   ├── package.json                         # Package raiz do monorepo
│   ├── pnpm-workspace.yaml                  # Config workspace pnpm
│   ├── turbo.json                           # 🚀 Pipeline Turborepo
│   ├── .lintstagedrc.js                     # Config lint-staged
│   ├── .prettierrc                          # Config Prettier
│   ├── .prettierignore                      # Ignore Prettier
│   ├── .editorconfig                        # Config Editor
│   ├── .eslintrc.js                         # Config ESLint
│   ├── .gitignore                           # Ignore Git
│   ├── .env.example                         # 🔐 Template variáveis de ambiente
│   │
│   ├── 📖 Documentação Auxiliar
│   ├── README.md                            # Readme principal
│   ├── CONTRIBUTING.md                      # 🤝 Guia de contribuição
│   ├── NEXT_STEPS.md                        # 🚀 Próximos passos pós-setup
│   ├── COMMANDS.md                          # ⚡ Comandos úteis
│   └── PROJECT_STRUCTURE.md                 # 📂 Este arquivo
│
└── 📦 node_modules/                   # Dependências (pnpm workspace)
```

## 🎯 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  web-admin   │  │   web-site   │  │  app-aluno   │          │
│  │  (Next.js)   │  │  (Next.js)   │  │   (Expo)     │          │
│  └──────┬───────┘  └──────────────┘  └──────┬───────┘          │
│         │                                     │                  │
│         └─────────────┬─────────────────────┘                   │
│                       │ tRPC Client                              │
└───────────────────────┼──────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND (tRPC)                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    @bora/api                              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐  │   │
│  │  │   user   │  │  lesson  │  │instructor│  │ payment │  │   │
│  │  │  router  │  │  router  │  │  router  │  │ router  │  │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬────┘  │   │
│  └───────┼─────────────┼─────────────┼─────────────┼────────┘   │
│          │             │             │             │            │
│          └─────────────┴─────────────┴─────────────┘            │
│                              │                                   │
│                              ▼                                   │
│                    Middlewares (auth, roles)                     │
└──────────────────────────────┼───────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (@bora/db)                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Prisma Client                           │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │               Supabase Postgres                           │   │
│  │  Users • Students • Instructors • Lessons • Payments      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Deploy Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         DEVELOPMENT                              │
│  Desenvolvedor faz push para branch → Abre PR                   │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CI (GitHub Actions)                         │
│  ✅ ESLint  ✅ Type Check  ✅ Tests  ✅ Build                    │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MERGE TO MAIN                                 │
│  PR aprovado e mergeado → Trigger deploy automático             │
└─────────┬───────────────────────────────┬────────────────────────┘
          │                               │
          ▼                               ▼
┌───────────────────────┐    ┌────────────────────────────────────┐
│   WEB APPS (Vercel)   │    │    MOBILE APPS (Expo EAS)          │
│  • web-admin          │    │  • app-aluno                       │
│  • web-site           │    │  • app-instrutor                   │
└───────────────────────┘    └────────────────────────────────────┘
```

## 🔑 Arquivos Importantes

| Arquivo                                  | Descrição                         |
| ---------------------------------------- | --------------------------------- |
| `turbo.json`                             | Pipeline de build Turborepo       |
| `pnpm-workspace.yaml`                    | Config workspace pnpm             |
| `packages/db/prisma/schema.prisma`       | Schema do banco de dados          |
| `packages/api/src/index.ts`              | Router principal tRPC             |
| `packages/ui/src/styles/bora-tokens.css` | Tokens de design BORA             |
| `.env.example`                           | Template de variáveis de ambiente |
| `NEXT_STEPS.md`                          | Guia de próximos passos           |

## 🎨 Design Tokens

```css
/* Verde BORA (Primary) */
--primary: 142 100% 39%; /* #00C853 */

/* Laranja BORA (Secondary) */
--secondary: 24 100% 50%; /* #FF6D00 */
```

Usado em todos os apps para consistência visual.

## 📊 Métricas do Projeto

- **Total de Apps**: 4 (2 web + 2 mobile)
- **Total de Packages**: 6
- **Linguagem**: TypeScript 100%
- **Framework Web**: Next.js 15 (App Router)
- **Framework Mobile**: Expo Router 3
- **Backend**: tRPC + Prisma
- **Database**: PostgreSQL (Supabase)
- **Auth**: NextAuth
- **Payments**: Stripe
- **CI/CD**: GitHub Actions

---

**Boa sorte com o desenvolvimento! 🚗💨**
