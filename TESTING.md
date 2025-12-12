# Guia de Testes - BORA Platform

Este documento descreve a estratégia de testes do projeto e como executá-los.

## Estrutura de Testes

```
packages/api/src/__tests__/     # Testes unitários da API
apps/app-aluno/__tests__/        # Testes E2E do app aluno (futuro)
apps/app-instrutor/__tests__/    # Testes E2E do app instrutor (futuro)
```

## Tipos de Testes

### 1. Testes Unitários (API)

Localização: `packages/api/src/__tests__/`

**Framework:** Vitest

**Cobertura atual:**
- ✅ Gamificação (pontos, níveis, medalhas)
- ✅ Rate Limiter (configurações, erros)
- ✅ Receipt Generator (geração de nomes de arquivo)

**Executar:**
```bash
# Todos os testes
pnpm --filter @bora/api test

# Watch mode
pnpm --filter @bora/api test:watch

# Com UI
pnpm --filter @bora/api test:ui

# Com cobertura
pnpm --filter @bora/api test:coverage
```

### 2. Testes de Integração (API)

**Status:** 🚧 Planejado

Testes que validam a integração entre módulos e com o banco de dados.

**Plano:**
- [ ] Testes de fluxo de aula (criar → iniciar → finalizar)
- [ ] Testes de pagamento (Stripe mocked)
- [ ] Testes de gamificação (pontos, medalhas)
- [ ] Testes de rating
- [ ] Testes de emergency/SOS

**Executar:**
```bash
pnpm --filter @bora/api test:integration
```

### 3. Testes E2E (Mobile)

**Status:** 🚧 Planejado

**Framework:** Detox + Jest

Testes end-to-end que simulam interações reais do usuário nos apps mobile.

**Plano:**
- [ ] Fluxo de login/cadastro
- [ ] Busca de instrutores
- [ ] Agendamento de aula
- [ ] Pagamento (Pix e Cartão)
- [ ] Avaliação pós-aula
- [ ] SOS em aula ativa

**Configuração (futuro):**
```bash
# Instalar Detox
cd apps/app-aluno
npm install -g detox-cli
detox init

# Executar testes
detox build --configuration ios.sim.debug
detox test --configuration ios.sim.debug
```

### 4. Testes de Snapshot (UI)

**Status:** 🚧 Planejado

Testes que capturam o estado visual dos componentes para detectar mudanças não intencionais.

**Executar:**
```bash
pnpm --filter app-aluno test:snapshot
```

## CI/CD Integration

Os testes são executados automaticamente no GitHub Actions:

**Workflow:** `.github/workflows/ci.yml`

```yaml
test:
  name: Test
  runs-on: ubuntu-latest
  steps:
    - run: pnpm test
```

**Quando rodam:**
- Em cada Pull Request
- Em cada push para `main` ou `develop`

## Cobertura de Código

**Meta:** 70% de cobertura mínima

**Ver relatório:**
```bash
pnpm --filter @bora/api test:coverage
# Abre em: packages/api/coverage/index.html
```

**Áreas críticas que exigem alta cobertura (>80%):**
- Gamificação
- Rate Limiting
- Pagamentos
- Geração de recibos
- Lógica de emergência/SOS

## Boas Práticas

### Nomenclatura

```typescript
describe("Module/Component Name", () => {
  describe("functionName", () => {
    it("should do something specific", () => {
      // test
    });
  });
});
```

### Estrutura AAA

```typescript
it("should add points correctly", async () => {
  // Arrange (preparar)
  const userId = "user123";
  const points = 10;

  // Act (executar)
  const result = await addPoints(userId, points, "test");

  // Assert (validar)
  expect(result).toBe(10);
});
```

### Mocks

Use mocks para:
- APIs externas (Stripe, Supabase, etc.)
- Banco de dados em testes unitários
- Notificações push
- Serviços de email/SMS

```typescript
import { vi } from "vitest";

const mockStripe = vi.fn().mockResolvedValue({
  id: "pi_123",
  status: "succeeded",
});
```

### Fixtures

Crie dados de teste reutilizáveis:

```typescript
// __tests__/fixtures/users.ts
export const mockStudent = {
  id: "student123",
  name: "João Silva",
  email: "joao@example.com",
  points: 100,
  level: 2,
};
```

## Debug

### Vitest UI

```bash
pnpm --filter @bora/api test:ui
```

Abre uma interface web interativa para executar e debugar testes.

### VS Code

Instale a extensão "Vitest" para rodar testes diretamente no editor.

## Roadmap de Testes

### Curto Prazo (próximos sprints)
- [x] Testes unitários básicos (gamificação, rate limiter)
- [ ] Testes de integração de API
- [ ] Setup de Detox para E2E mobile
- [ ] Primeiros testes E2E (login, busca)

### Médio Prazo
- [ ] Cobertura de 70%+ em módulos críticos
- [ ] Testes de performance/carga
- [ ] Testes de acessibilidade
- [ ] Visual regression tests

### Longo Prazo
- [ ] Testes de segurança automatizados
- [ ] Testes de compatibilidade (Android/iOS)
- [ ] Chaos engineering
- [ ] A/B testing framework

## Referências

- [Vitest Docs](https://vitest.dev/)
- [Detox Docs](https://wix.github.io/Detox/)
- [Testing Library](https://testing-library.com/)
- [Jest Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
