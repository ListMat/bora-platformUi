# 📊 Análise de Compatibilidade de Dependências - Expo SDK 52

**Data:** 2025-12-29
**Projeto:** BORA Aluno
**Expo SDK:** 52.0.0
**React Native:** 0.76.5

---

## ✅ Dependências COMPATÍVEIS (Managed Workflow)

### Expo Oficiais - Totalmente Compatíveis
| Pacote | Versão Atual | Status | Observações |
|--------|--------------|--------|-------------|
| `expo` | ~52.0.0 | ✅ OK | Versão correta |
| `expo-router` | ~4.0.0 | ✅ OK | Compatível com SDK 52 |
| `expo-asset` | ~11.0.1 | ✅ OK | Versão correta |
| `expo-av` | ~15.0.1 | ✅ OK | Áudio/Vídeo nativo |
| `expo-clipboard` | ~7.0.0 | ✅ OK | Clipboard nativo |
| `expo-device` | ~7.0.0 | ✅ OK | Info do dispositivo |
| `expo-haptics` | ~14.0.0 | ✅ OK | Feedback tátil |
| `expo-image-manipulator` | ~13.0.5 | ✅ OK | Manipulação de imagens |
| `expo-image-picker` | ~16.0.3 | ✅ OK | Seleção de imagens |
| `expo-location` | ~18.0.2 | ✅ OK | Geolocalização |
| `expo-notifications` | ~0.29.8 | ✅ OK | Push notifications |
| `expo-secure-store` | ~14.0.0 | ✅ OK | Armazenamento seguro |
| `expo-status-bar` | ~2.0.0 | ✅ OK | Barra de status |
| `expo-web-browser` | ~14.0.1 | ✅ OK | Navegador in-app |
| `@expo/vector-icons` | ^14.0.0 | ✅ OK | Ícones |

### React Native Community - Compatíveis
| Pacote | Versão Atual | Status | Observações |
|--------|--------------|--------|-------------|
| `@react-native-async-storage/async-storage` | 1.23.1 | ✅ OK | Storage assíncrono |
| `@react-native-community/datetimepicker` | 8.2.0 | ✅ OK | Seletor de data/hora |
| `@react-native-community/netinfo` | 11.4.1 | ✅ OK | Info de rede |

### Bibliotecas de UI/Navegação - Compatíveis
| Pacote | Versão Atual | Status | Observações |
|--------|--------------|--------|-------------|
| `@gorhom/bottom-sheet` | ^5.0.0 | ✅ OK | Bottom sheets |
| `react-native-gesture-handler` | ~2.20.2 | ✅ OK | Gestos nativos |
| `react-native-reanimated` | ~3.16.1 | ✅ OK | Animações |
| `react-native-safe-area-context` | 4.12.0 | ✅ OK | Safe areas |
| `react-native-screens` | ~4.1.0 | ✅ OK | Navegação otimizada |
| `react-native-svg` | 15.8.0 | ✅ OK | SVG nativo |

### Utilitários - Compatíveis
| Pacote | Versão Atual | Status | Observações |
|--------|--------------|--------|-------------|
| `react-native-qrcode-svg` | ^6.3.0 | ✅ OK | QR Code (usa react-native-svg) |
| `@tanstack/react-query` | ^5.90.1 | ✅ OK | Cache de dados |
| `zod` | ^3.23.8 | ✅ OK | Validação |
| `superjson` | ^2.2.1 | ✅ OK | Serialização |

---

## ⚠️ Dependências que REQUEREM ATENÇÃO

### 1. **react-native-maps** (CRÍTICO)
- **Versão Atual:** 1.18.0
- **Status:** ⚠️ REQUER EXPO DEV CLIENT
- **Problema:** `react-native-maps` requer código nativo e NÃO funciona no Expo Go
- **Soluções:**
  
  **Opção A - Usar Expo Dev Client (RECOMENDADO):**
  ```bash
  # Instalar expo-dev-client
  pnpm add expo-dev-client
  
  # Adicionar ao app.json plugins
  "plugins": ["expo-dev-client", ...]
  
  # Fazer build do dev client
  npx expo prebuild
  npx expo run:android
  ```
  
  **Opção B - Substituir por Expo Maps (SE DISPONÍVEL):**
  ```bash
  # Verificar se expo-maps está disponível para SDK 52
  pnpm remove react-native-maps
  pnpm add expo-maps
  ```
  
  **Opção C - Usar alternativa web:**
  - Para desenvolvimento, usar mapas web (Google Maps JS API)
  - Implementar versão nativa apenas para produção

