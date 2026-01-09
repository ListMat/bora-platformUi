"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    Loader2
} from "lucide-react";

export default function AguardandoAprovacaoPage() {
    const router = useRouter();

    const { data: document, isLoading, refetch } = trpc.instructorDocuments.getDocumentStatus.useQuery();

    // Atualizar status a cada 30 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 30000);

        return () => clearInterval(interval);
    }, [refetch]);

    // Redirecionar se aprovado
    useEffect(() => {
        if (document?.status === "APPROVED") {
            router.push("/instrutor/dashboard");
        }
    }, [document, router]);

    if (isLoading) {
        return (
            <div className="container max-w-2xl mx-auto py-16 px-4">
                <div className="flex flex-col items-center justify-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="container max-w-2xl mx-auto py-16 px-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Nenhum documento enviado</CardTitle>
                        <CardDescription>
                            Você ainda não enviou seus documentos para aprovação
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => router.push("/instrutor/cadastro/documentos")}>
                            Enviar Documentos
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "PENDING":
                return {
                    icon: Clock,
                    color: "bg-yellow-500",
                    title: "Aguardando Aprovação",
                    description: "Seus documentos estão sendo analisados pela nossa equipe",
                    variant: "default" as const,
                };
            case "APPROVED":
                return {
                    icon: CheckCircle2,
                    color: "bg-green-500",
                    title: "Aprovado!",
                    description: "Seus documentos foram aprovados. Você já pode começar a dar aulas!",
                    variant: "default" as const,
                };
            case "REJECTED":
                return {
                    icon: XCircle,
                    color: "bg-red-500",
                    title: "Documentos Rejeitados",
                    description: "Seus documentos foram rejeitados. Veja a análise abaixo e envie novamente.",
                    variant: "destructive" as const,
                };
            case "PENDING_MORE_DOCS":
                return {
                    icon: AlertCircle,
                    color: "bg-orange-500",
                    title: "Documentos Adicionais Necessários",
                    description: "Precisamos de mais informações. Veja a análise abaixo.",
                    variant: "default" as const,
                };
            default:
                return {
                    icon: Clock,
                    color: "bg-gray-500",
                    title: "Status Desconhecido",
                    description: "",
                    variant: "default" as const,
                };
        }
    };

    const config = getStatusConfig(document.status);
    const StatusIcon = config.icon;

    return (
        <div className="container max-w-2xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Status da Aprovação</h1>
                <p className="text-muted-foreground">
                    Acompanhe o status da análise dos seus documentos
                </p>
            </div>

            {/* Card de Status */}
            <Card className="mb-6">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${config.color}`}>
                            <StatusIcon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <CardTitle>{config.title}</CardTitle>
                            <CardDescription>{config.description}</CardDescription>
                        </div>
                        <Badge variant={config.variant}>
                            {document.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* Data de Envio */}
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Enviado em:</span>
                            <span className="font-medium">
                                {document.submittedAt
                                    ? new Date(document.submittedAt).toLocaleDateString("pt-BR", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : "N/A"}
                            </span>
                        </div>

                        {/* Data de Revisão */}
                        {document.reviewedAt && (
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Revisado em:</span>
                                <span className="font-medium">
                                    {new Date(document.reviewedAt).toLocaleDateString("pt-BR", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Nota de Análise */}
            {document.analysisNote && (
                <Alert className="mb-6" variant={config.variant}>
                    <FileText className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Análise da equipe:</strong>
                        <p className="mt-2">{document.analysisNote}</p>
                    </AlertDescription>
                </Alert>
            )}

            {/* Documentos Enviados */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Documentos Enviados</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">CNH (Frente)</span>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">CNH (Verso)</span>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Certificado CNH Brasil</span>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Ações */}
            <div className="flex gap-4">
                {(document.status === "REJECTED" || document.status === "PENDING_MORE_DOCS") && (
                    <Button
                        onClick={() => router.push("/instrutor/cadastro/documentos")}
                        className="flex-1"
                    >
                        Enviar Novos Documentos
                    </Button>
                )}

                {document.status === "PENDING" && (
                    <Button
                        variant="outline"
                        onClick={() => refetch()}
                        className="flex-1"
                    >
                        Atualizar Status
                    </Button>
                )}

                <Button
                    variant="outline"
                    onClick={() => router.push("/instrutor/dashboard")}
                >
                    Voltar ao Dashboard
                </Button>
            </div>
        </div>
    );
}
