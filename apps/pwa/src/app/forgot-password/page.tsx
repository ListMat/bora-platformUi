'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!email) {
            setError('Por favor, insira seu email');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/trpc/auth.requestPasswordReset', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar email');
            }

            setSuccess(true);
        } catch (err) {
            setError('Erro ao enviar email. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
                <Card className="w-full max-w-md shadow-2xl">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-3xl font-bold">Email Enviado!</CardTitle>
                        <CardDescription className="text-base">
                            Verifique sua caixa de entrada
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="bg-muted/50 border border-border rounded-lg p-4">
                            <p className="text-sm text-center">
                                Enviamos um link de recuperação para:
                            </p>
                            <p className="text-center font-semibold mt-2">{email}</p>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>📧 Verifique sua caixa de entrada e spam</p>
                            <p>⏰ O link expira em 1 hora</p>
                            <p>🔒 Use o link para criar uma nova senha</p>
                        </div>

                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setSuccess(false);
                                    setEmail('');
                                }}
                            >
                                Enviar para outro email
                            </Button>

                            <Button
                                variant="ghost"
                                className="w-full"
                                asChild
                            >
                                <Link href="/signin">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Voltar para login
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <span className="text-4xl">🔑</span>
                    </div>
                    <CardTitle className="text-3xl font-bold">Esqueceu a Senha?</CardTitle>
                    <CardDescription className="text-base">
                        Não se preocupe! Vamos te ajudar a recuperar
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="h-12"
                            />
                            <p className="text-xs text-muted-foreground">
                                Digite o email cadastrado na sua conta
                            </p>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                        </Button>
                    </form>

                    <div className="text-center pt-4 border-t">
                        <Link
                            href="/signin"
                            className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Voltar para login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
