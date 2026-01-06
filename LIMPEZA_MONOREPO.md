# 🧹 LIMPEZA DO MONOREPO - FOCO EXCLUSIVO NO PWA

## 🎯 Objetivo
Remover todos os apps que não são o PWA para focar 100% no desenvolvimento web.

---

## 📁 Estrutura Atual

```
apps/
├── app-aluno/          ❌ REMOVER (React Native)
├── app-instrutor/      ❌ REMOVER (React Native)
├── pwa/                ✅ MANTER (Next.js PWA)
├── web-admin/          ❌ REMOVER (Admin antigo)
└── web-site/           ❌ REMOVER (Site antigo)
```

---

## 📁 Estrutura Final

```
apps/
└── pwa/                ✅ PWA único
```

---

## 🗑️ Arquivos/Pastas para Remover

### Apps
- ❌ `apps/app-aluno/`
- ❌ `apps/app-instrutor/`
- ❌ `apps/web-admin/`
- ❌ `apps/web-site/`

### Scripts Mobile
- ❌ `abrir-emulador.ps1`
- ❌ `eas.json`
- ❌ `prepare-tests.ps1`
- ❌ `start-all.ps1`
- ❌ `CREDENCIAIS_TESTE.md`

### Documentação Antiga
- ❌ `docs/` (se existir documentação mobile)

---

## ✅ Manter

### Apps
- ✅ `apps/pwa/` - PWA Next.js

### Packages (se usados pelo PWA)
- ✅ `packages/api/` - tRPC API
- ✅ `packages/database/` - Prisma
- ✅ `packages/shared/` - Utilitários
- ⚠️ Revisar outros packages

### Configuração
- ✅ `package.json` (root)
- ✅ `pnpm-workspace.yaml`
- ✅ `turbo.json`
- ✅ `.gitignore`
- ✅ `.eslintrc.js`
- ✅ `.prettierrc`

---

## 📝 Comandos de Limpeza

```powershell
# Navegar para o diretório
cd "c:\Users\Mateus\Desktop\Bora UI"

# Remover apps mobile
Remove-Item -Recurse -Force "apps\app-aluno"
Remove-Item -Recurse -Force "apps\app-instrutor"
Remove-Item -Recurse -Force "apps\web-admin"
Remove-Item -Recurse -Force "apps\web-site"

# Remover scripts mobile
Remove-Item -Force "abrir-emulador.ps1"
Remove-Item -Force "eas.json"
Remove-Item -Force "prepare-tests.ps1"
Remove-Item -Force "start-all.ps1"
Remove-Item -Force "CREDENCIAIS_TESTE.md"

# Limpar node_modules e reinstalar
Remove-Item -Recurse -Force "node_modules"
pnpm install
```

---

## 📦 Atualizar package.json (root)

```json
{
  "name": "bora-pwa",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "@turbo/gen": "^2.3.3",
    "prettier": "^3.4.2",
    "turbo": "^2.3.3",
    "typescript": "^5.7.2"
  },
  "packageManager": "pnpm@9.15.0",
  "engines": {
    "node": ">=18"
  }
}
```

---

## 📦 Atualizar pnpm-workspace.yaml

```yaml
packages:
  - 'apps/pwa'
  - 'packages/*'
```

---

## 🔧 Atualizar turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

---

## ✅ Resultado Final

```
Bora UI/
├── apps/
│   └── pwa/                    ✅ PWA Next.js + HeroUI
├── packages/
│   ├── api/                    ✅ tRPC (se usado)
│   ├── database/               ✅ Prisma (se usado)
│   └── shared/                 ✅ Utils (se usado)
├── .git/
├── .github/
├── node_modules/
├── package.json                ✅ Atualizado
├── pnpm-workspace.yaml         ✅ Atualizado
├── turbo.json                  ✅ Atualizado
└── README.md                   ✅ Atualizar
```

---

## 📚 Atualizar README.md

```markdown
# Bora PWA - Marketplace de Aulas de Direção

PWA moderno para conectar alunos e instrutores de autoescola.

## Stack

- **Frontend:** Next.js 16 + React 19
- **UI:** HeroUI + Tailwind CSS 4
- **Backend:** tRPC + Prisma
- **Database:** PostgreSQL
- **Deploy:** Vercel

## Desenvolvimento

\`\`\`bash
# Instalar dependências
pnpm install

# Rodar em dev
pnpm dev

# Build
pnpm build
\`\`\`

## URLs

- **Dev:** http://localhost:3000
- **Prod:** https://bora.app (configurar)

## Documentação

Ver `apps/pwa/` para documentação completa.
```

---

## 🚀 Próximos Passos Após Limpeza

1. ✅ Verificar que PWA funciona
2. ✅ Limpar packages não usados
3. ✅ Atualizar documentação
4. ✅ Commit das mudanças
5. ✅ Continuar desenvolvimento PWA

---

**Executar limpeza agora?**
