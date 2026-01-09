'use client';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Wallet, User, LogOut, LayoutDashboard, Settings } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AppNavbar() {
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const user = session?.user;
    const isLoggedIn = status === 'authenticated';

    // Iniciais do nome para fallback do avatar
    const initials = user?.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'US';

    const menuItems = [
        { name: "Encontrar Instrutores", href: "/#categories" },
        { name: "Como Funciona", href: "/#how-it-works" },
        { name: "Preços", href: "/pricing" },
        { name: "Boost", href: "/boost" },
    ];


    // Determina o link do dashboard baseado na role
    // Para instrutores, redireciona para o dashboard ou onboarding conforme status
    // Futura implementação: buscar instructor.onboardingProgress via tRPC
    const dashboardLink = user?.role === 'INSTRUCTOR' ? '/instructor/onboarding/documentos' : '/student/dashboard';

    return (
        <nav className="border-b bg-background sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Botão Mobile (Hamburger) */}
                    <div className="flex items-center sm:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-foreground p-2 focus:outline-none">
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Logo */}
                    <div className="flex-1 flex justify-center sm:justify-start sm:flex-none">
                        <Link href={isLoggedIn ? dashboardLink : "/"} className="flex items-center gap-2">
                            <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="font-bold text-2xl text-primary">bora</span>
                        </Link>
                    </div>

                    {/* Desktop Menu - Apenas se NÃO estiver logado */}
                    {!isLoggedIn && (
                        <div className="hidden sm:flex sm:space-x-8">
                            {menuItems.map((item) => (
                                <Link key={item.name} href={item.href} className="text-foreground hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Actions / User Menu (Desktop) */}
                    <div className="hidden sm:flex items-center space-x-4">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-4">
                                {/* Wallet / Credits */}
                                <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border">
                                    <Wallet className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-semibold">R$ 0,00</span>
                                </div>

                                {/* User Dropdown */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-transparent">
                                            <Avatar className="h-10 w-10 border-2 border-primary/10 transition-all hover:border-primary/50">
                                                <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                                                <AvatarFallback className="bg-primary/5 text-primary font-bold">{initials}</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end" forceMount>
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{user?.name}</p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href={dashboardLink} className="cursor-pointer">
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                <span>Dashboard</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile" className="cursor-pointer">
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Meu Perfil</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/settings" className="cursor-pointer">
                                                <Settings className="mr-2 h-4 w-4" />
                                                <span>Configurações</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive cursor-pointer"
                                            onClick={() => signOut({ callbackUrl: '/' })}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Sair</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <>
                                <Link href="/signup/instructor" className="text-foreground hover:text-primary text-sm font-medium transition-colors">
                                    Seja um Instrutor
                                </Link>
                                <Button asChild>
                                    <Link href="/signup/student">Começar</Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile: Avatar Link quando logado (simplificado) */}
                    <div className="flex sm:hidden w-[40px] justify-end">
                        {isLoggedIn && (
                            <Avatar className="h-8 w-8 border border-primary/20" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Open */}
            {isMenuOpen && (
                <div className="sm:hidden border-t bg-background absolute w-full shadow-lg h-screen md:h-auto">
                    <div className="pt-2 pb-3 space-y-1">
                        {!isLoggedIn ? (
                            <>
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="block pl-3 pr-4 py-3 text-base font-medium text-foreground hover:bg-muted"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <Link
                                    href="/signup/instructor"
                                    className="block pl-3 pr-4 py-3 text-base font-medium text-primary hover:bg-muted"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Seja um Instrutor
                                </Link>
                                <div className="p-4">
                                    <Button className="w-full" asChild onClick={() => setIsMenuOpen(false)}>
                                        <Link href="/signup/student">Começar</Link>
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col h-full">
                                <div className="px-4 py-4 border-b bg-muted/20">
                                    <p className="text-lg font-bold text-foreground">{user?.name}</p>
                                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                                    <div className="mt-4 flex items-center gap-2 text-sm font-medium bg-background p-2 rounded-md border inline-flex">
                                        <Wallet className="w-4 h-4 text-primary" />
                                        <span>Saldo: R$ 0,00</span>
                                    </div>
                                </div>

                                <Link
                                    href={dashboardLink}
                                    className="flex items-center px-4 py-3 text-base font-medium text-foreground hover:bg-muted border-b border-border/50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LayoutDashboard className="w-5 h-5 mr-3 text-muted-foreground" />
                                    Dashboard
                                </Link>
                                <Link
                                    href="/profile"
                                    className="flex items-center px-4 py-3 text-base font-medium text-foreground hover:bg-muted border-b border-border/50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <User className="w-5 h-5 mr-3 text-muted-foreground" />
                                    Meu Perfil
                                </Link>
                                <Link
                                    href="/settings"
                                    className="flex items-center px-4 py-3 text-base font-medium text-foreground hover:bg-muted border-b border-border/50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Settings className="w-5 h-5 mr-3 text-muted-foreground" />
                                    Configurações
                                </Link>

                                <div className="p-4 mt-auto mb-20">
                                    <Button
                                        variant="destructive"
                                        className="w-full flex items-center justify-center gap-2"
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            signOut({ callbackUrl: '/' });
                                        }}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sair da Conta
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
