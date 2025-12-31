# 📱 Guia de Instalação do Android SDK

## 🔴 Problema

O Android SDK não está instalado ou configurado. Isso é necessário para:
- Build de apps Android nativos
- Executar apps no emulador Android
- Usar `adb` (Android Debug Bridge)

---

## ✅ Solução 1: Instalar Android Studio (Recomendado)

### Passo 1: Baixar Android Studio

1. Acesse: https://developer.android.com/studio
2. Baixe o instalador para Windows
3. Execute o instalador

### Passo 2: Instalar

1. Siga o assistente de instalação
2. **Importante**: Marque a opção "Android SDK" durante a instalação
3. O SDK será instalado em: `C:\Users\Mateus\AppData\Local\Android\Sdk`

### Passo 3: Configurar Variáveis de Ambiente

Execute o script `configurar-android-sdk.ps1` (veja abaixo) ou configure manualmente:

**No PowerShell (temporário - apenas para esta sessão):**
```powershell
$env:ANDROID_HOME = "C:\Users\Mateus\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT = "C:\Users\Mateus\AppData\Local\Android\Sdk"
$env:Path += ";$env:ANDROID_HOME\platform-tools;$env:ANDROID_HOME\tools;$env:ANDROID_HOME\tools\bin"
```

**Permanente (via Interface do Windows):**
1. Pressione `Win + R`, digite `sysdm.cpl` e Enter
2. Vá em "Avançado" → "Variáveis de Ambiente"
3. Clique em "Novo" em "Variáveis do usuário" e adicione:
   - Nome: `ANDROID_HOME`
   - Valor: `C:\Users\Mateus\AppData\Local\Android\Sdk`
4. Clique em "Novo" novamente:
   - Nome: `ANDROID_SDK_ROOT`
   - Valor: `C:\Users\Mateus\AppData\Local\Android\Sdk`
5. Edite a variável `Path` e adicione:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`

### Passo 4: Verificar Instalação

```powershell
# Verificar se adb está funcionando
adb version

# Verificar variáveis
echo $env:ANDROID_HOME
```

---

## ✅ Solução 2: Instalar apenas Android SDK (Sem Android Studio)

### Passo 1: Baixar Command Line Tools

1. Acesse: https://developer.android.com/studio#command-tools
2. Baixe "Command line tools only" para Windows
3. Extraia para: `C:\Users\Mateus\AppData\Local\Android\Sdk\cmdline-tools\latest`

### Passo 2: Instalar SDK via Command Line

```powershell
# Criar diretório
New-Item -ItemType Directory -Force -Path "C:\Users\Mateus\AppData\Local\Android\Sdk\cmdline-tools\latest"

# Extrair o zip baixado para o diretório acima
# Depois executar:

cd "C:\Users\Mateus\AppData\Local\Android\Sdk\cmdline-tools\latest\bin"
.\sdkmanager.bat "platform-tools" "platforms;android-33" "build-tools;33.0.0"
```

### Passo 3: Configurar Variáveis (mesmo processo da Solução 1)

---

## ✅ Solução 3: Usar Expo Go (Não precisa de SDK)

Se você só quer testar o app no dispositivo físico, **não precisa instalar o Android SDK**:

1. Instale o **Expo Go** no seu celular Android
2. Execute: `npx expo start`
3. Escaneie o QR code com o Expo Go

**Vantagens:**
- ✅ Não precisa instalar Android SDK
- ✅ Teste rápido no dispositivo real
- ✅ Hot reload automático

**Desvantagens:**
- ❌ Não suporta módulos nativos customizados (Mapbox, Stripe)
- ❌ Não pode fazer build de APK

---

## 🚀 Solução Rápida: Script Automático

Execute o script `configurar-android-sdk.ps1` que verifica e configura automaticamente:

```powershell
.\configurar-android-sdk.ps1
```

---

## 📝 Verificação Pós-Instalação

Após instalar e configurar, verifique:

```powershell
# 1. Verificar variáveis
echo $env:ANDROID_HOME
echo $env:ANDROID_SDK_ROOT

# 2. Verificar adb
adb version

# 3. Verificar dispositivos conectados
adb devices

# 4. Verificar SDK instalado
$env:ANDROID_HOME\platform-tools\adb version
```

---

## 🆘 Problemas Comuns

### Erro: "adb não é reconhecido"
- **Solução**: Adicione `%ANDROID_HOME%\platform-tools` ao PATH
- **Verificar**: `echo $env:Path` deve conter o caminho do Android SDK

### Erro: "SDK não encontrado"
- **Solução**: Verifique se o caminho em `ANDROID_HOME` está correto
- **Verificar**: `Test-Path $env:ANDROID_HOME` deve retornar `True`

### Erro: "No devices found"
- **Solução**: 
  - Conecte um dispositivo via USB e ative "Depuração USB"
  - Ou inicie um emulador Android no Android Studio

---

## 📚 Recursos

- [Android Studio Download](https://developer.android.com/studio)
- [Android SDK Command Line Tools](https://developer.android.com/studio#command-tools)
- [Configurar Variáveis de Ambiente](https://developer.android.com/studio/command-line/variables)

---

**💡 Dica**: Se você só quer desenvolver e testar, use **Expo Go** (Solução 3). Instale o Android SDK apenas se precisar fazer builds nativos ou usar emulador.

