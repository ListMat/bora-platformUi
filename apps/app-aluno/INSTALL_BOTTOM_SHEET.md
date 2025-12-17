# 📦 Instalação do Bottom Sheet

Para usar o modal de mapa expandido com bottom sheet (estilo Uber), você precisa instalar as dependências:

## 1. Instalar dependências

### Opção A: Usar o script PowerShell (recomendado)

```powershell
cd apps/app-aluno
.\install-bottom-sheet.ps1
```

### Opção B: Instalação manual

Se o script não funcionar, execute manualmente:

```powershell
# Limpar variáveis de ambiente corrompidas
Remove-Item Env:npm_config_*

# Instalar dependências
cd apps/app-aluno
pnpm install --ignore-scripts
```

## 2. Configuração do Reanimated

O `react-native-reanimated` já está configurado no `babel.config.js`. Se você ainda não tiver executado o app após adicionar o plugin, você precisa:

1. Limpar o cache do Metro:
```bash
npx expo start --clear
```

2. Se estiver usando Expo, o Reanimated já está incluído. Se estiver usando React Native bare, você pode precisar adicionar o plugin manualmente.

## 3. Estrutura do Componente

O componente `ExpandMapModal` agora usa:

- **MapContainer**: Ocupa 100% da tela (position: absolute, inset: 0)
- **BottomSheet**: Sobre o mapa com snap points [200, 400]
- **Gestos**: Swipe up/down para expandir/minimizar/fechar
- **Auto-zoom**: `fitToCoordinates` para mostrar todos os instrutores

## 4. Funcionalidades

- ✅ Mapa full-screen
- ✅ Bottom sheet com snap points (200px / 400px)
- ✅ Swipe down para fechar
- ✅ Markers conectados ao scroll do bottom sheet
- ✅ Auto-zoom para mostrar todos os instrutores
- ✅ Dark mode support

## 5. Troubleshooting

### Erro: `ERR_INVALID_ARG_VALUE` (variáveis npm_config corrompidas)

Este erro geralmente ocorre no Windows quando variáveis de ambiente `npm_config_*` estão corrompidas.

**Solução:**

1. Execute o script de instalação:
   ```powershell
   .\install-bottom-sheet.ps1
   ```

2. Ou limpe manualmente:
   ```powershell
   # Limpar todas as variáveis npm_config
   Remove-Item Env:npm_config_*
   
   # Instalar dependências
   pnpm install --ignore-scripts
   ```

3. Se ainda não funcionar, tente limpar o cache do pnpm:
   ```powershell
   pnpm store prune
   pnpm install --ignore-scripts
   ```

### Erro: "Cannot find module '@gorhom/bottom-sheet'"
- Execute `pnpm install` novamente
- Verifique se o arquivo `package.json` tem as dependências

### Erro: "Reanimated 2 failed to create a worklet"
- Limpe o cache: `npx expo start --clear`
- Verifique se o plugin do Reanimated está no `babel.config.js` (deve ser o último)

### Bottom sheet não aparece
- Verifique se o `GestureHandlerRootView` está envolvendo o componente
- Certifique-se de que o `Modal` está configurado corretamente

