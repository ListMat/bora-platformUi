# 🚀 Guia Rápido - Painel Admin Bora

## ⚡ Início Rápido (3 passos)

### 1️⃣ Instalar Componentes UI
```powershell
.\install-shadcn-components.ps1
```

### 2️⃣ Configurar e Rodar
```powershell
.\setup-admin.ps1
```

### 3️⃣ Acessar
Abra: **http://localhost:3001**

**Login:**
- Email: `admin@bora.com`
- Senha: `admin123`

---

## 📋 Checklist de Implementação

### ✅ Já Implementado
- [x] Estrutura base do projeto
- [x] Configuração Next.js + TypeScript
- [x] Configuração tRPC
- [x] Autenticação NextAuth
- [x] Dashboard com métricas
- [x] Gráfico de receita
- [x] Gestão de instrutores (lista, aprovação, suspensão)
- [x] Sidebar responsiva
- [x] Dark mode
- [x] Layout completo

### 🔨 Para Implementar

#### Páginas CRUD
- [ ] Alunos (`apps/admin/src/app/(dashboard)/students/`)
- [ ] Aulas (`apps/admin/src/app/(dashboard)/lessons/`)
- [ ] Pagamentos (`apps/admin/src/app/(dashboard)/payments/`)
- [ ] Emergências (`apps/admin/src/app/(dashboard)/emergencies/`)
- [ ] Avaliações (`apps/admin/src/app/(dashboard)/ratings/`)
- [ ] Indicações (`apps/admin/src/app/(dashboard)/referrals/`)
- [ ] Veículos (`apps/admin/src/app/(dashboard)/vehicles/`)

#### Funcionalidades Extras
- [ ] Exportação CSV/PDF
- [ ] Notificações em tempo real
- [ ] Configurações do sistema
- [ ] Logs de auditoria
- [ ] Relatórios personalizados

---

## 📁 Como Criar uma Nova Página

### Exemplo: Página de Alunos

**1. Criar estrutura de pastas:**
```
apps/admin/src/app/(dashboard)/students/
├── page.tsx
└── columns.tsx
```

**2. Copiar template de `instructors/page.tsx`:**
```tsx
// apps/admin/src/app/(dashboard)/students/page.tsx
'use client';

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function StudentsPage() {
  const { data: students, isLoading } = api.admin.getStudents.useQuery();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alunos</h2>
          <p className="text-muted-foreground">
            Gerencie os alunos do sistema
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Aluno
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={students || []}
        isLoading={isLoading}
        searchKey="user.name"
        searchPlaceholder="Buscar por nome..."
      />
    </div>
  );
}
```

**3. Criar colunas (`columns.tsx`):**
```tsx
// apps/admin/src/app/(dashboard)/students/columns.tsx
'use client';

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type Student = {
  id: string;
  user: {
    name: string | null;
    email: string;
    image: string | null;
  };
  level: number;
  points: number;
  walletBalance: number;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "user.name",
    header: "Aluno",
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={student.user.image || undefined} />
            <AvatarFallback>{student.user.name?.charAt(0) || "A"}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{student.user.name}</div>
            <div className="text-sm text-muted-foreground">{student.user.email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "level",
    header: "Nível",
    cell: ({ row }) => {
      return <Badge variant="secondary">Nível {row.getValue("level")}</Badge>;
    },
  },
  {
    accessorKey: "points",
    header: "Pontos",
  },
  {
    accessorKey: "walletBalance",
    header: "Saldo",
    cell: ({ row }) => {
      const balance = row.getValue("walletBalance") as number;
      return <div>R$ {balance.toFixed(2)}</div>;
    },
  },
];
```

**4. Pronto!** A página já estará acessível em `/students`

---

## 🎨 Componentes Disponíveis

### Layout
- `<Sidebar />` - Navegação lateral
- `<Header />` - Cabeçalho com busca e notificações

### Dashboard
- `<StatsCards />` - Cards de estatísticas
- `<Overview />` - Gráfico de receita
- `<RecentActivity />` - Atividades recentes

### UI (Shadcn)
- `<Button />` - Botões
- `<Card />` - Cards
- `<Input />` - Campos de texto
- `<Badge />` - Badges de status
- `<Avatar />` - Avatares
- `<DataTable />` - Tabela de dados
- `<Tabs />` - Abas
- `<Dialog />` - Modais
- `<DropdownMenu />` - Menus dropdown
- E mais...

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Lint
pnpm lint

# Type check
pnpm type-check

# Adicionar componente shadcn
npx shadcn-ui@latest add <component-name>
```

---

## 📊 API tRPC

### Como usar:
```tsx
// Query
const { data, isLoading } = api.admin.getInstructors.useQuery({ status: "ACTIVE" });

// Mutation
const approveMutation = api.admin.approveInstructor.useMutation({
  onSuccess: () => {
    toast({ title: "Instrutor aprovado!" });
  },
});

// Executar mutation
approveMutation.mutate({ id: "instructor-id" });
```

### Queries Disponíveis:
- `admin.getStats()` - Dashboard stats
- `admin.getInstructors({ status })` - Lista de instrutores
- `admin.getStudents()` - Lista de alunos
- `admin.getLessons({ status })` - Lista de aulas
- `admin.getPayments()` - Lista de pagamentos
- `admin.getRatings()` - Lista de avaliações
- `admin.getVehicles()` - Lista de veículos

### Mutations Disponíveis:
- `admin.approveInstructor({ id })` - Aprovar instrutor
- `admin.suspendInstructor({ id })` - Suspender instrutor

---

## 🎯 Próximos Passos Recomendados

1. **Instalar componentes UI** (se ainda não fez)
   ```powershell
   .\install-shadcn-components.ps1
   ```

2. **Criar página de Alunos** (seguir exemplo acima)

3. **Criar página de Aulas**

4. **Implementar tabela de Emergências no Prisma**

5. **Adicionar exportação de dados**

6. **Implementar notificações em tempo real**

---

## 💡 Dicas

- Use o componente `<DataTable />` para todas as listas
- Mantenha consistência com o padrão de `instructors/`
- Sempre adicione loading states
- Use `toast` para feedback ao usuário
- Aproveite o dark mode automático

---

**Desenvolvido com ❤️ para Bora Platform**
