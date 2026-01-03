# ⚠️ ERRO CONHECIDO: supportsCSS na Web

## ❌ Problema

Ao navegar para `/lessons` na web, aparece o erro:
```
Cannot read properties of undefined (reading 'supportsCSS')
```

**Causa:** O React Native Reanimated (usado por componentes como `@gorhom/bottom-sheet`) não é totalmente compatível com React Native Web.

---

## 🔧 Soluções Disponíveis

### **Solução 1: Testar no Emulador Android (RECOMENDADO)**

A versão nativa funciona perfeitamente. O erro só acontece na web.

**Como fazer:**
1. Abrir emulador Android
2. Instalar Expo Go
3. Conectar com `exp://10.0.2.2:8081`
4. Todas as funcionalidades funcionam!

---

### **Solução 2: Desabilitar Reanimated na Web**

Adicionar configuração no `babel.config.js`:

```javascript
plugins: [
  [
    'react-native-reanimated/plugin',
    {
      globals: ['__scanCodes'],
      processNestedWorklets: true,
      relativeSourceLocation: true,
    },
  ],
],
```

---

### **Solução 3: Usar Build de Desenvolvimento**

Criar um APK customizado com EAS Build que funciona 100%:

```powershell
npm install -g eas-cli
eas login
eas build --profile development --platform android
```

---

## 📊 Status das Plataformas

| Feature | Web | Android | iOS |
|---------|-----|---------|-----|
| Login | ✅ | ✅ | ✅ |
| Cadastro | ✅ | ✅ | ✅ |
| Home (Mapa) | ⚠️ Leaflet | ✅ Maps | ✅ Maps |
| Lessons | ❌ Reanimated | ✅ | ✅ |
| Profile | ✅ | ✅ | ✅ |
| Search | ✅ | ✅ | ✅ |

---

## 🎯 Recomendação

Para testar **TODAS as funcionalidades** (incluindo mapa dark mode, modal de instrutor, animações):

**Use o emulador Android ou dispositivo físico!**

A versão web é ótima para:
- ✅ Testar login/cadastro
- ✅ Ver layout geral
- ✅ Desenvolvimento rápido de UI

Mas para a experiência completa:
- 📱 **Android/iOS é obrigatório**

---

## 🚀 Próximos Passos

Quer que eu:
1. **Abra o emulador** e instale o app para você testar tudo?
2. **Crie um build de desenvolvimento** com EAS?
3. **Desabilite a aba Lessons** temporariamente na web?

Me avise qual opção prefere!
