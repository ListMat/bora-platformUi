# Solução: "new update available" Persistente no Expo Go

## Problema

Mesmo após limpar cache e configurar `updates.enabled: false`, o Expo Go continua mostrando "new update available, downloading" e não carrega o app.

## Causa

O Expo Go pode estar verificando automaticamente por updates no servidor do Expo, mesmo com `enabled: false`. Isso acontece porque:

1. **Verificação automática** - O Expo Go verifica por updates mesmo quando desabilitado
2. **Updates publicados anteriormente** - Pode haver uma atualização publicada no servidor do Expo
3. **Configuração incompleta** - Falta `checkAutomatically: "NEVER"` para desabilitar completamente

## Solução Aplicada

Adicionada a configuração `checkAutomatically: "NEVER"` nos `app.json`:

```json
{
  "expo": {
    "updates": {
      "enabled": false,
      "checkAutomatically": "NEVER",
      "fallbackToCacheTimeout": 0
    }
  }
}
```

## Passos para Resolver

### 1. Verificar Configuração

Certifique-se de que ambos os `app.json` têm:

```json
"updates": {
  "enabled": false,
  "checkAutomatically": "NEVER",
  "fallbackToCacheTimeout": 0
}
```

### 2. Limpar Tudo e Reiniciar

```powershell
# Limpar cache do Expo
.\limpar-cache-expo.ps1

# Limpar cache do Expo Go no celular
# Configurações > Apps > Expo Go > Armazenamento > Limpar dados

# Reiniciar Metro
cd apps\app-aluno
npx expo start --clear --localhost
```

### 3. No Expo Go (Celular)

1. **Desinstale completamente o Expo Go**
2. **Reinstale o Expo Go** da Play Store
3. **Abra o Expo Go** (não escaneie ainda)
4. **Limpe o cache** do Expo Go: Configurações > Apps > Expo Go > Armazenamento > Limpar dados
5. **Feche completamente o Expo Go**
6. **Abra novamente** e escaneie o QR code

### 4. Usar Development Build (Alternativa)

Se o problema persistir, use um Development Build ao invés do Expo Go:

```powershell
cd apps\app-aluno
npx expo prebuild
npx expo run:android
```

Isso cria um build local que não verifica updates do servidor do Expo.

## Configurações de Updates Disponíveis

### `checkAutomatically` - Opções:

- `"NEVER"` - Nunca verifica automaticamente (recomendado para desenvolvimento)
- `"ON_ERROR_RECOVERY"` - Verifica apenas quando há erro
- `"ON_LOAD"` - Verifica quando o app carrega
- `"WIFI_ONLY"` - Verifica apenas em Wi-Fi

### Para Desenvolvimento Local:

```json
{
  "updates": {
    "enabled": false,
    "checkAutomatically": "NEVER",
    "fallbackToCacheTimeout": 0
  }
}
```

## Verificar se Funcionou

Após aplicar as mudanças:

1. **Reinicie o Metro** com `--clear`
2. **No Expo Go**, feche completamente e abra novamente
3. **Escaneie o QR code**
4. **Aguarde carregar** - não deve aparecer "new update available"

## Se Ainda Não Funcionar

### Opção 1: Usar Tunnel

O tunnel pode evitar problemas de rede:

```powershell
cd apps\app-aluno
npx expo start --clear --tunnel
```

### Opção 2: Desabilitar Updates no Código

Adicione no início do `app/_layout.tsx`:

```typescript
import * as Updates from 'expo-updates';

// Desabilitar updates completamente
if (__DEV__) {
  Updates.checkForUpdateAsync = async () => ({ isAvailable: false });
  Updates.fetchUpdateAsync = async () => ({ isNew: false });
}
```

**Nota**: Isso requer instalar `expo-updates`:
```powershell
npx expo install expo-updates
```

### Opção 3: Usar Development Build

O Development Build não verifica updates do servidor do Expo:

```powershell
cd apps\app-aluno
npx expo prebuild
npx expo run:android
```

## Prevenção

1. ✅ **Sempre use `checkAutomatically: "NEVER"`** em desenvolvimento
2. ✅ **Limpe cache regularmente** do Expo Go
3. ✅ **Use Development Build** para testes completos
4. ✅ **Não publique updates** durante desenvolvimento

## Status da Configuração

✅ **Configuração atualizada** em:
- `apps/app-aluno/app.json` - `checkAutomatically: "NEVER"`
- `apps/app-instrutor/app.json` - `checkAutomatically: "NEVER"`

✅ **Próximos passos**:
1. Limpar cache do Expo Go no celular
2. Reiniciar Metro com `--clear`
3. Testar novamente

