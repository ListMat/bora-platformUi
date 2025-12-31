# Guia Rápido: Build via EAS (Recomendado)

## ✅ Por que usar EAS Build?

- ✅ **Sem problemas de configuração local** (JDK, Android SDK, etc.)
- ✅ **Build na nuvem** (não usa recursos do seu PC)
- ✅ **APK pronto para download** em 10-15 minutos
- ✅ **Funciona 100%** com react-native-maps
- ✅ **Grátis** para desenvolvimento

---

## 🚀 Passos para Build via EAS:

### **1. Instalar EAS CLI:**
```powershell
npm install -g eas-cli
```

### **2. Login no Expo:**
```powershell
eas login
```
(Crie uma conta grátis em expo.dev se não tiver)

### **3. Configurar o projeto:**
```powershell
cd c:\Users\Mateus\Desktop\Bora UI\apps\app-aluno
eas build:configure
```

### **4. Criar build de desenvolvimento:**
```powershell
eas build --platform android --profile development
```

### **5. Aguardar (~10-15 minutos):**
- O build será feito na nuvem
- Você receberá um link para baixar o APK

### **6. Instalar no dispositivo:**
```powershell
# Baixe o APK e instale via:
adb install caminho/para/o/arquivo.apk

# Ou transfira para o celular e instale manualmente
```

---

## 📱 Depois de Instalado:

1. **Abra o app "BORA Aluno"** no dispositivo
2. **Execute:** `pnpm start` no terminal
3. **Escaneie o QR code** ou o app conectará automaticamente
4. **Pronto!** Mapas funcionando perfeitamente! 🎉

---

## 💡 Vantagens do EAS:

- ✅ Sem configuração de ambiente local
- ✅ Builds consistentes e confiáveis
- ✅ Suporta todos os módulos nativos
- ✅ Pode compartilhar o APK com a equipe
- ✅ Integração com CI/CD

---

## 🆚 Comparação:

| Método | Tempo Setup | Sucesso | Facilidade |
|--------|-------------|---------|------------|
| Build Local | 2-4 horas | 50% | ⭐⭐ |
| **EAS Build** | **5 minutos** | **99%** | **⭐⭐⭐⭐⭐** |

---

## 📝 Comandos Rápidos:

```powershell
# Instalar EAS
npm install -g eas-cli

# Login
eas login

# Configurar
cd c:\Users\Mateus\Desktop\Bora UI\apps\app-aluno
eas build:configure

# Build
eas build --platform android --profile development

# Depois de baixar o APK:
adb install nome-do-arquivo.apk

# Iniciar servidor
pnpm start
```

---

**Recomendação:** Use EAS Build para economizar tempo e evitar problemas de configuração local! 🚀
