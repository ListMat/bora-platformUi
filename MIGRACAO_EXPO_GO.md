# 🔄 Migração para Expo Go - Substituindo Mapbox e Stripe

## 📋 Resumo

Este documento descreve a migração de módulos nativos para alternativas compatíveis com Expo Go:

- **Mapbox** (`@rnmapbox/maps`) → **react-native-maps** (compatível com Expo Go)
- **Stripe React Native** (`@stripe/stripe-react-native`) → **Stripe Checkout Web** (via WebView)

---

## 🗺️ 1. Migração do Mapbox

### O que está sendo substituído:
- `@rnmapbox/maps` → `react-native-maps`
- Componentes: `Mapbox.MapView`, `Camera`, `PointAnnotation`

### O que muda:
- ✅ Funciona com Expo Go
- ✅ Não precisa de configuração nativa
- ✅ API similar, mas com algumas diferenças

### Arquivos afetados:
- `apps/app-aluno/src/lib/mapbox.ts` → `apps/app-aluno/src/lib/maps.ts`
- `apps/app-aluno/app/(tabs)/index.tsx`
- `apps/app-aluno/app/screens/lessonLive.tsx`
- `apps/app-aluno/src/components/ExpandMapModal.tsx`
- `apps/app-aluno/app/_layout.tsx` (remover import do mapbox)

---

## 💳 2. Migração do Stripe

### O que está sendo substituído:
- `@stripe/stripe-react-native` → Stripe Checkout Web (via WebView)
- `useStripe()`, `initPaymentSheet()`, `presentPaymentSheet()`

### O que muda:
- ✅ Funciona com Expo Go
- ✅ Usa WebView para abrir checkout do Stripe
- ✅ Backend cria Checkout Session e retorna URL
- ✅ App abre URL no WebView ou browser

### Arquivos afetados:
- `apps/app-aluno/app/screens/paymentSheet.tsx`
- `apps/app-aluno/app/screens/bundlePayment.tsx`
- `apps/app-aluno/app/_layout.tsx` (remover StripeProvider)
- `packages/api/src/routers/payment.ts` (adicionar endpoint para checkout session)
- `packages/api/src/routers/bundle.ts` (adicionar endpoint para checkout session)

---

## 📦 3. Dependências

### Remover:
```json
"@rnmapbox/maps": "^10.1.18",
"@stripe/stripe-react-native": "^0.37.2"
```

### Adicionar:
```json
"react-native-maps": "1.20.1",
"expo-web-browser": "~14.0.1"
```

---

## 🔧 4. Configuração do app.json

### Remover plugins:
```json
{
  "plugins": [
    // Remover:
    // "@rnmapbox/maps",
    // "@stripe/stripe-react-native"
  ]
}
```

---

## ✅ 5. Checklist de Migração

- [ ] Instalar `react-native-maps` e `expo-web-browser`
- [ ] Remover `@rnmapbox/maps` e `@stripe/stripe-react-native`
- [ ] Criar novo arquivo `src/lib/maps.ts` com react-native-maps
- [ ] Atualizar `app/(tabs)/index.tsx` para usar react-native-maps
- [ ] Atualizar `app/screens/lessonLive.tsx` para usar react-native-maps
- [ ] Atualizar `src/components/ExpandMapModal.tsx` para usar react-native-maps
- [ ] Remover import do mapbox em `app/_layout.tsx`
- [ ] Atualizar `app/screens/paymentSheet.tsx` para usar WebView
- [ ] Atualizar `app/screens/bundlePayment.tsx` para usar WebView
- [ ] Remover `StripeProvider` de `app/_layout.tsx`
- [ ] Adicionar endpoints de checkout no backend
- [ ] Atualizar `app.json` removendo plugins nativos
- [ ] Testar no Expo Go

---

## 🚀 6. Próximos Passos

Após a migração:
1. Testar mapas no Expo Go
2. Testar pagamentos no Expo Go
3. Atualizar documentação
4. Remover variáveis de ambiente do Mapbox (opcional)

---

**Status**: Em progresso ⏳

