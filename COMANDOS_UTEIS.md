# 🛠️ Comandos Úteis - Bora Admin

## 🚀 Instalação e Setup

```powershell
# Instalação completa (recomendado)
.\install-shadcn-components.ps1
.\setup-admin.ps1

# Ou manualmente:
cd apps/admin
pnpm install
cp .env.example .env
# Configure o .env
pnpm dev
```

## 📦 Gerenciamento de Pacotes

```bash
# Instalar dependência
pnpm add <package-name>

# Instalar dependência de desenvolvimento
pnpm add -D <package-name>

# Remover dependência
pnpm remove <package-name>

# Atualizar dependências
pnpm update

# Limpar node_modules e reinstalar
rm -rf node_modules
pnpm install
```

## 🎨 Componentes Shadcn/UI

```bash
# Adicionar componente individual
npx shadcn-ui@latest add <component-name>

# Exemplos:
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog

# Adicionar todos de uma vez
.\install-shadcn-components.ps1
```

## 🗄️ Banco de Dados (Prisma)

```bash
# Gerar Prisma Client
cd ../../packages/db
pnpm db:generate

# Push schema para o banco
pnpm db:push

# Abrir Prisma Studio
pnpm db:studio

# Criar migration
pnpm db:migrate

# Seed do banco
pnpm db:seed
```

## 🔧 Desenvolvimento

```bash
# Rodar em desenvolvimento
pnpm dev

# Rodar em modo debug
NODE_OPTIONS='--inspect' pnpm dev

# Rodar com porta específica
PORT=3002 pnpm dev

# Build para produção
pnpm build

# Rodar build de produção
pnpm start

# Lint
pnpm lint

# Type check
pnpm type-check
```

## 🧪 Testes (quando implementados)

```bash
# Rodar testes
pnpm test

# Rodar testes em watch mode
pnpm test:watch

# Rodar testes com coverage
pnpm test:coverage

# Rodar testes e2e
pnpm test:e2e
```

## 🔐 Autenticação

```bash
# Criar usuário admin manualmente
cd ../..
npx tsx -e "
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const hashedPassword = await hash('sua-senha', 10);
  
  await prisma.user.create({
    data: {
      email: 'seu-email@exemplo.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });
  
  console.log('✅ Admin criado!');
}

createAdmin().finally(() => prisma.\$disconnect());
"
```

## 📊 Logs e Debug

```bash
# Ver logs do servidor
pnpm dev | tee logs.txt

# Ver logs do Prisma
DEBUG="prisma:*" pnpm dev

# Ver logs do tRPC
DEBUG="trpc:*" pnpm dev

# Ver todos os logs
DEBUG="*" pnpm dev
```

## 🧹 Limpeza

```bash
# Limpar cache do Next.js
rm -rf .next

# Limpar node_modules
rm -rf node_modules

# Limpar tudo e reinstalar
rm -rf node_modules .next
pnpm install
```

## 📦 Build e Deploy

```bash
# Build para produção
pnpm build

# Analisar bundle
ANALYZE=true pnpm build

# Deploy (Vercel)
vercel

# Deploy (Vercel - produção)
vercel --prod
```

## 🔄 Git

```bash
# Adicionar arquivos
git add .

# Commit
git commit -m "feat: adicionar painel admin"

# Push
git push origin main

# Criar branch
git checkout -b feature/nova-funcionalidade

# Merge
git checkout main
git merge feature/nova-funcionalidade
```

## 🛠️ Utilitários

```bash
# Gerar secret para NextAuth
openssl rand -base64 32

# Verificar porta em uso (Windows)
netstat -ano | findstr :3001

# Matar processo na porta 3001 (Windows)
taskkill /PID <PID> /F

# Verificar versão do Node
node -v

# Verificar versão do pnpm
pnpm -v

# Atualizar pnpm
npm install -g pnpm@latest
```

## 📝 Criar Nova Página

```bash
# 1. Criar pasta
mkdir -p apps/admin/src/app/\(dashboard\)/nova-pagina

# 2. Criar arquivos
touch apps/admin/src/app/\(dashboard\)/nova-pagina/page.tsx
touch apps/admin/src/app/\(dashboard\)/nova-pagina/columns.tsx

# 3. Copiar template de instructors
cp apps/admin/src/app/\(dashboard\)/instructors/page.tsx apps/admin/src/app/\(dashboard\)/nova-pagina/
cp apps/admin/src/app/\(dashboard\)/instructors/columns.tsx apps/admin/src/app/\(dashboard\)/nova-pagina/

# 4. Editar e adaptar
```

## 🔍 Troubleshooting

```bash
# Erro: "Cannot find module"
pnpm install

# Erro: "Port already in use"
# Mude a porta no .env ou mate o processo

# Erro: "Prisma Client not generated"
cd ../../packages/db
pnpm db:generate

# Erro: "Database connection failed"
# Verifique DATABASE_URL no .env

# Erro: "NextAuth error"
# Verifique NEXTAUTH_SECRET no .env

# Limpar tudo e recomeçar
rm -rf node_modules .next
pnpm install
pnpm dev
```

## 📚 Recursos

```bash
# Documentação Next.js
open https://nextjs.org/docs

# Documentação tRPC
open https://trpc.io/docs

# Documentação Shadcn/UI
open https://ui.shadcn.com

# Documentação Prisma
open https://www.prisma.io/docs

# Documentação Tailwind
open https://tailwindcss.com/docs
```

---

**💡 Dica**: Adicione esses comandos ao seu `.bashrc` ou `.zshrc` para atalhos:

```bash
alias admin-dev="cd apps/admin && pnpm dev"
alias admin-build="cd apps/admin && pnpm build"
alias admin-lint="cd apps/admin && pnpm lint"
```
