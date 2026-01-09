# ✅ FASE 2: tRPC Endpoints - CONCLUÍDA

**Data:** 09/01/2026 00:41

---

## ✅ O QUE FOI IMPLEMENTADO

### **1. Novo Router: `instructorDocumentsRouter`** ✅

Arquivo: `packages/api/src/routers/instructorDocuments.ts`

### **2. Endpoints para Instrutores** ✅

#### **`instructorDocuments.uploadDocuments`**
- Upload de CNH (frente/verso) + Certificado
- Validação de URLs
- Checkbox de confirmação obrigatório
- Status automático: `PENDING`

#### **`instructorDocuments.getDocumentStatus`**
- Consultar status dos documentos
- Retorna informações completas do documento

---

### **3. Endpoints para Admin** ✅

#### **`instructorDocuments.getPendingApprovals`**
- Listar aprovações pendentes
- Filtro por status
- Paginação (limit/skip)
- Inclui dados completos do instrutor:
  - Usuário (nome, email, foto, telefone)
  - Avaliações (últimas 5)
  - Aulas (últimas 10)

#### **`instructorDocuments.approveInstructor`**
- Aprovar instrutor
- Nota de análise (opcional)
- Atualiza status para `APPROVED`
- Ativa o instrutor (`status: ACTIVE`)

#### **`instructorDocuments.rejectInstructor`**
- Rejeitar instrutor
- Nota de análise (obrigatória, mín 10 caracteres)
- Atualiza status para `REJECTED`
- Desativa o instrutor (`status: INACTIVE`)

#### **`instructorDocuments.requestMoreDocuments`**
- Solicitar mais documentos
- Nota de análise (obrigatória, mín 10 caracteres)
- Atualiza status para `PENDING_MORE_DOCS`

#### **`instructorDocuments.getApprovalMetrics`**
- KPIs de aprovação
- Métricas:
  - Taxa de aprovação (%)
  - Taxa de rejeição (%)
  - Taxa de solicitação de mais docs (%)
  - Tempo médio de análise (horas)
- Filtro por período (startDate/endDate)

---

## 📊 ESTRUTURA DE DADOS

### **Status de Documentos**

```typescript
enum DocumentStatus {
  PENDING              // Aguardando aprovação
  APPROVED             // Aprovado
  REJECTED             // Rejeitado
  PENDING_MORE_DOCS    // Aguardando mais documentos
}
```

### **Documento do Instrutor**

```typescript
{
  id: string
  instructorId: string
  cnhFrontUrl: string
  cnhBackUrl: string
  certificateUrl: string
  status: DocumentStatus
  analysisNote: string | null
  confirmedAutonomous: boolean
  submittedAt: Date | null
  reviewedAt: Date | null
  reviewedBy: string | null
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔄 FLUXO COMPLETO

### **1. Instrutor envia documentos**
```typescript
await trpc.instructorDocuments.uploadDocuments.mutate({
  cnhFrontUrl: "https://...",
  cnhBackUrl: "https://...",
  certificateUrl: "https://...",
  confirmedAutonomous: true,
});
```

### **2. Admin lista aprovações pendentes**
```typescript
const { documents, total } = await trpc.instructorDocuments.getPendingApprovals.query({
  status: "PENDING",
  limit: 20,
  skip: 0,
});
```

### **3. Admin aprova/rejeita**
```typescript
// Aprovar
await trpc.instructorDocuments.approveInstructor.mutate({
  instructorId: "...",
  analysisNote: "Documentos válidos",
});

// Rejeitar
await trpc.instructorDocuments.rejectInstructor.mutate({
  instructorId: "...",
  analysisNote: "CNH vencida",
});

// Solicitar mais docs
await trpc.instructorDocuments.requestMoreDocuments.mutate({
  instructorId: "...",
  analysisNote: "Envie foto mais nítida da CNH",
});
```

### **4. Instrutor consulta status**
```typescript
const document = await trpc.instructorDocuments.getDocumentStatus.query();
// document.status: "PENDING" | "APPROVED" | "REJECTED" | "PENDING_MORE_DOCS"
```

---

## 📋 PRÓXIMOS PASSOS

### **FASE 3: Componentes PWA** 🚀

1. ✅ Tela de upload de documentos
2. ✅ Visualizador de status
3. ✅ Tela de aguardo

### **FASE 4: Componentes Admin** 💼

1. ✅ Lista de aprovações
2. ✅ Detalhes do instrutor
3. ✅ Visualizador de documentos
4. ✅ Botões de ação

---

## ✅ CHECKLIST

- [x] Enum DocumentStatus criado
- [x] Modelo InstructorDocument criado
- [x] Router instructorDocumentsRouter criado
- [x] Endpoints de upload implementados
- [x] Endpoints de aprovação implementados
- [x] Endpoints de KPIs implementados
- [x] Router adicionado ao appRouter
- [ ] Componentes PWA criados
- [ ] Componentes Admin criados
- [ ] Notificações implementadas

---

**FASE 2 CONCLUÍDA! Pronto para FASE 3!** 🚀
