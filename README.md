# Bora PWA - Marketplace de Aulas de Direção

> PWA moderno para conectar alunos e instrutores de autoescola

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![HeroUI](https://img.shields.io/badge/HeroUI-2.8-purple)](https://www.heroui.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

---

## 🚀 Stack Tecnológico

### Frontend
- **Framework:** Next.js 16 (App Router + Turbopack)
- **UI Library:** HeroUI 2.8.7
- **Styling:** Tailwind CSS 4
- **Language:** TypeScript 5.9
- **State:** React 19 + Hooks

### Backend (Futuro)
- **API:** tRPC
- **Database:** Prisma + PostgreSQL
- **Auth:** NextAuth.js
- **Payments:** Stripe / Mercado Pago

### PWA
- **Service Worker:** next-pwa
- **Offline:** Cache strategies
- **Install:** Manifest.json
- **Push:** Web Push API

---

## 📁 Estrutura do Projeto

```
bora-pwa/
├── apps/
│   └── pwa/                    # PWA Next.js
│       ├── src/
│       │   ├── app/            # App Router
│       │   │   ├── (landing)/  # Landing pages
│       │   │   ├── (auth)/     # Auth pages
│       │   │   ├── (student)/  # Student dashboard
│       │   │   └── (instructor)/ # Instructor dashboard
│       │   ├── components/     # React components
│       │   └── lib/            # Utilities
│       ├── public/             # Static assets
│       └── docs/               # Documentation
├── packages/                   # Shared packages
│   ├── api/                    # tRPC API (futuro)
│   ├── database/               # Prisma (futuro)
│   └── shared/                 # Utils (futuro)
└── README.md                   # Este arquivo
```

---

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js >= 18
- pnpm >= 9.15

### Instalação

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/bora-pwa.git
cd bora-pwa

# Instalar dependências
pnpm install
```

### Rodar em Desenvolvimento

```bash
# Rodar PWA
pnpm dev

# Ou diretamente
pnpm pwa

# Abrir: http://localhost:3000
```

### Build de Produção

```bash
# Build
pnpm build

# Start produção
cd apps/pwa && pnpm start
```

---

## 📱 PWA Features

### Instalável
- ✅ Manifest.json configurado
- ✅ Service Worker ativo
- ✅ Ícones em múltiplos tamanhos
- ✅ Splash screens

### Offline
- ✅ Cache de páginas
- ✅ Cache de assets
- ✅ Fallback offline
- ✅ Background sync

### Performance
- ✅ Next.js 16 Turbopack
- ✅ React 19 optimizations
- ✅ Image optimization
- ✅ Code splitting

---

## 🎨 Design System

### Tema HeroUI
- **Primary:** #006FEE (Azul)
- **Secondary:** #7828C8 (Roxo)
- **Success:** #17C964 (Verde)
- **Warning:** #F5A524 (Amarelo)
- **Danger:** #F31260 (Rosa)

### Componentes
- Navbar responsivo
- Cards interativos
- Forms com validação
- Tables com sorting
- Modals e Drawers
- Toast notifications

---

## 📄 Páginas Implementadas

### Landing
- ✅ Homepage (`/`)
- ✅ Pricing (`/pricing`)
- ✅ Boost (`/boost`)

### Auth
- ✅ Cadastro Aluno (`/signup/student`)
- ⏳ Cadastro Instrutor (`/signup/instructor`)
- ⏳ Login (`/login`)

### Dashboards
- ✅ Dashboard Aluno (`/student/dashboard`)
- ✅ Dashboard Instrutor (`/instructor/dashboard`)

---

## 🚀 Deploy

### Vercel (Recomendado)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
cd apps/pwa
vercel
```

### Outras Plataformas
- Netlify
- Cloudflare Pages
- AWS Amplify

---

## 📚 Documentação

### Estratégia
- [ESTRATEGIA_MARKETPLACE.md](apps/pwa/ESTRATEGIA_MARKETPLACE.md)
- [NOVA_ESTRATEGIA_HEROUI.md](apps/pwa/NOVA_ESTRATEGIA_HEROUI.md)
- [MODELOS_MONETIZACAO.md](apps/pwa/MODELOS_MONETIZACAO.md)

### Implementação
- [IMPLEMENTACAO_HEROUI_COMPLETA.md](apps/pwa/IMPLEMENTACAO_HEROUI_COMPLETA.md)
- [UI_UX_MODERNA_HEROUI.md](apps/pwa/UI_UX_MODERNA_HEROUI.md)
- [INDEX.md](apps/pwa/INDEX.md)

---

## 🎯 Roadmap

### ✅ Fase 1: MVP UI (Completo)
- [x] Setup Next.js + HeroUI
- [x] Homepage moderna
- [x] Páginas de pricing/boost
- [x] Dashboards aluno/instrutor
- [x] PWA configurado

### ⏳ Fase 2: Backend (Próximo)
- [ ] NextAuth authentication
- [ ] tRPC API
- [ ] Prisma + PostgreSQL
- [ ] CRUD completo

### 📋 Fase 3: Features
- [ ] Busca de instrutores
- [ ] Sistema de agendamento
- [ ] Chat em tempo real
- [ ] Pagamentos (Stripe)
- [ ] Notificações push

### 🚀 Fase 4: Launch
- [ ] Deploy produção
- [ ] Analytics (GA4)
- [ ] Marketing
- [ ] Onboarding usuários

---

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📝 License

Este projeto está sob a licença MIT.

---

## 👥 Autores

- **Mateus** - *Initial work*

---

## 🙏 Agradecimentos

- [Next.js](https://nextjs.org/)
- [HeroUI](https://www.heroui.com/)
- [Vercel](https://vercel.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Desenvolvido com 💜 em 2026**
