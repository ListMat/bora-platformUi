# 🏗️ FASE 2: IMPLEMENTAÇÃO DO BACKEND

## 🎯 Objetivo
Implementar a infraestrutura completa de backend: Autenticação, Banco de Dados e API Type-safe.

---

## 📋 Stack Tecnológica

1.  **Auth:** `next-auth` (v4 por estabilidade ou v5 beta)
2.  **Database:** `prisma` + `sqlite` (dev) / `postgresql` (prod)
3.  **API:** `@trpc/server` + `@trpc/client` + `react-query`

---

## 📅 Plano de Execução

### ETAPA 1: Instalação e Configuração Inicial
- [ ] Instalar dependências NextAuth
- [ ] Instalar dependências Prisma
- [ ] Instalar dependências tRPC e TanStack Query

### ETAPA 2: Banco de Dados (Prisma)
- [ ] Inicializar Prisma
- [ ] Definir Schema:
    - `User` (Auth)
    - `Instructor` (Perfil, Status)
    - `Student` (Perfil)
    - `Schedule` (Horários)
    - `Vehicle` (Carros)
    - `Lesson` (Aulas)
- [ ] Rodar primeira migration

### ETAPA 3: Autenticação (NextAuth)
- [ ] Configurar `[...nextauth]/route.ts`
- [ ] Criar PrismaAdapter
- [ ] Configurar Credentials Provider (Login senha)
- [ ] Configurar Google Provider (Opcional por enquanto)

### ETAPA 4: API (tRPC)
- [ ] Configurar cliente tRPC (frontend)
- [ ] Configurar servidor tRPC (backend)
- [ ] Criar Context (Session no tRPC)
- [ ] Criar Routers iniciais:
    - `appRouter` (root)
    - `authRouter` (exemplo)

### ETAPA 5: Integração Frontend
- [ ] Envolver app com `TRPCProvider` e `SessionProvider`
- [ ] Testar chamada de API simples

---

## 🛠️ Comandos de Instalação

```bash
# Auth e DB
pnpm add next-auth @prisma/client @next-auth/prisma-adapter bcryptjs

# Dev DB
pnpm add -D prisma @types/bcryptjs

# tRPC e Query
pnpm add @trpc/server @trpc/client @trpc/react-query @trpc/next @tanstack/react-query
```

---

## 📝 Schemas Principais (Prisma)

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  password      String?   // Para credentials logic
  role          String    @default("STUDENT") // STUDENT | INSTRUCTOR
  
  instructor    Instructor?
  student       Student?
  // ... next-auth fields
}

model Instructor {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id])
  
  cpf          String?
  phone        String?
  isOnline     Boolean @default(false)
  pricePerHour Float?
  
  vehicles     Vehicle[]
  schedule     Schedule[]
}
```

---

## ✅ Definição de Sucesso
- Login/Logout funcionando
- Banco de dados persistindo dados
- Frontend chamando Backend via tRPC com tipagem completa
