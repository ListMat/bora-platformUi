'use client';

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, CreditCard, Calendar } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Payment = {
    id: string;
    lesson: {
        student: {
            user: {
                name: string | null;
            };
        };
        instructor: {
            user: {
                name: string | null;
            };
        };
    };
    amount: number;
    method: string;
    status: string;
    createdAt: Date;
    stripePaymentId: string | null;
};

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    PENDING: { label: "Pendente", variant: "secondary" },
    PROCESSING: { label: "Processando", variant: "default" },
    COMPLETED: { label: "Concluído", variant: "outline" },
    FAILED: { label: "Falhou", variant: "destructive" },
    REFUNDED: { label: "Reembolsado", variant: "destructive" },
};

const methodMap: Record<string, { label: string; icon: string }> = {
    PIX: { label: "Pix", icon: "🔷" },
    CREDIT_CARD: { label: "Cartão de Crédito", icon: "💳" },
    DINHEIRO: { label: "Dinheiro", icon: "💵" },
    DEBITO: { label: "Débito", icon: "💳" },
    CREDITO: { label: "Crédito", icon: "💳" },
    BOLETO: { label: "Boleto", icon: "📄" },
};

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => {
            const id = row.getValue("id") as string;
            return (
                <div className="font-mono text-xs text-muted-foreground">
                    {id.slice(0, 8)}...
                </div>
            );
        },
    },
    {
        id: "studentName",
        accessorFn: (row) => row.lesson.student.user.name,
        header: "Aluno",
        cell: ({ row }) => {
            const name = row.original.lesson.student.user.name;
            return <div className="font-medium">{name || "Sem nome"}</div>;
        },
    },
    {
        id: "instructorName",
        accessorFn: (row) => row.lesson.instructor.user.name,
        header: "Instrutor",
        cell: ({ row }) => {
            const name = row.original.lesson.instructor.user.name;
            return <div className="font-medium">{name || "Sem nome"}</div>;
        },
    },
    {
        accessorKey: "amount",
        header: "Valor",
        cell: ({ row }) => {
            const amount = row.getValue("amount") as number;
            return (
                <div className="font-semibold text-lg">
                    R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
            );
        },
    },
    {
        accessorKey: "method",
        header: "Método",
        cell: ({ row }) => {
            const method = row.getValue("method") as string;
            const config = methodMap[method] || { label: method, icon: "💰" };
            return (
                <div className="flex items-center gap-2">
                    <span>{config.icon}</span>
                    <Badge variant="outline">{config.label}</Badge>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const config = statusMap[status] || { label: status, variant: "secondary" as const };
            return <Badge variant={config.variant}>{config.label}</Badge>;
        },
    },
    {
        accessorKey: "createdAt",
        header: "Data",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"));
            return (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {date.toLocaleDateString('pt-BR')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "stripePaymentId",
        header: "ID Externo",
        cell: ({ row }) => {
            const stripeId = row.getValue("stripePaymentId") as string | null;
            if (!stripeId) return <span className="text-muted-foreground text-xs">-</span>;
            return (
                <div className="font-mono text-xs text-muted-foreground">
                    {stripeId.slice(0, 12)}...
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const payment = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(payment.id)}
                        >
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Ver aula</DropdownMenuItem>
                        <DropdownMenuItem>Ver comprovante</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                            Reembolsar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
