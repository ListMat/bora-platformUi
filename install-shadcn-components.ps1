# Script para instalar todos os componentes Shadcn/UI necessários

Write-Host "📦 Instalando componentes Shadcn/UI..." -ForegroundColor Cyan

$components = @(
    "button",
    "card",
    "input",
    "label",
    "dropdown-menu",
    "dialog",
    "tabs",
    "table",
    "badge",
    "avatar",
    "skeleton",
    "toast",
    "scroll-area",
    "select",
    "switch",
    "separator"
)

Set-Location "apps/admin"

foreach ($component in $components) {
    Write-Host "Installing $component..." -ForegroundColor Yellow
    npx shadcn-ui@latest add $component --yes
}

Write-Host "`n✅ Todos os componentes foram instalados!" -ForegroundColor Green
