#!/bin/bash

# Script para criar release no GitHub
# Uso: ./scripts/release.sh [version] [message]

set -e

VERSION=${1:-"v0.1.0"}
MESSAGE=${2:-"Release $VERSION"}

echo "🚀 Criando release $VERSION..."

# Verificar se estamos no branch main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
  echo "⚠️  Você não está no branch main. Deseja continuar? (y/n)"
  read -r response
  if [ "$response" != "y" ]; then
    exit 1
  fi
fi

# Verificar se há mudanças não commitadas
if [ -n "$(git status --porcelain)" ]; then
  echo "⚠️  Há mudanças não commitadas. Deseja continuar? (y/n)"
  read -r response
  if [ "$response" != "y" ]; then
    exit 1
  fi
fi

# Atualizar versão no package.json (se necessário)
if grep -q "\"version\": \"0.1.0\"" package.json; then
  echo "📝 Versão já está atualizada no package.json"
fi

# Criar tag
echo "🏷️  Criando tag $VERSION..."
git tag -a "$VERSION" -m "$MESSAGE"

# Push da tag
echo "📤 Fazendo push da tag..."
git push origin "$VERSION"

echo "✅ Tag $VERSION criada e enviada com sucesso!"
echo ""
echo "📋 Próximos passos:"
echo "1. Acesse https://github.com/ListMat/bora-platform/releases/new"
echo "2. Selecione a tag $VERSION"
echo "3. Adicione as notas de release do CHANGELOG.md"
echo "4. Publique o release"
echo ""
echo "Ou use o GitHub CLI:"
echo "gh release create $VERSION --title \"$MESSAGE\" --notes-file CHANGELOG.md"
