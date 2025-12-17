# 🔧 Solução para ERR_INVALID_ARG_VALUE

Este erro geralmente ocorre no Windows quando há variáveis de ambiente `npm_config_*` corrompidas ou quando o pnpm tenta executar scripts com variáveis inválidas.

## Solução Rápida

### Opção 1: Usar o script PowerShell (recomendado)

```powershell
cd apps/app-aluno
.\install-bottom-sheet.ps1
```

### Opção 2: Limpeza manual

Execute no PowerShell (como Administrador, se necessário):

```powershell
# 1. Limpar variáveis npm_config
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config_*" } | ForEach-Object {
    Remove-Item "Env:$($_.Name)"
}

# 2. Limpar cache do pnpm
pnpm store prune

# 3. Instalar dependências (ignorando scripts que podem causar o erro)
cd apps/app-aluno
pnpm install --ignore-scripts
```

### Opção 3: Usar npm temporariamente

Se o pnpm continuar falhando, você pode usar npm temporariamente:

```powershell
# Limpar variáveis
Remove-Item Env:npm_config_*

# Instalar com npm
cd apps/app-aluno
npm install
```

**Nota:** Depois de instalar, você pode voltar a usar pnpm normalmente.

## Verificar se funcionou

Após instalar, verifique se as dependências foram instaladas:

```powershell
# Verificar se as dependências estão no node_modules
Test-Path "node_modules/@gorhom/bottom-sheet"
Test-Path "node_modules/react-native-gesture-handler"
Test-Path "node_modules/react-native-reanimated"
```

Se todos retornarem `True`, as dependências foram instaladas com sucesso!

## Próximos passos

1. Limpar cache do Metro:
   ```bash
   npx expo start --clear
   ```

2. Testar o app:
   ```bash
   npx expo start
   ```

## Se o erro persistir

1. **Reinicie o terminal** e tente novamente
2. **Reinicie o computador** (às vezes variáveis de ambiente ficam em cache)
3. **Verifique permissões**: Execute o PowerShell como Administrador
4. **Use npm**: Como alternativa temporária, use `npm install` em vez de `pnpm install`

