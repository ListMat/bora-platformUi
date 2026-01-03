# 🔧 Solução para Erro de Busca de Instrutores

## Problema Identificado

O erro "Erro de conexão" ocorre porque:

1. A API tRPC está configurada em `http://localhost:3000/api/trpc`
2. A procedure `instructor.nearby` requer autenticação (`protectedProcedure`)
3. O sistema de autenticação mock não está enviando tokens válidos

## Soluções Possíveis

### Opção 1: Usar Dados Mock no Frontend (Recomendado para Testes)

Modificar `search.tsx` para usar dados mock quando a API falhar:

```typescript
const mockInstructors = [
  {
    id: '2',
    user: { name: 'Instrutor Mestre', email: 'instrutor.teste@bora.com' },
    city: 'São Paulo',
    state: 'SP',
    basePrice: 80,
    averageRating: 4.8,
    totalLessons: 150,
    distance: 2.5,
    isAvailable: true,
  },
];

// No componente, usar fallback:
const instructors = data || (error ? mockInstructors : []);
```

### Opção 2: Tornar a Procedure Pública Temporariamente

No arquivo `packages/api/src/routers/instructor.ts`, mudar de `protectedProcedure` para `publicProcedure`:

```typescript
nearby: publicProcedure  // Era: protectedProcedure
  .input(...)
  .query(...)
```

### Opção 3: Verificar se Web Admin está Rodando

A API tRPC roda no Web Admin. Certifique-se de que:
- Web Admin está rodando em `http://localhost:3000`
- Não há erros no console do Web Admin
- A rota `/api/trpc` está acessível

## Próximos Passos

1. Verificar se o Web Admin está rodando sem erros
2. Testar acesso direto: `http://localhost:3000/api/trpc`
3. Implementar fallback com dados mock para testes