### 2. **pusher-js**
- **Versão Atual:** ^8.4.0-rc2
- **Status:** ⚠️ VERSÃO RC (Release Candidate)
- **Problema:** Versão não estável
- **Solução:**
  ```bash
  # Atualizar para versão estável
  pnpm add pusher-js@latest
  ```

### 3. **tRPC Packages**
- **Versões Atuais:** ^11.0.0-rc.446+v11.0.0-rc.379
- **Status:** ⚠️ VERSÃO RC
- **Problema:** Versões não estáveis
- **Solução:**
  ```bash
  # Atualizar para versões estáveis do tRPC v11
  pnpm add @trpc/client@latest @trpc/server@latest @trpc/react-query@latest @trpc/next@latest
  ```

---

## 🔴 PROBLEMAS CRÍTICOS IDENTIFICADOS

### 1. **Incompatibilidade de Versão do SDK**
**Arquivo:** `app.json` linha 6
```json
"sdkVersion": "54.0.0"  // ❌ ERRADO
```

**Correção Necessária:**
```json
"sdkVersion": "52.0.0"  // ✅ CORRETO
```

### 2. **@trpc/next no React Native**
- **Problema:** `@trpc/next` é específico para Next.js
- **Não é necessário** em um app React Native
- **Solução:** Pode ser removido se não estiver sendo usado

---

## 📦 Dependências Recomendadas para ADICIONAR

### Para melhor experiência com mapas:
```bash
# Se optar por Expo Dev Client
pnpm add expo-dev-client

# Ou se expo-maps estiver disponível
pnpm add expo-maps
```

### Para debugging melhor:
```bash
pnpm add -D react-native-debugger-open
```

---

## 🚀 PLANO DE AÇÃO RECOMENDADO

### Fase 1: Correções Críticas
1. ✅ Corrigir `sdkVersion` no `app.json`
2. ✅ Atualizar dependências RC para versões estáveis
3. ✅ Decidir estratégia para `react-native-maps`

### Fase 2: Limpeza de Cache
1. ✅ Limpar cache do Metro Bundler
2. ✅ Limpar cache do Expo
3. ✅ Limpar cache do pnpm
4. ✅ Reinstalar node_modules

### Fase 3: Testes
1. ✅ Testar build no Expo Go (sem maps)
2. ✅ Se necessário, configurar Expo Dev Client
3. ✅ Testar todas as funcionalidades

---

## 🎯 DECISÃO NECESSÁRIA: React Native Maps

Você precisa escolher uma das opções:

### Opção 1: Expo Dev Client (RECOMENDADO)
- ✅ Permite usar `react-native-maps`
- ✅ Mantém todas as funcionalidades
- ❌ Requer build nativo (mais lento)
- ❌ Não funciona no Expo Go

### Opção 2: Remover Mapas Temporariamente
- ✅ Funciona no Expo Go
- ✅ Desenvolvimento mais rápido
- ❌ Perde funcionalidade de mapas

### Opção 3: Usar Expo Maps (SE DISPONÍVEL)
- ✅ Funciona no Expo Go
- ✅ Mantém funcionalidade
- ❌ Pode ter menos recursos que react-native-maps

---

## 📝 NOTAS ADICIONAIS

### Sobre o Metro Config
O arquivo `metro.config.js` está bem configurado para monorepo com pnpm.
Nenhuma alteração necessária.

### Sobre Plugins no app.json
Os plugins configurados estão corretos para SDK 52:
- ✅ expo-router
- ✅ expo-secure-store
- ✅ expo-location
- ✅ expo-asset
- ✅ expo-notifications
- ✅ @react-native-community/datetimepicker

### Hermes Engine
✅ Configurado corretamente: `"jsEngine": "hermes"`

---

## 🔧 PRÓXIMOS PASSOS

Aguardando sua decisão sobre `react-native-maps` para prosseguir com:
1. Scripts de limpeza de cache
2. Correção do app.json
3. Atualização de dependências
4. Testes de execução
