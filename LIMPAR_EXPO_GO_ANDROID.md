# Como Limpar o Cache do Expo Go no Android

## Problema
O Expo Go está mostrando "new update available, downloading" e não carrega mais o app.

## Solução

### Método 1: Limpar Cache do App (Recomendado)

1. **Abra as Configurações do Android** no seu celular
2. Vá em **Apps** ou **Aplicativos**
3. Procure por **Expo Go**
4. Toque em **Expo Go**
5. Toque em **Armazenamento** ou **Armazenamento e cache**
6. Toque em **Limpar cache**
7. (Opcional) Se não funcionar, toque em **Limpar dados** (isso vai fazer você precisar fazer login novamente)

### Método 2: Desinstalar e Reinstalar o Expo Go

1. Desinstale o **Expo Go** do seu celular
2. Reinstale o **Expo Go** da Play Store
3. Abra o Expo Go novamente
4. Escaneie o QR code novamente

### Método 3: Limpar Cache do Metro/Expo no Computador

Execute no terminal do projeto:

```powershell
# Limpar cache do Expo
.\limpar-cache-expo.ps1

# Reiniciar o Expo com cache limpo
cd apps\app-aluno
npx expo start --clear
```

### Método 4: Forçar Recarregamento no Expo Go

1. Abra o **Expo Go** no celular
2. Agite o celular (shake gesture)
3. Toque em **Reload** ou **Recarregar**

Ou pressione `r` no terminal onde o Metro está rodando para recarregar.

## Prevenção

As atualizações automáticas já estão desabilitadas nos arquivos `app.json`:
- `apps/app-aluno/app.json`
- `apps/app-instrutor/app.json`

Com a configuração:
```json
"updates": {
  "enabled": false,
  "fallbackToCacheTimeout": 0
}
```

## Se o Problema Persistir

1. **Feche completamente o Expo Go** (remova dos apps recentes)
2. **Limpe o cache** (Método 1)
3. **Reinicie o celular**
4. **Reinicie o Metro Bundler** no computador com `--clear`
5. **Escaneie o QR code novamente**

## Dica Extra

Se você estiver usando o mesmo projeto em múltiplos dispositivos, certifique-se de que todos estão usando a mesma versão do Expo Go e que o Metro Bundler está rodando corretamente.

