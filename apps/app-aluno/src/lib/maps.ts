/**
 * Configuração do Maps (react-native-maps)
 * 
 * Compatível com Expo Dev Client
 * 
 * Para usar Google Maps (opcional):
 * 1. Obter API key em https://console.cloud.google.com/
 * 2. Adicionar EXPO_PUBLIC_GOOGLE_MAPS_API_KEY no arquivo .env
 */

import MapView, { PROVIDER_GOOGLE, PROVIDER_DEFAULT } from "react-native-maps";

// Configuração do provider (usa Google Maps se tiver API key, senão usa padrão do sistema)
export const MAP_PROVIDER = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
  ? PROVIDER_GOOGLE
  : PROVIDER_DEFAULT;

// Estilos de mapa customizados para Google Maps
export const MAP_STYLES = {
  // Tema escuro moderno (inspirado no Uber/99)
  dark: [
    {
      elementType: "geometry",
      stylers: [{ color: "#1a1a1a" }],
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#8a8a8a" }],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#1a1a1a" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [{ color: "#2a2a2a" }],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [{ color: "#2c2c2c" }],
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [{ color: "#373737" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#3c3c3c" }],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry",
      stylers: [{ color: "#4e4e4e" }],
    },
    {
      featureType: "road.local",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#0e1626" }],
    },
    {
      featureType: "water",
      elementType: "labels.text",
      stylers: [{ visibility: "off" }],
    },
  ],
  // Tema claro limpo (inspirado no Google Maps moderno)
  light: [
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "road.local",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      stylers: [{ visibility: "off" }],
    },
  ],
  // Tema padrão (sem customização)
  standard: [],
};

// Exportar MapView como padrão
export { MapView };
export default MapView;
