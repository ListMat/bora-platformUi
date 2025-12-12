# Assets do App

Os assets (ícones e imagens) precisam ser criados manualmente ou baixados.

## Arquivos necessários:

1. **icon.png** - Ícone do app (1024x1024px)
2. **splash.png** - Imagem de splash screen (1284x2778px recomendado)
3. **adaptive-icon.png** - Ícone adaptativo para Android (1024x1024px)
4. **favicon.png** - Favicon para web (48x48px ou 96x96px)

## Cores do BORA:

- Verde BORA: #00C853 (para app-aluno)
- Laranja BORA: #FF6D00 (para app-instrutor)

## Como criar:

1. Use uma ferramenta online como:
   - https://www.favicon-generator.org/
   - https://appicon.co/
   - https://www.appicon.build/

2. Ou crie manualmente usando:
   - Figma
   - Adobe Illustrator
   - GIMP
   - Photoshop

3. Para gerar automaticamente, você pode usar:
   ```bash
   npx expo-asset-generator
   ```

## Placeholder temporário:

Por enquanto, você pode usar qualquer imagem PNG como placeholder.
O app funcionará mesmo sem os assets finais.
