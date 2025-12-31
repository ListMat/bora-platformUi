# Guia: Expo Dev Client - Como Usar

## ✅ O que foi feito

1. ✅ Instalado `expo-dev-client@6.0.20`
2. ✅ Adicionado plugin no `app.json`
3. ✅ Revertido para `react-native-maps` (compatível com Dev Client)
4. ✅ Todos os imports corrigidos

## 📱 Como Rodar o App com Expo Dev Client

### **Opção 1: Android (Recomendado para começar)**

```powershell
# 1. Certifique-se de ter o Android Studio instalado
# 2. Abra um emulador Android ou conecte um dispositivo físico
# 3. Execute o comando:
npx expo run:android
```

**O que acontece:**
- O Expo vai compilar um APK customizado com `react-native-maps` incluído
- O app será instalado automaticamente no seu dispositivo/emulador
- O Metro bundler iniciará automaticamente
- **Primeira vez demora ~5-10 minutos** (builds subsequentes são mais rápidos)

### **Opção 2: iOS (Requer macOS)**

```powershell
npx expo run:ios
```

**Requisitos:**
- macOS com Xcode instalado
- Simulador iOS ou dispositivo físico conectado

---

## 🔄 Workflow de Desenvolvimento

### **Após o primeiro build:**

1. **Iniciar o servidor de desenvolvimento:**
   ```powershell
   pnpm start
   ```

2. **Abrir o app:**
   - Abra o app "BORA Aluno" que foi instalado no seu dispositivo
   - O app se conectará automaticamente ao Metro bundler
   - **Não precisa rebuildar** a cada mudança de código!

3. **Hot Reload:**
   - Mudanças em JavaScript/TypeScript recarregam automaticamente
   - Mudanças em código nativo requerem novo build

---

## 🆚 Diferença: Expo Go vs Expo Dev Client

| Recurso | Expo Go | Expo Dev Client |
|---------|---------|-----------------|
| Instalação | Baixa da loja | Build customizado |
| Módulos nativos | ❌ Limitado | ✅ Todos |
| react-native-maps | ❌ Não funciona | ✅ Funciona |
| Primeira vez | Instantâneo | ~5-10 min build |
| Desenvolvimento | Scan QR code | Abre app instalado |

---

## 🚀 Comandos Úteis

```powershell
# Build e roda no Android
npx expo run:android

# Build e roda no iOS
npx expo run:ios

# Apenas iniciar o servidor (após build inicial)
pnpm start

# Limpar cache e rebuildar
npx expo run:android --clear

# Build de produção
npx expo build:android
npx expo build:ios
```

---

## 🐛 Troubleshooting

### **Erro: "No Android SDK found"**
- Instale o Android Studio
- Configure as variáveis de ambiente ANDROID_HOME

### **Erro: "Build failed"**
```powershell
# Limpar cache e tentar novamente
cd android
./gradlew clean
cd ..
npx expo run:android --clear
```

### **App não conecta ao Metro**
- Verifique se o Metro está rodando (`pnpm start`)
- Shake o dispositivo e selecione "Settings" → Configure o IP manualmente

---

## 📝 Próximos Passos

1. **Agora execute:** `npx expo run:android`
2. **Aguarde o build** (primeira vez demora)
3. **O app abrirá automaticamente** com mapas funcionando!
4. **Para desenvolvimento diário:** apenas `pnpm start` + abrir o app

---

## 💡 Dica Pro

Crie um script no `package.json` para facilitar:

```json
{
  "scripts": {
    "android": "expo run:android",
    "ios": "expo run:ios",
    "dev": "expo start --dev-client"
  }
}
```

Então você pode usar:
```powershell
pnpm android  # Build e roda no Android
pnpm dev      # Inicia servidor para Dev Client
```
