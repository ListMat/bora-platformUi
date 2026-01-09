"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Search, MoreVertical, Eye, GraduationCap, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";

export default function AlunosPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const { data: students, isLoading } = trpc.admin.getStudents.useQuery({
        limit: 50,
        skip: 0,
    });

    const filteredStudents = students?.filter((student) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            student.user.name?.toLowerCase().includes(query) ||
            student.user.email?.toLowerCase().includes(query) ||
            student.cpf?.includes(query)
        );
    });

    return (
        <div className="container mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Alunos</h1>
                <p className="text-muted-foreground">
                    Gerencie todos os alunos da plataforma
                </p>
            </div>

            {/* Filtros */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nome, email ou CPF..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
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
                    ) : filteredStudents && filteredStudents.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>CPF</TableHead>
                                    <TableHead>Cidade</TableHead>
                                    <TableHead>Total de Aulas</TableHead>
                                    <TableHead>Cadastrado em</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">
                                            {student.user.name || "N/A"}
                                        </TableCell>
                                        <TableCell>{student.user.email}</TableCell>
                                        <TableCell>{student.cpf || "N/A"}</TableCell>
                                        <TableCell>
                                            {student.city || "N/A"}, {student.state || "N/A"}
                                        </TableCell>
                                        <TableCell>{student._count?.lessons || 0}</TableCell>
                                        <TableCell>
                                            {new Date(student.createdAt).toLocaleDateString("pt-BR")}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/alunos/${student.id}`}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Ver Detalhes
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/alunos/${student.id}?tab=lessons`}>
                                                            <GraduationCap className="mr-2 h-4 w-4" />
                                                            Ver Aulas
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/alunos/${student.id}?tab=payments`}>
                                                            <CreditCard className="mr-2 h-4 w-4" />
                                                            Ver Pagamentos
                                                        </Link>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="py-12 text-center text-muted-foreground">
                            Nenhum aluno encontrado
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
