# 🚀 Guia Completo - Iniciar Projeto BORA

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter:

- ✅ Node.js >= 18.17.0
- ✅ pnpm >= 8.0.0
- ✅ PostgreSQL rodando (ou Supabase configurado)
- ✅ Variáveis de ambiente configuradas (`.env`)

---

## 🔧 1. Preparação Inicial (Primeira vez)

### 1.1. Instalar Dependências

```powershell
# Na raiz do projeto
pnpm install
```

### 1.2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz com:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/bora"
DIRECT_URL="postgresql://user:password@localhost:5432/bora"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Mapbox
MAPBOX_TOKEN="pk.eyJ1..."
EXPO_PUBLIC_MAPBOX_TOKEN="pk.eyJ1..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGc..."

# Pusher (Chat em tempo real)
EXPO_PUBLIC_PUSHER_KEY="your-pusher-key"
EXPO_PUBLIC_PUSHER_CLUSTER="us2"

# API
EXPO_PUBLIC_API_URL="http://localhost:3000/api/trpc"
```

### 1.3. Migrar Banco de Dados

```powershell
cd packages/db
npx prisma migrate dev
npx prisma generate
cd ../..
```

---

## 🚀 2. Iniciar o Projeto (3 Terminais)

### Terminal 1: Backend API (Next.js)

```powershell
# Limpar variáveis npm_config (Windows)
Get-ChildItem Env: | Where-Object { $_.Name -like 'npm_config*' } | ForEach-Object { Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue }

# Iniciar admin panel (inclui API tRPC)
cd apps/web-admin
pnpm dev
```

**URL**: http://localhost:3000

---

### Terminal 2: App Aluno (Expo)

```powershell
# Limpar variáveis npm_config (Windows)
Get-ChildItem Env: | Where-Object { $_.Name -like 'npm_config*' } | ForEach-Object { Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue }

# Iniciar app do aluno
cd apps/app-aluno
npx expo start --clear
```

**Opções**:
- Pressione `a` para Android
- Pressione `i` para iOS
- Pressione `w` para Web (não recomendado para apps nativos)
- Escaneie o QR Code com Expo Go

---

### Terminal 3: App Instrutor (Expo)

```powershell
# Limpar variáveis npm_config (Windows)
Get-ChildItem Env: | Where-Object { $_.Name -like 'npm_config*' } | ForEach-Object { Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue }

# Iniciar app do instrutor
cd apps/app-instrutor
npx expo start --clear
```

**Opções**: Mesmas do App Aluno

---

## 🎯 3. Inicialização Rápida (Scripts PowerShell)

Criei scripts para facilitar a inicialização:

### 3.1. Script Principal (Raiz)

```powershell
# start-all.ps1
Write-Host "🚀 Iniciando Projeto BORA..." -ForegroundColor Green

# Limpar variáveis npm_config
Write-Host "🧹 Limpando variáveis npm_config..." -ForegroundColor Yellow
Get-ChildItem Env: | Where-Object { $_.Name -like 'npm_config*' } | ForEach-Object { 
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue 
}

Write-Host "✅ Variáveis limpas!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Abra 3 terminais e execute:" -ForegroundColor Cyan
Write-Host "  Terminal 1: cd apps/web-admin && pnpm dev" -ForegroundColor White
Write-Host "  Terminal 2: cd apps/app-aluno && npx expo start --clear" -ForegroundColor White
Write-Host "  Terminal 3: cd apps/app-instrutor && npx expo start --clear" -ForegroundColor White
Write-Host ""
Write-Host "🌐 URLs:" -ForegroundColor Cyan
Write-Host "  Admin Panel: http://localhost:3000" -ForegroundColor White
Write-Host "  API tRPC: http://localhost:3000/api/trpc" -ForegroundColor White
```

### 3.2. Uso

```powershell
# Na raiz do projeto
.\start-all.ps1
```

---

## 📱 4. Testar Apps Nativos

### Opção 1: Expo Go (Mais Rápido)

1. Instale o **Expo Go** no seu celular:
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)

2. Escaneie o QR Code que aparece no terminal

3. O app será carregado no Expo Go

**⚠️ Limitação**: Expo Go não suporta módulos nativos customizados (Mapbox, Stripe)

---

### Opção 2: Development Build (Recomendado)

Para testar features completas (Mapbox, Stripe, Haptic):

```powershell
# App Aluno
cd apps/app-aluno
npx expo prebuild
npx expo run:android
# ou
npx expo run:ios
```

```powershell
# App Instrutor
cd apps/app-instrutor
npx expo prebuild
npx expo run:android
# ou
npx expo run:ios
```

---

## 🔍 5. Verificar Status dos Serviços

### 5.1. Backend API

```powershell
# Testar endpoint tRPC
curl http://localhost:3000/api/trpc/user.me
```

### 5.2. Banco de Dados

```powershell
cd packages/db
npx prisma studio
```

**URL**: http://localhost:5555

---

## 🐛 6. Troubleshooting

### Erro: `ERR_INVALID_ARG_VALUE`

**Solução**: Limpar variáveis npm_config

```powershell
Get-ChildItem Env: | Where-Object { $_.Name -like 'npm_config*' } | ForEach-Object { 
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue 
}
```

### Erro: `Module not found: @bora/api`

**Solução**: Reinstalar dependências

```powershell
pnpm install --force
cd packages/db
npx prisma generate
```

### Erro: `Mapbox not initialized`

**Solução**: Verificar variável de ambiente

```powershell
# Verificar se existe
echo $env:EXPO_PUBLIC_MAPBOX_TOKEN

