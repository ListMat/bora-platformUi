# 🗺️ Soluções para react-native-maps no Expo

**Problema:** `react-native-maps` requer código nativo e não funciona no Expo Go

---

## 📋 Opções Disponíveis

### ✅ Opção 1: Expo Dev Client (RECOMENDADO)

**Descrição:** Criar um build customizado do Expo que inclui código nativo

**Vantagens:**
- ✅ Mantém todas as funcionalidades
- ✅ Usa react-native-maps completo
- ✅ Suporta outras bibliotecas nativas
- ✅ Mais próximo da produção

**Desvantagens:**
- ❌ Build inicial demora ~10 minutos
- ❌ Precisa rebuild após mudanças em dependências nativas
- ❌ Não funciona no Expo Go

**Como Implementar:**

```powershell
# 1. Instalar expo-dev-client
cd apps\app-aluno
pnpm add expo-dev-client

# 2. Adicionar ao app.json
```

```json
{
  "expo": {
    "plugins": [
      "expo-dev-client",  // ← Adicionar esta linha
      "expo-router",
      "expo-secure-store",
      // ... outros plugins
    ]
  }
}
```

```powershell
# 3. Fazer prebuild (gera pastas android/ e ios/)
npx expo prebuild

# 4. Rodar build nativo
npx expo run:android

# Para iOS (se tiver Mac)
npx expo run:ios
```

**Após o build inicial:**
- Mudanças em JS/TS: Hot reload funciona normalmente
- Mudanças em dependências nativas: Precisa `npx expo prebuild` novamente

---

### ✅ Opção 2: Expo Location + MapView Web

**Descrição:** Usar expo-location para coordenadas e exibir mapa via WebView

**Vantagens:**
- ✅ Funciona no Expo Go
- ✅ Não precisa build nativo
- ✅ Desenvolvimento rápido
- ✅ Usa APIs web de mapas (Google Maps JS, Mapbox, etc)

**Desvantagens:**
- ❌ Performance inferior a mapas nativos
- ❌ Menos recursos que react-native-maps
- ❌ Experiência de usuário pode ser inferior

**Como Implementar:**

```typescript
// components/MapView.tsx
import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';

interface MapViewProps {
  latitude: number;
  longitude: number;
  markers?: Array<{ lat: number; lng: number; title: string }>;
}

export function MapView({ latitude, longitude, markers = [] }: MapViewProps) {
  const mapHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
        <style>
          body, html, #map { margin: 0; padding: 0; height: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: ${latitude}, lng: ${longitude} },
            zoom: 15
          });
          
          ${markers.map(marker => `
            new google.maps.Marker({
              position: { lat: ${marker.lat}, lng: ${marker.lng} },
              map: map,
              title: '${marker.title}'
            });
          `).join('\n')}
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: mapHTML }}
        style={styles.map}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
```

**Uso:**
```typescript
import { MapView } from './components/MapView';

function MyScreen() {
  return (
    <MapView
      latitude={-23.5505}
      longitude={-46.6333}
      markers={[
        { lat: -23.5505, lng: -46.6333, title: 'São Paulo' }
      ]}
    />
  );
}
```

---

### ✅ Opção 3: Componente Condicional (Híbrido)

**Descrição:** Usar react-native-maps no build nativo e WebView no Expo Go

**Vantagens:**
- ✅ Melhor dos dois mundos
- ✅ Desenvolvimento rápido no Expo Go
- ✅ Produção com mapas nativos

**Desvantagens:**
- ❌ Código mais complexo
- ❌ Precisa manter duas implementações

**Como Implementar:**

```typescript
// components/AdaptiveMapView.tsx
import React from 'react';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Verificar se está rodando no Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Importação condicional
let NativeMapView: any;
if (!isExpoGo && Platform.OS !== 'web') {
  NativeMapView = require('react-native-maps').default;
}

import { WebMapView } from './WebMapView'; // Implementação web

interface MapViewProps {
  latitude: number;
  longitude: number;
  markers?: Array<{ lat: number; lng: number; title: string }>;
}

export function AdaptiveMapView(props: MapViewProps) {
  // Se for Expo Go ou Web, usar WebView
  if (isExpoGo || Platform.OS === 'web') {
    return <WebMapView {...props} />;
  }
  
  // Se for build nativo, usar react-native-maps
  return (
    <NativeMapView
      initialRegion={{
        latitude: props.latitude,
        longitude: props.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {props.markers?.map((marker, index) => (
        <NativeMapView.Marker
          key={index}
          coordinate={{ latitude: marker.lat, longitude: marker.lng }}
          title={marker.title}
        />
      ))}
    </NativeMapView>
  );
}
```

