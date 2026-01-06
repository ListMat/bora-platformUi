# 🗄️ GUIA COMPLETO - CONFIGURAÇÃO SUPABASE

## 📋 PASSO A PASSO

### **1. Criar Conta no Supabase**

1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub (recomendado)

---

### **2. Criar Novo Projeto**

1. Clique em "New Project"
2. Preencha:
   - **Name**: `bora-production` (ou nome que preferir)
   - **Database Password**: Crie uma senha forte (ANOTE!)
   - **Region**: `South America (São Paulo)` 🇧🇷
   - **Pricing Plan**: Free (até 500MB)

3. Clique em "Create new project"
4. Aguarde ~2 minutos (criação do banco)

---

### **3. Obter Connection String**

1. No menu lateral, clique em **Settings** (⚙️)
2. Clique em **Database**
3. Role até "Connection string"
4. Copie a **Connection string** (modo "URI")

Exemplo:
```
postgresql://postgres:[SUA-SENHA]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

5. **Substitua `[SUA-SENHA]`** pela senha que você criou

---

### **4. Configurar Variáveis de Ambiente**

**Arquivo**: `packages/db/.env`

```env
# Supabase Database
DATABASE_URL="postgresql://postgres:[SUA-SENHA]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres"

# Para Prisma Migrate
DIRECT_URL="postgresql://postgres:[SUA-SENHA]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres"
```

⚠️ **Importante**: 
- Substitua `[SUA-SENHA]` pela senha real
- Use aspas duplas
- Não commite este arquivo no Git

---

### **5. Executar Migrations do Prisma**

Abra o terminal e execute:

```bash
# 1. Navegar para o diretório do banco
cd packages/db

# 2. Gerar Prisma Client
pnpm prisma generate

# 3. Criar as tabelas no Supabase
pnpm prisma db push

