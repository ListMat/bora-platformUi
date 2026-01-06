'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Calendar,
    CreditCard,
    AlertTriangle,
    Star,
    Gift,
    Car,
    Settings,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const routes = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
        color: "text-sky-500",
    },
    {
        label: "Alunos",
        icon: Users,
        href: "/students",
        color: "text-violet-500",
    },
    {
        label: "Instrutores",
        icon: GraduationCap,
        href: "/instructors",
        color: "text-pink-700",
    },
    {
        label: "Aulas",
        icon: Calendar,
        href: "/lessons",
        color: "text-orange-700",
    },
    {
        label: "Pagamentos",
        icon: CreditCard,
        href: "/payments",
        color: "text-green-700",
    },
    {
        label: "Emergências",
        icon: AlertTriangle,
        href: "/emergencies",
        color: "text-red-700",
    },
    {
        label: "Avaliações",
        icon: Star,
        href: "/ratings",
        color: "text-yellow-500",
    },
    {
        label: "Indicações",
        icon: Gift,
        href: "/referrals",
        color: "text-emerald-500",
    },
    {
        label: "Veículos",
        icon: Car,
        href: "/vehicles",
        color: "text-blue-500",
    },
    {
        label: "Configurações",
        icon: Settings,
        href: "/settings",
        color: "text-gray-500",
    },
];

interface SidebarProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 transform bg-card border-r transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
                    open ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-between border-b px-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-lg font-bold text-primary-foreground">B</span>
                            </div>
                            <span className="text-xl font-bold">Bora Admin</span>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Navigation */}
                    <ScrollArea className="flex-1 px-3 py-4">
                        <div className="space-y-1">
                            {routes.map((route) => (
                                <Link
                                    key={route.href}
                                    href={route.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        pathname === route.href
                                            ? "bg-primary text-primary-foreground"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                    onClick={() => setOpen(false)}
                                >
                                    <route.icon className={cn("h-5 w-5", pathname === route.href ? "" : route.color)} />
                                    {route.label}
                                </Link>
                            ))}
                        </div>
                    </ScrollArea>

                    {/* Footer */}
                    <div className="border-t p-4">
                        <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
                            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                                <span className="text-sm font-semibold text-primary-foreground">AD</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">Admin</p>
                                <p className="text-xs text-muted-foreground truncate">admin@bora.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
