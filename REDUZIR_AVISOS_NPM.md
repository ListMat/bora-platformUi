# Como Reduzir Avisos do npm

## Problema

Você pode ver avisos como:
```
npm warn Unknown project config "ignore-workspace-root-check". This will stop working in the next major version of npm.
npm warn Unknown project config "". This will stop working in the next major version of npm.
```

## Causa

Esses avisos aparecem porque:
1. O projeto usa **pnpm** como gerenciador de pacotes
2. O arquivo `.npmrc` contém configurações específicas do pnpm (`ignore-workspace-root-check`)
3. Algumas ferramentas (como Expo CLI) chamam `npm` internamente, que não reconhece essas configurações

## Solução

### Opção 1: Limpar variáveis npm_config (Recomendado)

Antes de rodar comandos do Expo, execute:

```powershell
# Execute o script de limpeza
.\limpar-npm-config.ps1

# Ou execute diretamente:
Get-ChildItem Env: | Where-Object { $_.Name -like 'npm_config*' } | ForEach-Object { Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue }
```

### Opção 2: Ignorar os avisos (Mais simples)

Esses avisos são **inofensivos** e não afetam o funcionamento do projeto. Você pode simplesmente ignorá-los, pois:
- O projeto usa **pnpm**, não npm
- A configuração `ignore-workspace-root-check` é válida para pnpm
- O projeto funciona normalmente mesmo com esses avisos

### Opção 3: Criar um alias no PowerShell

Adicione ao seu perfil do PowerShell (`$PROFILE`):

```powershell
function Clear-NpmConfig {
    Get-ChildItem Env: | Where-Object { $_.Name -like 'npm_config*' } | 
        ForEach-Object { Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue }
}
```

Depois, execute `Clear-NpmConfig` antes de rodar comandos do Expo.

## Nota Importante

⚠️ **NÃO remova o arquivo `.npmrc`** - ele é necessário para o pnpm funcionar corretamente no monorepo!

