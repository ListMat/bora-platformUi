# Hermes Engine - Configuração e Benefícios

## O que é Hermes?

Hermes é um engine JavaScript otimizado para React Native desenvolvido pelo Facebook/Meta. Ele é o **engine padrão** usado pelo Expo e oferece várias vantagens de performance.

## Benefícios do Hermes

### 1. **Tempo de Inicialização Mais Rápido**
- Compila JavaScript em bytecode antes da execução (AOT - Ahead of Time)
- Reduz significativamente o tempo de inicialização do app
- Melhor experiência para o usuário

### 2. **Menor Tamanho Binário**
- O binário do Hermes é menor que outros engines (como JavaScriptCore)
- Apps ocupam menos espaço no dispositivo

### 3. **Menor Uso de Memória**
- Usa menos memória em runtime
- Especialmente valioso em dispositivos Android de baixo custo
- Melhor performance geral do app

### 4. **Debugging Moderno**
- Suporta Chrome DevTools Protocol
- Debugging direto no dispositivo (não precisa de remote debugging)
- Funciona com módulos JSI como `react-native-reanimated` v2+

## Configuração no Projeto

O Hermes já está configurado explicitamente nos arquivos `app.json`:

### `apps/app-aluno/app.json`
```json
{
  "expo": {
    "jsEngine": "hermes",
    // ... outras configurações
  }
}
```

### `apps/app-instrutor/app.json`
```json
{
  "expo": {
    "jsEngine": "hermes",
    // ... outras configurações
  }
}
```

## Configuração por Plataforma

Se você quiser usar Hermes em uma plataforma e JSC em outra:

```json
{
  "expo": {
    "jsEngine": "hermes",
    "ios": {
      "jsEngine": "jsc"  // Usar JSC no iOS, Hermes no Android
    }
  }
}
```

## Debugging com Hermes

### Abrir o Debugger

1. Inicie o projeto: `npx expo start`
2. Pressione `j` no terminal para abrir o debugger no Chrome/Edge
3. Ou use o menu de desenvolvedor no Expo Go/Development Build

### Verificar se Hermes está Ativo

Execute no terminal:
```bash
curl http://127.0.0.1:8081/json/list
```

Você deve ver uma resposta com `"vm": "Hermes"` se estiver funcionando.

### Troubleshooting

**Erro: "No compatible apps connected. JavaScript Debugging can only be used with the Hermes engine."**

Soluções:
1. Certifique-se de que `"jsEngine": "hermes"` está no `app.json`
2. Se usar `eas build`, certifique-se de que é um build de debug
3. Verifique se o app está conectado ao servidor de desenvolvimento
4. Tente recarregar o app pressionando `r` no terminal
5. Adicione `--localhost` ou `--tunnel` ao comando `npx expo start`

## Atualizações OTA e Hermes

⚠️ **Importante**: O formato de bytecode do Hermes pode mudar entre versões diferentes.

- Se você atualizar o React Native, também deve atualizar o `runtimeVersion` no `app.json`
- Updates produzidos para uma versão do Hermes não funcionarão em outra versão
- Sem atualizar o `runtimeVersion`, o app pode crashar ao iniciar

## Referências

- [Documentação Oficial do Expo - Using Hermes](https://docs.expo.dev/guides/using-hermes/)
- [Hermes GitHub](https://github.com/facebook/hermes)

## Status no Projeto

✅ **Hermes configurado** em:
- `apps/app-aluno/app.json`
- `apps/app-instrutor/app.json`

✅ **Benefícios ativos**:
- Tempo de inicialização otimizado
- Menor uso de memória
- Melhor performance geral
- Debugging moderno disponível

