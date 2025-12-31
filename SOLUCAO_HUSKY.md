# 🔧 Solução para Erro do Husky

## 🔴 Problema

O script `prepare` que executa `husky install` está falhando devido a variáveis `npm_config` corrompidas no sistema Windows.

### Erro:
```
TypeError [ERR_INVALID_ARG_VALUE]: The property 'options.env['npm_config___i_g_n_o_r_e___w_o_r_k_s_p_a_c_e___r_o_o_t___c_h_e_c_k_']' must be a string without null bytes.
```

---

## ✅ Soluções

### Solução 1: Reiniciar o Computador (RECOMENDADO)

**Esta é a solução mais confiável e definitiva.**

1. **Reinicie o computador** para limpar as variáveis corrompidas da memória
2. Após reiniciar, execute:
   ```powershell
   cd "C:\Users\Mateus\Desktop\Bora UI"
   pnpm install
   ```

---

### Solução 2: Instalar Sem Scripts (TEMPORÁRIO)

Se não puder reiniciar agora, instale as dependências pulando os scripts:

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI"
pnpm install --ignore-scripts
```

Depois, instale o husky manualmente (após reiniciar):

```powershell
npx husky install
```

---

### Solução 3: Limpar Variáveis Manualmente

1. Pressione `Win + R`
2. Digite: `sysdm.cpl`
3. Vá para aba **"Avançado"**
4. Clique em **"Variáveis de Ambiente"**
5. Em **"Variáveis do usuário"** e **"Variáveis do sistema"**:
   - Procure por TODAS as variáveis que começam com `npm_config`
   - Selecione cada uma e clique em **"Excluir"**
6. **Feche TODOS os terminais e aplicações**
7. Abra um **NOVO PowerShell** e tente novamente:
   ```powershell
   cd "C:\Users\Mateus\Desktop\Bora UI"
   pnpm install
   ```

---

### Solução 4: Desabilitar Husky Temporariamente

Se você não precisa do husky agora, pode desabilitá-lo temporariamente:

1. Edite `package.json` na raiz do projeto
2. Comente ou remova a linha:
   ```json
   "prepare": "husky install"
   ```
3. Execute `pnpm install`
4. Depois, quando resolver o problema, reative o husky

---

## 🔍 O Que é o Husky?

O **Husky** é uma ferramenta que gerencia Git hooks (scripts que executam automaticamente em eventos do Git, como commit, push, etc.).

### Por Que Está Falhando?

O husky tenta executar comandos durante a instalação, e esses comandos estão falhando devido às variáveis `npm_config` corrompidas que contêm bytes nulos (`\x00`).

---

## 📝 Scripts Modificados

Foi adicionado um script `postinstall` que tenta instalar o husky, mas não falha se der erro:

```json
"postinstall": "husky install || true"
```

Isso permite que o `pnpm install` complete mesmo se o husky falhar.

---

## ✅ Após Resolver

Depois de reiniciar o computador e resolver o problema das variáveis:

1. **Instale as dependências:**
   ```powershell
   pnpm install
   ```

2. **Instale o husky manualmente (se necessário):**
   ```powershell
   npx husky install
   ```

3. **Verifique se funcionou:**
   ```powershell
   # Verificar se o diretório .husky existe
   Test-Path .husky
   ```

---

## 🆘 Se Nada Funcionar

Se nenhuma das soluções acima funcionar:

1. **Reinicie o computador** (solução mais confiável)
2. **Ou** desabilite o husky temporariamente editando `package.json`
3. **Ou** use `pnpm install --ignore-scripts` para pular os scripts

---

## 📊 Status

- ✅ Script `postinstall` adicionado para não bloquear instalação
- ⏳ Aguardando reinicialização do sistema para resolver variáveis corrompidas
- ⏳ Husky será instalado automaticamente após resolver o problema

---

**🚀 RECOMENDAÇÃO: Reinicie o computador agora para resolver definitivamente!**

