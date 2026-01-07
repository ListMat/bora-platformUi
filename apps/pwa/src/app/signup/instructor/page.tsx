'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { api } from '@/utils/api';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff, User, Mail, Lock, Loader2 } from 'lucide-react';

export default function InstructorSignupPage() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('As senhas não coincidem');
            return;
        }

        setIsLoading(true);

        try {
            // 1. Criar conta via API direta
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'INSTRUCTOR',
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao criar conta');
            }

            // 2. Fazer login automático
            setIsLoggingIn(true);
            const loginResult = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (loginResult?.ok) {
                window.location.href = '/instructor/onboarding/documentos';
            } else {
                throw new Error('Conta criada, mas erro ao fazer login automático. Tente entrar manualmente.');
            }

        } catch (error: any) {
            alert(error.message);
            setIsLoading(false);
            setIsLoggingIn(false);
        }
    };

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <div className="min-h-screen bg-muted/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-2xl">
                        B
                    </div>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-foreground">
                    Torne-se um Instrutor
                </h2>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                    Comece a dar aulas e aumente sua renda hoje mesmo
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <Card>
                    <CardContent className="pt-6">
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="name"
                                        placeholder="Seu nome"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type={isVisible ? "text" : "password"}
                                        placeholder="Mínimo 6 caracteres"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="pl-9 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleVisibility}
                                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                                    >
                                        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="confirmPassword"
                                        type={isVisible ? "text" : "password"}
                                        placeholder="Repita sua senha"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full font-semibold"
                                size="lg"
                                disabled={isLoading || isLoggingIn}
                            >
                                {(isLoading || isLoggingIn) && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isLoading ? 'Criando conta...' : isLoggingIn ? 'Entrando...' : 'Criar Conta Gratuita'}
                            </Button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-muted" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-card text-muted-foreground">
                                        Já tem uma conta?
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-center">
                                <Link href="/api/auth/signin" className="text-primary font-medium hover:underline">
                                    Fazer Login
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
