# 🔧 Guia de Troubleshooting - Expo React Native

**Última atualização:** 2025-12-29
**Projeto:** BORA Aluno - Expo SDK 52

---

## 📋 Índice

1. [Problemas de Cache](#problemas-de-cache)
2. [Erros de Dependências](#erros-de-dependências)
3. [Problemas com Metro Bundler](#problemas-com-metro-bundler)
4. [Erros de Build](#erros-de-build)
5. [Problemas com react-native-maps](#problemas-com-react-native-maps)
6. [Erros de Conexão](#erros-de-conexão)
7. [Problemas com Android Emulator](#problemas-com-android-emulator)

---

## 🗑️ Problemas de Cache

### Sintoma: App não atualiza ou mostra código antigo

**Solução:**
```powershell
# Limpeza completa
.\limpar-cache-completo.ps1

# Ou manualmente:
cd apps\app-aluno
pnpm start --clear
```

### Sintoma: "Unable to resolve module"

**Solução:**
```powershell
# 1. Limpar cache
.\limpar-cache-completo.ps1

# 2. Reinstalar dependências
pnpm install

# 3. Iniciar com cache limpo
cd apps\app-aluno
pnpm start --clear
```

---

## 📦 Erros de Dependências

### Erro: "Invariant Violation: "main" has not been registered"

**Causa:** Dependências não instaladas corretamente

**Solução:**
```powershell
# 1. Remover node_modules
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force apps\app-aluno\node_modules

# 2. Reinstalar
pnpm install

# 3. Reiniciar
cd apps\app-aluno
pnpm start --clear
```

### Erro: Versões conflitantes de React

**Causa:** Metro encontrando múltiplas versões do React

**Solução:**
```powershell
# Verificar metro.config.js
# Deve ter: config.resolver.disableHierarchicalLookup = true

# Se não tiver, adicione ao metro.config.js:
config.resolver.disableHierarchicalLookup = true;
```

### Erro: "Cannot find module '@bora/api'"

**Causa:** Workspace não configurado corretamente

**Solução:**
```powershell
# Na raiz do projeto
pnpm install

# Verificar se packages/api foi instalado
cd packages\api
pnpm install
cd ..\..

# Reiniciar
cd apps\app-aluno
pnpm start --clear
```

---

## 🚇 Problemas com Metro Bundler

### Erro: "Metro Bundler can't listen on port 8081"

**Solução:**
```powershell
# Usar script de liberação de porta
.\liberar-porta.ps1

# Ou manualmente:
# Encontrar processo
netstat -ano | findstr :8081

# Matar processo (substitua PID)
taskkill /PID <PID> /F

# Ou usar porta diferente
cd apps\app-aluno
pnpm start --port 8083
```

### Erro: "Metro has encountered an error: ENOSPC"

**Causa:** Limite de watchers do sistema

**Solução (Windows):**
```powershell
# Reduzir arquivos observados no metro.config.js
config.watchFolders = [workspaceRoot];

# Adicionar blacklist
config.resolver.blacklistRE = /node_modules\/.*\/node_modules\/.*/;
```

### Erro: "Transform error: SyntaxError"

**Causa:** Babel não configurado corretamente

**Solução:**
```powershell
# Verificar babel.config.js existe
# Deve ter preset: babel-preset-expo

# Limpar cache do Babel
Remove-Item -Recurse -Force node_modules\.cache

# Reiniciar
pnpm start --clear
```

---

## 🔨 Erros de Build

### Erro: "SDK version mismatch"

**Causa:** app.json com versão diferente do package.json

**Solução:**
```json
// app.json - deve corresponder ao package.json
{
  "expo": {
    "sdkVersion": "52.0.0"  // ✅ Deve ser 52.0.0
  }
}
```

### Erro: "Expo CLI is not installed"

**Solução:**
```powershell
# Instalar Expo CLI globalmente
npm install -g expo-cli

# Ou usar npx (recomendado)
npx expo start
```

### Erro: "Unable to start server"

**Solução:**
```powershell
# 1. Verificar se outra instância está rodando
Get-Process -Name node, expo -ErrorAction SilentlyContinue | Stop-Process -Force

# 2. Limpar cache
.\limpar-cache-completo.ps1

# 3. Reiniciar
cd apps\app-aluno
pnpm start --clear
```

---

## 🗺️ Problemas com react-native-maps

### Erro: "Invariant Violation: requireNativeComponent: 'AIRMap' was not found"

**Causa:** react-native-maps requer código nativo

**Solução A - Expo Dev Client (RECOMENDADO):**
```powershell
# 1. Instalar expo-dev-client
cd apps\app-aluno
pnpm add expo-dev-client

# 2. Adicionar ao app.json
# "plugins": ["expo-dev-client", ...]

# 3. Fazer prebuild
npx expo prebuild

# 4. Rodar nativo
npx expo run:android
```

**Solução B - Remover temporariamente:**
```powershell
# Remover dependência
cd apps\app-aluno
pnpm remove react-native-maps

# Comentar código que usa mapas
# Usar Expo Go para desenvolvimento
```

**Solução C - Usar alternativa web:**
```typescript
// Criar componente condicional
import { Platform } from 'react-native';

const MapView = Platform.select({
  native: () => require('react-native-maps').default,
  web: () => require('./WebMapView').default,
})();
```

---

## 🌐 Erros de Conexão

### Erro: "Network request failed"

**Causa:** App não consegue conectar ao Metro

**Solução:**
```powershell
# 1. Verificar firewall
.\configurar-firewall-android.ps1

# 2. Usar tunnel
cd apps\app-aluno
pnpm start --tunnel

# 3. Ou usar localhost direto
pnpm start --localhost
```

### Erro: "Unable to connect to development server"

**Solução para Emulador Android:**
```powershell
# Configurar reverse proxy
adb reverse tcp:8081 tcp:8081
adb reverse tcp:8083 tcp:8083

# Verificar conexão
adb devices
```

**Solução para Dispositivo Físico:**
```powershell
# Usar tunnel
cd apps\app-aluno
pnpm start --tunnel

# Ou garantir mesma rede WiFi
# Verificar IP do computador: ipconfig
```

---

## 📱 Problemas com Android Emulator

### Erro: "No Android devices connected"

**Solução:**
```powershell
# Verificar dispositivos
adb devices

# Se vazio, iniciar emulador
emulator -avd Pixel_5_API_34

# Ou listar emuladores disponíveis
emulator -list-avds
```

### Erro: "INSTALL_FAILED_INSUFFICIENT_STORAGE"

**Solução:**
```powershell
# Limpar dados do emulador
adb shell pm clear com.bora.aluno

# Ou recriar emulador com mais espaço
# Android Studio > AVD Manager > Create Virtual Device
```

### Erro: "App keeps crashing on Android"

**Solução:**
```powershell
# Ver logs
adb logcat | Select-String "ReactNative"

# Limpar app data
adb shell pm clear com.bora.aluno

# Reinstalar
cd apps\app-aluno
npx expo run:android
```

---

## 🚀 Comandos Úteis de Diagnóstico

### Verificar versões
```powershell
node --version        # >= 18.17.0
pnpm --version        # >= 8.0.0
npx expo --version    # Expo CLI
```

### Verificar processos rodando
```powershell
Get-Process -Name node, expo, metro -ErrorAction SilentlyContinue
```

### Verificar portas em uso
```powershell
netstat -ano | findstr :8081
netstat -ano | findstr :8083
```

### Verificar Android
```powershell
adb devices           # Dispositivos conectados
adb logcat           # Logs do Android
adb reverse --list   # Reverse proxies configurados
```

### Limpar tudo
```powershell
# Script completo
.\limpar-cache-completo.ps1

# Ou manual
Remove-Item -Recurse -Force node_modules, .expo, .metro
Remove-Item -Recurse -Force apps\app-aluno\node_modules, apps\app-aluno\.expo
pnpm store prune
```

---

## 📞 Checklist de Troubleshooting

Quando encontrar um erro, siga esta ordem:

- [ ] 1. Ler a mensagem de erro completa
- [ ] 2. Verificar se é erro de cache → `.\limpar-cache-completo.ps1`
- [ ] 3. Verificar se é erro de dependência → `pnpm install`
- [ ] 4. Verificar se é erro de porta → `.\liberar-porta.ps1`
- [ ] 5. Verificar se é erro de conexão → `adb reverse` ou `--tunnel`
- [ ] 6. Verificar logs → `adb logcat` ou Metro logs
- [ ] 7. Verificar versões → Node, pnpm, Expo SDK
- [ ] 8. Verificar app.json → SDK version correto
- [ ] 9. Verificar metro.config.js → Configuração de monorepo
- [ ] 10. Último recurso → Reinstalar tudo

---

## 🆘 Último Recurso - Reinstalação Completa

```powershell
# 1. Backup do código
git status
git commit -am "Backup antes de reinstalação"

# 2. Limpar TUDO
.\limpar-cache-completo.ps1

# 3. Remover node_modules globalmente
Remove-Item -Recurse -Force node_modules
Get-ChildItem -Path . -Recurse -Directory -Filter node_modules | Remove-Item -Recurse -Force

# 4. Limpar store do pnpm
pnpm store prune

# 5. Reinstalar
pnpm install

# 6. Verificar
cd apps\app-aluno
pnpm start --clear
```

---

## 📚 Recursos Adicionais

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting)
- [Metro Bundler](https://facebook.github.io/metro/)
- [pnpm Workspaces](https://pnpm.io/workspaces)

---

## 💡 Dicas Preventivas

1. **Sempre use `--clear`** ao iniciar após mudanças grandes
2. **Mantenha versões estáveis** de dependências (evite RC)
3. **Commit frequente** para poder reverter mudanças
4. **Use scripts** ao invés de comandos manuais
5. **Documente** problemas e soluções específicas do projeto
6. **Teste em ambiente limpo** periodicamente
7. **Monitore logs** do Metro e Android para pegar erros cedo

---

**Última atualização:** 2025-12-29
**Mantido por:** Equipe BORA
