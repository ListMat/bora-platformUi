# 🗺️ Configuração do Mapbox

Este app usa Mapbox em vez do Google Maps. Siga os passos abaixo para configurar.

## 1. Obter Token do Mapbox

1. Acesse [mapbox.com](https://www.mapbox.com)
2. Crie uma conta (ou faça login)
3. Vá em **Account** > **Access tokens**
4. Copie seu **Default public token** (ou crie um novo)

## 2. Configurar Variável de Ambiente

Crie ou edite o arquivo `.env` na raiz do projeto `apps/app-aluno`:

```env
EXPO_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImN...
```

**⚠️ Importante:** O token deve começar com `pk.` (public token)

## 3. Instalar Dependências

```bash
cd apps/app-aluno
pnpm install
```

## 4. Configurar app.json

O plugin do Mapbox já está configurado no `app.json`. O token no `app.json` é apenas para download dos SDKs nativos. O token real usado no app vem da variável de ambiente `EXPO_PUBLIC_MAPBOX_TOKEN`.

**Importante:** Você pode deixar `"YOUR_MAPBOX_TOKEN_HERE"` no `app.json` ou substituir pelo seu token. O importante é ter `EXPO_PUBLIC_MAPBOX_TOKEN` no `.env`.

## 5. Limpar Cache e Reinstalar

```bash
# Limpar cache do Metro
npx expo start --clear

# Se necessário, limpar build
npx expo prebuild --clean
```

## 6. Verificar Instalação

Após instalar, verifique se o Mapbox está funcionando:

1. Execute o app: `npx expo start`
2. Abra a tela Home (deve mostrar o mapa)
3. Se aparecer um erro sobre token, verifique o `.env`

## Troubleshooting

### Erro: "Mapbox token not found"
- Verifique se o `.env` existe e tem `EXPO_PUBLIC_MAPBOX_TOKEN`
- Reinicie o servidor Expo após adicionar a variável
- Certifique-se de que o token começa com `pk.`

### Erro: "Mapbox module not found"
- Execute `pnpm install` novamente
- Limpe o cache: `npx expo start --clear`
- Se usar desenvolvimento nativo: `npx expo prebuild --clean`

### Mapa não aparece
- Verifique se as permissões de localização estão ativas
- Verifique se o token está correto no `.env`
- Verifique os logs do console para erros específicos

## Diferenças do Google Maps

- **Estilo:** Mapbox usa estilos JSON em vez de `customMapStyle`
- **Markers:** Usa `PointAnnotation` em vez de `Marker`
- **Provider:** Não precisa de `PROVIDER_GOOGLE`
- **Performance:** Geralmente mais rápido e customizável

## Recursos

- [Documentação do @rnmapbox/maps](https://github.com/rnmapbox/maps)
- [Mapbox Style Editor](https://studio.mapbox.com/)
- [Mapbox Tokens](https://account.mapbox.com/access-tokens/)

