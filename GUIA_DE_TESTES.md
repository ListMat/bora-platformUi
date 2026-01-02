# 🧪 Guia de Testes - Fluxo "Solicitar Aula"

## 📋 Pré-requisitos

Antes de começar os testes, certifique-se de que:

1. ✅ Migration foi aplicada:
   ```bash
   cd packages/db
   npx prisma migrate dev
   npx prisma generate
   ```

2. ✅ Servidor está rodando:
   ```bash
   npm run dev
   ```

3. ✅ Apps estão buildados:
   ```bash
   # App do aluno
   cd apps/app-aluno
   npx expo start

   # App do instrutor (em outro terminal)
   cd apps/app-instrutor
   npx expo start
   ```

---

## 🎯 Cenários de Teste

### Cenário 1: Fluxo Completo - Sucesso

**Objetivo**: Testar o fluxo completo de solicitação e aceitação de aula

#### Passo 1: Criar Solicitação (Aluno)

1. Abrir app do aluno
2. Na home, clicar no FAB verde "Solicitar Aula"
3. **Step 1 - Data & Horário**:
   - Selecionar uma data (próximos 7 dias)
   - Selecionar um horário disponível
   - Verificar que horários com menos de 2h estão desabilitados
   - Clicar em "Continuar"

4. **Step 2 - Tipo de Aula**:
   - Verificar que "1ª Habilitação" está pré-selecionado
   - Pode trocar para outro tipo se desejar
   - Clicar em "Continuar"

5. **Step 3 - Veículo**:
   - Selecionar "Carro da autoescola" OU "Usar meu carro"
   - Se selecionar "Usar meu carro", verificar desconto de 15%
   - Clicar em "Continuar"

6. **Step 4 - Plano**:
   - Selecionar plano (1, 5 ou 10 aulas)
   - Verificar descontos aplicados
   - Se valor ≥ R$ 200, pode parcelar em até 3x
   - Clicar em "Continuar"

7. **Step 5 - Pagamento**:
   - Verificar que "Pix" está pré-selecionado
   - Pode trocar para outra forma se desejar
   - Verificar aviso: "Pagamento SEMPRE ao final da aula"
   - Clicar em "Continuar"

8. **Step 6 - Confirmação**:
   - Revisar todos os detalhes
   - Verificar valor total
   - Clicar em "Confirmar Solicitação"

9. **Resultado Esperado**:
   - ✅ Redirecionamento para tela de chat
   - ✅ Mensagem inicial do sistema aparece
   - ✅ Status da aula: PENDING
   - ✅ Log no console: "New lesson request from..."
   - ✅ Log no console: "[Push] Notification for user..." (instrutor)

#### Passo 2: Aceitar Solicitação (Instrutor)

1. Verificar log no console do servidor:
   ```
   [Push] Notification for user instructor-id:
   {
     title: "Nova solicitação de aula! 🚗",
     body: "João quer agendar uma aula para seg, 15 jan às 15:30",
     ...
   }
   ```

2. Abrir app do instrutor
3. Navegar para a tela de solicitações pendentes
4. Ver solicitação do aluno
5. Clicar em "Aceitar"

6. **Resultado Esperado**:
   - ✅ Status da aula muda para SCHEDULED
   - ✅ Log no console: "[Push] Notification for user..." (aluno)
   - ✅ Mensagem de confirmação aparece

#### Passo 3: Verificar Notificação (Aluno)

1. Verificar log no console do servidor:
   ```
   [Push] Notification for user student-id:
   {
     title: "Aula confirmada! ✅",
     body: "Phoenix aceitou sua solicitação. Segunda-feira, 15 de janeiro às 15:30. Te espero lá!",
     ...
   }
   ```

2. No app do aluno, verificar que:
   - ✅ Status da aula mudou para SCHEDULED
   - ✅ Chat está disponível
   - ✅ Pode enviar mensagens

---

### Cenário 2: Solicitação Recusada

**Objetivo**: Testar o fluxo quando instrutor recusa a solicitação

#### Passos:

1. Seguir **Cenário 1 - Passo 1** (criar solicitação)
2. No app do instrutor, clicar em "Recusar"
3. Opcionalmente, adicionar um motivo
4. Confirmar recusa

#### Resultado Esperado:

- ✅ Status da aula muda para CANCELLED
- ✅ Log no console: "[Push] Notification for user..." (aluno)
- ✅ Notificação de recusa com motivo (se fornecido)

---

### Cenário 3: Expiração Automática (2 minutos)

**Objetivo**: Testar o timer de expiração quando instrutor não responde

#### Passos:

1. Seguir **Cenário 1 - Passo 1** (criar solicitação)
2. **NÃO** aceitar nem recusar no app do instrutor
3. Aguardar 2 minutos
4. Observar logs do console

#### Resultado Esperado:

