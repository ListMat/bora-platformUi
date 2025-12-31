# Como Configurar Emulador Android ou Conectar Dispositivo Físico

## Opção 1: Usar Dispositivo Físico (Mais Rápido)

### Passo 1: Habilitar Modo Desenvolvedor

1. Abra **Configurações** no seu Android
2. Vá em **Sobre o telefone** (About phone)
3. Toque **7 vezes** em **Número da versão** (Build number)
4. Você verá a mensagem "Você é um desenvolvedor!"

### Passo 2: Habilitar Depuração USB

1. Volte para **Configurações**
2. Vá em **Sistema** > **Opções do desenvolvedor** (Developer options)
3. Ative **Depuração USB** (USB debugging)
4. (Opcional) Ative **Instalar via USB** (Install via USB)

### Passo 3: Conectar ao Computador

1. Conecte o celular ao computador via USB
2. No celular, aparecerá um popup pedindo permissão - toque em **Permitir**
3. Marque **Sempre permitir deste computador** (se disponível)

### Passo 4: Verificar Conexão

```powershell
# Verificar se o dispositivo está conectado
adb devices
```

**Resultado esperado**:
```
List of devices attached
ABC123XYZ    device
```

Se aparecer "unauthorized", aceite a permissão no celular.

### Passo 5: Rodar o App

```powershell
cd apps\app-aluno
npx expo run:android
```

---

## Opção 2: Criar Emulador Android (Recomendado para Desenvolvimento)

### Pré-requisitos

1. **Android Studio instalado** (veja `INSTALAR_ANDROID_SDK.md`)
2. **Android SDK configurado** com `ANDROID_HOME` e `PATH` (veja `configurar-android-sdk.ps1`)

### Passo 1: Abrir Android Studio

1. Abra o **Android Studio**
2. Vá em **More Actions** > **Virtual Device Manager**
   - Ou: **Tools** > **Device Manager**

### Passo 2: Criar Novo Emulador

1. Clique em **Create Device**
2. Escolha um dispositivo (ex: **Pixel 5**)
3. Clique em **Next**
4. Escolha uma imagem do sistema:
   - Recomendado: **API 33 (Android 13)** ou **API 34 (Android 14)**
   - Marque **Show Downloadable System Images** se necessário
   - Clique em **Download** se a imagem não estiver instalada
5. Clique em **Next**
6. Revise as configurações e clique em **Finish**

### Passo 3: Iniciar o Emulador

1. No **Device Manager**, clique no botão **Play** (▶) ao lado do emulador
2. Aguarde o emulador iniciar (pode levar alguns minutos na primeira vez)

### Passo 4: Verificar Conexão

```powershell
# Verificar se o emulador está rodando
adb devices
```

**Resultado esperado**:
```
List of devices attached
emulator-5554    device
```

### Passo 5: Rodar o App

```powershell
cd apps\app-aluno
npx expo run:android
```

---

## Opção 3: Usar Expo Go (Mais Simples - Não Requer Emulador)

Se você não precisa testar módulos nativos, use o **Expo Go**:

```powershell
cd apps\app-aluno
npx expo start
```

Depois escaneie o QR code com o Expo Go no celular.

**Vantagens**:
- ✅ Não precisa de emulador
- ✅ Não precisa de dispositivo conectado
- ✅ Mais rápido para desenvolvimento

**Limitações**:
- ❌ Não suporta módulos nativos customizados
- ❌ Algumas funcionalidades podem não estar disponíveis

---

## Troubleshooting

### Erro: "adb: command not found"

**Solução**: Configure o Android SDK:

```powershell
# Execute o script de configuração
.\configurar-android-sdk.ps1

# Ou configure manualmente:
# 1. Adicione ao PATH: C:\Users\SeuUsuario\AppData\Local\Android\Sdk\platform-tools
# 2. Reinicie o terminal
```

### Erro: "No devices found"

**Soluções**:

1. **Verificar se o dispositivo está conectado**:
   ```powershell
   adb devices
   ```

2. **Reiniciar o servidor ADB**:
   ```powershell
   adb kill-server
   adb start-server
   adb devices
   ```

3. **Verificar se a depuração USB está ativada** no celular

4. **Tentar outro cabo USB** (alguns cabos são apenas para carregar)

### Erro: "device unauthorized"

**Solução**:
1. No celular, aparecerá um popup pedindo permissão
2. Toque em **Permitir**
3. Marque **Sempre permitir deste computador**
4. Execute novamente: `adb devices`

### Emulador não inicia

**Soluções**:

1. **Verificar se o Hyper-V está desabilitado** (Windows):
   ```powershell
   # Verificar status
   Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All
   
   # Se estiver habilitado, desabilite:
   # Desabilitar Hyper-V (requer reiniciar)
   ```

2. **Verificar se o HAXM está instalado** (para Intel):
   - Abra Android Studio
   - Vá em **Tools** > **SDK Manager**
   - Aba **SDK Tools**
   - Marque **Intel x86 Emulator Accelerator (HAXM installer)**
   - Clique em **Apply**

3. **Usar emulador com menos recursos**:
   - Crie um emulador com menos RAM
   - Use uma imagem de sistema mais leve (API 28 ou 29)

### Verificar Status do ADB

```powershell
# Ver dispositivos conectados
adb devices

# Ver informações do dispositivo
adb shell getprop ro.build.version.release

# Reiniciar servidor ADB
adb kill-server
adb start-server
```

---

## Comandos Úteis

### Listar Dispositivos
```powershell
adb devices -l
```

### Instalar APK Diretamente
```powershell
adb install caminho/para/app.apk
```

### Ver Logs do Android
```powershell
adb logcat
```

### Limpar Cache do App no Dispositivo
```powershell
adb shell pm clear com.bora.aluno
```

### Reiniciar o App
```powershell
adb shell am force-stop com.bora.aluno
adb shell am start -n com.bora.aluno/.MainActivity
```

---

## Recomendações

### Para Desenvolvimento Rápido:
- ✅ Use **Expo Go** no celular físico
- ✅ Mais rápido e simples
- ✅ Hot reload funciona perfeitamente

### Para Testes Completos:
- ✅ Use **Development Build** no emulador ou dispositivo físico
- ✅ Testa todos os módulos nativos
- ✅ Mais próximo do ambiente de produção

### Para Produção:
- ✅ Use **EAS Build** para gerar APK/AAB
- ✅ Teste em dispositivos físicos reais
- ✅ Use Firebase Test Lab para testes automatizados

---

## Próximos Passos

Após configurar o emulador ou conectar o dispositivo:

1. **Verificar conexão**:
   ```powershell
   adb devices
   ```

2. **Rodar o app**:
   ```powershell
   cd apps\app-aluno
   npx expo run:android
   ```

3. **Aguardar o build** (pode levar alguns minutos na primeira vez)

4. **O app abrirá automaticamente** no emulador/dispositivo

---

## Referências

- [Expo - Android Studio Emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [Android - Enable USB Debugging](https://developer.android.com/studio/run/device.html#developer-device-options)
- [Android SDK Setup](https://developer.android.com/studio/command-line/variables)

