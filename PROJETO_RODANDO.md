# 🚀 PROJETO RODANDO - Bora Platform

**Data:** 09/01/2026 00:59

---

## ✅ SERVIDORES ATIVOS

### **Admin Panel**
- 🌐 **URL Local:** http://localhost:3002
- 🌐 **URL Rede:** http://192.168.18.61:3002
- 📁 **Diretório:** `apps/admin`
- 🔑 **Login:** admin@bora.com / admin123

### **PWA (Instrutor/Aluno)**
- 🌐 **URL Local:** http://localhost:3000
- 🌐 **URL Rede:** http://192.168.18.61:3000
- 📁 **Diretório:** `apps/pwa`

---

## 🎯 ROTAS DISPONÍVEIS

### **Admin Panel (http://localhost:3002)**

#### **Autenticação**
- `/auth/login` - Login do admin

#### **Dashboard**
- `/` - Dashboard principal

#### **Aprovações (NOVO!)**
- `/aprovacoes` - Lista de aprovações pendentes
- `/aprovacoes/[id]` - Detalhes e análise do instrutor

---

### **PWA (http://localhost:3000)**

#### **Instrutor (NOVO!)**
- `/instrutor/cadastro/documentos` - Upload de CNH + Certificado
- `/instrutor/aguardando-aprovacao` - Status de aprovação

#### **Outras Rotas**
- `/` - Home
- `/login` - Login
- `/register` - Cadastro

---

## 🧪 COMO TESTAR O SISTEMA DE APROVAÇÃO

### **1. Criar Conta de Instrutor (PWA)**
```
1. Acesse: http://localhost:3000/register
2. Crie uma conta como instrutor
3. Faça login
```

### **2. Enviar Documentos (PWA)**
```
1. Acesse: http://localhost:3000/instrutor/cadastro/documentos
2. Faça upload da CNH (frente)
3. Faça upload da CNH (verso)
4. Faça upload do Certificado
5. Marque o checkbox de confirmação
6. Clique em "Enviar Documentos"
7. Será redirecionado para /instrutor/aguardando-aprovacao
```

### **3. Analisar Documentos (Admin)**
```
1. Acesse: http://localhost:3002/auth/login
2. Login: admin@bora.com / admin123
3. Vá para: http://localhost:3002/aprovacoes
4. Veja a lista de aprovações pendentes
5. Clique em "Analisar" no instrutor
6. Visualize os documentos
7. Escreva uma nota de análise (opcional)
8. Clique em:
   - "Aprovar Instrutor" OU
   - "Rejeitar Instrutor" OU
   - "Solicitar Mais Documentos"
```

### **4. Ver Resultado (PWA)**
```
1. Volte para: http://localhost:3000/instrutor/aguardando-aprovacao
2. O status será atualizado automaticamente
3. Se aprovado: será redirecionado para o dashboard
4. Se rejeitado: verá a nota de análise e poderá enviar novos docs
```

---

## 📊 STATUS DOS DOCUMENTOS

| Status | Descrição | Cor |
|--------|-----------|-----|
| 🟡 PENDING | Aguardando aprovação | Amarelo |
| 🟢 APPROVED | Aprovado | Verde |
| 🔴 REJECTED | Rejeitado | Vermelho |
| 🟠 PENDING_MORE_DOCS | Mais documentos necessários | Laranja |

---

## 🔑 CREDENCIAIS DE TESTE

### **Admin**
- Email: `admin@bora.com`
- Senha: `admin123`

### **Instrutor (se existir)**
- Email: `instrutor@bora.com`
- Senha: `admin123`

### **Aluno (se existir)**
- Email: `aluno@bora.com`
- Senha: `admin123`

---

## 🛠️ COMANDOS ÚTEIS

### **Parar Servidores**
```bash
# Parar todos os processos Node
taskkill /F /IM node.exe
```

### **Reiniciar Admin**
```bash
cd apps/admin
npm run dev
```

### **Reiniciar PWA**
```bash
cd apps/pwa
npm run dev
```

### **Ver Logs do Banco**
```bash
cd packages/db
npx prisma studio
```

### **Atualizar Prisma Client**
```bash
cd packages/db
npx prisma generate
```

---

## 📝 NOTAS IMPORTANTES

### **Upload de Arquivos**
⚠️ **Atenção:** O upload de arquivos ainda não está integrado com o Supabase Storage.
Por enquanto, as URLs são mockadas. Para integrar:

1. Configurar Supabase Storage
2. Criar bucket `instructor-documents`
3. Implementar função de upload
4. Atualizar componente de upload

### **Notificações**
⚠️ **Atenção:** Notificações push/email ainda não estão implementadas.
Quando o status mudar, o instrutor precisa:
- Recarregar a página manualmente, OU
- Aguardar o auto-refresh (30 segundos)

---

## 🎯 PRÓXIMOS PASSOS

1. ✅ **Testar o fluxo completo**
2. ⏳ Integrar Supabase Storage
3. ⏳ Implementar notificações
4. ⏳ Criar dashboard de KPIs
5. ⏳ Adicionar visualizador de PDF

---

## 🐛 TROUBLESHOOTING

### **Erro: Port already in use**
```bash
# Parar todos os processos
taskkill /F /IM node.exe

# Reiniciar
cd apps/admin
npm run dev
```

### **Erro: Prisma Client not found**
```bash
cd packages/db
npx prisma generate
```

### **Erro: Database connection**
```bash
# Verificar .env.local
# Verificar se DATABASE_URL e DIRECT_URL estão corretos
```

---

## ✅ CHECKLIST DE TESTE

- [ ] Admin login funcionando
- [ ] PWA abrindo corretamente
- [ ] Rota de upload de documentos acessível
- [ ] Upload de arquivos funcionando (mock)
- [ ] Checkbox de confirmação obrigatório
- [ ] Redirecionamento após envio
- [ ] Tela de aguardo mostrando status
- [ ] Lista de aprovações no admin
- [ ] Detalhes do instrutor visíveis
- [ ] Botões de aprovação funcionando
- [ ] Dialogs de confirmação aparecendo
- [ ] Status atualizando após ação

---

**PROJETO RODANDO E PRONTO PARA TESTE!** 🚀
