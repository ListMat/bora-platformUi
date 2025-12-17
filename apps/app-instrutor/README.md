# 📱 App Instrutor - BORA

Aplicativo mobile para instrutores de autoescola.

## 🚀 Como Rodar

### Problema Conhecido no Windows

Se você encontrar o erro:
```
ERR_INVALID_ARG_VALUE: The property 'options.env['npm_config_...']' must be a string without null bytes
```

Isso é causado por variáveis de ambiente corrompidas no Windows. Use uma das soluções abaixo:

### ✅ Solução Rápida (Recomendada)

**Opção 1: Usar o script PowerShell**
```powershell
cd "C:\Users\Mateus\Desktop\Bora UI\apps\app-instrutor"
.\start.ps1
```

**Opção 2: Usar npm diretamente**
```powershell
cd "C:\Users\Mateus\Desktop\Bora UI\apps\app-instrutor"
npm start
```

**Opção 3: Limpar variáveis e usar npx**
```powershell
cd "C:\Users\Mateus\Desktop\Bora UI\apps\app-instrutor"

# Limpar variáveis problemáticas
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config_*" } | ForEach-Object {
    Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue
}

# Executar Expo diretamente
npx expo start
```

### 🔧 Solução Permanente

Para resolver o problema permanentemente, execute no PowerShell como **Administrador**:

```powershell
# Remover variáveis npm_config do sistema
Get-ChildItem Env: | Where-Object { $_.Name -like "npm_config_*" } | ForEach-Object {
    [Environment]::SetEnvironmentVariable($_.Name, $null, "User")
    [Environment]::SetEnvironmentVariable($_.Name, $null, "Machine")
}

# Reiniciar o PowerShell e tentar novamente
cd "C:\Users\Mateus\Desktop\Bora UI\apps\app-instrutor"
pnpm start
```

## 📋 Comandos Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm start          # ou pnpm start (se o problema estiver resolvido)

# Rodar no Android
npm run android    # ou pnpm android

# Rodar no iOS (apenas macOS)
npm run ios        # ou pnpm ios

# Rodar no navegador
npm run web        # ou pnpm web

# Limpar cache
npm start -- --clear
```

## 🔗 Links Úteis

- [Documentação Expo](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Solução de Problemas](./FIX_INSTALL.md)

## 📦 Dependências Principais

- `expo` - Framework React Native
- `expo-router` - Roteamento baseado em arquivos
- `@trpc/react-query` - Cliente tRPC
- `expo-notifications` - Notificações push
- `expo-location` - Geolocalização
- `react-native-qrcode-svg` - Geração de QR Codes

## 🐛 Troubleshooting

### Erro: "Missing script start"
- Certifique-se de estar no diretório `apps/app-instrutor`
- Verifique se o `package.json` contém o script `start`

### Erro: "Cannot find module"
- Execute `npm install` ou `pnpm install` na raiz do projeto
- Limpe o cache: `npm start -- --clear`

### Expo não abre
- Verifique se o backend está rodando (porta 3000)
- Confirme que `EXPO_PUBLIC_API_URL` está configurada no `.env`

