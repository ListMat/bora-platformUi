# 🪝 Instalação do Husky

## ⚠️ Problema Atual

O Husky **NÃO PODE** ser instalado devido a variáveis `npm_config` corrompidas no sistema Windows.

### Erro:
```
TypeError [ERR_INVALID_ARG_VALUE]: The property 'options.env['npm_config___i_g_n_o_r_e___w_o_r_k_s_p_a_c_e___r_o_o_t___c_h_e_c_k_']' must be a string without null bytes.
```

---

## ✅ Soluções

### Solução 1: Reiniciar o Computador (RECOMENDADO)

**Esta é a ÚNICA solução confiável.**

1. **Reinicie o computador** para limpar as variáveis corrompidas
2. Após reiniciar, execute:
   ```powershell
   cd "C:\Users\Mateus\Desktop\Bora UI"
   npx husky install
   ```

---

### Solução 2: Usar o Script PowerShell

Após reiniciar, use o script criado:

```powershell
.\instalar-husky.ps1
```

---

### Solução 3: Instalar Manualmente (Após Reiniciar)

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI"
npx husky install
```

---

## 📝 O Que Foi Feito

1. ✅ **Removido** o script `husky:install` do `package.json` (não funciona devido às variáveis corrompidas)
2. ✅ **Criado** script `instalar-husky.ps1` para instalação após reiniciar
3. ✅ **Documentado** o problema e soluções

---

## 🔍 O Que é o Husky?

O **Husky** é uma ferramenta que gerencia Git hooks (scripts que executam automaticamente em eventos do Git, como commit, push, etc.).

### É Crítico?

**NÃO!** O Husky é opcional e não é necessário para o funcionamento da aplicação. Ele apenas adiciona validações automáticas durante commits.

Você pode:
- ✅ Desenvolver normalmente sem o Husky
- ✅ Fazer commits sem problemas
- ✅ Instalar o Husky depois quando resolver o problema

---

## 🚀 Status Atual

- ❌ Husky **NÃO** instalado (devido a variáveis corrompidas)
- ✅ Aplicação funciona **NORMALMENTE** sem o Husky
- ⏳ Aguardando reinicialização do sistema para instalar

---

## 📋 Checklist

- [x] Script problemático removido do `package.json`
- [x] Script alternativo criado (`instalar-husky.ps1`)
- [x] Documentação criada
- [ ] Reiniciar computador (necessário)
- [ ] Instalar Husky após reiniciar (opcional)

---

## 🆘 Se Não Puder Reiniciar Agora

**Não se preocupe!** O Husky não é crítico. Você pode:

1. **Continuar desenvolvendo normalmente** - tudo funciona sem o Husky
2. **Fazer commits normalmente** - o Git funciona sem o Husky
3. **Instalar o Husky depois** - quando resolver o problema das variáveis

---

## ✅ Após Reiniciar

Execute:

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI"
npx husky install
```

Ou use o script:

```powershell
.\instalar-husky.ps1
```

---

**💡 Lembre-se: O Husky é opcional! Você pode continuar trabalhando normalmente sem ele.**

