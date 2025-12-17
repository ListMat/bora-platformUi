# 📦 Instalação de Dependências - App Instrutor

Este documento lista as dependências adicionais necessárias para as funcionalidades implementadas.

## Dependências Necessárias

**✅ Todas as dependências já foram instaladas!**

Se precisar reinstalar, use:

```bash
cd "C:\Users\Mateus\Desktop\Bora UI"
pnpm add expo-device@~6.0.2 expo-notifications@~0.28.19 react-native-qrcode-svg@^6.3.0 react-native-svg@^15.2.0 --filter app-instrutor --ignore-scripts
```

**Nota:** O flag `--ignore-scripts` é necessário no Windows para evitar problemas com variáveis de ambiente corrompidas. Veja `FIX_INSTALL.md` para mais detalhes.

**Configuração:**
- As notificações push requerem um dispositivo físico para funcionar
- Configure as credenciais do Expo Push Notification Service no backend
- Adicione as variáveis de ambiente necessárias

### 2. QR Code

```bash
pnpm add react-native-qrcode-svg react-native-svg
```

**Uso:**
- A biblioteca `react-native-qrcode-svg` é usada para renderizar QR Codes Pix
- Funciona tanto no iOS quanto no Android

### 3. Localização em Tempo Real

A dependência `expo-location` já está instalada. Certifique-se de que as permissões de localização estão configuradas no `app.json`.

## Configuração do Backend

### Variáveis de Ambiente

Adicione ao `.env` na raiz do projeto:

```env
# Mercado Pago (opcional - para Pix real)
MERCADO_PAGO_ACCESS_TOKEN="your-mercadopago-access-token"

# PagSeguro (opcional - alternativa ao Mercado Pago)
PAGSEGURO_TOKEN="your-pagseguro-token"

# Expo Push Notifications
EXPO_ACCESS_TOKEN="your-expo-access-token"
```

### Gateway de Pagamento

Para usar Pix real em produção, escolha um dos gateways:

1. **Mercado Pago** (Recomendado para Brasil)
   - Crie conta em https://www.mercadopago.com.br
   - Obtenha o Access Token
   - Configure webhooks para receber confirmações de pagamento

2. **PagSeguro**
   - Crie conta em https://pagseguro.uol.com.br
   - Obtenha o token de integração
   - Configure notificações de pagamento

3. **Stripe PIX** (Brasil)
   - Requer conta Stripe Brasil
   - Configure PIX no dashboard

## Funcionalidades Implementadas

✅ **Notificações Push**
- Registro automático de token
- Recebimento de notificações em foreground e background
- Navegação automática ao tocar na notificação

✅ **QR Code Pix**
- Geração de QR Code visual
- Código Pix para copiar e colar
- Integração preparada para gateways reais

✅ **Localização em Tempo Real**
- Atualização automática quando online
- Intervalo configurável (padrão: 30 segundos)
- Permissões de localização gerenciadas automaticamente

✅ **Saque Pix**
- Tela completa de solicitação de saque
- Validação de saldo e valor mínimo
- Suporte a diferentes tipos de chave Pix

✅ **Reagendamento**
- Modal de reagendamento com calendário
- Validação de horários disponíveis
- Notificação automática ao aluno

## Próximos Passos

1. **Instalar dependências:**
   ```bash
   cd apps/app-instrutor
   pnpm install
   ```

2. **Configurar variáveis de ambiente** (ver seção acima)

3. **Testar em dispositivo físico:**
   - Notificações push só funcionam em dispositivos físicos
   - Localização em tempo real requer permissões do sistema

4. **Integrar gateway de pagamento real:**
   - Escolher entre Mercado Pago, PagSeguro ou Stripe
   - Implementar webhooks para confirmação de pagamento
   - Atualizar código em `packages/api/src/routers/payment.ts`

## Troubleshooting

### Notificações não funcionam
- Verifique se está usando dispositivo físico
- Confirme que as permissões foram concedidas
- Verifique o token no backend

### QR Code não renderiza
- Instale `react-native-qrcode-svg` e `react-native-svg`
- Execute `pnpm install` novamente
- Reinicie o Metro bundler

### Localização não atualiza
- Verifique permissões no dispositivo
- Confirme que o toggle "Online" está ativado
- Verifique logs do console para erros