# Se não existir, adicionar ao .env
EXPO_PUBLIC_MAPBOX_TOKEN="pk.eyJ1..."
```

### Erro: Metro bundler cache

**Solução**: Limpar cache

```powershell
cd apps/app-aluno
npx expo start --clear
# ou
rm -rf .expo node_modules
pnpm install
```

### Erro: Prisma Client not generated

**Solução**: Gerar Prisma Client

```powershell
cd packages/db
npx prisma generate
```

---

## 🎨 7. Testar Novas Features UX/UI

### Dark Mode
- Altere o tema do sistema (Android/iOS)
- O app deve mudar automaticamente

### Haptic Feedback
- **Requer dispositivo físico**
- Toque nos botões: mapa, filtros, SOS
- Sinta a vibração leve/média/pesada

### Bottom Sheet
- Abra o mapa expandido
- Arraste o bottom sheet para cima/baixo
- Teste os 3 níveis: 25%, 50%, 90%

### Solicitar Aula (3 Steps)
1. Selecione data, hora e tipo
2. Escolha plano e pagamento
3. Confirme

### Aula em 1 Clique
- Solicite uma aula completa
- Volte para home
- Veja o card verde "Aula em 1 clique"
- Clique para repetir com mesma config

---

## 📊 8. Monitoramento

### Logs do Backend

```powershell
# Ver logs em tempo real
cd apps/web-admin
pnpm dev | Select-String "tRPC"
```

### Logs do App

```powershell
# Ver logs do Expo
cd apps/app-aluno
npx expo start --clear
# Pressione 'j' para abrir debugger
```

### Banco de Dados

```powershell
# Abrir Prisma Studio
cd packages/db
npx prisma studio
```

---

## 🚦 9. Ordem Recomendada de Inicialização

1. **Banco de Dados** (se local)
   ```powershell
   # Verificar se PostgreSQL está rodando
   Get-Service -Name postgresql*
   ```

2. **Backend API** (Terminal 1)
   ```powershell
   cd apps/web-admin
   pnpm dev
   ```
   Aguarde: `✓ Ready in X ms`

3. **App Aluno** (Terminal 2)
   ```powershell
   cd apps/app-aluno
   npx expo start --clear
   ```
   Aguarde: `Metro waiting on...`

4. **App Instrutor** (Terminal 3)
   ```powershell
   cd apps/app-instrutor
   npx expo start --clear
   ```
   Aguarde: `Metro waiting on...`

---

## 🎯 10. Checklist de Inicialização

- [ ] PostgreSQL rodando
- [ ] Arquivo `.env` configurado
- [ ] Dependências instaladas (`pnpm install`)
- [ ] Banco migrado (`prisma migrate dev`)
- [ ] Prisma Client gerado (`prisma generate`)
- [ ] Terminal 1: Backend rodando (porta 3000)
- [ ] Terminal 2: App Aluno rodando (Expo)
- [ ] Terminal 3: App Instrutor rodando (Expo)
- [ ] Expo Go instalado no celular (ou development build)
- [ ] Variáveis npm_config limpas

---

## 📞 Próximos Passos

Após iniciar tudo:

1. **Criar usuário de teste**:
   - Acesse: http://localhost:3000
   - Registre-se como aluno ou instrutor

2. **Testar fluxo completo**:
   - Aluno: Solicitar aula → Chat → Avaliar
   - Instrutor: Aceitar aula → Iniciar → Finalizar

3. **Testar novas features UX/UI**:
   - Dark mode automático
   - Haptic feedback
   - Bottom sheet gestos
   - Solicitar aula 3 steps
   - Aula em 1 clique

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs nos 3 terminais
2. Consulte `TROUBLESHOOTING.md`
3. Limpe cache: `npx expo start --clear`
4. Reinstale: `pnpm install --force`

---

**Boa sorte! 🚀**


