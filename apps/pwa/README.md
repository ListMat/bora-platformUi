# Bora PWA - Progressive Web App

Um Progressive Web App moderno e completo para a plataforma Bora de aulas de direção.

## 🚀 Recursos PWA Implementados

### ✅ Funcionalidades Core
- **Service Worker** - Cache inteligente e funcionalidade offline
- **Manifest** - Configuração completa para instalação
- **Ícones** - Múltiplos tamanhos para diferentes dispositivos
- **Splash Screens** - Telas de carregamento customizadas
- **Instalável** - Pode ser adicionado à tela inicial
- **Offline First** - Funciona sem conexão à internet

### 🎨 Experiência do Usuário
- **Install Prompt** - Prompt elegante para instalação
- **Offline Indicator** - Notificação de status de conexão
- **Animações Premium** - Micro-animações suaves
- **Design Responsivo** - Otimizado para todos os dispositivos
- **Glassmorphism** - Efeitos de vidro modernos
- **Gradientes Animados** - Background dinâmico

### ⚡ Performance
- **Cache Strategy** - Diferentes estratégias para cada tipo de recurso
  - `CacheFirst` - Google Fonts (1 ano)
  - `StaleWhileRevalidate` - Assets estáticos (1 dia/1 semana)
  - `NetworkFirst` - APIs e páginas (5 min/24h)
- **Code Splitting** - Carregamento otimizado
- **Lazy Loading** - Componentes sob demanda
- **Minificação** - Assets comprimidos

### 📱 Mobile Features
- **Apple Touch Icon** - Ícone iOS otimizado
- **Theme Color** - Cor da barra de status
- **Viewport Otimizado** - Para dispositivos móveis
- **Safe Area Support** - Compatível com notch/island
- **Pull-to-Refresh** - Desabilitado para melhor UX

## 🛠️ Tecnologias

- **Next.js 16** - Framework React
- **next-pwa** - Plugin PWA para Next.js
- **Tailwind CSS 4** - Estilização utilitária
- **TypeScript** - Type safety
- **Workbox** - Service Worker toolkit

## 📦 Instalação

```bash
# No diretório raiz do projeto
pnpm install

# Ou especificamente no app PWA
cd apps/pwa
pnpm install
```

## 🏃‍♂️ Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# O PWA estará disponível em http://localhost:3000
```

**Nota:** Em desenvolvimento, o Service Worker está desabilitado para facilitar o desenvolvimento.

## 🏗️ Build de Produção

```bash
# Build do projeto
pnpm build

# Iniciar em produção
pnpm start
```

O build de produção irá:
1. Gerar os Service Workers automaticamente
2. Criar estratégias de cache otimizadas
3. Minificar todos os assets
4. Preparar o app para deployment

## 🌐 Deployment

### Vercel (Recomendado)
```bash
vercel
```

### Outros Hosts
1. Execute `pnpm build`
2. Faça deploy da pasta `.next`
3. Configure o servidor para servir `public/sw.js` corretamente

## 📱 Testando PWA

### Desktop (Chrome/Edge)
1. Abra DevTools (F12)
2. Vá em "Application" > "Service Workers"
3. Verifique se o SW está registrado
4. Teste o modo offline em "Application" > "Service Workers" > "Offline"

### Mobile (Android)
1. Adicione à tela inicial via menu do navegador
2. Abra o app instalado
3. Teste sem conexão

### iOS
1. Safari > Compartilhar > "Adicionar à Tela de Início"
2. Abra o ícone criado
3. Funciona como app nativo

## 🎯 Lighthouse Score Target

- **Performance:** 95+
- **Accessibility:** 95+
- **Best Practices:** 95+
- **SEO:** 95+
- **PWA:** 100

## 📁 Estrutura de Arquivos

```
apps/pwa/
├── public/
│   ├── manifest.json          # Configuração PWA
│   ├── offline.html           # Página offline
│   ├── icons/                 # Ícones do app
│   ├── sw.js                  # Service Worker (gerado)
│   └── workbox-*.js           # Workbox runtime (gerado)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Página inicial
│   │   └── globals.css        # Estilos globais + animações
│   └── components/
│       ├── InstallPrompt.tsx  # Prompt de instalação
│       └── OfflineIndicator.tsx # Indicador offline
├── next.config.ts             # Configuração Next.js + PWA
└── package.json
```

## 🔧 Configuração

### Manifest (public/manifest.json)
- Nome do app
- Ícones (72px até 512px)
- Cor do tema (#7C3AED)
- Modo de display (standalone)
- Screenshots
- Shortcuts

### Service Worker (next.config.ts)
- Estratégias de cache por tipo de recurso
- Tempos de expiração
- Limite de entradas no cache

## 🎨 Customização

### Cores
Edite as cores em `src/app/globals.css` e `public/manifest.json`:
- Theme color: `#7C3AED` (roxo)
- Background: Gradiente roxo-violeta

### Ícones
Substitua os ícones em `public/icons/` mantendo os tamanhos padrão.

### Animações
Customize em `src/app/globals.css` as animações:
- `slide-up`
- `slide-down`
- `fade-in`
- `blob`

## 📊 Analytics e Monitoramento

Para adicionar analytics:

```typescript
// src/app/layout.tsx
// Adicione Google Analytics, Vercel Analytics, etc.
```

## 🔒 Segurança

- HTTPS obrigatório em produção (requisito PWA)
- CSP headers recomendados
- Validação de origem no Service Worker

## 🐛 Troubleshooting

### Service Worker não registra
- Verifique se está em HTTPS ou localhost
- Limpe o cache do navegador
- Desregistre SWs antigos em DevTools

### Prompt de instalação não aparece
- Apenas funciona em produção (HTTPS)
- Só aparece em navegadores compatíveis
- Usuário precisa ter engajamento mínimo

### Cache desatualizado
- Force update: DevTools > Application > SW > "Update on reload"
- Ou desregistre o SW e recarregue

## 📚 Recursos Adicionais

- [Next.js PWA](https://github.com/shadowwalker/next-pwa)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)

## 🤝 Contribuindo

Veja [CONTRIBUTING.md](../../CONTRIBUTING.md) para guidelines de contribuição.

## 📄 Licença

Este projeto faz parte da plataforma Bora.