# OU (se quiser criar migrations)
pnpm prisma migrate dev --name init
```

**O que isso faz**:
- Lê o arquivo `schema.prisma`
- Cria TODAS as tabelas no Supabase
- Configura relacionamentos e índices

---

### **6. Verificar Tabelas Criadas**

1. Volte ao Supabase Dashboard
2. Clique em **Table Editor** (📊)
3. Você deve ver todas as tabelas:
   - ✅ User
   - ✅ Student
   - ✅ Instructor
   - ✅ Lesson
   - ✅ Payment
   - ✅ Vehicle
   - ✅ Rating
   - ✅ ChatMessage
   - ✅ InstructorAvailability
   - ✅ Plan
   - ✅ Bundle
   - ✅ E mais...

---

### **7. (Opcional) Popular com Dados de Teste**

Crie o arquivo: `packages/db/prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bora.com' },
    update: {},
    create: {
      email: 'admin@bora.com',
      name: 'Admin Bora',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Admin criado:', admin.email);

  // Criar instrutor de teste
  const instructorPassword = await bcrypt.hash('instrutor123', 10);
  const instructorUser = await prisma.user.upsert({
    where: { email: 'instrutor@bora.com' },
    update: {},
    create: {
      email: 'instrutor@bora.com',
      name: 'João Silva',
      password: instructorPassword,
      role: 'INSTRUCTOR',
      emailVerified: new Date(),
    },
  });

  const instructor = await prisma.instructor.upsert({
    where: { userId: instructorUser.id },
    update: {},
    create: {
      userId: instructorUser.id,
      cpf: '12345678900',
      phone: '(11) 99999-9999',
      cnhNumber: 'ABC123456',
      credentialNumber: 'CRED123',
      cep: '01310-100',
      street: 'Av. Paulista',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.5505,
      longitude: -46.6333,
      basePrice: 100,
      status: 'ACTIVE',
      isAvailable: true,
      isOnline: true,
    },
  });

  console.log('✅ Instrutor criado:', instructorUser.email);

  // Criar aluno de teste
  const studentPassword = await bcrypt.hash('aluno123', 10);
  const studentUser = await prisma.user.upsert({
    where: { email: 'aluno@bora.com' },
    update: {},
    create: {
      email: 'aluno@bora.com',
      name: 'Maria Santos',
      password: studentPassword,
      role: 'STUDENT',
      emailVerified: new Date(),
    },
  });

  const student = await prisma.student.upsert({
    where: { userId: studentUser.id },
    update: {},
    create: {
      userId: studentUser.id,
      cpf: '98765432100',
      phone: '(11) 98888-8888',
      cep: '01310-100',
      city: 'São Paulo',
      state: 'SP',
    },
  });

  console.log('✅ Aluno criado:', studentUser.email);

  // Criar veículo para o instrutor
  const vehicle = await prisma.vehicle.create({
    data: {
      userId: instructorUser.id,
      brand: 'Volkswagen',
      model: 'Gol',
      year: 2022,
      color: 'Branco',
      plateLastFour: '1234',
      category: 'HATCH',
      transmission: 'MANUAL',
      fuel: 'FLEX',
      hasDualPedal: true,
      status: 'active',
    },
  });

  console.log('✅ Veículo criado:', vehicle.model);

  // Criar disponibilidade do instrutor
  const daysOfWeek = [1, 2, 3, 4, 5]; // Seg a Sex
  for (const day of daysOfWeek) {
    await prisma.instructorAvailability.create({
      data: {
        instructorId: instructor.id,
        dayOfWeek: day,
        startTime: '08:00',
        endTime: '18:00',
      },
    });
  }

  console.log('✅ Disponibilidade criada');

  console.log('\n🎉 Seed completo!');
  console.log('\n📝 Credenciais de teste:');
  console.log('Admin: admin@bora.com / admin123');
  console.log('Instrutor: instrutor@bora.com / instrutor123');
  console.log('Aluno: aluno@bora.com / aluno123');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Executar seed**:
```bash
cd packages/db
pnpm prisma db seed
```

---

### **8. Configurar Storage (Fotos)**

1. No Supabase Dashboard, clique em **Storage** (🗂️)
2. Clique em "Create a new bucket"
3. Preencha:
   - **Name**: `vehicle-photos`
   - **Public**: ✅ Sim (para fotos públicas)
4. Clique em "Create bucket"

5. Repita para outros buckets:
   - `profile-photos`
   - `documents`
   - `receipts`

---

### **9. Obter Credenciais do Supabase**

1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (⚠️ SECRETO!)

---

### **10. Atualizar Variáveis de Ambiente**

**Arquivo**: `packages/api/.env`

```env
# Database
DATABASE_URL="postgresql://postgres:[SENHA]@db.xxxxx.supabase.co:5432/postgres"

# Supabase Storage
SUPABASE_URL="https://xxxxxxxxxxxxx.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." # service_role key
```

**Arquivo**: `apps/pwa/.env.local`

```env
# Supabase (Public)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." # anon key
```

---

### **11. Testar Conexão**

Crie um arquivo de teste: `packages/db/test-connection.ts`

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔌 Testando conexão com Supabase...');
    
    const users = await prisma.user.findMany();
    console.log(`✅ Conexão OK! Encontrados ${users.length} usuários.`);
    
    if (users.length > 0) {
      console.log('Primeiro usuário:', users[0].email);
    }
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
```

**Executar**:
```bash
cd packages/db
npx tsx test-connection.ts
```

---

## 🎯 CHECKLIST FINAL

- [ ] Conta Supabase criada
- [ ] Projeto criado (região São Paulo)
- [ ] Connection string copiada
- [ ] `.env` configurado
- [ ] `prisma db push` executado
- [ ] Tabelas visíveis no Table Editor
- [ ] (Opcional) Seed executado
- [ ] Storage buckets criados
- [ ] Credenciais Supabase copiadas
- [ ] Teste de conexão OK

---

## 🚨 TROUBLESHOOTING

### Erro: "Can't reach database server"
- Verifique se a senha está correta
- Verifique se não há espaços na connection string
- Tente usar a "Connection pooling" URL

### Erro: "SSL connection required"
- Adicione `?sslmode=require` no final da URL

### Tabelas não aparecem:
- Execute `prisma db push` novamente
- Verifique se está no diretório correto (`packages/db`)

---

## 📊 ESTRUTURA DO BANCO

Após o `db push`, você terá:

```
📊 Supabase Database
├── 👤 User (usuários)
├── 🎓 Student (alunos)
├── 🚗 Instructor (instrutores)
├── 📅 Lesson (aulas)
├── 💳 Payment (pagamentos)
├── 🚙 Vehicle (veículos)
├── ⭐ Rating (avaliações)
├── 💬 ChatMessage (mensagens)
├── 📆 InstructorAvailability (disponibilidade)
├── 📦 Plan (planos)
├── 🎁 Bundle (pacotes)
├── 🏅 Medal (medalhas)
├── 🎯 Skill (habilidades)
├── 🚨 Emergency (emergências)
├── 📢 Notification (notificações)
└── 📝 ActivityLog (logs)
```

---

## 💡 DICAS

1. **Backup**: Supabase faz backup automático (plano pago)
2. **Limites Free Tier**:
   - 500MB de banco
   - 1GB de storage
   - 2GB de bandwidth/mês
3. **Upgrade**: R$ 25/mês para plano Pro (8GB banco, 100GB storage)

---

## 🎉 PRONTO!

Agora você tem:
- ✅ Banco de dados PostgreSQL no Supabase
- ✅ Todas as tabelas criadas
- ✅ Storage configurado
- ✅ Dados de teste (se executou seed)

**Próximo passo**: Rodar a aplicação e fazer login! 🚀

```bash
pnpm dev
```

Acesse: http://localhost:3000
