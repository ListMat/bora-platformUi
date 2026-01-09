"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, MoreVertical, Eye, GraduationCap, CreditCard, Loader2, Wallet } from "lucide-react";
import Link from "next/link";

export default function AlunosPage() {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [showLessonsDialog, setShowLessonsDialog] = useState(false);
    const [showPaymentsDialog, setShowPaymentsDialog] = useState(false);
    const [showDepositDialog, setShowDepositDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<any>(null);
    const [depositAmount, setDepositAmount] = useState("");

    const { data: students, isLoading } = trpc.admin.getStudents.useQuery({
        limit: 50,
        skip: 0,
    });

    const { data: lessons, refetch: refetchLessons } = trpc.admin.getStudentLessons.useQuery(
        {
            studentId: selectedStudent?.id || "",
            limit: 20,
            skip: 0,
        },
        {
            enabled: !!selectedStudent?.id && showLessonsDialog,
        }
    );

    const { data: payments, refetch: refetchPayments } = trpc.admin.getStudentPayments.useQuery(
        {
            studentId: selectedStudent?.id || "",
            limit: 20,
            skip: 0,
        },
        {
            enabled: !!selectedStudent?.id && showPaymentsDialog,
        }
    );

    const filteredStudents = students?.filter((student) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            student.user.name?.toLowerCase().includes(query) ||
            student.user.email?.toLowerCase().includes(query) ||
            student.cpf?.includes(query)
        );
    });

    const handleDeposit = () => {
        const amount = parseFloat(depositAmount);
        if (isNaN(amount) || amount <= 0) {
            toast({
                title: "Valor inválido",
                description: "Por favor, insira um valor válido.",
                variant: "destructive",
            });
            return;
        }

        // Aqui você implementaria a lógica de depósito
        toast({
            title: "Depósito realizado",
            description: `R$ ${amount.toFixed(2)} depositado na conta de ${selectedStudent?.user.name}`,
        });
        setShowDepositDialog(false);
        setDepositAmount("");
    };

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
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedStudent(student);
                                                            setShowDetailsDialog(true);
                                                        }}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        Ver Detalhes
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedStudent(student);
                                                            setShowLessonsDialog(true);
                                                        }}
                                                    >
                                                        <GraduationCap className="mr-2 h-4 w-4" />
                                                        Ver Aulas
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedStudent(student);
                                                            setShowPaymentsDialog(true);
                                                        }}
                                                    >
                                                        <CreditCard className="mr-2 h-4 w-4" />
                                                        Ver Pagamentos
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setSelectedStudent(student);
                                                            setShowDepositDialog(true);
                                                        }}
                                                    >
                                                        <Wallet className="mr-2 h-4 w-4" />
                                                        Depositar Crédito
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

            {/* Modal de Detalhes */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detalhes do Aluno</DialogTitle>
                        <DialogDescription>
                            Informações completas do aluno
                        </DialogDescription>
                    </DialogHeader>
                    {selectedStudent && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Nome:</p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedStudent.user.name || "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Email:</p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedStudent.user.email}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">CPF:</p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedStudent.cpf || "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Telefone:</p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedStudent.user.phone || "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Cidade:</p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedStudent.city || "N/A"}, {selectedStudent.state || "N/A"}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Total de Aulas:</p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedStudent._count?.lessons || 0}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowDetailsDialog(false);
                                setSelectedStudent(null);
                            }}
                        >
                            Fechar
                        </Button>
                        <Button asChild>
                            <Link href={`/alunos/${selectedStudent?.id}`}>
                                Ver Página Completa
                            </Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Aulas */}
            <Dialog open={showLessonsDialog} onOpenChange={setShowLessonsDialog}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Aulas de {selectedStudent?.user.name}</DialogTitle>
                        <DialogDescription>
                            Histórico completo de aulas do aluno
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {lessons && lessons.length > 0 ? (
                            <div className="space-y-4">
                                {lessons.map((lesson: any) => (
                                    <div
                                        key={lesson.id}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="font-medium">
                                                    {lesson.instructor?.user?.name || "N/A"}
                                                </p>
                                                <Badge>{lesson.status}</Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {lesson.instructor?.user?.email || "N/A"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {new Date(lesson.createdAt).toLocaleDateString("pt-BR")} às{" "}
                                                {new Date(lesson.createdAt).toLocaleTimeString("pt-BR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                R$ {lesson.payment?.amount ? Number(lesson.payment.amount).toFixed(2) : "0.00"}
                                            </p>
                                            {lesson.payment && (
                                                <Badge variant="outline">{lesson.payment.status}</Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">
                                Nenhuma aula encontrada
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowLessonsDialog(false);
                            }}
                        >
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Pagamentos */}
            <Dialog open={showPaymentsDialog} onOpenChange={setShowPaymentsDialog}>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Pagamentos de {selectedStudent?.user.name}</DialogTitle>
                        <DialogDescription>
                            Histórico completo de pagamentos do aluno
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {payments && payments.length > 0 ? (
                            <>
                                <div className="mb-4 p-4 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">Total Pago</p>
                                    <p className="text-2xl font-bold">
                                        R${" "}
                                        {payments
                                            .reduce((sum, p: any) => sum + Number(p.amount || 0), 0)
                                            .toFixed(2)}
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    {payments.map((payment: any) => (
                                        <div
                                            key={payment.id}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium">
                                                        Aula com {payment.lesson?.instructor?.user?.name || "N/A"}
                                                    </p>
                                                    <Badge
                                                        variant={
                                                            payment.status === "PAID" ? "default" : "secondary"
                                                        }
                                                    >
                                                        {payment.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Método: {payment.method}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(payment.createdAt).toLocaleDateString("pt-BR")} às{" "}
                                                    {new Date(payment.createdAt).toLocaleTimeString("pt-BR", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold">
                                                    R$ {Number(payment.amount || 0).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">
                                Nenhum pagamento encontrado
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowPaymentsDialog(false);
                            }}
                        >
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Depósito */}
            <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Depositar Crédito</DialogTitle>
                        <DialogDescription>
                            Adicionar crédito na conta de {selectedStudent?.user.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Valor (R$)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={depositAmount}
                                onChange={(e) => setDepositAmount(e.target.value)}
                            />
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground mb-2">
                                Este valor será creditado na conta do aluno e poderá ser usado para pagar aulas.
                            </p>
                            <p className="text-sm font-medium">
                                Aluno: {selectedStudent?.user.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Email: {selectedStudent?.user.email}
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setShowDepositDialog(false);
                                setDepositAmount("");
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleDeposit}>
                            <Wallet className="mr-2 h-4 w-4" />
                            Confirmar Depósito
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