**Configuração do package.json:**
```json
{
  "dependencies": {
    "react-native-maps": "1.18.0"  // Manter
  },
  "optionalDependencies": {
    "react-native-maps": "1.18.0"  // Marcar como opcional
  }
}
```

---

### ✅ Opção 4: Remover Temporariamente

**Descrição:** Remover react-native-maps e focar em outras funcionalidades

**Vantagens:**
- ✅ Funciona no Expo Go imediatamente
- ✅ Sem complexidade adicional
- ✅ Foco em outras features primeiro

**Desvantagens:**
- ❌ Perde funcionalidade de mapas
- ❌ Precisa comentar/remover código relacionado

**Como Implementar:**

```powershell
# Remover dependência
cd apps\app-aluno
pnpm remove react-native-maps
```

**Comentar código que usa mapas:**
```typescript
// Antes
import MapView from 'react-native-maps';

function MyScreen() {
  return <MapView ... />;
}

// Depois
// import MapView from 'react-native-maps';
import { View, Text } from 'react-native';

function MyScreen() {
  return (
    <View>
      <Text>Mapa será implementado em breve</Text>
    </View>
  );
}
```

---

## 🎯 Qual Opção Escolher?

### Para Desenvolvimento Inicial
**Recomendação:** Opção 4 (Remover temporariamente)
- Foque em outras funcionalidades primeiro
- Adicione mapas depois quando estiver pronto

### Para Desenvolvimento Completo
**Recomendação:** Opção 1 (Expo Dev Client)
- Melhor experiência de usuário
- Todas as funcionalidades nativas
- Preparado para produção

### Para Prototipagem Rápida
**Recomendação:** Opção 2 (WebView)
- Funciona no Expo Go
- Demonstra funcionalidade
- Pode migrar para nativo depois

### Para Máxima Flexibilidade
**Recomendação:** Opção 3 (Híbrido)
- Desenvolvimento no Expo Go
- Produção com mapas nativos
- Melhor dos dois mundos

---

## 📦 Dependências Necessárias

### Opção 1 (Expo Dev Client)
```json
{
  "dependencies": {
    "expo-dev-client": "latest",
    "react-native-maps": "1.18.0"
  }
}
```

### Opção 2 (WebView)
```json
{
  "dependencies": {
    "react-native-webview": "latest",
    "expo-location": "~18.0.2"
  }
}
```

### Opção 3 (Híbrido)
```json
{
  "dependencies": {
    "expo-dev-client": "latest",
    "react-native-maps": "1.18.0",
    "react-native-webview": "latest",
    "expo-location": "~18.0.2",
    "expo-constants": "latest"
  }
}
```

### Opção 4 (Remover)
```json
{
  "dependencies": {
    // react-native-maps removido
  }
}
```

---

## 🔧 Configuração do app.json

### Para Opção 1 (Expo Dev Client)
```json
{
  "expo": {
    "plugins": [
      "expo-dev-client",  // ← Adicionar
      "expo-router",
      // ... outros
    ]
  }
}
```

### Para Opções 2, 3, 4
```json
{
  "expo": {
    "plugins": [
      "expo-router",
      // ... sem mudanças
    ]
  }
}
```

---

## 🚀 Comandos para Cada Opção

### Opção 1
```powershell
cd apps\app-aluno
pnpm add expo-dev-client
# Editar app.json
npx expo prebuild
npx expo run:android
```

### Opção 2
```powershell
cd apps\app-aluno
pnpm remove react-native-maps
pnpm add react-native-webview
# Implementar WebMapView
pnpm start
```

### Opção 3
```powershell
cd apps\app-aluno
pnpm add expo-dev-client react-native-webview expo-constants
# Implementar AdaptiveMapView
# Para Expo Go:
pnpm start
# Para build nativo:
npx expo prebuild
npx expo run:android
```

### Opção 4
```powershell
cd apps\app-aluno
pnpm remove react-native-maps
# Comentar código relacionado
pnpm start
```

---

## 💡 Recomendação Final

**Para este projeto BORA Aluno:**

1. **Curto prazo (agora):** Use Opção 4
   - Remova react-native-maps temporariamente
   - Foque em outras funcionalidades
   - Rode no Expo Go para desenvolvimento rápido

2. **Médio prazo (próximas semanas):** Migre para Opção 1
   - Quando outras features estiverem estáveis
   - Configure Expo Dev Client
   - Implemente mapas nativos corretamente

3. **Longo prazo (produção):** Opção 1 com EAS Build
   - Use EAS Build para builds de produção
   - Publique na Play Store / App Store
   - Mantenha Expo Dev Client para desenvolvimento

---

**Arquivo criado em:** 2025-12-29
**Mantido por:** Equipe BORA
