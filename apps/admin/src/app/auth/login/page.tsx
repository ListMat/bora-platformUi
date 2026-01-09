'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, Mail } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("admin@bora.com");
    const [password, setPassword] = useState("admin123");

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();

        console.log('🔵 [FRONTEND] Iniciando login...');
        console.log('🔵 [FRONTEND] Email:', email);
        console.log('🔵 [FRONTEND] Password:', password ? '***' : 'vazio');

        setIsLoading(true);

        try {
            console.log('🔵 [FRONTEND] Chamando signIn...');

            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            console.log('🔵 [FRONTEND] Resultado do signIn:', result);

            if (result?.error) {
                console.error('❌ [FRONTEND] Erro no login:', result.error);
                toast({
                    title: "Erro ao fazer login",
                    description: "Email ou senha inválidos",
                    variant: "destructive",
                });
            } else {
                console.log('✅ [FRONTEND] Login bem-sucedido!');
                toast({
                    title: "Login realizado com sucesso!",
                    description: "Redirecionando...",
                });

                console.log('🔵 [FRONTEND] Redirecionando para /');
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            console.error('❌ [FRONTEND] Erro capturado:', error);
            toast({
                title: "Erro",
                description: "Algo deu errado. Tente novamente.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
            console.log('🔵 [FRONTEND] Finalizando login');
        }
    }

    console.log('🔵 [FRONTEND] Renderizando LoginPage');

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-4">
                        <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary-foreground">B</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Bora Admin</CardTitle>
                    <CardDescription className="text-center">
                        Painel de Administração
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="admin@bora.com"
                                    value={email}
                                    onChange={(e) => {
                                        console.log('🔵 [FRONTEND] Email alterado:', e.target.value);
                                        setEmail(e.target.value);
                                    }}
                                    required
                                    disabled={isLoading}
                                    className="pl-10"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => {
                                        console.log('🔵 [FRONTEND] Senha alterada');
                                        setPassword(e.target.value);
                                    }}
                                    required
                                    disabled={isLoading}
                                    className="pl-10"
                                    autoComplete="current-password"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                            onClick={() => console.log('🔵 [FRONTEND] Botão clicado')}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Entrando...
                                </>
                            ) : (
                                "Entrar"
                            )}
                        </Button>

                        <div className="text-center">
                            <Link
                                href="/auth/forgot-password"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Esqueceu sua senha?
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
