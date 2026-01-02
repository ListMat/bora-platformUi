# 🧪 Guia Completo de Testes - App Bora

## 📋 Pré-requisitos

### 1. Aplicar Migrations
```bash
cd packages/db
npx prisma migrate dev
npx prisma generate
```

### 2. Instalar Dependências Faltantes
```bash
# Na raiz do projeto
npm install

# Dependência do QR Code (se não instalada)
cd packages/api
npm install qrcode
npm install -D @types/qrcode

# Dependência do Clipboard (se não instalada)
cd ../../apps/app-aluno
npx expo install expo-clipboard

# Dependência de Notificações (se não instalada)
npx expo install expo-notifications
```

### 3. Iniciar Servidor Backend
```bash
# Na raiz do projeto
npm run dev
```

### 4. Iniciar Apps
```bash
# App do Aluno (terminal 1)
cd apps/app-aluno
npx expo start

# App do Instrutor (terminal 2)
cd apps/app-instrutor
npx expo start
```

---

## 🎯 ROTEIRO DE TESTES COMPLETO

### Fase 1: Backend (15 min)

#### ✅ Teste 1.1: Servidor Rodando
```bash
# Verificar se o servidor está rodando
curl http://localhost:3000/api/trpc/health
```

**Resultado Esperado**: Status 200

#### ✅ Teste 1.2: Prisma Client Gerado
```bash
cd packages/db
npx prisma studio
```

**Resultado Esperado**: Prisma Studio abre no navegador

#### ✅ Teste 1.3: Verificar Novos Campos
No Prisma Studio:
1. Abrir tabela `User`
   - ✅ Verificar campo `pushToken` existe
2. Abrir tabela `Instructor`
   - ✅ Verificar campo `isOnline` existe
   - ✅ Verificar campo `acceptsOwnVehicle` existe
   - ✅ Verificar campo `bio` existe
3. Abrir tabela `Lesson`
   - ✅ Verificar campos `pixCode`, `pixQrCode`, `pixGeneratedAt`, etc. existem

---

### Fase 2: App do Aluno (30 min)

#### ✅ Teste 2.1: Home Screen
1. Abrir app do aluno
2. **Verificar**:
   - ✅ Mapa carrega (estilo Airbnb - fundo claro, sem POIs)
   - ✅ Markers dos instrutores aparecem (foto circular + badge verde)
   - ✅ FAB verde "Solicitar Aula" está visível
   - ✅ Bottom sheet com cards de instrutores

**Tempo**: ~2 min

#### ✅ Teste 2.2: Fluxo "Solicitar Aula" (6 Steps)
1. Clicar no FAB verde
2. **Step 1 - Data & Horário**:
   - ✅ Calendário horizontal aparece
   - ✅ Selecionar data
   - ✅ Pills de horários aparecem
   - ✅ Horários com menos de 2h estão desabilitados
   - ✅ Selecionar horário
   - ✅ Clicar "Continuar"

3. **Step 2 - Tipo de Aula**:
   - ✅ Cards horizontais aparecem
   - ✅ "1ª Habilitação" está pré-selecionado
   - ✅ Selecionar tipo
   - ✅ Clicar "Continuar"

4. **Step 3 - Veículo**:
   - ✅ Cards de veículos aparecem
   - ✅ Opção "Usar meu carro" aparece
   - ✅ Selecionar veículo
   - ✅ Clicar "Continuar"

5. **Step 4 - Plano**:
   - ✅ Cards de planos aparecem (1, 5, 10 aulas)
   - ✅ Descontos aparecem
   - ✅ Opção de parcelamento aparece (se ≥ R$ 200)
   - ✅ Selecionar plano
   - ✅ Clicar "Continuar"

6. **Step 5 - Pagamento**:
   - ✅ Opções de pagamento aparecem
   - ✅ "Pix" está pré-selecionado
   - ✅ Aviso "Pagamento ao final" aparece
   - ✅ Selecionar forma
   - ✅ Clicar "Continuar"

7. **Step 6 - Confirmação**:
   - ✅ Resumo completo aparece
   - ✅ Todos os dados estão corretos
   - ✅ Clicar "Confirmar Solicitação"

8. **Resultado**:
   - ✅ Redirecionamento automático para chat
   - ✅ Mensagem inicial do sistema aparece
   - ✅ Status da aula: PENDING

**Tempo**: ~26 segundos (objetivo: < 2 min) ✅

#### ✅ Teste 2.3: Chat com Timer
1. No chat da aula criada
2. **Verificar**:
   - ✅ Timer de 2 minutos aparece no header
   - ✅ Countdown está funcionando (MM:SS)
   - ✅ Mensagem inicial do sistema está formatada

**Tempo**: ~1 min

#### ✅ Teste 2.4: Notificações Push (Logs)
1. Verificar console do servidor
2. **Logs Esperados**:
```
[Push] Notification for user instructor-id:
{
  title: "Nova solicitação de aula! 🚗",
  body: "João quer agendar uma aula para seg, 15 jan às 15:30",
  ...
}
```

