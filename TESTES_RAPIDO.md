# 🚀 GUIA RÁPIDO DE TESTES - App Bora

## ⚡ INÍCIO RÁPIDO (5 minutos)

### 1. Preparar Ambiente
```bash
# Na raiz do projeto
cd packages/db
npx prisma migrate dev
npx prisma generate
cd ../..
```

### 2. Instalar Dependências
```bash
# API - QR Code
cd packages/api
npm install qrcode @types/qrcode

# App Aluno - Clipboard e Notificações
cd ../../apps/app-aluno
npx expo install expo-clipboard expo-notifications

cd ../..
```

### 3. Iniciar Aplicação
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: App Aluno
cd apps/app-aluno
npx expo start

# Terminal 3: App Instrutor
cd apps/app-instrutor
npx expo start
```

---

## 🧪 TESTES ESSENCIAIS (30 min)

### ✅ Teste 1: Fluxo de Solicitação (~2 min)
1. Abrir app do aluno
2. Clicar no FAB verde "Solicitar Aula"
3. Preencher 6 steps
4. Confirmar
5. **Verificar**: Redirecionamento para chat + mensagem inicial

### ✅ Teste 2: Timer de 2 Minutos (~2 min)
1. No chat, verificar timer no header
2. Aguardar 2 minutos SEM aceitar
3. **Verificar**: Status muda para EXPIRED

### ✅ Teste 3: Aceitar Solicitação (~1 min)
1. App do instrutor
2. Ver solicitação
3. Clicar "Aceitar"
4. **Verificar**: Status muda para SCHEDULED

### ✅ Teste 4: Geração de Pix (~2 min)
1. Finalizar uma aula (status FINISHED)
2. Instrutor: Clicar "Gerar Pix"
3. **Verificar**: QR Code aparece
4. Aluno: Clicar "Confirmar Pagamento"
5. **Verificar**: Pagamento confirmado

### ✅ Teste 5: Toggle Online/Offline (~1 min)
1. App do instrutor - Home
2. Clicar no switch
3. **Verificar**: Status muda + dot muda de cor

### ✅ Teste 6: Modal "Aceitar Aulas" (~3 min)
1. App do instrutor - Home
2. Clicar "Aceitar Aulas"
3. Preencher 3 steps
4. **Verificar**: Disponibilidade salva

---

## 📊 VERIFICAÇÕES RÁPIDAS

### Console do Servidor
Deve mostrar:
```
[Push] Notification for user instructor-id: ...
New lesson request from João to instructor Phoenix
Lesson lesson-id expired - instructor did not respond in time
[Pix] Generated for lesson lesson-id: R$ 79.00
```

### Prisma Studio
```bash
cd packages/db
npx prisma studio
```

Verificar campos:
- ✅ `User.pushToken`
- ✅ `Instructor.isOnline`
- ✅ `Instructor.acceptsOwnVehicle`
- ✅ `Instructor.bio`
- ✅ `Lesson.pixCode`
- ✅ `Lesson.pixQrCode`

---

## 🐛 PROBLEMAS COMUNS

### Erro: "Cannot find module 'qrcode'"
```bash
cd packages/api
npm install qrcode @types/qrcode
```

### Erro: Migration não aplicada
```bash
cd packages/db
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
```

### Erro: App não inicia
```bash
# Limpar cache
cd apps/app-aluno
npx expo start -c
```

---

## ✅ CHECKLIST MÍNIMO

- [ ] Backend rodando
- [ ] Migrations aplicadas
- [ ] App aluno abre
- [ ] App instrutor abre
- [ ] Fluxo de 6 steps funciona
- [ ] Timer aparece e funciona
- [ ] Pix é gerado
- [ ] Toggle online funciona
- [ ] Modal "Aceitar Aulas" funciona

---

## 🎯 RESULTADO ESPERADO

Se todos os testes passarem:
- ✅ App 100% funcional
- ✅ Pronto para deploy
- ✅ Pronto para usuários reais

---

## 📚 DOCUMENTAÇÃO COMPLETA

Para testes detalhados, consulte:
- **`GUIA_TESTES_COMPLETO.md`** - Roteiro completo (2h)
- **`IMPLEMENTACAO_100_COMPLETA.md`** - Resumo da implementação
- **`FLUXO_COMPLETO_360.md`** - Fluxo detalhado

---

**Tempo Total**: ~30 minutos  
**Dificuldade**: Fácil  
**Pré-requisitos**: Node.js, Expo CLI

**Boa sorte! 🚀**
