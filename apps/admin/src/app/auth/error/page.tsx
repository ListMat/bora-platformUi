'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const errorMessages: Record<string, string> = {
    Signin: 'Erro ao fazer login. Tente novamente.',
    OAuthSignin: 'Erro ao iniciar autenticação OAuth.',
    OAuthCallback: 'Erro no callback OAuth.',
    OAuthCreateAccount: 'Erro ao criar conta OAuth.',
    EmailCreateAccount: 'Erro ao criar conta com email.',
    Callback: 'Erro no callback de autenticação.',
    OAuthAccountNotLinked: 'Esta conta já está vinculada a outro método de login.',
    EmailSignin: 'Erro ao enviar email de login.',
    CredentialsSignin: 'Email ou senha incorretos. Verifique suas credenciais.',
    SessionRequired: 'Por favor, faça login para continuar.',
    default: 'Ocorreu um erro durante a autenticação.',
};

export default function AuthErrorPage() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const errorMessage = error ? errorMessages[error] || errorMessages.default : errorMessages.default;

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                        <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <CardTitle>Erro de Autenticação</CardTitle>
                    <CardDescription className="text-base">{errorMessage}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button asChild className="w-full">
                        <Link href="/auth/login">Voltar para Login</Link>
                    </Button>
                    {error === 'CredentialsSignin' && (
                        <div className="text-sm text-center space-y-2">
                            <p className="text-muted-foreground">
                                Verifique suas credenciais e tente novamente.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Credenciais padrão: <strong>admin@bora.com</strong> / <strong>admin123</strong>
                            </p>
                        </div>
                    )}
                    {error && (
                        <p className="text-xs text-center text-muted-foreground">
                            Código do erro: {error}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
