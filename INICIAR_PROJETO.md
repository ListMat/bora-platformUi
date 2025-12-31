# 🚀 Guia Rápido - Iniciar Projeto BORA

## ✅ Status Atual

- [x] Dependências instaladas (incluindo `react-admin`)
- [x] Prisma Client gerado
- [x] App Instrutor rodando (porta 8082)
- [x] App Aluno rodando (porta 8081)
- [ ] Web Admin precisa ser iniciado

---

## 🎯 Próximo Passo: Iniciar Web Admin

### Opção 1: Novo Terminal PowerShell (Recomendado)

Abra um **NOVO** terminal PowerShell e execute:

```powershell
# 1. Navegar para o projeto
cd "C:\Users\Mateus\Desktop\Bora UI"

# 2. Limpar variáveis npm_config
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config*" } | ForEach-Object { 
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue 
}

# 3. Iniciar web-admin
cd apps\web-admin
pnpm dev
```

### Opção 2: Usar o Script

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI"
.\start-web-admin-clean.ps1
```

---

## 🌐 URLs dos Serviços

Após iniciar o web-admin, você terá acesso a:

- **Admin Panel**: http://localhost:3000
- **API tRPC**: http://localhost:3000/api/trpc
- **App Aluno**: Porta 8081 (escaneie QR code no terminal)
- **App Instrutor**: Porta 8082 (escaneie QR code no terminal)

---

## ⚠️ Importante: Configurar .env

Antes de testar o projeto, certifique-se de configurar o arquivo `.env` na raiz do projeto com suas credenciais reais.

**Mínimo necessário para rodar:**

```env
# Database (PostgreSQL local ou Supabase)
DATABASE_URL="postgresql://postgres:NovaSenhaForte123!@localhost:5432/bora_db"
DIRECT_URL="postgresql://postgres:NovaSenhaForte123!@localhost:5432/bora_db"

# NextAuth (gere uma senha forte)
NEXTAUTH_SECRET="sua-senha-super-secreta-aqui-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

# Supabase (obrigatório para storage)
NEXT_PUBLIC_SUPABASE_URL="https://seu-projeto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-chave-anon"
SUPABASE_SERVICE_ROLE_KEY="sua-chave-service-role"
EXPO_PUBLIC_SUPABASE_ANON_KEY="sua-chave-anon"

# Mapbox (obrigatório para mapas)
MAPBOX_TOKEN="pk.eyJ1..."
EXPO_PUBLIC_MAPBOX_TOKEN="pk.eyJ1..."

# Stripe (obrigatório para pagamentos)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# API URL
EXPO_PUBLIC_API_URL="http://localhost:3000/api/trpc"
```

**Guia completo**: `CONFIGURAR_ENV.md`

---

## 🔍 Verificar se tudo está funcionando

### 1. Web Admin

```powershell
# Testar se a porta 3000 está respondendo
curl http://localhost:3000
```

### 2. Apps Expo

Verifique se os terminais dos apps mostram:

```
Metro waiting on exp://192.168.x.x:8081
```

### 3. Banco de Dados

```powershell
cd packages\db
npx prisma studio
```

Acesse: http://localhost:5555

---

## 🐛 Troubleshooting

### Erro: "DATABASE_URL is not defined"

**Solução**: Configure o `.env` conforme acima.

### Erro: "ERR_INVALID_ARG_VALUE"

**Solução**: Limpe as variáveis npm_config em um novo terminal:

```powershell
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config*" } | ForEach-Object { 
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue 
}
```

### Erro: "Module not found: react-admin"

**Solução**: Já resolvido! O pacote foi instalado.

### Web Admin não inicia

**Solução**: 
1. Feche todos os terminais
2. Abra um novo terminal PowerShell
3. Execute os comandos da Opção 1 acima

---

## 📱 Testar nos Apps Móveis

### Expo Go (Rápido, mas limitado)

1. Instale o Expo Go no celular
2. Escaneie o QR code no terminal
3. **Limitação**: Não suporta Mapbox e Stripe nativos

### Development Build (Completo)

```powershell
# App Aluno
cd apps\app-aluno
npx expo prebuild
npx expo run:android  # ou run:ios

# App Instrutor
cd apps\app-instrutor
npx expo prebuild
npx expo run:android  # ou run:ios
```

---

## 🎉 Próximos Passos

Após iniciar tudo:

1. **Criar usuário admin**:
   - Acesse: http://localhost:3000
   - Registre-se como administrador

2. **Testar fluxo completo**:
   - Criar aluno
   - Criar instrutor
   - Solicitar aula
   - Aceitar aula
   - Iniciar aula
   - Finalizar aula

3. **Testar novas features UX/UI**:
   - Dark mode automático
   - Haptic feedback (dispositivo físico)
   - Bottom sheet gestos
   - Solicitar aula em 3 steps
   - Aula em 1 clique
   - Chat com áudio/foto
   - Mapa com roteamento em tempo real

---

## 📞 Suporte

- **Configuração .env**: `CONFIGURAR_ENV.md`
- **Inicialização completa**: `START_PROJECT.md`
- **Features implementadas**: `FEATURES_IMPLEMENTED.md`

---

**Boa sorte! 🚀**

