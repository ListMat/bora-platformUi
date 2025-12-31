# Solução: "No compatible apps connected, React Native DevTools can only be used with Hermes"

## Problema

Ao tentar abrir o debugger do React Native, aparece o erro:
```
Debug: No compatible apps connected, React Native DevTools can only be used with Hermes.
```

## Causas Possíveis

1. **Expo Go não está detectando Hermes** - Cache antigo ou app não recarregado
2. **Conexão com o servidor de desenvolvimento** - Metro não está acessível
3. **Configuração não aplicada** - Mudanças no `app.json` não foram carregadas

## Soluções (Tente na Ordem)

### Solução 1: Recarregar o App Completamente

1. **No terminal do Metro**, pressione `r` para recarregar
2. **No Expo Go**, feche completamente o app (remova dos apps recentes)
3. **Abra o Expo Go novamente** e escaneie o QR code
4. **Aguarde o app carregar completamente**
5. **Tente abrir o debugger novamente** (pressione `j` no terminal)

### Solução 2: Limpar Cache e Reiniciar

```powershell
# Parar o Metro (Ctrl+C)

# Limpar cache do Expo
cd apps\app-aluno  # ou app-instrutor
npx expo start --clear

# Aguarde o Metro iniciar completamente
# Escaneie o QR code novamente
# Tente abrir o debugger (pressione 'j')
```

### Solução 3: Verificar Conexão com Metro

Execute no terminal:

```powershell
curl http://127.0.0.1:8081/json/list
```

**Resultado esperado**: Uma lista JSON com informações sobre o app conectado, incluindo `"vm": "Hermes"`

**Se retornar vazio ou erro**:
- Adicione `--localhost` ao comando de start:
  ```powershell
  npx expo start --clear --localhost
  ```

**Se ainda não funcionar**, tente `--tunnel`:
  ```powershell
  npx expo start --clear --tunnel
  ```

### Solução 4: Verificar Configuração do Hermes

Certifique-se de que o `app.json` tem:

```json
{
  "expo": {
    "jsEngine": "hermes",
    // ... outras configurações
  }
}
```

Depois de verificar:
1. Pare o Metro (Ctrl+C)
2. Limpe o cache: `npx expo start --clear`
3. Recarregue o app no Expo Go

### Solução 5: Usar Menu de Desenvolvedor do Expo Go

1. **No Expo Go**, agite o celular (shake gesture)
2. Toque em **"Open JS Debugger"** no menu
3. Isso deve abrir o Chrome DevTools automaticamente

### Solução 6: Verificar Versão do Expo Go

O Expo Go precisa ser atualizado para a versão mais recente:

1. Abra a **Play Store** (Android) ou **App Store** (iOS)
2. Procure por **Expo Go**
3. Atualize para a versão mais recente
4. Abra o Expo Go novamente

## Verificar se Hermes Está Funcionando

### Método 1: Verificar via Metro Inspector

```powershell
curl http://127.0.0.1:8081/json/list
```

Procure por:
```json
{
  "vm": "Hermes",
  "title": "Hermes ABI47_0_0React Native"
}
```

### Método 2: Verificar no Console do App

Adicione temporariamente no código:

```typescript
console.log('Hermes:', typeof HermesInternal !== 'undefined' ? 'Enabled' : 'Disabled');
```

Se mostrar `Hermes: Enabled`, o Hermes está funcionando.

## Configuração Recomendada para Debugging

Scripts de debugging já foram adicionados aos `package.json`:

### App Aluno
```powershell
cd apps\app-aluno
pnpm start:debug
```

**Nota**: O script `start:debug` agora limpa automaticamente as variáveis `npm_config` corrompidas antes de iniciar.

### App Instrutor
```powershell
cd apps\app-instrutor
pnpm start:debug
```

**Nota**: O script `start:debug` agora limpa automaticamente as variáveis `npm_config` corrompidas antes de iniciar.

### Alternativa: Executar Diretamente (se o script não funcionar)

Se o script PowerShell não funcionar, você pode limpar manualmente e usar o script direto:

```powershell
# Limpar variáveis npm_config
Get-ChildItem Env: | Where-Object { $_.Name -like 'npm_config*' } | ForEach-Object { Remove-Item "Env:\$($_.Name)" -ErrorAction SilentlyContinue }

# Depois executar
cd apps\app-aluno
pnpm start:debug:direct
```

### Verificar Status do Hermes

Execute o script de verificação:
```powershell
.\verificar-hermes.ps1
```

Ou para verificar uma porta específica:
```powershell
.\verificar-hermes.ps1 -Port 8082
```

## Troubleshooting Avançado

### Se Nada Funcionar

1. **Desinstale e reinstale o Expo Go** no celular
2. **Limpe todos os caches**:
   ```powershell
   .\limpar-cache-expo.ps1
   ```
3. **Reinicie o computador**
4. **Inicie o Metro novamente**:
   ```powershell
   cd apps\app-aluno
   npx expo start --clear --localhost
   ```

### Verificar Logs do Metro

No terminal do Metro, você deve ver mensagens como:
```
Metro waiting on exp://192.168.x.x:8081
```

Se não aparecer, verifique:
- Firewall não está bloqueando a porta 8081
- Celular e computador estão na mesma rede Wi-Fi
- VPN não está interferindo

## Referências

- [Documentação Expo - Using Hermes](https://docs.expo.dev/guides/using-hermes/)
- [Troubleshooting React Native Debugger](https://reactnative.dev/docs/debugging)

## Status da Configuração

✅ **Hermes configurado** em:
- `apps/app-aluno/app.json` - `"jsEngine": "hermes"`
- `apps/app-instrutor/app.json` - `"jsEngine": "hermes"`

✅ **Próximos passos**:
1. Limpar cache
2. Recarregar app no Expo Go
3. Verificar conexão com Metro
4. Tentar abrir debugger novamente

## Resumo Rápido - Solução em 3 Passos

### Passo 1: Limpar e Reiniciar
```powershell
cd apps\app-aluno
pnpm start:debug
```

### Passo 2: Verificar Hermes
```powershell
.\verificar-hermes.ps1
```

### Passo 3: Abrir Debugger
- **No terminal do Metro**: Pressione `j`
- **No Expo Go**: Shake gesture > "Open JS Debugger"

Se o `verificar-hermes.ps1` mostrar que Hermes está ativo, o debugger deve funcionar!

## Scripts Disponíveis

✅ **Scripts adicionados aos package.json**:
- `pnpm start:debug` - Inicia com cache limpo e localhost
- `pnpm start:tunnel` - Inicia com tunnel (útil se localhost não funcionar)

✅ **Scripts PowerShell**:
- `.\verificar-hermes.ps1` - Verifica se Hermes está funcionando
- `.\limpar-cache-expo.ps1` - Limpa todos os caches do Expo

