'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Suspense } from 'react';

function ErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    let errorMessage = "Ocorreu um erro desconhecido na autenticação.";

    if (error === "Configuration") {
        errorMessage = "Erro de configuração do servidor. Por favor, contate o suporte.";
    } else if (error === "AccessDenied") {
        errorMessage = "Acesso negado. Você não tem permissão para entrar.";
    } else if (error === "Verification") {
        errorMessage = "O link de verificação expirou ou já foi usado.";
    }

    return (
        <Card className="w-full max-w-md mx-4 shadow-lg border-destructive/20">
            <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="w-6 h-6 text-destructive" />
                </div>
                <CardTitle className="text-xl text-destructive">Erro de Autenticação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">
                    {errorMessage}
                </p>
                <div className="bg-muted p-3 rounded text-xs font-mono text-center text-muted-foreground">
                    Código: {error || 'Unknown'}
                </div>

                <div className="flex justify-center pt-2">
                    <Link href="/signin">
                        <Button variant="default" className="w-full min-w-[200px]">
                            Voltar para Login
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
            <Suspense fallback={<div>Carregando...</div>}>
                <ErrorContent />
            </Suspense>
        </div>
    );
}
