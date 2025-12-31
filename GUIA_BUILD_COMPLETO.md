# 🚀 Guia Completo: Build Nativo dos Apps (Aluno + Instrutor)

## ✅ Configuração Concluída

- ✅ EAS CLI instalado globalmente
- ✅ expo-dev-client adicionado em ambos os apps
- ✅ eas.json configurado para app-aluno
- ✅ eas.json configurado para app-instrutor

---

## 📱 Passo a Passo para Build

### **1. Login no Expo (Uma Vez Apenas)**

```powershell
eas login
```

**Se não tiver conta:**
- Crie em: https://expo.dev/signup
- É grátis para desenvolvimento!

---

### **2. Build do App ALUNO**

```powershell
# Navegar para o app-aluno
cd c:\Users\Mateus\Desktop\Bora UI\apps\app-aluno

# Iniciar build de desenvolvimento
eas build --platform android --profile development

# Aguardar ~10-15 minutos
# Você receberá um link para baixar o APK
```

---

### **3. Build do App INSTRUTOR**

```powershell
# Navegar para o app-instrutor
cd c:\Users\Mateus\Desktop\Bora UI\apps\app-instrutor

# Iniciar build de desenvolvimento
eas build --platform android --profile development

# Aguardar ~10-15 minutos
# Você receberá um link para baixar o APK
```

---

## 📥 Instalando os APKs

### **Opção 1: Via ADB (Emulador ou Dispositivo Conectado)**

```powershell
# Baixe os APKs quando estiverem prontos
# Depois instale:

# App Aluno
adb install caminho\para\app-aluno.apk

# App Instrutor
adb install caminho\para\app-instrutor.apk
```

### **Opção 2: Transferir para Celular**

1. Baixe os APKs no PC
2. Transfira para o celular (via USB, email, etc.)
3. Instale manualmente no Android

---

## 🎯 Usando os Apps Após Instalação

### **Para App ALUNO:**

```powershell
# 1. Iniciar servidor de desenvolvimento
cd c:\Users\Mateus\Desktop\Bora UI\apps\app-aluno
pnpm start

# 2. Abrir app "BORA Aluno" no dispositivo
# 3. App conectará automaticamente ao servidor
# 4. Hot reload funcionará! 🔥
```

### **Para App INSTRUTOR:**

```powershell
# 1. Iniciar servidor de desenvolvimento
cd c:\Users\Mateus\Desktop\Bora UI\apps\app-instrutor
pnpm start

# 2. Abrir app "BORA Instrutor" no dispositivo
# 3. App conectará automaticamente ao servidor
# 4. Hot reload funcionará! 🔥
```

---

## 🔄 Workflow Diário de Desenvolvimento

```powershell
# 1. Iniciar servidor do app que está desenvolvendo
cd apps\app-aluno  # ou app-instrutor
pnpm start

# 2. Abrir o app instalado no dispositivo

# 3. Desenvolver normalmente
# - Mudanças em código JS/TS recarregam automaticamente
# - Mudanças em código nativo requerem novo build (raro)

# 4. Para testar ambos os apps simultaneamente:
# Terminal 1:
cd apps\app-aluno
pnpm start --port 8081

# Terminal 2:
cd apps\app-instrutor
pnpm start --port 8082
```

---

## 📊 Status dos Builds

Acompanhe em: https://expo.dev/accounts/[seu-usuario]/projects

---

## 💡 Dicas Importantes

### **Primeira Vez (Agora):**
1. ⏱️ Builds demoram ~10-15 minutos
2. 📱 Você receberá 2 APKs (aluno + instrutor)
3. 📥 Instale ambos no dispositivo
4. ✅ Pronto para desenvolver!

### **Desenvolvimento Diário:**
- ✅ Apenas `pnpm start` + abrir app
- ✅ Hot reload funciona
- ✅ Não precisa rebuildar (exceto mudanças nativas)

### **Quando Rebuildar:**
- ➕ Adicionar novo módulo nativo
- 🔧 Mudar configuração do app.json
- 📦 Atualizar versão do Expo SDK

---

## 🎯 Comandos Rápidos

```powershell
# Login (uma vez)
eas login

# Build App Aluno
cd apps\app-aluno
eas build --platform android --profile development

# Build App Instrutor
cd apps\app-instrutor
eas build --platform android --profile development

# Desenvolvimento Aluno
cd apps\app-aluno
pnpm start

# Desenvolvimento Instrutor
cd apps\app-instrutor
pnpm start
```

---

## ✅ Checklist

- [ ] Fazer login no EAS (`eas login`)
- [ ] Iniciar build do app-aluno
- [ ] Iniciar build do app-instrutor
- [ ] Aguardar builds completarem (~10-15 min cada)
- [ ] Baixar ambos os APKs
- [ ] Instalar no dispositivo
- [ ] Testar ambos os apps
- [ ] Começar a desenvolver! 🚀

---

## 🆘 Troubleshooting

### **Erro: "Not logged in"**
```powershell
eas login
```

### **Erro: "Project not configured"**
```powershell
# Já está configurado! Apenas execute:
eas build --platform android --profile development
```

### **Build falhou**
- Verifique os logs em expo.dev
- Geralmente é problema de configuração no app.json
- Peça ajuda se necessário!

---

## 🎉 Próximo Passo

**Execute agora:**

```powershell
# 1. Login
eas login

# 2. Build App Aluno
cd c:\Users\Mateus\Desktop\Bora UI\apps\app-aluno
eas build --platform android --profile development
```

Aguarde o build completar e depois repita para o app-instrutor!
