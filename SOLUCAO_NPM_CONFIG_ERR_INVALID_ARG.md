# Solução: ERR_INVALID_ARG_VALUE - npm_config com null bytes

## Problema

Erro ao executar comandos do Expo/pnpm:
```
TypeError [ERR_INVALID_ARG_VALUE]: The property 'options.env['npm_config___i_g_n_o_r_e___w_o_r_k_s_p_a_c_e___r_o_o_t___c_h_e_c_k_']' must be a string without null bytes. Received '\x00t\x00r\x00u\x00e\x00'
```

## Causa

Variáveis de ambiente `npm_config*` no Windows estão corrompidas com **null bytes** (`\x00`). Isso acontece quando:
- Variáveis são definidas incorretamente
- Encoding incorreto ao definir variáveis
- Problemas com scripts que modificam variáveis de ambiente

## Solução Rápida

### Opção 1: Usar Scripts com Limpeza Automática (Recomendado)

Os scripts `start:debug` agora limpam automaticamente as variáveis antes de executar:

```powershell
cd apps\app-aluno
pnpm start:debug
```

### Opção 2: Limpar Manualmente Antes de Executar

Execute antes de qualquer comando do Expo/pnpm:

```powershell
# Limpar todas as variáveis npm_config
Get-ChildItem Env: | Where-Object { $_.Name -like 'npm_config*' } | ForEach-Object { 
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue 
}

# Depois execute seu comando normalmente
cd apps\app-aluno
npx expo start --clear
```

### Opção 3: Usar o Script de Limpeza

```powershell
.\limpar-npm-config.ps1
```

Depois execute seus comandos normalmente.

## Solução Permanente

### Método 1: Remover do Sistema (Recomendado)

1. Abra **Configurações do Windows**
2. Vá em **Sistema** > **Informações do sistema** > **Configurações avançadas do sistema**
3. Clique em **Variáveis de ambiente**
4. Em **Variáveis do sistema**, procure por variáveis que começam com `npm_config`
5. **Delete todas** as variáveis `npm_config*`
6. Clique em **OK** e **reinicie o computador**

### Método 2: Criar um Alias no PowerShell

Adicione ao seu perfil do PowerShell (`$PROFILE`):

```powershell
function Clear-NpmConfig {
    Get-ChildItem Env: | Where-Object { $_.Name -like 'npm_config*' } | 
        ForEach-Object { Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue }
    Write-Host "Variáveis npm_config limpas!" -ForegroundColor Green
}
```

Depois, sempre que precisar:
```powershell
Clear-NpmConfig
```

### Método 3: Usar CMD ao Invés de PowerShell

O CMD não tem o mesmo problema. Você pode usar:

```cmd
cd apps\app-aluno
npx expo start --clear
```

## Scripts Atualizados

✅ **Scripts que agora limpam automaticamente**:
- `apps/app-aluno/start-debug.ps1` - Limpa antes de iniciar
- `apps/app-instrutor/start-debug.ps1` - Limpa antes de iniciar
- `limpar-npm-config.ps1` - Script dedicado para limpeza

## Verificar se Está Limpo

Execute para verificar se há variáveis npm_config:

```powershell
Get-ChildItem Env: | Where-Object { $_.Name -like 'npm_config*' }
```

**Resultado esperado**: Nenhuma variável encontrada

## Prevenção

1. **Não defina variáveis npm_config manualmente** no sistema
2. **Use scripts** que limpam antes de executar
3. **Reinicie o computador** após remover variáveis do sistema
4. **Use CMD** se o problema persistir no PowerShell

## Referências

- [Node.js Issue - ERR_INVALID_ARG_VALUE](https://github.com/nodejs/node/issues)
- [pnpm Environment Variables](https://pnpm.io/npmrc#environment-variables)

