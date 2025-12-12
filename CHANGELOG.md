# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-12-05

### 🎉 Initial Release

#### ✅ Added

**Monorepo Setup**
- Turborepo configuration with pnpm workspaces
- TypeScript configuration across all packages
- ESLint + Prettier + Husky + lint-staged
- CI/CD pipelines with GitHub Actions

**Packages**
- `@bora/ui` - Design system with BORA tokens (verde #00C853, laranja #FF6D00) and shadcn/ui components
- `@bora/db` - Prisma schema with 13 models (User, Student, Instructor, Lesson, Payment, etc.)
- `@bora/api` - tRPC routers (user, lesson, instructor, payment) with 23 procedures
- `@bora/auth` - NextAuth configuration with Credentials + Google OAuth
- `@bora/i18n` - Internationalization support (pt-BR)
- `@bora/tsconfig` - Shared TypeScript configurations
- `@bora/eslint-config` - Shared ESLint configurations

**Web Admin (`apps/web-admin`)**
- Next.js 15 with App Router
- Admin panel with shadcn-admin-kit
- CRUD resources: Instructors, Lessons, Students
- Authentication with NextAuth
- Dashboard with metrics cards
- Responsive sidebar navigation

**Web Site (`apps/web-site`)**
- Next.js 15 landing page
- Hero section, features, benefits, CTA
- Responsive mobile-first design
- SEO meta tags

**App Aluno (`apps/app-aluno`)**
- Expo Router 3 with bottom tabs navigation
- Screens: Home (Map), Search, Lessons, Profile
- tRPC client integration
- BORA green theme

**App Instrutor (`apps/app-instrutor`)**
- Expo Router 3 with bottom tabs navigation
- Screens: Agenda, History, Finance, Profile
- Availability toggle
- BORA orange theme

**Documentation**
- README.md with project overview
- CONTRIBUTING.md with contribution guidelines
- NEXT_STEPS.md with roadmap
- COMMANDS.md with useful commands
- PROJECT_STRUCTURE.md with visual structure
- docs/SETUP.md - Complete setup guide
- docs/ARCHITECTURE.md - Architecture decisions
- docs/API.md - Complete tRPC API documentation

**CI/CD**
- GitHub Actions workflows for CI
- Automated deployment for web apps (Vercel)
- Automated deployment for mobile apps (Expo EAS)
- Pre-commit hooks with Husky

#### 📊 Statistics

- **4 Apps** (2 web + 2 mobile)
- **6 Shared Packages**
- **4 tRPC Routers** with 23 procedures
- **13 Prisma Models**
- **5 Base UI Components**
- **~80 Files Created**
- **~3,000+ Lines of Code**

#### 🛠️ Tech Stack

- **Frontend**: Next.js 15, React Native, Expo Router 3, React 18
- **UI**: shadcn/ui, Tailwind CSS
- **Backend**: tRPC, Prisma, Supabase
- **Auth**: NextAuth, Expo SecureStore
- **Payments**: Stripe + Pix (prepared)
- **Tooling**: Turborepo, pnpm, TypeScript, ESLint, Prettier

---

[0.1.0]: https://github.com/ListMat/bora-platform/releases/tag/v0.1.0