- ✅ Após 2 minutos, log aparece:
  ```
  Lesson lesson-id expired - instructor did not respond in time
  ```
- ✅ Log de notificação para aluno:
  ```
  [Push] Notification for user student-id:
  {
    title: "Solicitação expirada ⏰",
    body: "O instrutor não respondeu a tempo. Tente outro instrutor perto de você.",
    ...
  }
  ```
- ✅ Status da aula muda para EXPIRED

---

### Cenário 4: Validação de Horário (2h mínimas)

**Objetivo**: Testar validação de horário mínimo

#### Passos:

1. Abrir app do aluno
2. Clicar no FAB "Solicitar Aula"
3. No Step 1, tentar selecionar um horário com menos de 2h de antecedência

#### Resultado Esperado:

- ✅ Horário aparece desabilitado (opacidade reduzida)
- ✅ Não é possível selecionar
- ✅ Tooltip ou mensagem: "Mínimo 2h de antecedência"

---

### Cenário 5: Horário Ocupado

**Objetivo**: Testar validação de horário já ocupado

#### Passos:

1. Criar uma solicitação para um horário específico (ex: 15:30)
2. Instrutor aceita a solicitação
3. Tentar criar outra solicitação para o mesmo horário

#### Resultado Esperado:

- ✅ Backend retorna erro: "Horário já está ocupado"
- ✅ Frontend mostra mensagem de erro
- ✅ Usuário pode selecionar outro horário

---

### Cenário 6: Chat Durante Solicitação

**Objetivo**: Testar chat enquanto aula está PENDING

#### Passos:

1. Criar solicitação (status PENDING)
2. No app do aluno, tentar enviar mensagem no chat
3. No app do instrutor, tentar enviar mensagem no chat

#### Resultado Esperado:

- ✅ Ambos conseguem enviar mensagens
- ✅ Mensagens aparecem em tempo real
- ✅ Sem restrição de tempo (diferente de aulas ativas)

---

### Cenário 7: Parcelamento

**Objetivo**: Testar opção de parcelamento

#### Passos:

1. No Step 4 (Plano), selecionar plano de 5 ou 10 aulas (≥ R$ 200)
2. Verificar opção de parcelamento aparece
3. Selecionar 2x ou 3x
4. Confirmar solicitação

#### Resultado Esperado:

- ✅ Opção de parcelamento aparece apenas para valores ≥ R$ 200
- ✅ Pode selecionar 1x, 2x ou 3x
- ✅ Valor das parcelas é calculado corretamente
- ✅ Informação aparece no resumo final

---

### Cenário 8: Usar Carro Próprio (Desconto 15%)

**Objetivo**: Testar desconto ao usar carro próprio

#### Passos:

1. No Step 3 (Veículo), selecionar "Usar meu carro"
2. Verificar badge de desconto (-15%)
3. Continuar até Step 6 (Confirmação)
4. Verificar valor final

#### Resultado Esperado:

- ✅ Badge "-15%" aparece no card
- ✅ Valor final é 15% menor
- ✅ Informação aparece no resumo: "Carro próprio"

---

### Cenário 9: "Aula em 1 Clique" (Quick Book)

**Objetivo**: Testar funcionalidade de repetir última configuração

#### Passos:

1. Completar uma solicitação de aula
2. Voltar para a home
3. Verificar se aparece card "Aula em 1 clique"
4. Clicar no card
5. Verificar que dados estão pré-preenchidos

#### Resultado Esperado:

- ✅ Card "Aula em 1 clique" aparece na home
- ✅ Mostra última configuração (horário, tipo, plano, pagamento)
- ✅ Ao clicar, abre fluxo com dados pré-preenchidos
- ✅ Usuário só precisa confirmar

---

### Cenário 10: Navegação Entre Steps

**Objetivo**: Testar navegação para frente e para trás

#### Passos:

1. Abrir fluxo de solicitação
2. Avançar até Step 4
3. Clicar no botão "Voltar"
4. Verificar que dados foram mantidos
5. Avançar novamente
6. Verificar que dados ainda estão lá

#### Resultado Esperado:

- ✅ Botão "Voltar" funciona em todos os steps
- ✅ Dados são mantidos ao voltar
- ✅ Progress bar atualiza corretamente
- ✅ Stepper pills mostram step atual

---

## 🔍 Verificações de Console

### Logs Esperados

#### Ao Criar Solicitação:
```
New lesson request from João to instructor Phoenix
[Push] Notification for user instructor-id:
{
  title: "Nova solicitação de aula! 🚗",
  body: "João quer agendar uma aula para seg, 15 jan às 15:30",
  data: { type: 'lesson_request', lessonId: '...', ... }
}
```

