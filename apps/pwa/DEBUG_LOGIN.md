# 🐛 Debug Log: Login Automático

**Problema:** Após criar conta em `/signup/instructor`, o usuário é redirecionado para o onboarding mas as chamadas tRPC falham com `UNAUTHORIZED`.

**Causa Provável:** O `signIn` do NextAuth no callback `onSuccess` não está definindo o cookie de sessão corretamente antes do redirecionamento, ou o redirecionamento acontece rápido demais, ou o CredentialsProvider está rejeitando o login recém-criado.

**Evidência:**
- Teste E2E mostrou criação de usuário com sucesso (API 200).
- Chamada subsequente para `createFirstPlan` retornou 401.

**Ações para Correção:**
1.  **Verificar `[...nextauth]/route.ts`:** Adicionar `console.log` no `authorize` para ver se a senha está batendo.
2.  **Ajustar Frontend:** Adicionar um pequeno delay ou verificação de sessão (`useSession`) após o `signIn` e antes do `router.push`.
3.  **Verificar BaseUrl:** Garantir que `NEXTAUTH_URL` está correto no `.env` (http://localhost:3000).

**Workaround Atual:** O usuário pode fazer login manualmente em `/api/auth/signin` após criar a conta.
