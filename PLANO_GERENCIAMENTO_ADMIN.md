# 🎯 TELAS DE GERENCIAMENTO ADMIN - PLANO DE IMPLEMENTAÇÃO

**Data:** 09/01/2026 01:20

---

## ✅ O QUE SERÁ IMPLEMENTADO

### **1. Gerenciamento de Instrutores**

#### **Lista de Instrutores** ✅
**Rota:** `/instrutores`
**Arquivo:** `apps/admin/src/app/instrutores/page.tsx`

**Funcionalidades:**
- ✅ Tabela com todos os instrutores
- ✅ Filtros (busca, status)
- ✅ Colunas: Nome, Email, CPF, Cidade, Status, Avaliação, Aulas
- ✅ Ações por instrutor:
  - Ver Detalhes
  - Suspender (se ativo)
  - Reativar (se suspenso/inativo)

#### **Detalhes do Instrutor** ⏳
**Rota:** `/instrutores/[id]`
**Arquivo:** `apps/admin/src/app/instrutores/[id]/page.tsx`

**Funcionalidades:**
- Informações completas
- Documentos enviados
- Histórico de aulas
- Avaliações recebidas
- Veículos cadastrados
- Botões de ação (Suspender/Reativar)

---

### **2. Gerenciamento de Alunos**

#### **Lista de Alunos** ⏳
**Rota:** `/alunos`
**Arquivo:** `apps/admin/src/app/alunos/page.tsx`

**Funcionalidades:**
- Tabela com todos os alunos
- Filtros (busca, status)
- Colunas: Nome, Email, CPF, Cidade, Aulas, Pagamentos
- Ações por aluno:
  - Ver Detalhes
  - Ver Aulas
  - Ver Pagamentos

#### **Detalhes do Aluno** ⏳
**Rota:** `/alunos/[id]`
**Arquivo:** `apps/admin/src/app/alunos/[id]/page.tsx`

**Funcionalidades:**
- Informações completas
- Histórico de aulas
- Histórico de pagamentos
- Avaliações dadas
- Estatísticas

---

## 📊 ESTRUTURA DE ARQUIVOS

```
apps/admin/src/app/
├── instrutores/
│   ├── page.tsx                    # ✅ Lista de instrutores
│   └── [id]/
│       └── page.tsx                # ⏳ Detalhes do instrutor
└── alunos/
    ├── page.tsx                    # ⏳ Lista de alunos
    └── [id]/
        └── page.tsx                # ⏳ Detalhes do aluno
```

---

## 🔌 ENDPOINTS tRPC NECESSÁRIOS

### **Admin Router**
```typescript
// packages/api/src/routers/admin.ts

admin.getInstructors              // Listar instrutores
admin.getInstructorById           // Detalhes do instrutor
admin.getStudents                 // Listar alunos
admin.getStudentById              // Detalhes do aluno
admin.getStudentLessons           // Aulas do aluno
admin.getStudentPayments          // Pagamentos do aluno
```

### **Instructor Router** (já existe)
```typescript
instructor.suspend                // Suspender instrutor
instructor.approve                // Aprovar/Reativar instrutor
```

---

## 📋 TABELAS

### **Tabela de Instrutores**
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| Nome | String | Nome do instrutor |
| Email | String | Email |
| CPF | String | CPF |
| Cidade | String | Cidade, Estado |
| Status | Badge | ACTIVE, SUSPENDED, etc |
| Avaliação | Number | ⭐ 4.5 |
| Aulas | Number | Total de aulas |
| Ações | Dropdown | Ver, Suspender, Reativar |

### **Tabela de Alunos**
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| Nome | String | Nome do aluno |
| Email | String | Email |
| CPF | String | CPF |
| Cidade | String | Cidade, Estado |
| Aulas | Number | Total de aulas |
| Pagamentos | Number | Total pago |
| Ações | Dropdown | Ver, Aulas, Pagamentos |

---

## 🎨 COMPONENTES SHADCN USADOS

- Table
- Card
- Button
- Badge
- Input
- Select
- DropdownMenu
- Dialog
- Tabs

---

## ✅ CHECKLIST

### **Instrutores**
- [x] Lista de instrutores criada
- [ ] Endpoint `admin.getInstructors` criado
- [ ] Detalhes do instrutor criado
- [ ] Endpoint `admin.getInstructorById` criado
- [ ] Ações funcionando (suspender/reativar)

### **Alunos**
- [ ] Lista de alunos criada
- [ ] Endpoint `admin.getStudents` criado
- [ ] Detalhes do aluno criado
- [ ] Endpoint `admin.getStudentById` criado
- [ ] Ver aulas do aluno
- [ ] Ver pagamentos do aluno

---

## 🚀 PRÓXIMOS PASSOS

1. Criar endpoint `admin.getInstructors`
2. Criar página de detalhes do instrutor
3. Criar lista de alunos
4. Criar detalhes do aluno
5. Criar visualização de aulas
6. Criar visualização de pagamentos

---

## 📝 NOTAS

- Usar mesma estrutura de tabela para consistência
- Reutilizar componentes quando possível
- Adicionar loading states
- Adicionar estados vazios
- Adicionar confirmação para ações destrutivas

---

**STATUS:** Lista de instrutores criada ✅
**PRÓXIMO:** Criar endpoints tRPC
