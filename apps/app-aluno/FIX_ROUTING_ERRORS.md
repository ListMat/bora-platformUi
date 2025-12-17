# 🔧 Solução para Erros de Roteamento e Carregamento

## Problemas Identificados

### 1. ⚠️ Aviso: EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY não configurado

**Mensagem:**
```
WARN  [WARN] EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Stripe will not work.
```

**Solução:**
Este é apenas um aviso. O Stripe só é necessário se você for usar pagamentos com cartão. Se não for usar agora, pode ignorar.

Se quiser configurar (opcional):
1. Crie um arquivo `.env` na raiz do projeto `apps/app-aluno`
2. Adicione:
   ```
   EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

### 2. ⚠️ Aviso: No route named "index" exists

**Mensagem:**
```
WARN  [Layout children]: No route named "index" exists in nested children: ["lessons", "profile", "search"]
```

**Causa:**
Este aviso geralmente ocorre quando o Expo Router não detectou o arquivo `index.tsx` corretamente, geralmente por cache.

**Solução:**

1. **Limpar cache do Metro:**
   ```bash
   cd apps/app-aluno
   npx expo start --clear
   ```

2. **Se ainda não funcionar, limpar cache completo:**
   ```bash
   # Limpar cache do Expo
   npx expo start --clear
   
   # Limpar node_modules e reinstalar (se necessário)
   rm -rf node_modules
   pnpm install
   ```

3. **Verificar se o arquivo existe:**
   Certifique-se de que o arquivo `apps/app-aluno/app/(tabs)/index.tsx` existe e está exportando um componente padrão.

### 3. ❌ Erro: "Erro ao carregar instrutores"

**Mensagem:**
```
Erro ao carregar instrutores: [mensagem de erro]
```

**Possíveis causas e soluções:**

#### A. Erro de conexão com a API

**Verificar:**
1. A API está rodando? Verifique se o servidor backend está ativo
2. A URL da API está correta? Verifique `EXPO_PUBLIC_API_URL` no `.env`

**Solução:**
```bash
# Verificar se a API está rodando
# No diretório raiz do projeto:
pnpm --filter api dev
```

#### B. Erro de autenticação

**Sintoma:** Erro 401 ou 403

**Solução:**
1. Verifique se você está logado
2. Verifique se o token de autenticação está válido
3. Faça login novamente se necessário

#### C. Erro de localização

**Sintoma:** Erro ao obter localização ou permissão negada

**Solução:**
1. **Android:** Vá em Configurações > Apps > Bora Aluno > Permissões > Localização > Permitir
2. **iOS:** Vá em Configurações > Privacidade > Localização > Bora Aluno > Permitir

#### D. Erro de rede

**Sintoma:** Timeout ou erro de conexão

**Solução:**
1. Verifique sua conexão com a internet
2. Verifique se o firewall não está bloqueando
3. Tente novamente após alguns segundos

## Verificação Rápida

Execute este checklist:

- [ ] API está rodando (`pnpm --filter api dev`)
- [ ] Arquivo `.env` existe com `EXPO_PUBLIC_API_URL` configurado
- [ ] Permissão de localização foi concedida
- [ ] Cache do Metro foi limpo (`npx expo start --clear`)
- [ ] Arquivo `app/(tabs)/index.tsx` existe e está correto

## Debug

Para ver mais detalhes do erro:

1. **Ver console completo:**
   - No terminal onde o Expo está rodando
   - Ou no DevTools do dispositivo/emulador

2. **Verificar logs da API:**
   - Verifique o terminal onde a API está rodando
   - Procure por erros relacionados a `instructor.nearby`

3. **Testar endpoint manualmente:**
   ```bash
   # Se a API estiver em http://localhost:3000
   curl http://localhost:3000/api/trpc/instructor.nearby?input={"latitude":-23.5505,"longitude":-46.6333,"radius":10,"limit":20}
   ```

## Solução Rápida (Tudo de uma vez)

```bash
# 1. Limpar cache
cd apps/app-aluno
npx expo start --clear

# 2. Se ainda não funcionar, reinstalar dependências
rm -rf node_modules
pnpm install --ignore-scripts

# 3. Reiniciar o app
npx expo start --clear
```

## Se nada funcionar

1. **Reinicie o computador** (às vezes resolve problemas de cache)
2. **Verifique se todos os serviços estão rodando:**
   - Backend API
   - Banco de dados
   - Expo Dev Server
3. **Verifique os logs completos** para identificar o erro específico

