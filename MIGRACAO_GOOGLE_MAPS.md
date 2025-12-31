# 🗺️ Migração de Mapbox para Google Maps

## ✅ Mudanças Realizadas

### **1. Removido Mapbox**
- ❌ Arquivo `src/lib/mapbox.ts` removido
- ❌ Dependência `@rnmapbox/maps` não é mais necessária

### **2. Configurado Google Maps**
- ✅ Usando `react-native-maps` (compatível com Expo Go)
- ✅ Provider configurado para Google Maps
- ✅ Estilos customizados dark e light adicionados

### **3. Melhorias Visuais**
- 🎨 **Tema Dark Moderno**: Inspirado no Uber/99
  - Cores escuras elegantes (#1a1a1a, #2c2c2c)
  - Água em azul escuro (#0e1626)
  - POIs e labels desnecessários removidos
  
- 🎨 **Tema Light Limpo**: Inspirado no Google Maps moderno
  - Interface limpa sem poluição visual
  - Foco nas ruas e navegação

## 📋 Arquivos Modificados

### `src/lib/maps.ts`
- Adicionado estilos customizados `dark` e `light`
- Configuração automática do provider (Google ou padrão)
- 108 linhas de estilos de mapa profissionais

### `src/components/ExpandMapModal.tsx`
- Importado `MAP_STYLES`
- Aplicado `customMapStyle={MAP_STYLES.dark}` no MapView
- Mapa agora usa tema escuro moderno

## 🎯 Como Usar

### **Tema Dark (Atual)**
```tsx
<MapView
  provider={MAP_PROVIDER}
  customMapStyle={MAP_STYLES.dark}
  // ... outras props
/>
```

### **Tema Light**
```tsx
<MapView
  provider={MAP_PROVIDER}
  customMapStyle={MAP_STYLES.light}
  // ... outras props
/>
```

### **Tema Padrão (Sem customização)**
```tsx
<MapView
  provider={MAP_PROVIDER}
  customMapStyle={MAP_STYLES.standard}
  // ... outras props
/>
```

## 🔑 API Key do Google Maps (Opcional)

Para usar Google Maps explicitamente, adicione no `.env`:

```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=SUA_API_KEY_AQUI
```

**Como obter:**
1. Acesse: https://console.cloud.google.com/
2. Crie um projeto
3. Ative a API "Maps SDK for Android" e "Maps SDK for iOS"
4. Crie uma credencial (API Key)
5. Adicione no `.env`

**Nota:** Se não configurar a API key, o app usará o provider padrão do sistema (Apple Maps no iOS, Google Maps no Android).

## 🚀 Vantagens da Mudança

### **Antes (Mapbox)**
- ❌ Precisa de módulos nativos
- ❌ Não funciona no Expo Go
- ❌ Requer build customizado
- ❌ Token obrigatório

### **Depois (Google Maps)**
- ✅ Funciona no Expo Go
- ✅ Sem necessidade de build customizado
- ✅ API key opcional
- ✅ Estilos modernos e profissionais
- ✅ Melhor performance

## 🎨 Comparação Visual

### **Tema Dark**
- Background: `#1a1a1a` (preto suave)
- Ruas: `#2c2c2c` a `#4e4e4e` (gradiente de cinza)
- Água: `#0e1626` (azul escuro)
- Labels: `#8a8a8a` (cinza médio)

### **Tema Light**
- Cores padrão do Google Maps
- POIs de negócios removidos
- Labels de ruas locais removidos
- Interface limpa e minimalista

## 📱 Teste no Emulador

O app já está rodando com o novo tema dark! Você deve ver:
- Mapa com fundo escuro elegante
- Ruas em cinza claro
- Água em azul escuro
- Marcadores dos instrutores destacados

## 🔄 Próximos Passos

Se quiser adicionar mais customizações:

1. **Mudar para tema light:**
   - Edite `ExpandMapModal.tsx`
   - Troque `MAP_STYLES.dark` por `MAP_STYLES.light`

2. **Criar tema personalizado:**
   - Edite `src/lib/maps.ts`
   - Adicione um novo tema no objeto `MAP_STYLES`
   - Use o [Google Maps Styling Wizard](https://mapstyle.withgoogle.com/)

3. **Adicionar modo automático (dark/light):**
   - Use `useColorScheme()` do React Native
   - Alterne entre `MAP_STYLES.dark` e `MAP_STYLES.light`

---

**Criado em:** 22/12/2025
**Autor:** Antigravity Agent
