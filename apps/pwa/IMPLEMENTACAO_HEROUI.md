# 🎯 PRÓXIMOS PASSOS - Implementação com HeroUI

## ✅ Status Atual

```
✅ HeroUI instalado (@heroui/react + framer-motion)
✅ PWA funcionando (localhost:3000)
✅ Estratégia documentada
✅ Monetização definida
✅ Páginas iniciais criadas
```

---

## 🚀 Implementação Imediata (Próximas 2-3 horas)

### 1. Configurar HeroUI no Tailwind

**Arquivo:** `apps/pwa/tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // HeroUI
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF",
            foreground: "#11181C",
            primary: {
              50: "#F5F3FF",
              100: "#EDE9FE",
              200: "#DDD6FE",
              300: "#C4B5FD",
              400: "#A78BFA",
              500: "#8B5CF6",
              600: "#7C3AED",
              700: "#6D28D9",
              800: "#5B21B6",
              900: "#4C1D95",
              DEFAULT: "#7C3AED",
              foreground: "#FFFFFF",
            },
            focus: "#7C3AED",
          },
        },
        dark: {
          colors: {
            background: "#000000",
            foreground: "#ECEDEE",
            primary: {
              DEFAULT: "#8B5CF6",
              foreground: "#FFFFFF",
            },
            focus: "#8B5CF6",
          },
        },
      },
    }),
  ],
};

export default config;
```

---

### 2. Adicionar HeroUIProvider

**Arquivo:** `apps/pwa/src/app/layout.tsx`

```typescript
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { HeroUIProvider } from "@heroui/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bora - Aulas de Direção",
  description: "Encontre os melhores instrutores de direção perto de você",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bora",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#7C3AED",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <HeroUIProvider>
          {children}
        </HeroUIProvider>
      </body>
    </html>
  );
}
```

---

### 3. Criar Navbar com HeroUI

**Arquivo:** `apps/pwa/src/components/Navbar.tsx`

```typescript
'use client';

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { useState } from "react";
import Link from "next/link";

export default function AppNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // TODO: Pegar do contexto de autenticação
  const user = null;

  const menuItems = [
    { name: "Encontrar Instrutores", href: "/#categories" },
    { name: "Como Funciona", href: "/#how-it-works" },
    { name: "Preços", href: "/pricing" },
    { name: "Boost", href: "/boost" },
  ];

  return (
    <Navbar 
      onMenuOpenChange={setIsMenuOpen}
      className="border-b border-divider"
      maxWidth="xl"
    >
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p className="font-bold text-2xl text-primary">bora</p>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-8" justify="center">
        {menuItems.map((item) => (
          <NavbarItem key={item.name}>
            <Link 
              href={item.href}
              className="text-foreground hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {user ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="primary"
                name={user.name}
                size="sm"
                src={user.avatar}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Olá, {user.name}</p>
                <p className="text-small">{user.email}</p>
              </DropdownItem>
              <DropdownItem key="dashboard">
                {user.role === 'student' ? 'Meu Painel' : 'Dashboard'}
              </DropdownItem>
              <DropdownItem key="settings">Configurações</DropdownItem>
              <DropdownItem key="logout" color="danger">
                Sair
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <div className="flex items-center gap-3">
            <NavbarItem className="hidden lg:flex">
              <Link href="/signup/instructor" className="text-foreground hover:text-primary">
                Seja um Instrutor
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Button 
                as={Link} 
                color="primary" 
                href="/signup/student" 
                variant="solid"
                radius="full"
              >
                Começar
              </Button>
            </NavbarItem>
          </div>
        )}
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
```

---

### 4. Dashboard Aluno (Básico)

**Arquivo:** `apps/pwa/src/app/student/dashboard/page.tsx`

```typescript
'use client';

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";

export default function StudentDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Olá, João! 👋</h1>
        <p className="text-foreground-500">Bem-vindo de volta ao seu painel</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-4xl font-bold text-primary mb-2">12</p>
            <p className="text-foreground-500">Aulas Realizadas</p>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="text-center py-6">
            <p className="text-4xl font-bold text-primary mb-2">6h</p>
            <p className="text-foreground-500">Horas de Prática</p>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="text-center py-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-4xl font-bold text-primary">4.8</span>
              <span className="text-2xl">⭐</span>
            </div>
            <p className="text-foreground-500">Sua Avaliação</p>
          </CardBody>
        </Card>
      </div>

      {/* Next Lesson */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-bold">Próxima Aula</h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center gap-4">
            <Avatar
              src="https://i.pravatar.cc/150?img=1"
              size="lg"
              isBordered
              color="primary"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Carlos Silva</h3>
              <p className="text-foreground-500">14/01/2026 às 10:00</p>
              <p className="text-sm text-foreground-400">Rua Exemplo, 123 - 2.1km</p>
            </div>
            <Chip color="success" variant="flat">Confirmada</Chip>
          </div>
        </CardBody>
        <CardFooter className="gap-3">
          <Button color="primary" variant="flat">Ver Detalhes</Button>
          <Button color="danger" variant="light">Cancelar</Button>
        </CardFooter>
      </Card>

      {/* Progress */}
      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-bold">Seu Progresso</h2>
        </CardHeader>
        <CardBody className="gap-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Prática de Direção</span>
              <span className="text-sm font-semibold">60%</span>
            </div>
            <Progress value={60} color="primary" />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Baliza e Manobras</span>
              <span className="text-sm font-semibold">40%</span>
            </div>
            <Progress value={40} color="primary" />
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Regras de Trânsito</span>
              <span className="text-sm font-semibold">80%</span>
            </div>
            <Progress value={80} color="primary" />
          </div>
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Button
          size="lg"
          color="primary"
          variant="solid"
          fullWidth
          startContent={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        >
          Buscar Novo Instrutor
        </Button>

        <Button
          size="lg"
          color="secondary"
          variant="bordered"
          fullWidth
          startContent={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        >
          Agendar Nova Aula
        </Button>
      </div>
    </div>
  );
}
```

---

## 📋 Checklist de Implementação

### Hoje
- [ ] Configurar Tailwind com HeroUI
- [ ] Adicionar HeroUIProvider no layout
- [ ] Criar Navbar com HeroUI
- [ ] Dashboard Aluno básico
- [ ] Dashboard Instrutor básico
- [ ] Testar tudo funcionando

### Esta Semana
- [ ] Sistema de autenticação (NextAuth)
- [ ] Conectar com backend tRPC
- [ ] Busca de instrutores
- [ ] Sistema de agendamento
- [ ] Notificações

### Comandos para Rodar

```bash
# Navegar para o PWA
cd apps/pwa

# Rodar em dev
pnpm dev

# Abrir no navegador
http://localhost:3000
```

---

## 🎯 Resultado Esperado

Após implementar os passos acima, você terá:

```
✅ Navbar moderna com HeroUI
✅ Dashboard Aluno funcional
✅ Design consistente e profissional
✅ Componentes reutilizáveis
✅ Temas light/dark automáticos
✅ Responsivo mobile-first
✅ Acessibilidade built-in
```

---

**Pronto para começar a implementação! 🚀**

Começe pelos arquivos na ordem:
1. `tailwind.config.ts`
2. `layout.tsx`
3. `Navbar.tsx`
4. `dashboard/page.tsx`

Boa sorte! 💜
