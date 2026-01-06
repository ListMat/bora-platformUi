# 🎯 SETUP SUPABASE - CHECKLIST COMPLETO

## ✅ PASSO A PASSO SIMPLIFICADO

### **PARTE 1: Criar Conta e Projeto** (5 minutos)

```
1. Acesse: https://supabase.com
2. Faça login com GitHub
3. Clique em "New Project"
4. Preencha:
   - Name: bora-production
   - Password: [CRIE UMA SENHA FORTE E ANOTE!]
   - Region: South America (São Paulo)
5. Clique em "Create new project"
6. Aguarde ~2 minutos
```

---

### **PARTE 2: Obter Connection String** (2 minutos)

```
1. No Supabase Dashboard:
   Settings (⚙️) > Database > Connection string

2. Copie a URI:
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres

3. SUBSTITUA [YOUR-PASSWORD] pela senha que você criou
```

---

### **PARTE 3: Configurar .env** (1 minuto)

```bash
# 1. Copie o template
cd packages/db
cp .env.example .env

# 2. Edite o .env
# Cole sua connection string completa
DATABASE_URL="postgresql://postgres:suasenha@db.xxxxx.supabase.co:5432/postgres"
```

---

### **PARTE 4: Criar Tabelas** (2 minutos)

```bash
# 1. Gerar Prisma Client
cd packages/db
pnpm prisma generate

# 2. Criar todas as tabelas no Supabase
pnpm prisma db push

# Você verá:
# ✔ Generated Prisma Client
# ✔ Your database is now in sync with your Prisma schema
```

---

### **PARTE 5: Testar Conexão** (1 minuto)

```bash
# Executar teste
npx tsx test-connection.ts

# Você deve ver:
# ✅ Conexão estabelecida com sucesso!
# ✅ Usuários no banco: 0
# ✅ Instrutores no banco: 0
# ✅ Alunos no banco: 0
```

---

### **PARTE 6: Popular com Dados de Teste** (1 minuto)

```bash
# Executar seed
pnpm db:seed

# Você verá:
# ✅ Admin criado: admin@bora.com
# ✅ Instrutor criado: João Silva
# ✅ Instrutor criado: Maria Santos
# ✅ Instrutor criado: Carlos Oliveira
# ✅ Aluno criado: Ana Costa
# ✅ Aluno criado: Pedro Alves
```

---

### **PARTE 7: Verificar no Supabase** (1 minuto)

```
1. Volte ao Supabase Dashboard
2. Clique em "Table Editor" (📊)
3. Você deve ver todas as tabelas:
   ✅ User (6 registros)
   ✅ Instructor (3 registros)
   ✅ Student (2 registros)
   ✅ Vehicle (3 registros)
   ✅ InstructorAvailability (15 registros)
   ✅ E mais 15+ tabelas vazias
```

---

## 🎓 CREDENCIAIS DE TESTE

Após executar o seed, você pode fazer login com:

### 👨‍💼 **Admin**
```
Email: admin@bora.com
Senha: admin123
```

### 🚗 **Instrutores**
```
Email: joao.silva@bora.com
Email: maria.santos@bora.com
Email: carlos.oliveira@bora.com
Senha: instrutor123 (todos)
```

### 🎓 **Alunos**
```
Email: ana.costa@bora.com
Email: pedro.alves@bora.com
Senha: aluno123 (todos)
```

---

## 🚀 TESTAR A APLICAÇÃO

```bash
# 1. Voltar para raiz do projeto
cd ../..

# 2. Iniciar servidor de desenvolvimento
pnpm dev

# 3. Abrir no navegador
http://localhost:3000

# 4. Fazer login
# Use qualquer credencial acima
```

---

## 📊 O QUE FOI CRIADO

### **Banco de Dados**:
- ✅ 20+ tabelas
- ✅ Relacionamentos configurados
- ✅ Índices otimizados
- ✅ Constraints de integridade

### **Dados de Teste**:
- ✅ 1 Admin
- ✅ 3 Instrutores (com veículos e disponibilidade)
- ✅ 2 Alunos
- ✅ Total: 6 usuários prontos para teste

---

## 🎯 PRÓXIMOS PASSOS

Agora que o banco está pronto, configure as outras APIs:

### 1. **Google Maps** (para o mapa)
```
Guia: MAPA_AGENDAMENTO_COMPLETO.md
Tempo: ~5 minutos
```

### 2. **Mercado Pago** (para pagamentos)
```
Guia: MERCADOPAGO_INTEGRACAO.md
Tempo: ~10 minutos
```

### 3. **Pusher** (para chat em tempo real)
```
Criar conta em: https://pusher.com
Tempo: ~5 minutos
```

### 4. **NextAuth** (Google OAuth - opcional)
```
Criar OAuth em: https://console.cloud.google.com
Tempo: ~10 minutos
```

---

## 🚨 PROBLEMAS COMUNS

### ❌ "Can't reach database server"
**Solução**:
```bash
# Verifique se a senha está correta
# Tente adicionar ?sslmode=require no final da URL
DATABASE_URL="postgresql://...?sslmode=require"
```

### ❌ "Environment variable not found"
**Solução**:
```bash
# Certifique-se de estar no diretório correto
cd packages/db
ls .env  # Deve existir

# Se não existir, crie:
cp .env.example .env
# E edite com sua connection string
```

### ❌ "Table already exists"
**Solução**:
```bash
# Resetar e recriar tudo
pnpm prisma db push --force-reset
pnpm db:seed
```

---

## 💡 DICAS

1. **Prisma Studio**: Interface visual para ver/editar dados
   ```bash
   pnpm db:studio
   # Abre em http://localhost:5555
   ```

2. **Backup**: Supabase faz backup automático (plano pago)

3. **Limites Free Tier**:
   - 500MB de banco
   - 1GB de storage
   - 2GB de bandwidth/mês
   - Suficiente para desenvolvimento!

4. **Upgrade**: R$ 25/mês para plano Pro
   - 8GB de banco
   - 100GB de storage
   - Backups automáticos

---

## ✅ CHECKLIST FINAL

- [ ] Conta Supabase criada
- [ ] Projeto criado (região São Paulo)
- [ ] Connection string copiada
- [ ] `.env` configurado em `packages/db`
- [ ] `prisma generate` executado
- [ ] `prisma db push` executado
- [ ] `test-connection.ts` passou
- [ ] `db:seed` executado
- [ ] Tabelas visíveis no Supabase Dashboard
- [ ] Login funcionando na aplicação

---

## 🎉 PRONTO!

Seu banco de dados está **100% configurado** e pronto para uso!

**Tempo total**: ~15 minutos ⏱️

**Próximo**: Configure as APIs externas e faça deploy! 🚀
