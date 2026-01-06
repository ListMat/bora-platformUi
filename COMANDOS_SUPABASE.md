# ⚡ COMANDOS RÁPIDOS - SUPABASE

## 🚀 Setup Inicial (Execute nesta ordem)

### 1. Configurar .env
```bash
# Edite o arquivo packages/db/.env
# Adicione sua connection string do Supabase
DATABASE_URL="postgresql://postgres:[SENHA]@db.xxxxx.supabase.co:5432/postgres"
```

### 2. Gerar Prisma Client
```bash
cd packages/db
pnpm prisma generate
```

### 3. Criar Tabelas no Supabase
```bash
pnpm prisma db push
```

### 4. Testar Conexão
```bash
npx tsx test-connection.ts
```

### 5. Popular com Dados de Teste
```bash
pnpm db:seed
```

---

## 📝 Comandos Úteis

### Ver Banco de Dados (Interface Visual)
```bash
cd packages/db
pnpm db:studio
```
Abre em: http://localhost:5555

### Resetar Banco (CUIDADO!)
```bash
pnpm prisma db push --force-reset
pnpm db:seed
```

### Ver Schema Atual
```bash
pnpm prisma db pull
```

### Criar Migration
```bash
pnpm prisma migrate dev --name nome_da_migration
```

### Aplicar Migrations em Produção
```bash
pnpm prisma migrate deploy
```

---

## 🔍 Verificar Status

### Contar Registros
```bash
npx tsx test-connection.ts
```

### Ver Logs do Prisma
```bash
# Adicione ao .env:
DEBUG="prisma:*"
```

---

## 🎯 Credenciais de Teste (Após Seed)

### Admin:
- Email: `admin@bora.com`
- Senha: `admin123`

### Instrutores:
- Email: `joao.silva@bora.com`
- Email: `maria.santos@bora.com`
- Email: `carlos.oliveira@bora.com`
- Senha: `instrutor123` (todos)

### Alunos:
- Email: `ana.costa@bora.com`
- Email: `pedro.alves@bora.com`
- Senha: `aluno123` (todos)

---

## 🚨 Troubleshooting

### Erro: "Environment variable not found: DATABASE_URL"
```bash
# Certifique-se de estar no diretório correto
cd packages/db

# Verifique se o .env existe
ls .env

# Se não existir, crie:
echo 'DATABASE_URL="sua_connection_string"' > .env
```

### Erro: "Can't reach database server"
```bash
# 1. Verifique a senha na connection string
# 2. Tente adicionar ?sslmode=require no final
# 3. Use a Connection Pooling URL do Supabase
```

### Erro: "Table already exists"
```bash
# Use --force-reset para recriar tudo
pnpm prisma db push --force-reset
```

### Limpar Cache do Prisma
```bash
rm -rf node_modules/.prisma
pnpm prisma generate
```

---

## 📊 Estrutura Criada

Após `db push`, você terá 20+ tabelas:

✅ User
✅ Student  
✅ Instructor
✅ Lesson
✅ Payment
✅ Vehicle
✅ Rating
✅ ChatMessage
✅ InstructorAvailability
✅ Plan
✅ Bundle
✅ Medal
✅ Skill
✅ SkillEvaluation
✅ Emergency
✅ Notification
✅ ActivityLog
✅ PaymentSplit
✅ CancellationPolicy
✅ Account (NextAuth)
✅ Session (NextAuth)
✅ VerificationToken (NextAuth)

---

## 🎓 Próximos Passos

1. ✅ Execute os comandos acima
2. ✅ Verifique no Supabase Dashboard (Table Editor)
3. ✅ Teste login na aplicação
4. ✅ Configure as outras APIs (Google Maps, Mercado Pago, Pusher)

---

## 💡 Dicas

- Use `pnpm db:studio` para ver/editar dados visualmente
- Sempre faça backup antes de `--force-reset`
- Em produção, use migrations (`migrate deploy`)
- Monitore uso no Supabase Dashboard
