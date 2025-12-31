# 🔧 Solução Final - Variáveis npm_config Corrompidas

## ❌ Problema

As variáveis de ambiente `npm_config` estão corrompidas com bytes nulos (`\x00`), causando erros em todos os comandos `npm` e `pnpm`.

```
TypeError [ERR_INVALID_ARG_VALUE]: The property 'options.env['npm_config___i_g_n_o_r_e___w_o_r_k_s_p_a_c_e___r_o_o_t___c_h_e_c_k_']' must be a string without null bytes.
```

---

## ✅ Solução Definitiva

### Passo 1: Fechar TODOS os Terminais

1. Feche **TODOS** os terminais PowerShell/CMD abertos
2. Feche o **Visual Studio Code / Cursor** (se estiver usando terminal integrado)
3. Reinicie o computador (recomendado) **OU** continue para o Passo 2

---

### Passo 2: Limpar Variáveis do Sistema (Windows)

**Opção A: Via Interface Gráfica**

1. Pressione `Win + R`
2. Digite: `sysdm.cpl` e pressione Enter
3. Vá para a aba **"Avançado"**
4. Clique em **"Variáveis de Ambiente"**
5. Em **"Variáveis do usuário"** e **"Variáveis do sistema"**:
   - Procure por variáveis que começam com `npm_config`
   - Selecione e clique em **"Excluir"**
6. Clique em **"OK"** para salvar
7. **Reinicie o computador**

**Opção B: Via PowerShell (Admin)**

1. Abra PowerShell como **Administrador**
2. Execute:

```powershell
# Limpar variáveis do usuário
[Environment]::GetEnvironmentVariables('User').Keys | Where-Object { $_ -like 'npm_config*' } | ForEach-Object {
    [Environment]::SetEnvironmentVariable($_, $null, 'User')
    Write-Host "Removida: $_"
}

# Limpar variáveis do sistema
[Environment]::GetEnvironmentVariables('Machine').Keys | Where-Object { $_ -like 'npm_config*' } | ForEach-Object {
    [Environment]::SetEnvironmentVariable($_, $null, 'Machine')
    Write-Host "Removida: $_"
}

Write-Host "Limpeza concluida! Reinicie o computador."
```

3. **Reinicie o computador**

---

### Passo 3: Após Reiniciar

Abra um **NOVO** terminal PowerShell e execute:

```powershell
# Verificar se as variáveis foram removidas
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config*" }
```

**Resultado esperado**: Nenhuma variável encontrada

---

### Passo 4: Gerar Prisma Client

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI\packages\db"
npx prisma generate
```

**Resultado esperado**: `✔ Generated Prisma Client`

---

### Passo 5: Iniciar os Serviços

Abra **3 terminais PowerShell** separados:

**Terminal 1 - Web Admin:**
```powershell
cd "C:\Users\Mateus\Desktop\Bora UI\apps\web-admin"
npx next dev -p 3000
```

**Terminal 2 - App Aluno:**
```powershell
cd "C:\Users\Mateus\Desktop\Bora UI\apps\app-aluno"
npx expo start --clear
```

**Terminal 3 - App Instrutor:**
```powershell
cd "C:\Users\Mateus\Desktop\Bora UI\apps\app-instrutor"
npx expo start --clear
```

---

## 🎯 Alternativa: Usar CMD ao invés de PowerShell

Se o problema persistir, use o **Prompt de Comando (CMD)**:

1. Abra o **CMD** (não PowerShell)
2. Execute os comandos acima

O CMD não tem o mesmo problema com variáveis de ambiente corrompidas.

---

## 🔍 Verificar se Funcionou

Após iniciar os serviços:

```powershell
# Verificar porta 3000 (Web Admin)
curl http://localhost:3000

# Verificar portas Expo
Get-NetTCPConnection -LocalPort 8081,8082 | Select-Object LocalPort, State
```

---

## 📊 Status Esperado

| Serviço | Porta | Status |
|---------|-------|--------|
| Web Admin | 3000 | ✅ http://localhost:3000 |
| App Aluno | 8081 | ✅ QR Code no terminal |
| App Instrutor | 8082 | ✅ QR Code no terminal |

---

## 🐛 Se Ainda Não Funcionar

### Opção 1: Reinstalar Node.js

1. Desinstale o Node.js
2. Baixe a versão LTS mais recente: https://nodejs.org
3. Instale novamente
4. Reinicie o computador
5. Reinstale as dependências:
   ```powershell
   cd "C:\Users\Mateus\Desktop\Bora UI"
   pnpm install
   ```

### Opção 2: Usar WSL (Windows Subsystem for Linux)

Se você tem o WSL instalado:

```bash
# No WSL
cd /mnt/c/Users/Mateus/Desktop/Bora\ UI
pnpm install
cd packages/db
npx prisma generate
cd ../../apps/web-admin
pnpm dev
```

---

## ⚠️ Importante

Após resolver o problema das variáveis:

1. **Configure o .env** (veja `CONFIGURAR_ENV.md`)
2. **Teste o Admin Panel**: http://localhost:3000
3. **Teste os apps móveis** com Expo Go

---

## 📞 Resumo

1. ✅ Feche todos os terminais
2. ✅ Limpe as variáveis npm_config do sistema
3. ✅ Reinicie o computador
4. ✅ Abra novos terminais
5. ✅ Gere o Prisma Client
6. ✅ Inicie os 3 serviços
7. ✅ Configure o .env
8. ✅ Teste o projeto

---

**Boa sorte! 🚀**

