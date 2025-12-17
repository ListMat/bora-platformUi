# 🌙 Guia de Migração para Dark Mode

Este documento explica como aplicar os tokens do Figma (Dark Mode) em todos os componentes do app-instrutor.

## 📦 Tokens Disponíveis

Os tokens estão disponíveis em `src/theme/tokens.ts`:

```typescript
import { colors, spacing, radius, typography, widths, containers } from '@/theme';
```

## 🎨 Cores

### Background
- `colors.background.primary` - Fundo principal (#030712)
- `colors.background.secondary` - Fundo secundário (#111827)
- `colors.background.tertiary` - Fundo terciário (#1F2937)
- `colors.background.brandPrimary` - Laranja BORA (#FF6D00)
- `colors.background.brandSecondary` - Laranja BORA secundário (#E85D00)

### Text
- `colors.text.primary` - Texto principal (#F5F5F6)
- `colors.text.secondary` - Texto secundário (#D1D5DB)
- `colors.text.tertiary` - Texto terciário (#9CA3AF)
- `colors.text.placeholder` - Placeholder (#6B7280)
- `colors.text.white` - Branco (#FFFFFF)

### Border
- `colors.border.primary` - Borda principal (#4B5563)
- `colors.border.secondary` - Borda secundária (#1F2937)
- `colors.border.brand` - Borda brand (#FF6D00)

## 📏 Spacing

```typescript
spacing.xs    // 4px
spacing.sm    // 6px
spacing.md    // 8px
spacing.lg    // 12px
spacing.xl    // 16px
spacing['2xl'] // 20px
spacing['3xl'] // 24px
// ... até spacing['11xl'] (160px)
```

## 🔲 Radius

```typescript
radius.xs     // 4px
radius.sm    // 6px
radius.md    // 8px
radius.lg    // 10px
radius.xl    // 12px
radius['2xl'] // 16px
radius.full  // 9999 (totalmente arredondado)
```

## 📝 Typography

```typescript
typography.fontSize.xs    // 12
typography.fontSize.sm   // 14
typography.fontSize.base // 16
typography.fontSize.lg    // 18
typography.fontSize.xl    // 20
// ... até fontSize['5xl'] (36)

typography.fontWeight.normal   // '400'
typography.fontWeight.medium   // '500'
typography.fontWeight.semibold // '600'
typography.fontWeight.bold     // '700'
```

## 🔄 Como Migrar um Componente

### Antes:
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  text: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#FF6D00",
    borderRadius: 8,
    padding: 12,
  },
});
```

### Depois:
```typescript
import { colors, spacing, radius, typography } from '@/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    padding: spacing.xl,
  },
  text: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  button: {
    backgroundColor: colors.background.brandPrimary,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
});
```

## ✅ Checklist de Migração

- [ ] Importar tokens: `import { colors, spacing, radius, typography } from '@/theme'`
- [ ] Substituir cores hardcoded por `colors.*`
- [ ] Substituir espaçamentos hardcoded por `spacing.*`
- [ ] Substituir border-radius hardcoded por `radius.*`
- [ ] Substituir font-sizes hardcoded por `typography.fontSize.*`
- [ ] Substituir font-weights hardcoded por `typography.fontWeight.*`
- [ ] Adicionar `placeholderTextColor` em TextInputs
- [ ] Verificar contraste de cores (texto legível no fundo)

## 📋 Componentes para Migrar

### Prioridade Alta
- [ ] `app/(tabs)/index.tsx` (Home)
- [ ] `app/screens/AcceptLessonModal.tsx`
- [ ] `app/screens/lessonChat.tsx`
- [ ] `app/(tabs)/finance.tsx`

### Prioridade Média
- [ ] `app/screens/generatePix.tsx`
- [ ] `app/screens/withdrawPix.tsx`
- [ ] `app/screens/RescheduleModal.tsx`
- [ ] `app/screens/rating.tsx`

### Prioridade Baixa
- [ ] `app/screens/evaluateLesson.tsx`
- [ ] `app/screens/lessonLive.tsx`
- [ ] Outros componentes...

## 🎯 Exemplo Completo

Veja `app/screens/lessonChat.tsx` (app-aluno) como referência de migração completa.

## 🐛 Troubleshooting

### Erro: "Cannot find module '@/theme'"
- Verifique se o arquivo `src/theme/tokens.ts` existe
- Verifique se o `tsconfig.json` tem o path alias configurado

### Cores não aparecem corretamente
- Certifique-se de usar `colors.background.primary` e não `colors.backgroundPrimary`
- Verifique se está importando de `@/theme` e não de outro lugar

### TypeScript errors
- Execute `pnpm type-check` para verificar erros de tipo
- Certifique-se de que os tipos estão corretos nos tokens

