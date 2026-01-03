# ✅ STATUS: Agenda & Pacotes do Instrutor [CONCLUÍDO]

## 🎯 Objetivo Completo
Transformar o App do Instrutor em um painel de controle para alimentar o ecossistema BORA.

## 🛠 Entregas Técnicas

### 1. Gestão de Pacotes
- **Backend:** Models e CRUD (`plan` router) implementados com suporte multi-instrutor.
- **Frontend:**
  - `screens/packages/index.tsx`: Listagem completa.
  - `screens/packages/create.tsx`: Criação simplificada.
  - Integração total com API.

### 2. Gestão de Agenda
- **Backend:**
  - Novo Router `availability`.
  - Endpoint `getMySettings` (Instrutor logado).
  - Endpoint `updateSettings` (Salva turnos).
  - Endpoint `getByInstructorId` (Para o ALUNO consultar).
- **Frontend:**
  - `screens/schedule/index.tsx`: Grade horária intuitiva (Manhã/Tarde/Noite).
  - Integração total com API.

### 3. Dashboard
- Novos atalhos funcionais para **Pacotes** e **Agenda**.

---

## 🚀 Próximo Passo: O "Ciclo da Vida" da Aula

Agora que o Instrutor define os dados, precisamos que o Aluno os consuma e gere uma VENDA.

**Ação Recomendada:**
1. Voltar ao App Aluno (`InstructorDetailModal.tsx`).
2. Trocar o mock de horários pela chamada `trpc.availability.getByInstructorId`.
3. Prosseguir para a **Tela de Checkout** (`LessonCheckout`), onde a mágica acontece (pagamento e criação da aula).
