# 🔧 Como Resolver o Erro do Prisma Client

## ❌ Erro Atual

```
Module not found: Can't resolve '.prisma/client/default'
```

Este erro ocorre porque:
1. O Prisma Client não foi gerado
2. As variáveis `npm_config` corrompidas impedem a execução do comando

---

## ✅ SOLUÇÃO DEFINITIVA

### Opção 1: Reiniciar o Computador (RECOMENDADO)

Esta é a solução mais rápida e garantida:

1. **Salve todo o trabalho**
2. **Reinicie o computador**
3. Após reiniciar, abra um **NOVO PowerShell**
4. Execute:

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI\packages\db"
npx prisma generate
```

5. Reinicie o web-admin:

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI\apps\web-admin"
npx next dev -p 3000
```

---

### Opção 2: Limpar Variáveis do Sistema (SEM REINICIAR)

Se não puder reiniciar agora:

#### Passo 1: Limpar Variáveis de Ambiente

1. Pressione `Win + R`
2. Digite: `sysdm.cpl`
3. Vá para aba **"Avançado"**
4. Clique em **"Variáveis de Ambiente"**
5. Em **"Variáveis do usuário"** E **"Variáveis do sistema"**:
   - Procure por TODAS as variáveis que começam com `npm_config`
   - Selecione cada uma e clique em **"Excluir"**
6. Clique em **"OK"** em todas as janelas

#### Passo 2: Fechar TODOS os Terminais

1. Feche **TODOS** os terminais PowerShell/CMD
2. Feche o **VS Code/Cursor** (se usando terminal integrado)

#### Passo 3: Abrir Novo Terminal e Gerar Prisma

Abra um **NOVO PowerShell** e execute:

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI\packages\db"
npx prisma generate
```

**Resultado esperado:**
```
✔ Generated Prisma Client (v5.8.1) to ...
```

#### Passo 4: Reiniciar Web Admin

```powershell
# Matar processo antigo na porta 3000
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force

# Iniciar novamente
cd "C:\Users\Mateus\Desktop\Bora UI\apps\web-admin"
npx next dev -p 3000
```

---

### Opção 3: Usar PowerShell Core

Se você tem o PowerShell Core instalado (pwsh):

```powershell
# Abra o PowerShell Core (não o Windows PowerShell)
pwsh

# Execute
cd "C:\Users\Mateus\Desktop\Bora UI\packages\db"
npx prisma generate

# Reinicie o web-admin
cd ../apps/web-admin
npx next dev -p 3000
```

---

## 🔍 Verificar se Funcionou

Após gerar o Prisma Client:

```powershell
# Verificar se o arquivo foi gerado
Test-Path "C:\Users\Mateus\Desktop\Bora UI\node_modules\.pnpm\@prisma+client@*\node_modules\.prisma\client"
```

**Resultado esperado:** `True`

---

## 📊 Status Atual dos Serviços

| Serviço | Status | Ação |
|---------|--------|------|
| Web Admin | ❌ ERRO | Precisa gerar Prisma Client |
| App Aluno | ✅ RODANDO | Porta 8081 |
| App Instrutor | ⏳ AGUARDANDO | Precisa iniciar |

---

## 🎯 Após Resolver

1. ✅ Gerar Prisma Client
2. ✅ Reiniciar web-admin
3. ✅ Iniciar app-instrutor
4. ✅ Configurar `.env`
5. ✅ Testar o projeto

---

## ⚠️ Por Que Isso Aconteceu?

As variáveis `npm_config` foram corrompidas durante a execução de múltiplos comandos `pnpm` no Windows PowerShell. Elas contêm bytes nulos (`\x00`) que causam falha em qualquer comando `npm`/`npx`/`pnpm`.

**Solução permanente:**
- Sempre use terminais novos para cada comando
- Considere usar WSL (Windows Subsystem for Linux) para desenvolvimento

---

## 🆘 Se Nada Funcionar

Execute este diagnóstico e me envie o resultado:

```powershell
# Verificar variáveis npm_config
Get-ChildItem Env: | Where-Object { $_.Name -like "npm*" } | Select-Object Name, Value

# Verificar Prisma instalado
pnpm list prisma

# Verificar node_modules
Test-Path "node_modules"
Test-Path "packages/db/node_modules"
```

---

## 📞 Resumo Rápido

**Melhor solução: REINICIAR O COMPUTADOR**

1. Reinicie o PC
2. Abra novo PowerShell
3. `cd "C:\Users\Mateus\Desktop\Bora UI\packages\db"`
4. `npx prisma generate`
5. `cd ../apps/web-admin`
6. `npx next dev -p 3000`

---

**Depois de resolver, todo o projeto estará funcionando! 🚀**

