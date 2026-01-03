# 🧪 PLANO DE TESTES COMPLETO - PROJETO BORA

## ✅ CHECKLIST DE TESTES

### 1. BACKEND (API)

#### 1.1 Servidor Rodando
- [ ] Backend está na porta 3000
- [ ] Next.js compilado sem erros
- [ ] API tRPC acessível

#### 1.2 Endpoints Principais
- [ ] `GET /api/trpc/user.me` - Retorna dados do usuário
- [ ] `POST /api/trpc/auth.login` - Login funciona
- [ ] `POST /api/trpc/auth.register` - Cadastro funciona
- [ ] `GET /api/trpc/instructor.nearby` - Lista instrutores próximos

#### 1.3 Banco de Dados
- [ ] Prisma Client gerado
- [ ] Conexão com PostgreSQL ativa
- [ ] Migrations aplicadas

---

### 2. APP ALUNO (MOBILE)

#### 2.1 Expo Metro
- [ ] Metro Bundler rodando na porta 8081
- [ ] QR Code gerado
- [ ] Sem erros de compilação

#### 2.2 Conexão com Backend
- [ ] URL configurada: `http://10.0.2.2:3000/api/trpc`
- [ ] Requisições chegando no backend
- [ ] Autenticação funcionando

#### 2.3 Telas Principais

**Tela de Login**
- [ ] Campos de email e senha visíveis
- [ ] Botão "Entrar" funcional
- [ ] Link "Criar Conta" funcional
- [ ] Validação de campos

**Tela de Cadastro**
- [ ] Formulário completo
- [ ] Validação de CPF
- [ ] Validação de email
- [ ] Criação de conta funcional

