# ⚡ Comandos Úteis - BORA

Referência rápida de comandos para desenvolvimento.

## 📦 Instalação

```bash
# Instalar todas as dependências
pnpm install

# Instalar dependência no workspace raiz
pnpm add -w <pacote>

# Instalar dependência em um app específico
pnpm add <pacote> --filter web-admin

# Instalar dependência em um package
pnpm add <pacote> --filter @bora/ui

# Instalar dependência de dev
pnpm add -D <pacote> --filter web-admin

# Remover dependência
pnpm remove <pacote> --filter web-admin
```

## 🚀 Desenvolvimento

```bash
# Rodar todos os apps
pnpm dev

# Rodar app específico
pnpm --filter web-admin dev
pnpm --filter web-site dev

# Mobile apps (terminal separado)
cd apps/app-aluno && pnpm start
cd apps/app-instrutor && pnpm start
```

## 🏗️ Build

```bash
# Build todos os projetos
pnpm build

# Build app específico
pnpm --filter web-admin build

# Build com dependências
pnpm --filter web-admin... build

# Limpar builds anteriores
pnpm clean
```

## 🧹 Limpeza

```bash
# Limpar node_modules e builds
rm -rf node_modules apps/*/node_modules packages/*/node_modules
rm -rf .turbo apps/*/.next packages/*/dist

# Reinstalar tudo
pnpm install

# Limpar cache do Turborepo
rm -rf .turbo
```

## ✅ Qualidade de Código

```bash
# Lint todos os projetos
pnpm lint

# Lint e fix
pnpm lint --fix

# Type check
pnpm type-check

# Formatar código
pnpm format

# Rodar testes
pnpm test

# Testes com coverage
pnpm test --coverage
```

## 🗄️ Banco de Dados (Prisma)

```bash
cd packages/db

# Gerar client
pnpm prisma generate

# Push schema (dev)
pnpm prisma db push

# Criar migration
pnpm prisma migrate dev --name nome_da_migration

# Deploy migrations (prod)
pnpm prisma migrate deploy

# Reset database
pnpm prisma migrate reset

# Abrir Prisma Studio
pnpm prisma studio

# Seed database
pnpm prisma db seed

# Format schema
pnpm prisma format
```

## 🔐 Autenticação

```bash
# Gerar secret do NextAuth
openssl rand -base64 32

# Testar Google OAuth local
# Adicione http://localhost:3000/api/auth/callback/google
# nas redirect URIs do Google Console
```

## 💳 Stripe

```bash
# Instalar CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Escutar webhooks localmente
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Testar webhook
stripe trigger payment_intent.succeeded

# Ver logs
stripe logs tail
```

## 📱 Mobile (Expo)

```bash
cd apps/app-aluno

# Iniciar dev server
pnpm start

# Rodar no iOS (macOS only)
pnpm ios

# Rodar no Android
pnpm android

# Rodar no web
pnpm web

# Limpar cache
pnpm start --clear

# Build preview (EAS)
eas build --profile preview --platform ios

# Build production
eas build --profile production --platform all

# Submit para stores
eas submit --platform all

# Ver builds
eas build:list

# Ver status do build
eas build:view <build-id>
```

## 🚢 Deploy

### Vercel (Web)

```bash
# Instalar CLI
pnpm add -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy produção
vercel --prod

# Ver logs
vercel logs <deployment-url>

# Ver variáveis de ambiente
vercel env ls

# Adicionar variável
vercel env add DATABASE_URL production
```

### Expo EAS (Mobile)

```bash
# Login
eas login

# Configurar projeto
eas build:configure

# Build desenvolvimento
eas build --profile development --platform ios

# Build produção
eas build --profile production --platform all

# Submit
eas submit --platform ios
eas submit --platform android

# Update OTA
eas update --branch production --message "Fix crítico"
```

## 🔍 Debug

```bash
# Next.js debug
NODE_OPTIONS='--inspect' pnpm --filter web-admin dev

# Ver logs do Vercel
vercel logs <deployment-url> --follow

# Ver logs do Expo
cd apps/app-aluno
npx react-native log-android
npx react-native log-ios

# Prisma debug queries
DATABASE_URL="..." pnpm prisma studio
```

