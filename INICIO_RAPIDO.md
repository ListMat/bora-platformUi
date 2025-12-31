# 🚀 INÍCIO RÁPIDO - Preparação do Ambiente Expo

> **Status:** ✅ Ambiente analisado e pronto para preparação  
> **Data:** 2025-12-29  
> **Projeto:** BORA Aluno - Expo SDK 52

---

## ⚡ EXECUÇÃO RÁPIDA (1 comando)

```powershell
.\preparar-ambiente-expo.ps1
```

Este comando irá:
- ✅ Analisar o projeto
- ✅ Corrigir configurações
- ✅ Limpar todos os caches
- ✅ Reinstalar dependências
- ✅ Preparar para execução

**Tempo:** ~5-10 minutos

---

## 📚 DOCUMENTAÇÃO CRIADA

### 📄 Arquivos Principais

| Arquivo | Descrição | Quando Usar |
|---------|-----------|-------------|
| **RESUMO_PREPARACAO_EXPO.md** | 📊 Resumo executivo completo | Leia PRIMEIRO |
| **ANALISE_DEPENDENCIAS_EXPO.md** | 🔍 Análise técnica detalhada | Para entender dependências |
| **TROUBLESHOOTING_EXPO.md** | 🔧 Guia de solução de problemas | Quando encontrar erros |
| **SOLUCOES_REACT_NATIVE_MAPS.md** | 🗺️ Opções para mapas | Decidir sobre react-native-maps |

### 🛠️ Scripts Criados

| Script | Descrição | Quando Executar |
|--------|-----------|-----------------|
| **preparar-ambiente-expo.ps1** | 🎯 Script mestre (tudo em 1) | PRIMEIRA VEZ |
| **limpar-cache-completo.ps1** | 🧹 Limpa todos os caches | Quando app não atualiza |
| **corrigir-dependencias.ps1** | 📦 Corrige dependências | Problemas de compatibilidade |

---

## 🎯 FLUXO RECOMENDADO

### 1️⃣ PRIMEIRA VEZ

```powershell
# Leia o resumo
code RESUMO_PREPARACAO_EXPO.md

# Execute o script mestre
.\preparar-ambiente-expo.ps1

# Siga as instruções interativas
```

### 2️⃣ DESENVOLVIMENTO DIÁRIO

```powershell
# Iniciar app normalmente
cd apps\app-aluno
pnpm start
```

### 3️⃣ SE ENCONTRAR PROBLEMAS

```powershell
# 1. Consulte o guia
code TROUBLESHOOTING_EXPO.md

# 2. Limpe o cache
.\limpar-cache-completo.ps1

# 3. Reinstale
pnpm install

# 4. Tente novamente
cd apps\app-aluno
pnpm start --clear
```

---

## ✅ O QUE JÁ FOI FEITO

- ✅ **app.json corrigido** (SDK 52.0.0)
- ✅ **Dependências analisadas** (30+ pacotes)
- ✅ **Scripts criados** (automação completa)
- ✅ **Documentação completa** (4 guias)

---

## ⚠️ DECISÕES NECESSÁRIAS

### 🗺️ react-native-maps

Você precisa escolher uma opção:

| Opção | Descrição | Recomendado Para |
|-------|-----------|------------------|
| **1. Expo Dev Client** | Build nativo com mapas | Produção |
| **2. WebView** | Mapas via web | Prototipagem |
| **3. Híbrido** | Ambos | Flexibilidade |
| **4. Remover** | Sem mapas agora | Desenvolvimento inicial |

**Leia:** `SOLUCOES_REACT_NATIVE_MAPS.md` para detalhes

Execute `.\corrigir-dependencias.ps1` para escolher interativamente

---

## 📊 STATUS DAS DEPENDÊNCIAS

### ✅ Compatíveis (85%)
- Expo oficiais: 15 pacotes
- React Native Community: 3 pacotes
- UI/Navegação: 6 pacotes
- Utilitários: 6 pacotes

### ⚠️ Requerem Atenção (15%)
- react-native-maps (requer decisão)
- tRPC (versão RC)
- pusher-js (versão RC)
- @trpc/next (desnecessário)

---

## 🚀 PRÓXIMOS PASSOS

### Opção A: Desenvolvimento Rápido (Expo Go)