**HomeScreen (Mapa)**
- [ ] Mapa carrega corretamente
- [ ] Background dark (#030712)
- [ ] Saudação com nome do usuário
- [ ] Barra de busca estilizada
- [ ] Pinos de instrutores aparecem
- [ ] Localização do usuário detectada

**Card de Instrutor**
- [ ] Aparece ao clicar no pino
- [ ] Mostra foto do instrutor
- [ ] Exibe rating e número de aulas
- [ ] Mostra veículo (marca, modelo, placa)
- [ ] Preço por hora visível
- [ ] Animação suave ao aparecer

**Modal de Instrutor**
- [ ] Abre ao clicar no card
- [ ] Foto grande do veículo
- [ ] Tags de tipo de aula
- [ ] Horários disponíveis
- [ ] Localização do instrutor
- [ ] Detalhes do carro
- [ ] Botão "Solicitar Aula" funcional
- [ ] Botão de fechar (X) funcional
- [ ] Animação de slide up

---

### 3. EMULADOR ANDROID

#### 3.1 Conexão
- [ ] Emulador detectado (`emulator-5554`)
- [ ] ADB conectado
- [ ] Internet funcionando no emulador

#### 3.2 Expo Go
- [ ] App Expo Go instalado
- [ ] Consegue conectar via URL manual
- [ ] App carrega sem erros

---

### 4. INTEGRAÇÃO COMPLETA

#### 4.1 Fluxo de Login
1. [ ] Abrir app no emulador
2. [ ] Ver tela de login
3. [ ] Inserir credenciais
4. [ ] Fazer login com sucesso
5. [ ] Ser redirecionado para Home

#### 4.2 Fluxo de Cadastro
1. [ ] Clicar em "Criar Conta"
2. [ ] Preencher formulário
3. [ ] Criar conta com sucesso
4. [ ] Fazer login automático
5. [ ] Ver HomeScreen

#### 4.3 Fluxo de Visualização de Instrutor
1. [ ] Ver mapa com pinos
2. [ ] Clicar num pino
3. [ ] Ver card compacto
4. [ ] Clicar no card
5. [ ] Ver modal completo
6. [ ] Fechar modal

#### 4.4 Fluxo de Solicitação de Aula
1. [ ] Abrir modal de instrutor
2. [ ] Clicar em "Solicitar Aula"
3. [ ] Ser redirecionado para tela de agendamento
4. [ ] Preencher dados da aula
5. [ ] Confirmar solicitação

---

## 🔍 TESTES AUTOMATIZADOS

### Teste 1: Backend Respondendo
```powershell
Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
```
**Esperado:** Status 200 ou 404 (página existe)

### Teste 2: API tRPC Acessível
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/trpc/user.me" -UseBasicParsing
```
**Esperado:** Resposta JSON (mesmo que erro de autenticação)

### Teste 3: Emulador Conectado
```powershell
& "C:\Users\Mateus\AppData\Local\Android\Sdk\platform-tools\adb.exe" devices
```
**Esperado:** Lista com `emulator-5554   device`

### Teste 4: Metro Bundler Ativo
```powershell
netstat -ano | findstr :8081
```
**Esperado:** Processo escutando na porta 8081

---

## 🐛 TESTES DE ERRO

### Cenário 1: Login com credenciais inválidas
- [ ] Mostra mensagem de erro
- [ ] Não redireciona
- [ ] Campos permanecem preenchidos

### Cenário 2: Cadastro com email duplicado
- [ ] Mostra erro "Email já cadastrado"
- [ ] Não cria conta duplicada

### Cenário 3: Sem conexão com backend
- [ ] Mostra erro de conexão
- [ ] Botão "Tentar Novamente"
- [ ] Não trava o app

### Cenário 4: Sem permissão de localização
- [ ] Mapa carrega com localização padrão
- [ ] Mostra mensagem pedindo permissão
- [ ] Instrutores ainda aparecem

---

## 📊 MÉTRICAS DE SUCESSO

### Performance
- [ ] App carrega em menos de 3 segundos
- [ ] Mapa renderiza em menos de 2 segundos
- [ ] Transições suaves (60fps)
- [ ] Sem travamentos

### UX
- [ ] Interface intuitiva
- [ ] Feedback visual em todas as ações
- [ ] Mensagens de erro claras
- [ ] Design consistente com Figma

### Funcionalidade
- [ ] 100% das features principais funcionando
- [ ] Sem crashes
- [ ] Dados persistem após fechar app
- [ ] Autenticação mantém sessão

---

## 🚀 EXECUTAR TESTES

### Teste Rápido (5 minutos)
1. Abrir app no emulador
2. Fazer login
3. Ver mapa
4. Clicar num instrutor
5. Ver modal

### Teste Completo (15 minutos)
1. Criar nova conta
2. Fazer login
3. Explorar mapa
4. Testar todos os pinos
5. Abrir todos os modais
6. Solicitar uma aula
7. Fazer logout
8. Fazer login novamente

### Teste de Stress (30 minutos)
1. Criar múltiplas contas
2. Fazer login/logout várias vezes
3. Clicar em muitos pinos rapidamente
4. Abrir/fechar modais repetidamente
5. Verificar memory leaks
6. Testar com internet lenta

---

## 📝 RELATÓRIO DE BUGS

### Template:
```
BUG #X
Título: [Descrição curta]
Severidade: [Alta/Média/Baixa]
Passos para reproduzir:
1. ...
2. ...
3. ...

Resultado esperado: ...
Resultado atual: ...
Screenshot/Log: ...
```

---

## ✅ CRITÉRIOS DE APROVAÇÃO

Para considerar o projeto **PRONTO PARA PRODUÇÃO**:

- [ ] ✅ Todos os testes de integração passando
- [ ] ✅ Zero crashes em 30 minutos de uso
- [ ] ✅ Performance aceitável (< 3s load time)
- [ ] ✅ UI/UX conforme Figma
- [ ] ✅ Autenticação 100% funcional
- [ ] ✅ Backend respondendo corretamente
- [ ] ✅ Sem erros críticos no console

---

**Status Atual:** 🟡 EM TESTE

Vamos começar os testes! 🧪
