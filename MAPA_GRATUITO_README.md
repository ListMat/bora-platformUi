# 🗺️ Solução de Mapas Gratuitos (Sem Cartão de Crédito)

Substituímos o Google Maps por soluções **Open Source e Gratuitas** para garantir que você não precise cadastrar cartão de crédito ou pagar por uso de API.

## ✅ O que mudou?

### 🌐 Web (Navegador)
- **Antes:** Google Maps API (Necessitava chave paga/trial)
- **Agora:** **Leaflet + OpenStreetMap**
  - Totalmente gratuito
  - Sem limite de visualizações
  - Carrega rápido e leve

### 📱 Android
- **Antes:** Google Maps Native SDK (Necessitava chave na Cloud Platform)
- **Agora:** **React Native Maps + OpenStreetMap Tiles**
  - Usa tiles do OpenStreetMap via componente `<UrlTile>`
  - `mapType="none"` desativa o mapa de fundo do Google
  - Não requer chave de API do Google Maps para exibir o mapa

### 🍎 iOS (iPhone)
- **Mantido:** **Apple Maps**
  - Já é nativo e gratuito para uso em apps iOS.
  - Não requer configuração extra.

## 🛠️ Como Testar

### Web
```bash
pnpm expo start --web
```
Verifique o mapa em `http://localhost:8083`. Ele deve mostrar o estilo do OpenStreetMap.

### Android
```bash
pnpm expo run:android
```
O mapa deve carregar com os tiles do OSM. Se ficar cinza, verifique a conexão com a internet (tiles são baixados online).

## ⚠️ Dependências Instaladas

```json
{
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "@types/leaflet": "^1.9.8"
}
```

Dependências do Google Maps foram removidas (`@react-google-maps/api`).

## 💡 Dica

Se precisar de outras camadas de mapa (Satélite, Dark Mode), você pode trocar a URL do `UrlTile` ou `TileLayer`:
- **CartoDB Dark:** `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`
- **OpenStreetMap Standard:** `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
