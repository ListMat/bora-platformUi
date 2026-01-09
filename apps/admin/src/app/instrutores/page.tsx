"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Eye, Ban, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function InstrutoresPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    const { data: instructors, isLoading, refetch } = trpc.admin.getInstructors.useQuery({
        status: statusFilter === "ALL" ? undefined : statusFilter,
    });

    const suspendMutation = trpc.instructor.suspend.useMutation({
        onSuccess: () => {
            refetch();
        },
    });

    const approveMutation = trpc.instructor.approve.useMutation({
        onSuccess: () => {
            refetch();
        },
    });

    const filteredInstructors = instructors?.filter((instructor) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            instructor.user.name?.toLowerCase().includes(query) ||
            instructor.user.email?.toLowerCase().includes(query) ||
            instructor.cpf?.includes(query)
        );
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return <Badge variant="default">Ativo</Badge>;
            case "PENDING_VERIFICATION":
                return <Badge variant="secondary">Pendente</Badge>;
            case "SUSPENDED":
                return <Badge variant="destructive">Suspenso</Badge>;
            case "INACTIVE":
                return <Badge variant="outline">Inativo</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Instrutores</h1>
                <p className="text-muted-foreground">
                    Gerencie todos os instrutores da plataforma
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
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">Todos</SelectItem>
                                <SelectItem value="ACTIVE">Ativos</SelectItem>
                                <SelectItem value="PENDING_VERIFICATION">Pendentes</SelectItem>
                                <SelectItem value="SUSPENDED">Suspensos</SelectItem>
                                <SelectItem value="INACTIVE">Inativos</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Tabela */}
            <Card>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : filteredInstructors && filteredInstructors.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>CPF</TableHead>
                                    <TableHead>Cidade</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Avaliação</TableHead>
                                    <TableHead>Aulas</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInstructors.map((instructor) => (
                                    <TableRow key={instructor.id}>
                                        <TableCell className="font-medium">
                                            {instructor.user.name || "N/A"}
                                        </TableCell>
                                        <TableCell>{instructor.user.email}</TableCell>
                                        <TableCell>{instructor.cpf || "N/A"}</TableCell>
                                        <TableCell>
                                            {instructor.city || "N/A"}, {instructor.state || "N/A"}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(instructor.status)}</TableCell>
                                        <TableCell>
                                            {instructor.averageRating > 0
                                                ? `⭐ ${instructor.averageRating.toFixed(1)}`
                                                : "N/A"}
                                        </TableCell>
                                        <TableCell>{instructor.totalLessons}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/instrutores/${instructor.id}`}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Ver Detalhes
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {instructor.status === "ACTIVE" && (
                                                        <DropdownMenuItem
                                                            onClick={() =>
                                                                suspendMutation.mutate({
                                                                    instructorId: instructor.id,
                                                                })
                                                            }
                                                            className="text-destructive"
                                                        >
                                                            <Ban className="mr-2 h-4 w-4" />
                                                            Suspender
                                                        </DropdownMenuItem>
                                                    )}
                                                    {(instructor.status === "SUSPENDED" ||
                                                        instructor.status === "INACTIVE") && (
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    approveMutation.mutate({
                                                                        instructorId: instructor.id,
                                                                    })
                                                                }
                                                            >
                                                                <CheckCircle className="mr-2 h-4 w-4" />
                                                                Reativar
                                                            </DropdownMenuItem>
                                                        )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="py-12 text-center text-muted-foreground">
                            Nenhum instrutor encontrado
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
