# 🗺️ Mapa Web - Localizar Instrutores Próximos

## 📍 Visão Geral

Mapa interativo estilo **Airbnb** para localizar instrutores de direção próximos, acessível via web sem necessidade de instalar app.

## 🚀 Acesso

- **URL Principal:** `http://localhost:3001/mapa`
- **Deep-link:** `http://localhost:3001/mapa?lat=-15.7801&lng=-47.9292`

## ✨ Funcionalidades

### 1. Mapa Interativo
- ✅ Google Maps JavaScript API
- ✅ Pins personalizados com foto do instrutor
- ✅ Info window com nota e preço
- ✅ Auto-fit de todos os pins
- ✅ Estilo customizado (cores neutras, sem POI)
- ✅ Geolocalização automática do usuário

### 2. Bottom Sheet
- ✅ Cards horizontais com swipe
- ✅ Snap points (200px / 400px)
- ✅ Sincronização com pins do mapa
- ✅ Botão "Ver disponibilidade"
- ✅ Responsivo (desktop e mobile)

### 3. Dados
- ✅ Mock data com 4 instrutores
- 🔄 Integração tRPC (preparado para produção)
- ✅ Loading states
- ✅ Empty states

## 🛠️ Configuração

### 1. Instalar Dependências

```bash
cd apps/web-site
pnpm install
```

### 2. Configurar Google Maps API

1. Acesse: https://console.cloud.google.com/google/maps-apis
2. Crie um projeto (ou use existente)
3. Ative a **Maps JavaScript API**
4. Crie uma chave de API
5. Configure restrições (opcional):
   - **Restrição de aplicativo:** HTTP referrers
   - **Domínios permitidos:** `localhost:3001`, `bora.app`

### 3. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar e adicionar sua chave
NEXT_PUBLIC_GOOGLE_MAPS_KEY=AIzaSy...
```

### 4. Rodar o Projeto

```bash
pnpm dev
```

Acesse: http://localhost:3001/mapa

## 📱 Responsividade

### Desktop
- Mapa: 100% da tela
- Bottom sheet: Sobreposto na parte inferior
- Cards: Scroll horizontal

### Mobile
- Mapa: 100% da tela
- Bottom sheet: Snap 200px (compacto) / 400px (expandido)
- Cards: Swipe horizontal com snap

## 🎨 Estilo

### Cores
- **Light mode:** Fundo branco, mapa cinza claro
- **Dark mode:** Fundo cinza escuro, mapa cinza

### Componentes
- **Mapa:** Estilo Airbnb (neutro, sem POI)
- **Cards:** Rounded 2xl, shadow-lg
- **Bottom sheet:** Rounded-t-3xl

## 🔗 Deep-linking

### Exemplos

```
# Abrir mapa centrado em Brasília
/mapa?lat=-15.7801&lng=-47.9292

# Abrir mapa centrado em São Paulo
/mapa?lat=-23.5505&lng=-46.6333
```

## 🎯 Próximos Passos

### Integração com Backend

Substituir mock data por tRPC:

```typescript
// Em MapPage.tsx
const { data: instructors } = trpc.instructor.nearby.useQuery({
  lat: userLat,
  lng: userLng,
  radiusKm: 5,
});
```

### Filtros Adicionais

- Preço (min/max)
- Avaliação mínima
- Tipo de veículo
- Tipo de aula

### Melhorias UX

- Clustering de pins (muitos instrutores próximos)
- Animações de transição
- Favoritos
- Compartilhar localização

## 📚 Tecnologias

- **Next.js 15** - App Router
- **React 18** - Componentes
- **Google Maps API** - Mapa interativo
- **Tailwind CSS** - Estilização
- **TypeScript** - Type safety

## 🎨 Acessibilidade

- ✅ `aria-label` em todos os botões
- ✅ `role="button"` nos cards
- ✅ Navegação por teclado (Tab)
- ✅ Cores com contraste adequado
- ✅ Textos descritivos

## 🐛 Troubleshooting

### Mapa não carrega
- Verifique se a chave do Google Maps está configurada
- Verifique se a API está ativada no console do Google
- Verifique o console do navegador para erros

### Geolocalização não funciona
- Permita acesso à localização no navegador
- Use HTTPS (ou localhost)
- Fallback para coordenadas padrão está ativo

### Cards não aparecem
- Verifique se há instrutores no array
- Verifique o console para erros
- Recarregue a página

## 📝 Licença

Projeto Bora - Plataforma de Aulas de Direção
