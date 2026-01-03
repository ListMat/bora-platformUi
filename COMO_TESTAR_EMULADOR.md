# Como Testar o App BORA Aluno no Emulador Android

## ✅ Status Atual
- Emulador Android: **RODANDO** (emulator-5554)
- Backend API: **RODANDO** (porta 3000)
- Expo Metro: **INICIANDO**
- Configuração de IP: **CORRIGIDA** (10.0.2.2 para emulador)

## 🚀 Opção 1: Usar Expo Go (RECOMENDADO - Mais Rápido)

### Passo 1: Instalar Expo Go no Emulador
1. No emulador, abra a **Play Store**
2. Procure por "**Expo Go**"
3. Instale o app

### Passo 2: Conectar ao Expo
Aguarde o terminal mostrar o QR code e a URL (algo como `exp://192.168.x.x:8081`)

No emulador:
1. Abra o **Expo Go**
2. Toque em "**Enter URL manually**"
3. Digite: `exp://10.0.2.2:8081` (IP especial do emulador para acessar o PC)
4. O app vai carregar!

## 🔧 Opção 2: Build Nativo (Mais Demorado)

### Problema Atual
O build do Gradle está falhando. Possíveis causas:
- Configuração do React Native 0.76.5
- Dependências nativas incompatíveis
- Cache corrompido do Gradle

### Solução Alternativa
Se o Expo Go não funcionar, podemos:
1. Usar o **Expo EAS Build** (build na nuvem)
2. Ou investigar o erro específico do Gradle com `--stacktrace`

## 🎯 O Que Você Vai Ver no App

Quando o app abrir, você deverá ver:
1. **Mapa em Dark Mode** (fundo escuro #030712)
2. **Saudação dinâmica**: "Olá, [Seu Nome] 👋"
3. **Pinos no mapa** com instrutores
4. **Ao clicar num pino**:
   - Card compacto aparece embaixo
   - Clique no card para abrir o **Modal Completo**
5. **Modal Expandido** com:
   - Foto grande do veículo
   - Detalhes completos do instrutor
   - Botão amarelo "Solicitar Aula"

## ⚠️ Se der erro de conexão no app
Clique em "Tentar Novamente" - a configuração de IP já está correta!

## 📱 Comandos Úteis

### Ver logs do emulador:
```powershell
& "C:\Users\Mateus\AppData\Local\Android\Sdk\platform-tools\adb.exe" logcat | Select-String "ReactNative"
```

### Recarregar o app no Expo Go:
Pressione `R` no terminal do Expo ou sacuda o emulador (Ctrl+M)

### Parar tudo:
Pressione `Ctrl+C` no terminal do Expo