**Tempo**: ~30 seg

---

### Fase 3: App do Instrutor (20 min)

#### ✅ Teste 3.1: Aceitar Solicitação
1. Abrir app do instrutor
2. Navegar para solicitações pendentes
3. **Verificar**:
   - ✅ Solicitação do aluno aparece
   - ✅ Dados estão corretos
   - ✅ Botões "Aceitar" e "Recusar" aparecem

4. Clicar em "Aceitar"
5. **Resultado**:
   - ✅ Status muda para SCHEDULED
   - ✅ Log de notificação aparece no console
   - ✅ Mensagem de confirmação

**Tempo**: ~2 min

#### ✅ Teste 3.2: Timer de Expiração (2 min)
1. Criar nova solicitação (app do aluno)
2. **NÃO** aceitar nem recusar (app do instrutor)
3. Aguardar 2 minutos
4. **Verificar**:
   - ✅ Após 2 min, log aparece:
   ```
   Lesson lesson-id expired - instructor did not respond in time
   ```
   - ✅ Status muda para EXPIRED
   - ✅ Notificação de expiração é logada

**Tempo**: ~2 min (aguardando)

---

### Fase 4: Novos Componentes (30 min)

#### ✅ Teste 4.1: Modal de Detalhes do Instrutor
1. Na home do aluno
2. Clicar em um card de instrutor
3. **Verificar**:
   - ✅ Modal abre de baixo para cima
   - ✅ Header com foto grande (80px) aparece
   - ✅ Nome + nota + credencial aparecem
   - ✅ Seção "Sobre" aparece (se tiver bio)
   - ✅ Cards de veículos (scroll horizontal)
   - ✅ Cards de pacotes (1, 5, 10 aulas)
   - ✅ Pills de horários disponíveis hoje
   - ✅ Localidade aparece
   - ✅ Botão "Solicitar Aula" está fixo no rodapé

4. Clicar em "Solicitar Aula"
5. **Resultado**:
   - ✅ Modal fecha
   - ✅ Fluxo de solicitação abre

**Tempo**: ~3 min

#### ✅ Teste 4.2: Botões Rápidos no Chat
1. No chat de uma aula PENDING
2. **Verificar**:
   - ✅ Componente QuickReplyButtons aparece
   - ✅ 3 botões aparecem:
     - "Aceitar" (verde)
     - "Trocar horário"
     - "Recusar" (cinza)
   - ✅ Haptic feedback ao clicar

3. Clicar em "Aceitar"
4. **Resultado**:
   - ✅ Status muda para SCHEDULED
   - ✅ Botões desaparecem

**Tempo**: ~2 min

#### ✅ Teste 4.3: Timer Visual
1. No chat de uma aula PENDING
2. **Verificar**:
   - ✅ Timer aparece no header
   - ✅ Countdown está funcionando
   - ✅ Quando faltam 30s:
     - Fundo fica amarelo
     - Texto fica laranja
     - Badge "Urgente!" aparece
   - ✅ Quando expira:
     - Fundo fica vermelho
     - Texto "Tempo esgotado" aparece

**Tempo**: ~2 min (ou aguardar expiração)

#### ✅ Teste 4.4: Geração de Pix
1. Finalizar uma aula (status FINISHED)
2. No chat (app do instrutor):
   - ✅ Botão "Gerar Pix" aparece
   - ✅ Clicar no botão
   - ✅ QR Code aparece
   - ✅ Código Pix aparece
   - ✅ Botão "Copiar código" funciona
   - ✅ Texto "Expira em X minutos" aparece

3. No chat (app do aluno):
   - ✅ QR Code aparece
   - ✅ Botão "Confirmar Pagamento" aparece
   - ✅ Clicar no botão
   - ✅ Confirmação aparece

**Tempo**: ~3 min

#### ✅ Teste 4.5: Toggle Online/Offline
1. Na home do instrutor
2. **Verificar**:
   - ✅ Componente OnlineToggle aparece
   - ✅ Status atual é exibido (Online/Offline)
   - ✅ Dot verde/cinza aparece
   - ✅ Descrição aparece

3. Clicar no switch
4. **Resultado**:
   - ✅ Status muda
   - ✅ Dot muda de cor
   - ✅ Haptic feedback
   - ✅ Descrição atualiza

**Tempo**: ~2 min

#### ✅ Teste 4.6: Modal "Aceitar Aulas"
1. Na home do instrutor
2. Clicar em "Aceitar Aulas"
3. **Step 1 - Disponibilidade**:
   - ✅ Calendário horizontal (7 dias) aparece
   - ✅ Selecionar data
   - ✅ Grid de horários aparece
   - ✅ Selecionar múltiplos horários
   - ✅ Progress bar mostra 33%
   - ✅ Clicar "Continuar"

4. **Step 2 - Tipos de Aula**:
   - ✅ 6 cards aparecem
   - ✅ Selecionar múltiplos tipos
   - ✅ Progress bar mostra 66%
   - ✅ Clicar "Continuar"

