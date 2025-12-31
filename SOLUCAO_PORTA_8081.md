# 🔧 Solução: Porta 8081 em Uso

## 🔴 Problema

O Metro Bundler (Expo) não consegue iniciar porque a porta **8081** já está em uso por outro processo.

### Erro:
```
Error: listen EADDRINUSE: address already in use :::8081
```

---

## ✅ Soluções

### Solução 1: Liberar a Porta (AUTOMÁTICO)

Use o script criado:

```powershell
.\liberar-porta.ps1 -Porta 8081
```

---

### Solução 2: Liberar Manualmente

#### Passo 1: Identificar o Processo

```powershell
# Ver qual processo está usando a porta
Get-NetTCPConnection -LocalPort 8081 | Select-Object OwningProcess

# Ver detalhes do processo
$pid = (Get-NetTCPConnection -LocalPort 8081).OwningProcess
Get-Process -Id $pid
```

#### Passo 2: Encerrar o Processo

```powershell
# Encerrar o processo (substitua PID pelo ID encontrado)
Stop-Process -Id <PID> -Force
```

#### Passo 3: Verificar

```powershell
# Verificar se a porta está livre agora
Get-NetTCPConnection -LocalPort 8081
# Se não retornar nada, a porta está livre!
```

---

### Solução 3: Usar Outra Porta

Se não conseguir liberar a porta, você pode usar outra porta:

```powershell
cd apps\app-instrutor
npx expo start --port 8082
```

O Expo perguntará se você quer usar outra porta automaticamente.

---

### Solução 4: Encerrar Todos os Processos Node

Se houver múltiplos processos Node rodando:

```powershell
# Ver todos os processos Node
Get-Process node -ErrorAction SilentlyContinue

# Encerrar todos os processos Node
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

**⚠️ CUIDADO:** Isso encerrará TODOS os processos Node, incluindo outros projetos que possam estar rodando.

---

## 🔍 Verificar Portas em Uso

Para ver todas as portas em uso pelos processos Node:

```powershell
Get-NetTCPConnection | Where-Object { $_.OwningProcess -in (Get-Process node -ErrorAction SilentlyContinue).Id } | Select-Object LocalPort, State, OwningProcess | Sort-Object LocalPort
```

---

## 📋 Portas Comuns do Projeto

| Serviço | Porta Padrão | Alternativa |
|---------|--------------|-------------|
| App Aluno (Expo) | 8081 | 8082, 8083 |
| App Instrutor (Expo) | 8081 | 8082, 8083 |
| Web Admin (Next.js) | 3000 | 3001 |
| API (tRPC) | 3001 | 3002 |

---

## 🚀 Após Liberar a Porta

Execute novamente:

```powershell
cd apps\app-instrutor
npx expo start
```

---

## 🆘 Se Nada Funcionar

1. **Reinicie o computador** - Isso encerrará todos os processos
2. **Verifique se há outros terminais abertos** com Metro Bundler rodando
3. **Feche todas as aplicações** relacionadas ao projeto
4. **Use outra porta** temporariamente

---

## 📝 Scripts Criados

- `liberar-porta.ps1` - Script para liberar qualquer porta em uso
- `SOLUCAO_PORTA_8081.md` - Esta documentação

---

## ✅ Checklist

- [ ] Identificar processo usando a porta 8081
- [ ] Encerrar o processo
- [ ] Verificar se a porta está livre
- [ ] Iniciar o app-instrutor novamente

---

**🚀 A porta 8081 foi liberada! Tente iniciar o app-instrutor novamente.**