#### Ao Aceitar:
```
[Push] Notification for user student-id:
{
  title: "Aula confirmada! ✅",
  body: "Phoenix aceitou sua solicitação. Segunda-feira, 15 de janeiro às 15:30. Te espero lá!",
  data: { type: 'lesson_accepted', lessonId: '...', ... }
}
```

#### Ao Recusar:
```
[Push] Notification for user student-id:
{
  title: "Solicitação recusada",
  body: "Phoenix não pode no momento. Que tal tentar outro horário?",
  data: { type: 'lesson_rejected', lessonId: '...', ... }
}
```

#### Ao Expirar:
```
Lesson lesson-id expired - instructor did not respond in time
[Push] Notification for user student-id:
{
  title: "Solicitação expirada ⏰",
  body: "O instrutor não respondeu a tempo. Tente outro instrutor perto de você.",
  data: { type: 'lesson_expired', lessonId: '...', ... }
}
```

---

## 🐛 Problemas Comuns e Soluções

### Problema: FAB não aparece

**Solução**:
- Verificar se arquivo `index.tsx` foi modificado
- Verificar z-index do FAB (deve ser 100)
- Limpar cache: `npx expo start -c`

### Problema: Modal não abre

**Solução**:
- Verificar rota: `/screens/SolicitarAulaFlow`
- Verificar se arquivo existe
- Verificar logs de erro no console

### Problema: Erro ao confirmar

**Solução**:
- Verificar se migration foi aplicada
- Verificar se servidor está rodando
- Verificar logs do backend
- Verificar se todos os campos estão preenchidos

### Problema: Timer não expira

**Solução**:
- Aguardar exatamente 2 minutos
- Verificar logs do console
- Verificar se status é PENDING
- Reiniciar servidor se necessário

### Problema: Notificações não aparecem

**Solução**:
- Por enquanto, notificações são apenas logs
- Verificar console do servidor
- Para ativar envio real, adicionar campo `pushToken` ao schema

---

## ✅ Checklist de Testes

### Funcionalidades Básicas
- [ ] FAB aparece na home
- [ ] Modal abre ao clicar no FAB
- [ ] Todos os 6 steps aparecem
- [ ] Progress bar funciona
- [ ] Stepper pills funcionam
- [ ] Botão "Voltar" funciona
- [ ] Botão "Continuar" funciona
- [ ] Dados são mantidos entre steps

### Validações
- [ ] Horário mínimo de 2h funciona
- [ ] Não permite horário ocupado
- [ ] Todos os campos obrigatórios validados
- [ ] Mensagens de erro aparecem

### Fluxo Completo
- [ ] Criar solicitação funciona
- [ ] Redirecionamento para chat funciona
- [ ] Mensagem inicial aparece
- [ ] Status PENDING é criado
- [ ] Instrutor pode aceitar
- [ ] Instrutor pode recusar
- [ ] Status muda para SCHEDULED ao aceitar
- [ ] Status muda para CANCELLED ao recusar

### Timer e Expiração
- [ ] Timer de 2 minutos funciona
- [ ] Status muda para EXPIRED após 2 min
- [ ] Notificação de expiração é enviada

### Notificações (Logs)
- [ ] Log de nova solicitação aparece
- [ ] Log de aula aceita aparece
- [ ] Log de aula recusada aparece
- [ ] Log de expiração aparece

### Recursos Extras
- [ ] Parcelamento funciona (≥ R$ 200)
- [ ] Desconto de 15% funciona (carro próprio)
- [ ] "Aula em 1 clique" funciona
- [ ] Chat funciona durante PENDING

---

## 📊 Métricas de Performance

### Tempo de Resposta

| Ação | Tempo Esperado |
|------|----------------|
| Abrir modal | < 300ms |
| Carregar step | < 200ms |
| Validar campo | < 100ms |
| Confirmar solicitação | < 1s |
| Redirecionar para chat | < 500ms |

### Uso de Memória

| Tela | Memória Esperada |
|------|------------------|
| Home | < 100MB |
| Modal aberto | < 150MB |
| Chat | < 120MB |

---

## 🎯 Critérios de Sucesso

Para considerar o teste bem-sucedido, todos os itens abaixo devem funcionar:

1. ✅ Fluxo completo em < 2 minutos (alvo: ~33s)
2. ✅ Todas as validações funcionando
3. ✅ Timer de 2 minutos funcionando
4. ✅ Notificações sendo logadas
5. ✅ Status mudando corretamente
6. ✅ Chat disponível durante PENDING
7. ✅ Sem erros no console
8. ✅ Sem crashes no app

---

**Boa sorte com os testes! 🚀**

Se encontrar algum problema, consulte:
- `IMPLEMENTACAO_COMPLETA.md` - Resumo completo
- `SOLICITAR_AULA_FLOW.md` - Documentação frontend
- `BACKEND_IMPLEMENTED.md` - Documentação backend
