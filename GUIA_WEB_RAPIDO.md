# Guia Rápido: Rodando BORA no Web

Agora que os bugs de compatibilidade foram resolvidos, você pode rodar ambos os apps no navegador para desenvolvimento rápido de UI e fluxos.

## 1. App Aluno
Este app roda na porta **8083** por padrão.

### Como iniciar:
```powershell
cd "apps/app-aluno"
npx expo start --web --port 8083 --clear
```
Acesse: http://localhost:8083

---

## 2. App Instrutor
Este app roda na porta **8086** por padrão.

### Como iniciar:
```powershell
cd "apps/app-instrutor"
npx expo start --web --port 8086 --clear
```
Acesse: http://localhost:8086

## Limitações no Web
Para garantir que os apps rodem no navegador, algumas funcionalidades nativas foram desativadas temporariamente ou substituídas:

- **Mapas (Google Maps):** Substituídos por um placeholder cinza com aviso. O mapa não carregará.
- **Notificações Push:** Desativadas no web (o código foi protegido para ignorar).
- **Rastreamento de Localização em Background:** Desativado. A localização atual ainda pode ser obtida se o navegador permitir.

## Voltando para Mobile (Nativo)
Quando quiser gerar o APK ou rodar no emulador Android com todas as funções:
1. Comente os placeholders de mapa.
2. Descomente os imports de `react-native-maps`.
3. Rode `eas build --profile development --platform android`.