```powershell
# 1. Preparar ambiente
.\preparar-ambiente-expo.ps1

# 2. Escolher "Remover react-native-maps temporariamente"

# 3. Iniciar
cd apps\app-aluno
pnpm start

# 4. Escanear QR Code com Expo Go
```

**Tempo:** ~10 minutos  
**Vantagem:** Desenvolvimento rápido  
**Limitação:** Sem mapas

---

### Opção B: Build Completo (Expo Dev Client)

```powershell
# 1. Preparar ambiente
.\preparar-ambiente-expo.ps1

# 2. Escolher "Instalar Expo Dev Client"

# 3. Fazer prebuild
cd apps\app-aluno
npx expo prebuild

# 4. Rodar nativo
npx expo run:android
```

**Tempo:** ~20 minutos (primeira vez)  
**Vantagem:** Todas as funcionalidades  
**Limitação:** Build mais lento

---

## 🆘 AJUDA RÁPIDA

### Comandos Úteis

```powershell
# Ver versões
node --version    # >= 18.17.0
pnpm --version    # >= 8.0.0

# Limpar tudo
.\limpar-cache-completo.ps1

# Ver processos rodando
Get-Process -Name node, expo -ErrorAction SilentlyContinue

# Matar processos
Get-Process -Name node, expo -ErrorAction SilentlyContinue | Stop-Process -Force

# Ver portas em uso
netstat -ano | findstr :8081
netstat -ano | findstr :8083

# Android
adb devices           # Ver dispositivos
adb logcat           # Ver logs
adb reverse tcp:8081 tcp:8081  # Configurar proxy
```

---

## 📞 ESTRUTURA DE ARQUIVOS

```
Bora UI/
├── 📄 INICIO_RAPIDO.md                    ← VOCÊ ESTÁ AQUI
├── 📄 RESUMO_PREPARACAO_EXPO.md           ← Leia primeiro
├── 📄 ANALISE_DEPENDENCIAS_EXPO.md        ← Análise técnica
├── 📄 TROUBLESHOOTING_EXPO.md             ← Solução de problemas
├── 📄 SOLUCOES_REACT_NATIVE_MAPS.md       ← Opções para mapas
│
├── 🛠️ preparar-ambiente-expo.ps1          ← Script mestre
├── 🛠️ limpar-cache-completo.ps1           ← Limpar cache
├── 🛠️ corrigir-dependencias.ps1           ← Corrigir deps
│
└── apps/
    └── app-aluno/
        ├── app.json                        ← ✅ CORRIGIDO (SDK 52)
        ├── package.json                    ← Dependências
        └── metro.config.js                 ← ✅ Configurado
```

---

## 🎓 GLOSSÁRIO

| Termo | Significado |
|-------|-------------|
| **Expo Go** | App para testar sem build nativo |
| **Expo Dev Client** | Build customizado com código nativo |
| **Metro Bundler** | Empacotador de código JavaScript |
| **SDK** | Software Development Kit (versão do Expo) |
| **RC** | Release Candidate (versão pré-lançamento) |
| **Cache** | Arquivos temporários para acelerar builds |
| **Monorepo** | Múltiplos projetos em um repositório |
| **pnpm** | Gerenciador de pacotes (alternativa ao npm) |

---

## ✨ DICAS

💡 **Sempre use `--clear`** ao iniciar após mudanças grandes  
💡 **Commit frequente** para poder reverter mudanças  
💡 **Leia os logs** completos quando houver erro  
💡 **Use scripts** ao invés de comandos manuais  
💡 **Teste em ambiente limpo** periodicamente  

---

## 🎯 CHECKLIST ANTES DE COMEÇAR

- [ ] Node.js >= 18.17.0 instalado
- [ ] pnpm >= 8.0.0 instalado
- [ ] Android SDK instalado (para Android)
- [ ] Expo Go instalado no celular (para teste rápido)
- [ ] Leu `RESUMO_PREPARACAO_EXPO.md`
- [ ] Decidiu sobre react-native-maps
- [ ] Executou `.\preparar-ambiente-expo.ps1`

---

## 🎉 PRONTO PARA COMEÇAR!

```powershell
# Execute este comando e siga as instruções:
.\preparar-ambiente-expo.ps1
```

**Boa sorte! 🚀**

---

**Criado em:** 2025-12-29  
**Versão:** 1.0  
**Mantido por:** Equipe BORA
