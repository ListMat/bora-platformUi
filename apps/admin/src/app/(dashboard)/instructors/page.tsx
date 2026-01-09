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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function InstrutoresPage() {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [showSuspendDialog, setShowSuspendDialog] = useState(false);
    const [showActivateDialog, setShowActivateDialog] = useState(false);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState<any>(null);

    const { data: instructors, isLoading, refetch } = trpc.admin.getInstructors.useQuery({
        status: statusFilter === "ALL" ? undefined : statusFilter,
    });

    const suspendMutation = trpc.instructor.suspend.useMutation({
        onSuccess: () => {
            toast({
                title: "Instrutor suspenso",
                description: "O instrutor foi suspenso com sucesso.",
            });
            setShowSuspendDialog(false);
            setSelectedInstructor(null);
            refetch();
        },
        onError: (error) => {
            toast({
                title: "Erro ao suspender",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const approveMutation = trpc.instructor.approve.useMutation({
        onSuccess: () => {
            toast({
                title: "Instrutor ativado",
                description: "O instrutor foi ativado com sucesso.",
            });
            setShowActivateDialog(false);
            setSelectedInstructor(null);
            refetch();
        },
        onError: (error) => {
            toast({
                title: "Erro ao ativar",
                description: error.message,
                variant: "destructive",
            });
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
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedInstructor(instructor);
                                                            setShowDetailsDialog(true);
                                                        }}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Ver Detalhes
                                                    </DropdownMenuItem>
                                                    {instructor.status === "ACTIVE" && (
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedInstructor(instructor);
                                                                setShowSuspendDialog(true);
                                                            }}
                                                            className="text-destructive"
                                                        >
                                                            <Ban className="mr-2 h-4 w-4" />
                                                            Suspender
                                                        </DropdownMenuItem>
                                                    )}
                                                    {(instructor.status === "SUSPENDED" ||
                                                        instructor.status === "INACTIVE") && (
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setSelectedInstructor(instructor);
                                                                    setShowActivateDialog(true);
                                                                }}
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

            {/* Modal de Suspender */}
            <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Suspender Instrutor</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja suspender este instrutor?
                        </DialogDescription>
                    </DialogHeader>
                    {selectedInstructor && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Nome:</p>
                                <p className="text-sm text-muted-foreground">
                                    {selectedInstructor.user.name || "N/A"}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Email:</p>
                                <p className="text-sm text-muted-foreground">
                                    {selectedInstructor.user.email}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Total de Aulas:</p>
                                <p className="text-sm text-muted-foreground">
                                    {selectedInstructor.totalLessons}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Avaliação:</p>
                                <p className="text-sm text-muted-foreground">
                                    {selectedInstructor.averageRating > 0
                                        ? `⭐ ${selectedInstructor.averageRating.toFixed(1)}`
                                        : "N/A"}
                                </p>
                            </div>
                            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                                <p className="text-sm text-destructive">
                                    ⚠️ O instrutor não poderá dar aulas até ser reativado.
                                </p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowSuspendDialog(false);
                                setSelectedInstructor(null);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (selectedInstructor) {
                                    suspendMutation.mutate({
                                        instructorId: selectedInstructor.id,
                                    });
                                }
                            }}
                            disabled={suspendMutation.isLoading}
                        >
                            {suspendMutation.isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Suspendendo...
                                </>
                            ) : (
                                "Confirmar Suspensão"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Ativar */}
            <Dialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ativar Instrutor</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja ativar este instrutor?
                        </DialogDescription>
                    </DialogHeader>
                    {selectedInstructor && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Nome:</p>
                                <p className="text-sm text-muted-foreground">
                                    {selectedInstructor.user.name || "N/A"}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Email:</p>
                                <p className="text-sm text-muted-foreground">
                                    {selectedInstructor.user.email}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Status Atual:</p>
                                <p className="text-sm text-muted-foreground">
                                    {selectedInstructor.status}
                                </p>
                            </div>
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-700">
                                    ✅ O instrutor poderá dar aulas novamente após a ativação.
                                </p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowActivateDialog(false);
                                setSelectedInstructor(null);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={() => {
                                if (selectedInstructor) {
                                    approveMutation.mutate({
                                        instructorId: selectedInstructor.id,
                                    });
                                }
                            }}
                            disabled={approveMutation.isLoading}
                        >
                            {approveMutation.isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Ativando...
                                </>
                            ) : (
                                "Confirmar Ativação"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Detalhes */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detalhes do Instrutor</DialogTitle>
                        <DialogDescription>
                            Informações completas do instrutor
                        </DialogDescription>
                    </DialogHeader>
                    {selectedInstructor && (
                        <div className="space-y-6 py-4">
                            {/* Informações Básicas */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Nome:</p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedInstructor.user.name || "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Email:</p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedInstructor.user.email}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">CPF:</p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedInstructor.cpf || "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Telefone:</p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedInstructor.user.phone || "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Cidade:</p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedInstructor.city || "N/A"}, {selectedInstructor.state || "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Status:</p>
                                    {getStatusBadge(selectedInstructor.status)}
                                </div>
                            </div>

                            {/* Estatísticas */}
                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-4">Estatísticas</h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-2xl font-bold">{selectedInstructor.totalLessons}</p>
                                        <p className="text-sm text-muted-foreground">Aulas</p>
                                    </div>
                                    <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-2xl font-bold">
                                            {selectedInstructor.averageRating > 0
                                                ? selectedInstructor.averageRating.toFixed(1)
                                                : "N/A"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Avaliação</p>
                                    </div>
                                    <div className="p-4 bg-muted rounded-lg">
                                        <p className="text-2xl font-bold">
                                            R$ {selectedInstructor.basePrice ? Number(selectedInstructor.basePrice).toFixed(2) : "0.00"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Preço Base</p>
                                    </div>
                                </div>
                            </div>

                            {/* Bio */}
                            {selectedInstructor.bio && (
                                <div className="border-t pt-4">
                                    <h3 className="font-semibold mb-2">Bio</h3>
                                    <p className="text-sm text-muted-foreground">{selectedInstructor.bio}</p>
                                </div>
                            )}

                            {/* Informações Adicionais */}
                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-4">Informações Adicionais</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">CNH:</p>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedInstructor.cnhNumber || "N/A"}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Data de Nascimento:</p>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedInstructor.birthDate
                                                ? new Date(selectedInstructor.birthDate).toLocaleDateString("pt-BR")
                                                : "N/A"}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium">Cadastrado em:</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(selectedInstructor.createdAt).toLocaleDateString("pt-BR")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowDetailsDialog(false);
                                setSelectedInstructor(null);
                            }}
                        >
                            Fechar
                        </Button>
                        <Button asChild>
                            <Link href={`/instrutores/${selectedInstructor?.id}`}>
                                Ver Página Completa
                            </Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
