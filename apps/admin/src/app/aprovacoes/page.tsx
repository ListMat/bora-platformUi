"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Search,
    Eye,
    Loader2
} from "lucide-react";
import Link from "next/link";

type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED" | "PENDING_MORE_DOCS";

export default function AprovacoesPage() {
    const [statusFilter, setStatusFilter] = useState<DocumentStatus | "ALL">("PENDING");
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0);
    const limit = 20;

    const { data, isLoading, refetch } = trpc.instructorDocuments.getPendingApprovals.useQuery({
        status: statusFilter === "ALL" ? undefined : statusFilter,
        limit,
        skip: page * limit,
    });

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "PENDING":
                return {
                    icon: Clock,
                    color: "bg-yellow-500",
                    label: "Pendente",
                    variant: "secondary" as const,
                };
            case "APPROVED":
                return {
                    icon: CheckCircle2,
                    color: "bg-green-500",
                    label: "Aprovado",
                    variant: "default" as const,
                };
            case "REJECTED":
                return {
                    icon: XCircle,
                    color: "bg-red-500",
                    label: "Rejeitado",
                    variant: "destructive" as const,
                };
            case "PENDING_MORE_DOCS":
                return {
                    icon: AlertCircle,
                    color: "bg-orange-500",
                    label: "Mais Docs",
                    variant: "secondary" as const,
                };
            default:
                return {
                    icon: Clock,
                    color: "bg-gray-500",
                    label: "Desconhecido",
                    variant: "secondary" as const,
                };
        }
    };

    const filteredDocuments = data?.documents.filter((doc) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            doc.instructor.user.name?.toLowerCase().includes(query) ||
            doc.instructor.user.email?.toLowerCase().includes(query) ||
            doc.instructor.cpf?.includes(query)
        );
    });

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Aprovação de Instrutores</h1>
                <p className="text-muted-foreground">
                    Gerencie as solicitações de aprovação de instrutores
                </p>
            </div>

            {/* Filtros */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Busca */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por nome, email ou CPF..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Filtro de Status */}
                        <Select
                            value={statusFilter}
                            onValueChange={(value) => setStatusFilter(value as DocumentStatus | "ALL")}
                        >
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todos</SelectItem>
                                <SelectItem value="PENDING">Pendentes</SelectItem>
                                <SelectItem value="APPROVED">Aprovados</SelectItem>
                                <SelectItem value="REJECTED">Rejeitados</SelectItem>
                                <SelectItem value="PENDING_MORE_DOCS">Mais Documentos</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Botão de Atualizar */}
                        <Button
                            variant="outline"
                            onClick={() => refetch()}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Atualizar"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Estatísticas */}
            {data && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total</CardDescription>
                            <CardTitle className="text-3xl">{data.total}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Pendentes</CardDescription>
                            <CardTitle className="text-3xl text-yellow-600">
                                {data.documents.filter(d => d.status === "PENDING").length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Aprovados</CardDescription>
                            <CardTitle className="text-3xl text-green-600">
                                {data.documents.filter(d => d.status === "APPROVED").length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Rejeitados</CardDescription>
                            <CardTitle className="text-3xl text-red-600">
                                {data.documents.filter(d => d.status === "REJECTED").length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            )}

            {/* Lista de Documentos */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredDocuments && filteredDocuments.length > 0 ? (
                <div className="space-y-4">
                    {filteredDocuments.map((doc) => {
                        const config = getStatusConfig(doc.status);
                        const StatusIcon = config.icon;

                        return (
                            <Card key={doc.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        {/* Avatar/Ícone */}
                                        <div className={`p-3 rounded-full ${config.color}`}>
                                            <StatusIcon className="h-6 w-6 text-white" />
                                        </div>

                                        {/* Informações do Instrutor */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-lg">
                                                    {doc.instructor.user.name || "Nome não informado"}
                                                </h3>
                                                <Badge variant={config.variant}>{config.label}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {doc.instructor.user.email}
                                            </p>
                                            <div className="flex flex-wrap gap-4 text-sm">
                                                <span className="text-muted-foreground">
                                                    CPF: {doc.instructor.cpf || "N/A"}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    Enviado: {doc.submittedAt
                                                        ? new Date(doc.submittedAt).toLocaleDateString("pt-BR")
                                                        : "N/A"}
                                                </span>
                                                {doc.instructor.averageRating > 0 && (
                                                    <span className="text-muted-foreground">
                                                        ⭐ {doc.instructor.averageRating.toFixed(1)}
                                                    </span>
                                                )}
                                                <span className="text-muted-foreground">
                                                    {doc.instructor.totalLessons} aulas
                                                </span>
                                            </div>
                                        </div>

                                        {/* Botão de Ação */}
                                        <Link href={`/aprovacoes/${doc.instructorId}`}>
                                            <Button>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Analisar
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}

                    {/* Paginação */}
                    {data && data.total > limit && (
                        <div className="flex justify-center gap-2 mt-6">
                            <Button
                                variant="outline"
                                onClick={() => setPage(Math.max(0, page - 1))}
                                disabled={page === 0}
                            >
                                Anterior
                            </Button>
                            <span className="flex items-center px-4">
                                Página {page + 1} de {Math.ceil(data.total / limit)}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPage(page + 1)}
                                disabled={!data.hasMore}
                            >
                                Próxima
                            </Button>
                        </div>
                    )}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">
                            Nenhum documento encontrado
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
