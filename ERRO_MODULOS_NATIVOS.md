# 🔴 ERRO DETECTADO: Módulos Nativos Incompatíveis

## ❌ Problema

O app está configurado com `expo-dev-client` e outros plugins nativos que **NÃO funcionam no Expo Go padrão**.

**Erro:** `TurboModuleRegistry.getEnforcing(...): 'PlatformConstants' could not be found`

## 🎯 Soluções Disponíveis

### ✅ SOLUÇÃO 1: Build de Desenvolvimento (RECOMENDADO)

Criar um APK de desenvolvimento customizado que inclui todos os módulos nativos.

**Vantagens:**
- Funciona com todos os módulos nativos
- Melhor performance
- Experiência completa do app

**Como fazer:**
```powershell
# 1. Instalar EAS CLI
npm install -g eas-cli

# 2. Login no Expo
eas login

# 3. Configurar projeto
cd apps/app-aluno
eas build:configure

# 4. Criar build de desenvolvimento
eas build --profile development --platform android

# 5. Instalar no emulador
# (O EAS vai gerar um link para download do APK)
```

**Tempo:** ~10-15 minutos (build na nuvem)

---

### ⚡ SOLUÇÃO 2: Remover Plugins Nativos (RÁPIDO, mas limitado)

Temporariamente remover plugins que não funcionam no Expo Go.

**Desvantagens:**
- Perde funcionalidades (notificações, maps nativos, etc)
- Apenas para teste básico de UI

**Como fazer:**
```powershell
# Editar app.json e remover plugins
# Reiniciar Expo
```

---

### 🌐 SOLUÇÃO 3: Testar na Web (MAIS RÁPIDO)

Rodar o app no navegador (sem módulos nativos).

**Como fazer:**
```powershell
cd apps/app-aluno
npx expo start --web
```

**Vantagens:**
- Funciona imediatamente
- Boa para testar UI e layout
- Mapa funciona (usa react-leaflet)

**Desvantagens:**
- Não testa funcionalidades mobile específicas
- Experiência diferente do app nativo

---

## 🚀 RECOMENDAÇÃO

Para ver o **mapa dark mode e o modal completo** funcionando AGORA:

### Opção A: Testar na Web (2 minutos)
```powershell
cd apps/app-aluno
npx expo start --web
```

Depois abra: http://localhost:8081

### Opção B: Build de Desenvolvimento (15 minutos)
Seguir os passos da Solução 1 acima.

---

## 📱 O Que Cada Solução Permite Testar

| Feature | Expo Go | Web | Dev Build |
|---------|---------|-----|-----------|
| Mapa Dark Mode | ❌ | ✅ | ✅ |
| Modal de Instrutor | ❌ | ✅ | ✅ |
| Animações | ❌ | ⚠️ | ✅ |
| Localização GPS | ❌ | ❌ | ✅ |
| Notificações | ❌ | ❌ | ✅ |
| Camera | ❌ | ❌ | ✅ |

---

## 🎯 Qual você prefere?

1. **Web (rápido)** - Ver UI agora
2. **Dev Build (completo)** - Experiência real do app
3. **Simplificar (temporário)** - Remover plugins

**Qual opção você quer seguir?**
