# 🗺️ Implementar Mapa como Home do App Aluno

## 📍 Situação Atual

O app-aluno JÁ TEM a estrutura do mapa preparada em `app/(tabs)/index.tsx`, mas está comentada porque `react-native-maps` foi removido temporariamente.

## 🎯 Objetivo

Habilitar o mapa interativo como tela principal para o aluno selecionar instrutores e solicitar aulas.

## 🚀 Passos para Implementar

### 1. Instalar Dependências

```bash
cd apps/app-aluno
pnpm add react-native-maps
```

### 2. Descomentar o Código do Mapa

No arquivo `apps/app-aluno/app/(tabs)/index.tsx`:

**Remover estas linhas (223-228):**
```typescript
<View style={[styles.map, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
  <Text style={{ color: colors.textSecondary, textAlign: 'center', padding: 20 }}>
    Mapa temporariamente desabilitado{'\n'}
    {instructors.length} instrutores disponíveis
  </Text>
</View>
```

**Descomentar o bloco MapView (linhas 229-301):**
```typescript
<MapView
  ref={homeMapRef}
  style={styles.map}
  provider={MAP_PROVIDER}
  // ... resto do código
</MapView>
```

### 3. Criar o arquivo de configuração de mapas

Criar `apps/app-aluno/src/lib/maps.ts`:

```typescript
import { Platform } from 'react-native';

// Provider do mapa (Google Maps no Android, Apple Maps no iOS)
export const MAP_PROVIDER = Platform.select({
  ios: undefined, // Apple Maps
  android: 'google', // Google Maps
  default: 'google',
});
```

### 4. Descomentar Imports

No topo do arquivo `index.tsx`, descomentar:

```typescript
import MapView, { Marker } from "react-native-maps";
import { MAP_PROVIDER } from "@/lib/maps";
```

### 5. Configurar Google Maps (Android)

**Android:** Adicionar chave do Google Maps em `apps/app-aluno/android/app/src/main/AndroidManifest.xml`:

```xml
<application>
  <!-- ... -->
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="SUA_CHAVE_GOOGLE_MAPS_AQUI"/>
</application>
```

**iOS:** Já usa Apple Maps nativamente, não precisa de chave.

### 6. Testar

```bash
# Limpar cache
pnpm expo start -c

# Rodar no emulador
pnpm expo run:android
# ou
pnpm expo run:ios
```

## 🎨 Funcionalidades Já Implementadas

O código já tem TUDO pronto:

✅ **Mapa interativo** com localização do usuário  
✅ **Pins dos instrutores** com nota e preço  
✅ **Cards horizontais** com swipe  
✅ **Card expandido** quando seleciona instrutor  
✅ **Botão FAB** "Solicitar Aula"  
✅ **Integração com tRPC** para buscar instrutores  
✅ **Filtros** (1h, 5h, carro próprio, aula dupla)  
✅ **Aula em 1 clique** (última configuração)  
✅ **Modal de mapa expandido**

## 🔄 Fluxo Completo

1. **Usuário abre app** → Vê mapa com instrutores próximos
2. **Clica em pin** → Card do instrutor aparece
3. **Clica em "Solicitar Aula"** → Abre `SolicitarAulaFlow`
4. **Escolhe data/hora** → Confirma
5. **Paga** → Aula agendada

## 📱 Alternativa: Usar Dados Mock (Sem Mapa)

Se não quiser instalar `react-native-maps` agora, o código já mostra os instrutores em cards horizontais. O mapa é opcional.

Para usar sem mapa:
- Deixe o código como está (mapa desabilitado)
- Os cards já funcionam perfeitamente
- O botão "Solicitar Aula" já funciona

## 🐛 Troubleshooting

**Erro: "Google Maps não carrega"**
- Verifique se adicionou a chave no AndroidManifest.xml
- Verifique se ativou "Maps SDK for Android" no Google Cloud

**Erro: "Module not found: react-native-maps"**
- Rode: `pnpm install`
- Limpe cache: `pnpm expo start -c`

**Mapa em branco**
- Verifique permissões de localização
- Verifique se há instrutores com lat/lng no banco

## 📚 Próximos Passos

1. Instalar `react-native-maps`
2. Descomentar código do mapa
3. Adicionar chave do Google Maps (Android)
4. Testar no emulador
5. Ajustar estilos se necessário

---

**💡 Dica:** O código já está 100% pronto! Só precisa descomentar e adicionar a dependência.
