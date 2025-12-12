# 🚀 Guia de Release para GitHub

Este guia explica como criar um release no GitHub para o projeto BORA Platform UI.

## 📋 Pré-requisitos

1. Ter o Git configurado
2. Ter acesso ao repositório GitHub
3. Ter o GitHub CLI instalado (opcional, mas recomendado)

## 🔧 Opção 1: Usando GitHub CLI (Recomendado)

### 1. Instalar GitHub CLI

```bash
# Windows (via winget)
winget install GitHub.cli

# Ou baixar de: https://cli.github.com/
```

### 2. Autenticar no GitHub

```bash
gh auth login
```

### 3. Criar o Release

```bash
# Navegar até o diretório do projeto
cd "c:\Users\Mateus\Desktop\Bora UI"

# Criar release usando as notas do arquivo
gh release create v0.1.0 \
  --title "BORA Platform UI v0.1.0 - Initial Release" \
  --notes-file RELEASE_NOTES_v0.1.0.md \
  --latest
```

## 🔧 Opção 2: Usando Git + Interface Web do GitHub

### Passo 1: Commitar as mudanças (se necessário)

```bash
cd "c:\Users\Mateus\Desktop\Bora UI"

# Verificar status
git status

# Adicionar arquivos novos
git add CHANGELOG.md RELEASE_NOTES_v0.1.0.md scripts/release.sh

# Commitar
git commit -m "chore: adicionar arquivos de release v0.1.0"
```

### Passo 2: Criar e enviar a tag

```bash
# Criar tag anotada
git tag -a v0.1.0 -m "Release v0.1.0 - Initial Release"

# Enviar tag para o GitHub
git push origin v0.1.0
```

### Passo 3: Criar Release no GitHub

1. Acesse: `https://github.com/ListMat/bora-platformUi/releases/new`
2. Selecione a tag `v0.1.0` no dropdown "Choose a tag"
3. Preencha o título: `BORA Platform UI v0.1.0 - Initial Release`
4. Cole o conteúdo do arquivo `RELEASE_NOTES_v0.1.0.md` na descrição
5. Marque como "Latest release" (se for o release mais recente)
6. Clique em "Publish release"

## ✅ Verificação

Após criar o release, verifique:

1. A tag foi criada: `https://github.com/ListMat/bora-platformUi/tags`
2. O release foi publicado: `https://github.com/ListMat/bora-platformUi/releases`
3. As notas estão completas e formatadas corretamente

## 🔄 Próximos Releases

Para releases futuros:

1. Atualize o `CHANGELOG.md` com as novas mudanças
2. Atualize a versão no `package.json`
3. Siga os mesmos passos acima, ajustando o número da versão

---

**Boa sorte com o release! 🚀**