## 📊 Monitoring

```bash
# Analisar bundle size (Next.js)
ANALYZE=true pnpm --filter web-admin build

# Lighthouse CI
npm install -g @lhci/cli
lhci autorun

# Check security
pnpm audit

# Fix vulnerabilities
pnpm audit --fix
```

## 🧪 Testes

```bash
# Rodar todos os testes
pnpm test

# Rodar testes de um pacote
pnpm --filter @bora/api test

# Watch mode
pnpm test --watch

# Coverage
pnpm test --coverage

# E2E (Playwright)
pnpm test:e2e

# E2E com UI
pnpm test:e2e --ui
```

## 🔄 Git

```bash
# Criar branch
git checkout -b feat/nome-da-feature

# Commit (Husky roda lint-staged)
git commit -m "feat: adiciona nova funcionalidade"

# Push
git push origin feat/nome-da-feature

# Atualizar branch com main
git checkout main
git pull
git checkout feat/nome-da-feature
git rebase main

# Squash commits
git rebase -i HEAD~3
```

## 🎨 UI/Design

```bash
# Adicionar componente shadcn
cd packages/ui
npx shadcn-ui@latest add <component>

# Adicionar ícone (Lucide)
# Ver: https://lucide.dev

# Gerar palette de cores
# Usar: https://ui.shadcn.com/themes
```

## 📦 Packages

```bash
# Criar novo package
mkdir packages/nome-do-package
cd packages/nome-do-package
pnpm init

# Criar novo app
mkdir apps/nome-do-app
cd apps/nome-do-app
pnpm init
```

## 🔧 Turborepo

```bash
# Cache info
turbo run build --dry-run

# Filtrar por escopo
turbo run build --filter=web-admin

# Sem cache
turbo run build --force

# Paralelo
turbo run lint test type-check --parallel
```

## 📚 Documentação

```bash
# Gerar docs da API (TypeDoc)
pnpm add -D typedoc
pnpm typedoc

# Gerar changelog
pnpm add -D conventional-changelog-cli
pnpm conventional-changelog -p angular -i CHANGELOG.md -s
```

## 🚨 Emergência / Hotfix

```bash
# Reverter último commit
git revert HEAD

# Reverter deploy no Vercel
vercel rollback

# Criar hotfix branch
git checkout -b hotfix/nome-do-fix main

# Merge direto para main (após aprovação)
git checkout main
git merge hotfix/nome-do-fix
git push
```

## 📱 Device Testing

```bash
# Expo: testar em device físico
# 1. Instale Expo Go no celular
# 2. pnpm start
# 3. Escaneie QR code

# Expo: testar em emulador
# iOS: pnpm ios (requer Xcode)
# Android: pnpm android (requer Android Studio)

# Ver devices conectados
adb devices  # Android
xcrun simctl list devices  # iOS
```

## 🔐 Secrets Management

```bash
# Adicionar secret no Vercel
vercel env add SECRET_NAME production

# Adicionar secret no GitHub
# Settings > Secrets > Actions > New repository secret

# Adicionar secret no Expo (EAS)
eas secret:create --scope project --name SECRET_NAME
```

## 📊 Analytics

```bash
# Next.js: analisar bundle
ANALYZE=true pnpm build

# Lighthouse
lighthouse http://localhost:3000 --view

# Web Vitals
# Usar: https://web.dev/vitals/
```

## 🎯 Produtividade

```bash
# Rodar múltiplos comandos
pnpm run-parallel lint type-check test

# Watch multiple packages
pnpm --filter @bora/ui --filter @bora/api dev

# Aliases úteis (adicione ao .bashrc/.zshrc)
alias pi="pnpm install"
alias pd="pnpm dev"
alias pb="pnpm build"
alias pt="pnpm test"
alias pl="pnpm lint"
```

## 📝 Logs

```bash
# Ver logs do Next.js
cd apps/web-admin
cat .next/trace

# Ver logs do Expo
cd apps/app-aluno
cat .expo/README.md

# Ver logs do Prisma
cd packages/db
cat prisma/schema.prisma
```

---

💡 **Dica**: Adicione esses comandos aos seus aliases ou crie scripts npm customizados!
