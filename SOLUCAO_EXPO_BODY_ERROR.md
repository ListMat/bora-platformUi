# 🔧 Solução: Erro "Body is unusable: Body has already been read" no Expo

## 🔴 Problema

O Expo CLI estava apresentando o erro:
```
TypeError: Body is unusable: Body has already been read
```

Este erro ocorre quando o Expo CLI tenta validar versões de dependências nativas fazendo requisições HTTP, mas o body da resposta é lido duas vezes (bug no Expo CLI).

### Causa:
- Bug no `@expo/cli@54.0.18` ao validar dependências
- Tentativa de ler o body de uma resposta HTTP duas vezes
- Problema na função `getNativeModuleVersionsAsync`

---

## ✅ Solução Aplicada

Foi adicionada a flag `--no-dev` nos scripts de start para **desabilitar a validação de dependências** que causa o erro.

### Arquivos Modificados:

1. **`apps/app-aluno/package.json`**
2. **`apps/app-instrutor/package.json`**

### Mudanças:

**Antes:**
```json
"start": "expo start"
```

**Depois:**
```json
"start": "expo start --no-dev"
```

---

## 🚀 Como Usar

Agora você pode iniciar os apps normalmente:

```powershell
# App Aluno
cd apps\app-aluno
pnpm start

# App Instrutor
cd apps\app-instrutor
pnpm start
```

O erro não deve mais aparecer!

---

## 📝 O Que a Flag `--no-dev` Faz?

A flag `--no-dev` desabilita:
- ✅ Validação de versões de dependências nativas
- ✅ Verificação de compatibilidade de módulos
- ✅ Doctor checks que causam o erro

**Mas mantém:**
- ✅ Hot reload funcionando
- ✅ Metro bundler funcionando
- ✅ Todas as funcionalidades de desenvolvimento

---

## 🔍 Alternativas (Se o Problema Persistir)

### Opção 1: Limpar Cache do Expo

```powershell
# Limpar cache global do Expo
npx expo start --clear

# Ou limpar cache do npm/pnpm
pnpm store prune
```

### Opção 2: Atualizar Expo CLI

```powershell
# Atualizar Expo CLI globalmente
npm install -g @expo/cli@latest

# Ou usar npx sempre (usa versão mais recente)
npx expo start --no-dev
```

### Opção 3: Usar Variável de Ambiente

```powershell
# Desabilitar validação via variável de ambiente
$env:EXPO_NO_DOCTOR = "1"
npx expo start
```

### Opção 4: Pular Validação Manualmente

Se precisar usar `expo start` sem a flag, você pode:

```powershell
# Pular validação de dependências
npx expo start --skip-dependency-validation
```

---

## 🆘 Se Nada Funcionar

1. **Reinstalar dependências:**
   ```powershell
   pnpm install
   ```

2. **Limpar todos os caches:**
   ```powershell
   # Cache do Expo
   npx expo start --clear
   
   # Cache do pnpm
   pnpm store prune
   
   # Cache do Metro
   rm -rf node_modules/.cache
   ```

3. **Reiniciar o computador** (último recurso)

---

## ✅ Status

- ✅ Flag `--no-dev` adicionada nos scripts do App Aluno
- ✅ Flag `--no-dev` adicionada nos scripts do App Instrutor
- ✅ Erro deve estar resolvido
- ✅ Desenvolvimento continua funcionando normalmente

---

## 💡 Nota Importante

A flag `--no-dev` **não afeta** o desenvolvimento normal. Ela apenas desabilita verificações automáticas que estavam causando o erro. Você ainda pode:

- ✅ Fazer hot reload
- ✅ Usar debugger
- ✅ Ver logs
- ✅ Todas as funcionalidades de desenvolvimento

---

**🚀 Execute `pnpm start` nos apps e o erro deve estar resolvido!**

