# Solução: Expo Go Travado em "new update available, downloading"

## Problema
O Expo Go no Android está travado mostrando "new update available, downloading" e não carrega mais.

## Solução Rápida (No Celular)

### Opção 1: Limpar Cache do Expo Go (Mais Rápido)

1. Abra **Configurações** no seu Android
2. Vá em **Apps** ou **Aplicativos**
3. Procure e toque em **Expo Go**
4. Toque em **Armazenamento** ou **Armazenamento e cache**
5. Toque em **Limpar cache**
6. **Feche completamente o Expo Go** (remova dos apps recentes)
7. Abra o Expo Go novamente
8. Escaneie o QR code novamente

### Opção 2: Limpar Dados do Expo Go (Se Opção 1 não funcionar)

1. Siga os passos 1-4 da Opção 1
2. Toque em **Limpar dados** (você precisará fazer login novamente)
3. Abra o Expo Go e faça login
4. Escaneie o QR code novamente

### Opção 3: Reinstalar Expo Go (Último Recurso)

1. Desinstale o **Expo Go** da Play Store
2. Reinstale o **Expo Go**
3. Abra e escaneie o QR code

## No Computador

Certifique-se de que o Metro está rodando corretamente:

```powershell
# Limpar cache e reiniciar
cd apps\app-aluno
npx expo start --clear
```

Ou para o app-instrutor:

```powershell
cd apps\app-instrutor
npx expo start --clear --port 8082
```

## Por Que Isso Acontece?

O Expo Go tenta baixar atualizações automaticamente, mas:
- As atualizações já estão **desabilitadas** nos `app.json`
- O cache do Expo Go ainda tem informações antigas sobre atualizações
- Limpar o cache remove essas informações antigas

## Prevenção

As atualizações automáticas estão desabilitadas em:
- `apps/app-aluno/app.json`
- `apps/app-instrutor/app.json`

Com a configuração:
```json
"updates": {
  "enabled": false,
  "fallbackToCacheTimeout": 0
}
```

## Dica

Se o problema continuar aparecendo:
1. Limpe o cache do Expo Go regularmente
2. Use `npx expo start --clear` sempre que reiniciar o Metro
3. Certifique-se de que o celular e o computador estão na mesma rede Wi-Fi

