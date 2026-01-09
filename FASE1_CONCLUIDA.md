# ✅ FASE 1: Database Schema - CONCLUÍDA

**Data:** 09/01/2026 00:06

---

## ✅ O QUE FOI FEITO

### **1. Enum DocumentStatus** ✅

```prisma
enum DocumentStatus {
  PENDING              // Aguardando aprovação
  APPROVED             // Aprovado
  REJECTED             // Rejeitado
  PENDING_MORE_DOCS    // Aguardando mais documentos
}
```

### **2. Modelo InstructorDocument** ✅

```prisma
model InstructorDocument {
  id                  String         @id @default(cuid())
  instructorId        String         @unique
  cnhFrontUrl         String?        // URL da CNH (frente)
  cnhBackUrl          String?        // URL da CNH (verso)
  certificateUrl      String?        // URL do certificado
  status              DocumentStatus @default(PENDING)
  analysisNote        String?        @db.Text
  confirmedAutonomous Boolean        @default(false)
  submittedAt         DateTime?
  reviewedAt          DateTime?
  reviewedBy          String?
  
  createdAt           DateTime       @default(now())
  updatedAt           DateTime       @updatedAt
  
  instructor          Instructor     @relation(fields: [instructorId], references: [id], onDelete: Cascade)
  
  @@index([status])
  @@index([instructorId])
  @@map("instructor_documents")
}
```

### **3. Atualização do Modelo Instructor** ✅

Adicionada relação:
```prisma
documents  InstructorDocument?
```

---

## ⚠️ PRÓXIMO PASSO

### **Aplicar as mudanças no banco:**

1. **Feche o Prisma Studio** (se estiver aberto)
2. **Execute:**

```bash
cd packages/db
npx prisma db push
```

3. **Aguarde a confirmação:**
```
✔ Your database is now in sync with your Prisma schema.
```

---

## 🔄 DEPOIS DO PUSH

Vou criar os tRPC endpoints para:
- ✅ Upload de documentos
- ✅ Listagem de aprovações pendentes
- ✅ Aprovação/Rejeição de instrutores
- ✅ Solicitação de mais documentos

---

## 📋 CHECKLIST

- [x] Enum DocumentStatus criado
- [x] Modelo InstructorDocument criado
- [x] Relação adicionada ao Instructor
- [ ] Prisma generate executado
- [ ] Prisma db push executado
- [ ] tRPC endpoints criados

---

**Feche o Prisma Studio e execute `npx prisma db push`!** 🚀
