# 🔧 Solução para Erro de Instalação no Windows

## Problema

Erro ao instalar dependências:
```
ERR_INVALID_ARG_VALUE: The property 'options.env['npm_config___i_g_n_o_r_e___w_o_r_k_s_p_a_c_e___r_o_o_t___c_h_e_c_k_']' must be a string without null bytes
```

Este é um problema conhecido do pnpm no Windows com variáveis de ambiente corrompidas.

## Solução 1: Limpar Variáveis de Ambiente (Recomendado)

Execute no PowerShell como Administrador:

```powershell
# 1. Remover todas as variáveis npm_config problemáticas
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config_*" } | ForEach-Object {
    [Environment]::SetEnvironmentVariable($_.Name, $null, "User")
    [Environment]::SetEnvironmentVariable($_.Name, $null, "Machine")
}

# 2. Reiniciar o PowerShell e tentar novamente
cd "C:\Users\Mateus\Desktop\Bora UI"
pnpm install
```

## Solução 2: Usar npm temporariamente

Se o problema persistir, use npm para instalar as dependências específicas:

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI\apps\app-instrutor"
npm install expo-device@~6.0.2
npm install expo-notifications@~0.28.19
npm install react-native-qrcode-svg@^6.3.0
npm install react-native-svg@^15.2.0
```

Depois volte para pnpm na raiz:
```powershell
cd "C:\Users\Mateus\Desktop\Bora UI"
pnpm install --ignore-scripts
```

## Solução 3: Pular Scripts de Postinstall

Instale pulando os scripts de postinstall que causam o problema:

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI"
pnpm install --ignore-scripts
```

Depois, se necessário, execute os scripts manualmente:
```powershell
cd node_modules/esbuild
node install.js
```

## Solução 4: Atualizar pnpm

O problema pode ser resolvido atualizando o pnpm:

```powershell
npm install -g pnpm@latest
pnpm install
```

## Verificação

Após aplicar uma das soluções, verifique se as dependências foram instaladas:

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI\apps\app-instrutor"
pnpm list expo-notifications react-native-qrcode-svg
```

Se aparecerem nas listas, a instalação foi bem-sucedida!

## ✅ Solução Aplicada (Funcionou!)

As dependências foram instaladas com sucesso usando:

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI"
pnpm install --ignore-scripts
pnpm add expo-device@~6.0.2 expo-notifications@~0.28.19 react-native-qrcode-svg@^6.3.0 react-native-svg@^15.2.0 --filter app-instrutor --ignore-scripts
```

**Status:** ✅ Todas as dependências instaladas com sucesso!

- ✅ `expo-device@~6.0.2`
- ✅ `expo-notifications@~0.28.19`
- ✅ `react-native-qrcode-svg@^6.3.21`
- ✅ `react-native-svg@^15.15.1`

**Nota:** O flag `--ignore-scripts` evita o erro com variáveis de ambiente corrompidas. Isso não afeta o funcionamento das bibliotecas.

## 🚀 Como Rodar o App

Devido ao problema com variáveis de ambiente, use uma das opções abaixo:

### ⭐ Opção 1: Usar o script start.ps1 (Recomendado)

O script `start.ps1` limpa automaticamente as variáveis problemáticas antes de iniciar:

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI\apps\app-instrutor"
.\start.ps1
```

### 🔧 Opção 2: Limpeza Permanente (Recomendado para resolver definitivamente)

Execute o script de limpeza permanente (como Administrador para limpar do sistema):

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI\apps\app-instrutor"

# Executar como Administrador (clique com botão direito > Executar como Administrador)
.\fix-env-vars.ps1
```

Depois, feche e reabra o PowerShell e use:

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI\apps\app-instrutor"
.\start.ps1
```

### Opção 3: Executar Expo diretamente (sem pnpm)

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI\apps\app-instrutor"

# Limpar variáveis problemáticas
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config_*" } | ForEach-Object {
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue
}

# Executar Expo diretamente
npx --yes expo start --clear
```

### Opção 4: Usar npm em vez de pnpm

```powershell
cd "C:\Users\Mateus\Desktop\Bora UI\apps\app-instrutor"
npm start
```