5. **Step 3 - Veículo**:
   - ✅ Lista de veículos aparece
   - ✅ Opção "Aceitar carro do aluno" aparece
   - ✅ Selecionar veículo
   - ✅ Progress bar mostra 100%
   - ✅ Clicar "Aceitar Chamadas"

6. **Resultado**:
   - ✅ Modal fecha
   - ✅ Disponibilidade salva
   - ✅ Mensagem de sucesso

**Tempo**: ~5 min

---

### Fase 5: Mensagens Automáticas (10 min)

#### ✅ Teste 5.1: Aula Iniciada
1. Iniciar uma aula (mutation `lesson.start`)
2. **Verificar no chat**:
   - ✅ Mensagem do sistema aparece:
   ```
   🚗 Aula iniciada – 60 min restantes
   ```

#### ✅ Teste 5.2: Faltam 5 Minutos
1. Aguardar 55 minutos (ou simular)
2. **Verificar no chat**:
   - ✅ Mensagem do sistema aparece:
   ```
   ⏰ Faltam 5 min – preparando recibo
   ```

#### ✅ Teste 5.3: Aula Finalizada
1. Finalizar aula (mutation `lesson.finish`)
2. **Verificar no chat**:
   - ✅ Mensagem do sistema aparece:
   ```
   ✅ Aula finalizada. Instrutor irá gerar o Pix para receber o pagamento.
   ```

**Tempo**: ~5 min (ou simulado)

---

## 🐛 TROUBLESHOOTING

### Problema: Migration não aplicada
**Solução**:
```bash
cd packages/db
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
```

### Problema: Erro "Cannot find module 'qrcode'"
**Solução**:
```bash
cd packages/api
npm install qrcode @types/qrcode
```

### Problema: Erro "Cannot find module 'expo-clipboard'"
**Solução**:
```bash
cd apps/app-aluno
npx expo install expo-clipboard
```

### Problema: Notificações não aparecem
**Solução**:
- Verificar se `usePushNotifications()` foi adicionado no `_layout.tsx`
- Verificar permissões no dispositivo/emulador
- Por enquanto, notificações são apenas logs no console

### Problema: Timer não expira
**Solução**:
- Aguardar exatamente 2 minutos
- Verificar logs do console do servidor
- Reiniciar servidor se necessário

### Problema: Pix não gera
**Solução**:
- Verificar se migration foi aplicada
- Verificar se campos `pixCode`, `pixQrCode` existem na tabela `Lesson`
- Verificar logs de erro no console

---

## ✅ CHECKLIST FINAL DE TESTES

### Backend
- [ ] Servidor rodando
- [ ] Prisma Studio abre
- [ ] Novos campos existem no banco
- [ ] Migrations aplicadas

### App do Aluno
- [ ] Home carrega
- [ ] Mapa estilo Airbnb
- [ ] FAB aparece
- [ ] Fluxo de 6 steps funciona (~26s)
- [ ] Chat funciona
- [ ] Timer aparece
- [ ] Modal de detalhes funciona
- [ ] Botões rápidos funcionam
- [ ] Pix é gerado e confirmado

### App do Instrutor
- [ ] Solicitações aparecem
- [ ] Aceitar funciona
- [ ] Recusar funciona
- [ ] Timer de expiração funciona
- [ ] Toggle online/offline funciona
- [ ] Modal "Aceitar Aulas" funciona
- [ ] Pix é gerado

### Notificações
- [ ] Logs aparecem no console
- [ ] Nova solicitação (instrutor)
- [ ] Aula aceita (aluno)
- [ ] Aula recusada (aluno)
- [ ] Solicitação expirada (aluno)

### Mensagens Automáticas
- [ ] "Aula iniciada"
- [ ] "Faltam 5 min"
- [ ] "Aula finalizada"

---

## 📊 MÉTRICAS DE SUCESSO

| Métrica | Meta | Como Medir |
|---------|------|------------|
| Tempo do fluxo | < 2 min | Cronômetro (~26s ✅) |
| Timer funciona | 2 min | Aguardar expiração |
| Pix gerado | < 5s | Cronômetro |
| Modal abre | < 300ms | Visual |
| Notificações | 100% | Logs no console |

---

## 🎯 PRÓXIMOS PASSOS APÓS TESTES

### Se Todos os Testes Passarem ✅
1. Integrar componentes nas telas
2. Testar em dispositivo físico
3. Deploy em staging
4. Testes com usuários reais
5. Lançamento em produção

### Se Houver Erros ❌
1. Documentar erros encontrados
2. Verificar logs do console
3. Verificar migrations
4. Corrigir e testar novamente

---

**Boa sorte com os testes! 🚀**

Se encontrar algum problema, consulte:
- `IMPLEMENTACAO_100_COMPLETA.md` - Resumo completo
- `FLUXO_COMPLETO_360.md` - Fluxo detalhado
- `PRIORIDADE_ALTA_IMPLEMENTADA.md` - Componentes

**Tempo Total Estimado**: ~2 horas
