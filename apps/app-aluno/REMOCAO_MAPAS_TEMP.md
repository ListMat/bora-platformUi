# 🔧 Script: Remover Mapas Temporariamente

## Arquivos que usam react-native-maps:

1. `app/(tabs)/index.tsx` - linha 22
2. `app/screens/lessonLive.tsx` - linha 7  
3. `src/components/ExpandMapModal.tsx` - linha 19
4. `src/lib/maps.ts` - configuração

## Ações Realizadas:

✅ react-native-maps removido do package.json

## Próximos Passos:

Vou comentar temporariamente as seções de mapa nos arquivos acima.
Isso permitirá que o build funcione sem erros.

## Para Restaurar Mapas Depois:

```powershell
# 1. Reinstalar react-native-maps
pnpm add react-native-maps

# 2. Descomentar os imports e código
# 3. Fazer novo build
eas build --platform android --profile development
```

## Alternativa: Usar expo-location para mostrar localização

Podemos mostrar a localização do usuário sem mapas visuais,
apenas com coordenadas e distância calculada.
