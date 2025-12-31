# 🔧 Solução para Iniciar o Web Admin

## ❌ Problema

O erro `ERR_INVALID_ARG_VALUE` ocorre porque o `pnpm` está passando variáveis de ambiente corrompidas (com bytes nulos) para o Node.js.

```
TypeError [ERR_INVALID_ARG_VALUE]: The property 'options.env['npm_config___i_g_n_o_r_e___w_o_r_k_s_p_a_c_e___r_o_o_t___c_h_e_c_k_']' must be a string without null bytes.
```

---

## ✅ Solução 1: Usar NPX (Recomendado)

### Passo a Passo

1. **Feche** todos os terminais abertos do web-admin

2. Abra um **NOVO** terminal PowerShell

3. Execute:

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI"
.\start-web-admin-npx.ps1
```

**OU** execute manualmente:

```powershell
# 1. Navegar
cd "C:\Users\Mateus\Desktop\Bora UI\apps\web-admin"

# 2. Limpar variáveis
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config*" } | ForEach-Object { 
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue 
}

# 3. Iniciar com npx
npx next dev -p 3000
```

---

## ✅ Solução 2: Reiniciar o PowerShell

Se a Solução 1 não funcionar:

1. **Feche completamente** o PowerShell/Terminal
2. Abra um **NOVO** PowerShell
3. Execute:

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI\apps\web-admin"
npx next dev -p 3000
```

---

## ✅ Solução 3: Usar CMD ao invés de PowerShell

Se ainda não funcionar, tente usar o CMD:

1. Abra o **Prompt de Comando (CMD)**
2. Execute:

```cmd
cd "C:\Users\Mateus\Desktop\Bora UI\apps\web-admin"
npx next dev -p 3000
```

---

## ✅ Solução 4: Limpar Cache do PNPM

```powershell
# Limpar cache do pnpm
pnpm store prune

# Reinstalar dependências
cd "C:\Users\Mateus\Desktop\Bora UI"
pnpm install --force --ignore-scripts

# Tentar iniciar novamente
cd apps\web-admin
npx next dev -p 3000
```

---

## 🎯 O que Esperar

Após executar a solução, você deve ver:

```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Environments: .env

✓ Starting...
✓ Ready in 2.3s
```

---

## 🔍 Verificar se Funcionou

1. Aguarde a mensagem `✓ Ready in X.Xs`
2. Abra o navegador em: http://localhost:3000
3. Você deve ver o painel admin

---

## 🐛 Se Ainda Não Funcionar

Execute este diagnóstico:

```powershell
# Verificar variáveis de ambiente
Get-ChildItem Env: | Where-Object { $_.Name -like "npm*" } | Select-Object Name, Value

# Verificar se a porta 3000 está ocupada
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
```

Se a porta 3000 estiver ocupada, use outra porta:

```powershell
npx next dev -p 3001
```

---

## 📊 Status Esperado

Após resolver:

| Serviço | Status | Porta | URL |
|---------|--------|-------|-----|
| Web Admin | ✅ Rodando | 3000 | http://localhost:3000 |
| App Aluno | ✅ Rodando | 8081 | Expo QR Code |
| App Instrutor | ✅ Rodando | 8082 | Expo QR Code |

---

## 💡 Por que isso acontece?

O Windows PowerShell às vezes corrompe variáveis de ambiente quando:
- Múltiplos comandos `pnpm` são executados
- Variáveis contêm caracteres especiais
- O terminal foi reutilizado várias vezes

**Solução permanente**: Sempre use um novo terminal para iniciar o web-admin.

---

## 📞 Próximos Passos

Após o web-admin iniciar:

1. Configure o `.env` (veja `CONFIGURAR_ENV.md`)
2. Acesse http://localhost:3000
3. Teste o painel admin
4. Teste os apps móveis

---

**Boa sorte! 🚀**

