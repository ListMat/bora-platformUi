# 🐘 Configuração do PostgreSQL Local

Este guia ajuda você a configurar o PostgreSQL localmente para o projeto BORA.

## 1️⃣ Verificar Instalação do PostgreSQL

Primeiro, verifique se o PostgreSQL está instalado e rodando:

```bash
# Windows (PowerShell)
psql --version

# Verificar se o serviço está rodando
Get-Service postgresql*
```

## 2️⃣ Criar o Banco de Dados

### Opção A: Usando psql (Recomendado)

1. Abra o terminal e conecte-se ao PostgreSQL:

```bash
# Windows
psql -U postgres
```

2. Se solicitado, digite a senha do usuário `postgres` (a senha que você definiu durante a instalação)

3. Execute os seguintes comandos SQL:

```sql
-- Criar o banco de dados
CREATE DATABASE bora_db;

-- Verificar se foi criado
\l

-- Sair do psql
\q
```

### Opção B: Usando pgAdmin

1. Abra o pgAdmin
2. Conecte-se ao servidor PostgreSQL
3. Clique com o botão direito em "Databases" > "Create" > "Database"
4. Nome: `bora_db`
5. Clique em "Save"

## 3️⃣ Configurar o Arquivo .env

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Database - PostgreSQL Local
# IMPORTANTE: Ajuste user, password conforme sua instalação
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/bora_db"
DIRECT_URL="postgresql://postgres:SUA_SENHA@localhost:5432/bora_db"

# NextAuth
# Gere uma chave secreta com: openssl rand -base64 32
NEXTAUTH_SECRET="sua-chave-secreta-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Stripe (Payment Processing) - Opcional para desenvolvimento
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Pusher (Realtime Chat) - Opcional para desenvolvimento
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="us2"

# Supabase (Storage) - Opcional para desenvolvimento
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Upstash Redis (Rate Limiting) - Opcional para desenvolvimento
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Application URLs
APP_URL="http://localhost:3000"
EXPO_PUBLIC_API_URL="http://localhost:3000/api/trpc"

# Expo Public Keys (Mobile Apps)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
EXPO_PUBLIC_PUSHER_KEY="your-pusher-key"
EXPO_PUBLIC_PUSHER_CLUSTER="us2"
EXPO_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
EXPO_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

**⚠️ IMPORTANTE:**
- Substitua `SUA_SENHA` pela senha do seu usuário PostgreSQL
- Se você usou um usuário diferente de `postgres`, ajuste também o nome do usuário
- A porta padrão é `5432`, mas se você usou outra porta, ajuste também

## 4️⃣ Testar a Conexão

Teste se a conexão está funcionando:

```bash
# No terminal, na raiz do projeto
cd packages/db
pnpm prisma db pull
```

Se não houver erros, a conexão está funcionando!

## 5️⃣ Criar as Tabelas (Migrações)

Execute as migrações do Prisma para criar todas as tabelas:

```bash
# Na raiz do projeto
cd packages/db

# Gerar o cliente Prisma
pnpm prisma generate

# Aplicar o schema ao banco de dados
pnpm prisma db push

# OU criar uma migração (recomendado para produção)
pnpm prisma migrate dev --name init
```

## 6️⃣ Popular o Banco com Dados Iniciais (Opcional)

Execute o seed para criar dados de teste:

```bash
cd packages/db
pnpm prisma db seed
```

Isso criará:
- Um usuário admin: `admin@bora.com`
- Um instrutor de teste: `instrutor@bora.com`

## 7️⃣ Verificar no Prisma Studio

Visualize os dados no Prisma Studio:

```bash
cd packages/db
pnpm prisma studio
```

Isso abrirá o Prisma Studio em `http://localhost:5555`

## 🔧 Troubleshooting

### Erro: "password authentication failed"

- Verifique se a senha no `.env` está correta
- Se esqueceu a senha, você pode redefini-la no PostgreSQL

### Erro: "database does not exist"

- Certifique-se de que criou o banco `bora_db` (veja passo 2)

### Erro: "connection refused"

- Verifique se o serviço PostgreSQL está rodando:
  ```bash
  # Windows
  Get-Service postgresql*
  ```
- Se não estiver rodando, inicie o serviço:
  ```bash
  # Windows (como Administrador)
  Start-Service postgresql-x64-XX
  ```

### Erro: "port 5432 is already in use"

- Verifique se há outro PostgreSQL rodando
- Ou use uma porta diferente no `.env`

### Esqueci a senha do PostgreSQL

**Windows:**
1. Pare o serviço PostgreSQL
2. Edite o arquivo `pg_hba.conf` (geralmente em `C:\Program Files\PostgreSQL\XX\data\`)
3. Mude `md5` para `trust` na linha que contém `127.0.0.1`
4. Inicie o serviço
5. Conecte-se sem senha: `psql -U postgres`
6. Altere a senha: `ALTER USER postgres WITH PASSWORD 'nova_senha';`
7. Reverta a mudança no `pg_hba.conf` (volte para `md5`)
8. Reinicie o serviço

## ✅ Próximos Passos

Após configurar o PostgreSQL:

1. Configure as outras variáveis de ambiente (Stripe, Pusher, etc.) conforme necessário
2. Execute `pnpm dev` na raiz para iniciar o projeto
3. Acesse `http://localhost:3000` para o web admin

## 📚 Recursos Úteis

- [Documentação do Prisma](https://www.prisma.io/docs)
- [Documentação do PostgreSQL](https://www.postgresql.org/docs/)
- [Guia de Setup Completo](./SETUP.md)

