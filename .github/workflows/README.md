# GitHub Actions Workflows

Este diretório contém os workflows do GitHub Actions para CI/CD do projeto BORA.

## Workflows Disponíveis

### 1. CI (ci.yml)

Executado em: PRs e pushes para `main` e `develop`

**Jobs:**
- **lint-and-typecheck**: Executa ESLint e verificação de tipos TypeScript
- **test**: Executa os testes automatizados
- **build**: Constrói todos os pacotes para validar

**Quando usar:** Automático em cada PR/push

### 2. Deploy Web (deploy-web.yml)

Executado em: Pushes para `main`

**Jobs:**
- **deploy-admin**: Deploy do painel admin para Vercel
- **deploy-site**: Deploy do site institucional para Vercel

**Secrets necessários:**
- `VERCEL_TOKEN`: Token de autenticação do Vercel
- `VERCEL_ORG_ID`: ID da organização no Vercel
- `VERCEL_PROJECT_ID_ADMIN`: ID do projeto web-admin
- `VERCEL_PROJECT_ID_SITE`: ID do projeto web-site
- `DATABASE_URL`: URL do banco de dados
- `DIRECT_URL`: URL direta do banco (Supabase)
- `NEXTAUTH_SECRET`: Secret do NextAuth
- `NEXTAUTH_URL`: URL base da aplicação
- `GOOGLE_CLIENT_ID`: ID do cliente Google OAuth (opcional)
- `GOOGLE_CLIENT_SECRET`: Secret do cliente Google OAuth (opcional)

### 3. Deploy Mobile (deploy-mobile.yml)

Executado em: Pushes para `main` ou manualmente

**Jobs:**
- **deploy-aluno**: Build e submit do app do aluno via EAS
- **deploy-instrutor**: Build e submit do app do instrutor via EAS

**Secrets necessários:**
- `EXPO_TOKEN`: Token de autenticação do Expo

**Nota:** Os builds mobile são feitos com EAS (Expo Application Services) e automaticamente submetidos às lojas.

## Configuração Inicial

### 1. Configurar Secrets no GitHub

Vá para `Settings > Secrets and variables > Actions` e adicione:

```bash
# Vercel
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID_ADMIN=admin-project-id
VERCEL_PROJECT_ID_SITE=site-project-id

# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Auth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=https://admin.bora.com

# Expo
EXPO_TOKEN=your-expo-token

# OAuth (opcional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### 2. Obter Tokens

**Vercel Token:**
```bash
# No terminal local
npx vercel login
npx vercel link
# Copie os IDs gerados
```

**Expo Token:**
```bash
# No terminal local
npx expo login
npx expo whoami --token
```

### 3. Configurar Projetos Vercel

1. Crie dois projetos no Vercel: um para admin e outro para site
2. Conecte cada projeto ao diretório correto (`apps/web-admin` e `apps/web-site`)
3. Configure as variáveis de ambiente em cada projeto
4. Copie os Project IDs para os secrets do GitHub

### 4. Configurar EAS Build

```bash
# Nos diretórios dos apps mobile
cd apps/app-aluno
npx eas build:configure

cd ../app-instrutor
npx eas build:configure
```

## Fluxo de Deploy

### Branch Strategy

- **develop**: Branch de desenvolvimento, CI roda mas não faz deploy
- **main**: Branch de produção, CI + deploy automático

### Processo Recomendado

1. Desenvolver em feature branch
2. Abrir PR para `develop`
3. CI valida automaticamente
4. Após aprovação, merge para `develop`
5. Testar em ambiente de staging (se configurado)
6. Abrir PR de `develop` para `main`
7. Após merge, deploy automático para produção

## Troubleshooting

### Build Falha no CI

- Verifique os logs do workflow
- Rode `pnpm build` localmente para reproduzir
- Certifique-se de que todas as dependências estão no `package.json`

### Deploy Web Falha

- Verifique se todos os secrets estão configurados
- Confirme que os Project IDs do Vercel estão corretos
- Verifique os logs no dashboard do Vercel

### Deploy Mobile Falha

- Confirme que o `EXPO_TOKEN` está válido
- Verifique o arquivo `eas.json` em cada app
- Rode `eas build` localmente para testar

## Melhorias Futuras

- [ ] Deploy de staging automático em PRs
- [ ] Notificações no Slack/Discord após deploys
- [ ] Preview deployments para cada PR
- [ ] Testes E2E antes do deploy de produção
- [ ] Rollback automático em caso de falha
