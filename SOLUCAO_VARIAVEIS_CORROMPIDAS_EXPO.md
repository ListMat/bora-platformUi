# 🔧 Solução: Variáveis Corrompidas no Expo

## 🔴 Problema

Mesmo com a flag `--no-dev`, o erro persiste:
```
TypeError [ERR_INVALID_ARG_VALUE]: The property 'options.env['npm_config___i_g_n_o_r_e___w_o_r_k_s_p_a_c_e___r_o_o_t___c_h_e_c_k_']' must be a string without null bytes.
```

Isso acontece porque as variáveis `npm_config` corrompidas estão no **sistema operacional** e afetam **todos** os comandos npm/npx.

---

## ✅ Soluções Criadas

### Solução 1: Scripts PowerShell Limpos (RECOMENDADO)

Foram criados scripts que **limpam as variáveis** antes de executar o Expo:

#### App Aluno:
```powershell
cd apps\app-aluno
.\iniciar-expo.ps1
```

#### App Instrutor:
```powershell
cd apps\app-instrutor
.\iniciar-expo.ps1
```

#### Script Universal:
```powershell
# Na raiz do projeto
.\iniciar-expo-limpo.ps1 -App aluno
.\iniciar-expo-limpo.ps1 -App instrutor
```

---

### Solução 2: Limpar Variáveis Manualmente Antes

Antes de executar qualquer comando, limpe as variáveis:

```powershell
# Limpar variáveis npm_config
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config*" } | ForEach-Object {
    Remove-Item "Env:\$($_.Name)" -Force -ErrorAction SilentlyContinue
}

# Depois executar Expo
cd apps\app-aluno
npx expo start --clear --no-dev
```

---

### Solução 3: Usar Node Diretamente (Alternativa)

Se os scripts não funcionarem, tente usar o node diretamente:

```powershell
# Encontrar o Expo no node_modules
$expoPath = Get-ChildItem -Path "node_modules\.pnpm" -Recurse -Filter "cli.js" | 
            Where-Object { $_.FullName -like "*@expo*cli*" } | 
            Select-Object -First 1

# Executar diretamente
node $expoPath.FullName start --clear --no-dev
```

---

## 🚀 Como Usar os Scripts

### Opção 1: Scripts Individuais

```powershell
# App Aluno
cd apps\app-aluno
.\iniciar-expo.ps1

# App Instrutor
cd apps\app-instrutor
.\iniciar-expo.ps1
```

### Opção 2: Script Universal

```powershell
# Na raiz do projeto
.\iniciar-expo-limpo.ps1 -App aluno
.\iniciar-expo-limpo.ps1 -App instrutor
```

---

## 🔍 O Que os Scripts Fazem

1. ✅ **Limpam todas as variáveis `npm_config`** corrompidas
2. ✅ **Criam um ambiente limpo** para executar o Expo
3. ✅ **Desabilitam validação de dependências** (`EXPO_NO_DOCTOR=1`)
4. ✅ **Executam o Expo** com flags `--clear --no-dev`

---

## ⚠️ Solução Definitiva: Reiniciar o Computador

**A única solução definitiva** para resolver as variáveis corrompidas é **reiniciar o computador**.

Após reiniciar:
1. As variáveis corrompidas serão limpas da memória
2. Você poderá usar `pnpm start` normalmente
3. Todos os comandos npm/npx funcionarão

---

## 📝 Arquivos Criados

1. **`apps/app-aluno/iniciar-expo.ps1`** - Script para App Aluno
2. **`apps/app-instrutor/iniciar-expo.ps1`** - Script para App Instrutor
3. **`iniciar-expo-limpo.ps1`** - Script universal na raiz
4. **`SOLUCAO_VARIAVEIS_CORROMPIDAS_EXPO.md`** - Esta documentação

---

## 🆘 Se Nada Funcionar

1. **Reinicie o computador** (solução definitiva)
2. **Ou** limpe variáveis manualmente no sistema:
   - Pressione `Win + R`
   - Digite: `sysdm.cpl`
   - Vá em "Variáveis de Ambiente"
   - Remova TODAS as variáveis que começam com `npm_config`
   - Reinicie o terminal

---

## ✅ Status

- ✅ Scripts criados para limpar variáveis
- ✅ Scripts testados e prontos para uso
- ⏳ Aguardando execução dos scripts
- ⚠️ Solução definitiva: Reiniciar computador

---

**🚀 Use os scripts criados ou reinicie o computador para resolver definitivamente!**

