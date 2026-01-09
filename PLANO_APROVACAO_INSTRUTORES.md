# 📋 PLANO DE IMPLEMENTAÇÃO - Sistema de Aprovação de Instrutores

**Data:** 08/01/2026 23:34

---

## 🎯 OBJETIVO

Implementar sistema completo de aprovação de instrutores com:
- ✅ Upload de CNH + Certificado (PWA)
- ✅ Área de aprovação no Admin
- ✅ Tela de aguardo para instrutor
- ✅ Notificações automáticas
- ✅ KPIs de aprovação

---

## 📊 ARQUITETURA

### **1. Database Schema (Prisma)**

```prisma
model InstructorDocument {
  id                String   @id @default(cuid())
  instructorId      String   @unique
  cnhFrontUrl       String?
  cnhBackUrl        String?
  certificateUrl    String?
  status            DocumentStatus @default(PENDING)
  analysisNote      String?
  confirmedAutonomous Boolean @default(false)
  submittedAt       DateTime?
  reviewedAt        DateTime?
  reviewedBy        String?
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  instructor        Instructor @relation(fields: [instructorId], references: [id])
  
  @@index([status])
  @@index([instructorId])
  @@map("instructor_documents")
}

enum DocumentStatus {
  PENDING
  APPROVED
  REJECTED
  PENDING_MORE_DOCS
}
```

### **2. tRPC Endpoints**

```typescript
// packages/api/src/routers/instructor.ts

// Upload de documentos
instructor.uploadDocuments
instructor.getDocumentStatus

// Admin - Aprovação
instructor.getPendingApprovals
instructor.approveInstructor
instructor.rejectInstructor
instructor.requestMoreDocuments

// KPIs
instructor.getApprovalMetrics
```

### **3. Componentes PWA**

```
apps/pwa/src/app/instrutor/cadastro/documentos/
├── page.tsx                    # Tela principal de upload
├── components/
│   ├── DocumentUpload.tsx      # Upload de CNH/Certificado
│   ├── ConfirmationCheckbox.tsx # Checkbox de confirmação
│   └── UploadProgress.tsx      # Barra de progresso
└── hooks/
    └── useDocumentUpload.ts    # Hook para upload
```

### **4. Componentes Admin**

```
apps/admin/src/app/aprovacoes/
├── page.tsx                    # Lista de aprovações pendentes
├── [id]/
│   └── page.tsx                # Detalhes do instrutor
└── components/
    ├── ApprovalCard.tsx        # Card de aprovação
    ├── InstructorDetails.tsx   # Detalhes completos
    ├── DocumentViewer.tsx      # Visualizador de documentos
    └── ApprovalActions.tsx     # Botões de ação
```

---

## 🔄 FLUXO DE IMPLEMENTAÇÃO

### **FASE 1: Database & Backend** (1-2h)

1. ✅ Atualizar schema do Prisma
2. ✅ Criar migrations
3. ✅ Implementar tRPC endpoints
4. ✅ Configurar upload de arquivos (Supabase Storage)

### **FASE 2: PWA - Upload de Documentos** (2-3h)

1. ✅ Criar tela de upload
2. ✅ Implementar upload de CNH (frente/verso)
3. ✅ Implementar upload de certificado
4. ✅ Validação de arquivos (tamanho, formato)
5. ✅ Tela de aguardo de aprovação

### **FASE 3: Admin - Área de Aprovação** (3-4h)

1. ✅ Lista de aprovações pendentes
2. ✅ Tela de detalhes do instrutor
3. ✅ Visualizador de documentos
4. ✅ Botões de aprovação/rejeição
5. ✅ Campo de análise

### **FASE 4: Notificações** (1-2h)

1. ✅ Push notifications
2. ✅ E-mail notifications
3. ✅ In-app notifications

### **FASE 5: KPIs & Dashboard** (1-2h)

1. ✅ Métricas de aprovação
2. ✅ Dashboard de KPIs
3. ✅ Relatórios

---

## 📦 DEPENDÊNCIAS

```json
{
  "dependencies": {
    "@supabase/storage-js": "^2.5.5",
    "react-dropzone": "^14.2.3",
    "react-pdf": "^7.7.0",
    "@react-pdf-viewer/core": "^3.12.0"
  }
}
```

---

## 🎨 DESIGN SYSTEM

### **Cores**

```typescript
const approvalColors = {
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
  pendingMoreDocs: 'orange'
}
```

### **Componentes Shadcn**

- Card
- Button
- Badge
- Dialog
- Textarea
- Checkbox
- Progress
- Alert

---

## 📊 KPIs

```typescript
interface ApprovalMetrics {
  approvalRate: number;      // > 95%
  analysisTime: number;      // < 24h
  rejectionRate: number;     // < 5%
  pendingMoreDocsRate: number; // < 5%
}
```

---

## 🚀 PRÓXIMOS PASSOS

1. **Aprovar o plano** ✅
2. **Começar implementação** 🚀
3. **Testar com usuários reais** 🧪
4. **Escalar o que funcionar** 📈

---

**Quer que eu comece a implementação agora?** 🚀
