# 🤝 Contribuindo com BORA

Obrigado por considerar contribuir com o projeto BORA!

## 📋 Pré-requisitos

- Node.js >= 18.17.0
- pnpm >= 8.0.0
- Conta no Supabase (para banco de dados)
- Conta no Stripe (para pagamentos)
- Conta no Google Cloud (para OAuth)

## 🚀 Setup Inicial

1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/bora.git
cd bora
```

2. Instale as dependências

```bash
pnpm install
```

3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Preencha o arquivo `.env` com suas credenciais.

4. Setup do banco de dados

```bash
cd packages/db
pnpm prisma generate
pnpm prisma db push
```

5. Inicie o ambiente de desenvolvimento

```bash
pnpm dev
```

## 📁 Estrutura do Projeto

```
bora/
├── apps/
│   ├── web-admin        # Painel Administrativo (porta 3000)
│   ├── web-site         # Site Institucional (porta 3001)
│   ├── app-aluno        # App do Aluno (Expo)
│   └── app-instrutor    # App do Instrutor (Expo)
├── packages/
│   ├── ui               # Componentes compartilhados
│   ├── db               # Prisma + Supabase
│   ├── api              # tRPC routers
│   ├── auth             # NextAuth config
│   └── i18n             # Traduções
```

## 🔀 Workflow de Contribuição

1. Crie uma branch para sua feature

```bash
git checkout -b feat/nome-da-feature
```

2. Faça suas alterações seguindo os padrões do projeto

3. Commit suas mudanças (Husky rodará lint-staged automaticamente)

```bash
git commit -m "feat: adiciona nova funcionalidade"
```

4. Push para o repositório

```bash
git push origin feat/nome-da-feature
```

5. Abra um Pull Request

## 📝 Convenções de Código

### Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Tarefas de build/config

### TypeScript

- Use tipos explícitos sempre que possível
- Evite `any`, use `unknown` se necessário
- Documente funções complexas com JSDoc

### React/Next.js

- Componentes funcionais com TypeScript
- Props tipadas com interfaces
- Use React Hooks (useState, useEffect, etc.)
- Componentes Server/Client explicitamente marcados

### React Native/Expo

- StyleSheet para estilos
- Componentes tipados
- Use Expo Router para navegação

## 🧪 Testes

```bash
# Rodar todos os testes
pnpm test

# Rodar testes de um pacote específico
pnpm --filter @bora/api test
```

## 🎨 Design Tokens

Cores principais:

- Verde BORA: `#00C853` (142 100% 39%)
- Laranja BORA: `#FF6D00` (24 100% 50%)

Use os tokens CSS do `@bora/ui` para consistência.

## 📦 Adicionando Dependências

```bash
# Adicionar ao workspace raiz
pnpm add -w <pacote>

# Adicionar a um app específico
pnpm add <pacote> --filter web-admin

# Adicionar a um package
pnpm add <pacote> --filter @bora/ui
```

## 🐛 Reportando Bugs

Abra uma issue com:

- Descrição clara do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Ambiente (OS, browser, versão do Node)

## 💡 Sugestões de Features

Abra uma issue com:

- Descrição da feature
- Caso de uso
- Mockups/wireframes (se aplicável)
- Impacto no negócio

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto.
