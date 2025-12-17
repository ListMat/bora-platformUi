/**
 * Configuração do Mapbox
 * 
 * Para usar o Mapbox, você precisa:
 * 1. Obter um token em https://account.mapbox.com/access-tokens/
 * 2. Adicionar EXPO_PUBLIC_MAPBOX_TOKEN no arquivo .env
 */

import Mapbox from "@rnmapbox/maps";

// Inicializar Mapbox com o token
const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN;

if (MAPBOX_TOKEN) {
  Mapbox.setAccessToken(MAPBOX_TOKEN);
} else {
  console.warn(
    "[WARN] EXPO_PUBLIC_MAPBOX_TOKEN is not set. Mapbox will not work."
  );
  console.warn(
    "[WARN] Crie um arquivo .env na raiz de apps/app-aluno com: EXPO_PUBLIC_MAPBOX_TOKEN=pk.eyJ..."
  );
}

// Estilo dark mode para o mapa
export const DARK_MAP_STYLE = "mapbox://styles/mapbox/dark-v11";

// Estilo padrão
export const DEFAULT_MAP_STYLE = "mapbox://styles/mapbox/standard";

export default Mapbox;
