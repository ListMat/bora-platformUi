# 🎓 Sistema de Aprovação de Instrutores - Bora

Sistema completo de aprovação de instrutores com upload de documentos (CNH + Certificado) e análise administrativa.

---

## 🚀 Funcionalidades Implementadas

### **Para Instrutores (PWA)**
- ✅ Upload de CNH (frente e verso)
- ✅ Upload de Certificado CNH Brasil
- ✅ Validação de arquivos (10MB, JPG/PNG/PDF)
- ✅ Confirmação de instrutor autônomo
- ✅ Acompanhamento de status em tempo real
- ✅ Feedback visual por status

### **Para Administradores (Admin Panel)**
- ✅ Lista de aprovações pendentes
- ✅ Filtros e busca avançada
- ✅ Visualização completa do instrutor
- ✅ Análise de documentos
- ✅ Aprovação/Rejeição/Solicitação de mais documentos
- ✅ KPIs e métricas de aprovação

---

## 📁 Estrutura de Arquivos

### **Backend**
```
packages/
├── db/
│   └── prisma/
│       └── schema.prisma          # Modelo InstructorDocument
└── api/
    └── src/
        ├── routers/
        │   └── instructorDocuments.ts  # Endpoints tRPC
        └── index.ts                    # Router principal
```

### **PWA (Instrutor)**
```
apps/pwa/src/app/
├── instrutor/
│   ├── cadastro/
│   │   └── documentos/
│   │       └── page.tsx           # Upload de documentos
│   └── aguardando-aprovacao/
│       └── page.tsx               # Status de aprovação
```

### **Admin**
```
apps/admin/src/app/
└── aprovacoes/
    ├── page.tsx                   # Lista de aprovações
    └── [id]/
        └── page.tsx               # Detalhes e análise
```

---

## 🔄 Fluxo de Aprovação

### **1. Instrutor Envia Documentos**
```
/instrutor/cadastro/documentos
↓
Upload CNH (frente + verso)
Upload Certificado
Confirma que é autônomo
↓
Status: PENDING
↓
/instrutor/aguardando-aprovacao
```

### **2. Admin Analisa**
```
/aprovacoes
↓
Filtra por status
Busca por nome/email/CPF
↓
Clica "Analisar"
↓
/aprovacoes/[id]
↓
Visualiza documentos
Escreve nota de análise
↓
Aprova / Rejeita / Solicita mais docs
```

### **3. Instrutor Recebe Feedback**
```
Status atualiza automaticamente (30s)
↓
APPROVED → Pode dar aulas
REJECTED → Pode enviar novos documentos
PENDING_MORE_DOCS → Pode enviar documentos adicionais
```

---

## 📊 Status de Documentos

| Status | Descrição | Cor |
|--------|-----------|-----|
| `PENDING` | Aguardando aprovação | 🟡 Amarelo |
| `APPROVED` | Aprovado | 🟢 Verde |
| `REJECTED` | Rejeitado | 🔴 Vermelho |
| `PENDING_MORE_DOCS` | Mais documentos necessários | 🟠 Laranja |

---

## 🎯 Endpoints tRPC

### **Instrutor**
- `instructorDocuments.uploadDocuments` - Upload de documentos
- `instructorDocuments.getDocumentStatus` - Consultar status

### **Admin**
- `instructorDocuments.getPendingApprovals` - Listar aprovações
- `instructorDocuments.approveInstructor` - Aprovar
- `instructorDocuments.rejectInstructor` - Rejeitar
- `instructorDocuments.requestMoreDocuments` - Solicitar mais docs
- `instructorDocuments.getApprovalMetrics` - KPIs

---

## 📈 KPIs Disponíveis

```typescript
{
  total: number,              // Total de documentos
  approved: number,           // Aprovados
  rejected: number,           // Rejeitados
  pendingMoreDocs: number,    // Aguardando mais docs
  pending: number,            // Pendentes
  approvalRate: number,       // Taxa de aprovação (%)
  rejectionRate: number,      // Taxa de rejeição (%)
  pendingMoreDocsRate: number, // Taxa de solicitação (%)
  avgAnalysisTime: number,    // Tempo médio de análise (horas)
}
```

---

## 🛠️ Tecnologias Utilizadas

- **Database:** Prisma + PostgreSQL (Supabase)
- **Backend:** tRPC
- **Frontend PWA:** Next.js + Shadcn UI
- **Frontend Admin:** Next.js + Shadcn UI
- **Validação:** Zod
- **Notificações:** Toast (Shadcn)

---

## 🚀 Como Usar

### **Instrutor**
1. Acesse `/instrutor/cadastro/documentos`
2. Faça upload da CNH (frente e verso)
3. Faça upload do Certificado CNH Brasil
4. Confirme que é instrutor autônomo
5. Clique em "Enviar Documentos"
6. Aguarde aprovação em `/instrutor/aguardando-aprovacao`

### **Admin**
1. Acesse `/aprovacoes`
2. Veja a lista de aprovações pendentes
3. Clique em "Analisar" no instrutor desejado
4. Visualize os documentos enviados
5. Escreva uma nota de análise (opcional para aprovar, obrigatória para rejeitar)
6. Clique em:
   - "Aprovar Instrutor" - Aprova e ativa o instrutor
   - "Rejeitar Instrutor" - Rejeita e desativa o instrutor
   - "Solicitar Mais Documentos" - Solicita documentos adicionais

---

## 📝 Próximas Melhorias

- [ ] Integração com Supabase Storage para upload real
- [ ] Notificações push quando status mudar
- [ ] E-mail notifications
- [ ] Preview de imagens antes do upload
- [ ] Visualizador de PDF inline
- [ ] Dashboard de KPIs com gráficos
- [ ] Exportar relatórios
- [ ] Histórico de revisões

---

## 📄 Licença

MIT

---

**Desenvolvido com ❤️ para Bora**
