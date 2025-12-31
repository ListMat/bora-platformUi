# 🔧 Solução: Erro "Failed to download remote update" no Expo

## 🔴 Problema

Ambos os apps (Aluno e Instrutor) estavam apresentando o erro:
```
Uncaught Error: java.io.IOException: Failed to download remote update
```

Este erro ocorre quando o Expo tenta baixar atualizações OTA (Over-The-Air) automaticamente, mas falha devido a:
- Problemas de conexão com o servidor do Expo
- Firewall/VPN bloqueando conexões
- Configuração incorreta de updates
- Cache corrompido

---

## ✅ Solução Aplicada

Foi adicionada a configuração para **desabilitar atualizações automáticas** nos dois apps:

### Arquivos Modificados:

1. **`apps/app-aluno/app.json`**
2. **`apps/app-instrutor/app.json`**

### Configuração Adicionada:

```json
{
  "expo": {
    // ... outras configurações ...
    "updates": {
      "enabled": false,
      "fallbackToCacheTimeout": 0
    }
  }
}
```

---

## 🚀 Próximos Passos

### 1. Limpar Cache e Reiniciar

Execute nos dois apps:

```powershell
# App Aluno
cd apps\app-aluno
npx expo start --clear

# App Instrutor
cd apps\app-instrutor
npx expo start --clear
```

### 2. Verificar se o Erro Sumiu

Após reiniciar, o erro "Failed to download remote update" não deve mais aparecer.

---

## 📝 O Que Foi Feito

- ✅ **Desabilitadas atualizações automáticas** no App Aluno
- ✅ **Desabilitadas atualizações automáticas** no App Instrutor
- ✅ **Configurado fallback** para não usar cache de updates

---

## 🔍 Por Que Isso Resolve?

Ao desabilitar `updates.enabled: false`, o Expo:
- **Não tenta** baixar atualizações remotas automaticamente
- **Não verifica** por novas versões no servidor
- **Usa apenas** o código local durante desenvolvimento
- **Elimina** o erro de conexão com servidor remoto

---

## 💡 Quando Reativar Updates?

Se você quiser usar **EAS Updates** no futuro (para atualizações OTA em produção):

1. Configure o projeto no EAS:
   ```bash
   eas update:configure
   ```

2. Reative as updates no `app.json`:
   ```json
   {
     "expo": {
       "updates": {
         "url": "https://u.expo.dev/YOUR_PROJECT_ID",
         "enabled": true,
         "checkAutomatically": "ON_ERROR_RECOVERY"
       }
     }
   }
   ```

3. Publique updates:
   ```bash
   eas update --branch production --message "Nova versão"
   ```

---

## ✅ Status

- ✅ Configuração aplicada nos dois apps
- ⏳ Aguardando limpeza de cache e reinício
- ✅ Erro deve estar resolvido após reiniciar

---

## 🆘 Se o Erro Persistir

1. **Limpe o cache completamente:**
   ```powershell
   npx expo start -c
   ```

2. **Reinstale dependências:**
   ```powershell
   pnpm install
   ```

3. **Verifique conexão de rede:**
   ```powershell
   curl https://exp.host
   ```

4. **Reinicie o computador** (se nada funcionar)

---

**🚀 Execute `npx expo start --clear` nos dois apps para aplicar as mudanças!**

