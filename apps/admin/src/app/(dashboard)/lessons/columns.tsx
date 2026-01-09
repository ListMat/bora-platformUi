'use client';

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar, Clock, MapPin } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Lesson = {
    id: string;
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
    scheduledAt: Date;
    status: string;
    paymentStatus: string;
    price: number;
    lessonType: string | null;
    duration: number | null;
    pickupAddress: string | null;
};

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    PENDING: { label: "Pendente", variant: "secondary" },
    SCHEDULED: { label: "Agendada", variant: "default" },
    ACTIVE: { label: "Em andamento", variant: "default" },
    FINISHED: { label: "Concluída", variant: "outline" },
    CANCELLED: { label: "Cancelada", variant: "destructive" },
    EXPIRED: { label: "Expirada", variant: "destructive" },
};

const paymentStatusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    PENDING: { label: "Pendente", variant: "secondary" },
    PROCESSING: { label: "Processando", variant: "default" },
    COMPLETED: { label: "Pago", variant: "outline" },
    FAILED: { label: "Falhou", variant: "destructive" },
    REFUNDED: { label: "Reembolsado", variant: "destructive" },
};

export const columns: ColumnDef<Lesson>[] = [
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
        accessorFn: (row) => row.student.user.name,
        header: "Aluno",
        cell: ({ row }) => {
            const name = row.original.student.user.name;
            return <div className="font-medium">{name || "Sem nome"}</div>;
        },
    },
    {
        id: "instructorName",
        accessorFn: (row) => row.instructor.user.name,
        header: "Instrutor",
        cell: ({ row }) => {
            const name = row.original.instructor.user.name;
            return <div className="font-medium">{name || "Sem nome"}</div>;
        },
    },
    {
        accessorKey: "scheduledAt",
        header: "Data/Hora",
        cell: ({ row }) => {
            const date = new Date(row.getValue("scheduledAt"));
            return (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {date.toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "lessonType",
        header: "Tipo",
        cell: ({ row }) => {
            const type = row.getValue("lessonType") as string | null;
            return (
                <Badge variant="outline" className="text-xs">
                    {type || "Padrão"}
                </Badge>
            );
        },
    },
    {
        accessorKey: "duration",
        header: "Duração",
        cell: ({ row }) => {
            const duration = row.getValue("duration") as number | null;
            if (!duration) return <span className="text-muted-foreground">-</span>;
            return <div className="text-sm">{duration} min</div>;
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
        accessorKey: "paymentStatus",
        header: "Pagamento",
        cell: ({ row }) => {
            const status = row.getValue("paymentStatus") as string;
            const config = paymentStatusMap[status] || { label: status, variant: "secondary" as const };
            return <Badge variant={config.variant}>{config.label}</Badge>;
        },
    },
    {
        accessorKey: "price",
        header: "Valor",
        cell: ({ row }) => {
            const price = row.getValue("price") as number;
            return (
                <div className="font-semibold">
                    R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const lesson = row.original;

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
                            onClick={() => navigator.clipboard.writeText(lesson.id)}
                        >
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Ver chat</DropdownMenuItem>
                        <DropdownMenuItem>Ver pagamento</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                            Cancelar aula
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
