"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export type Lesson = {
    id: string;
    status: string;
    scheduledAt: Date;
    price: any;
    student: {
        user: { name: string | null };
    };
    instructor: {
        user: { name: string | null };
    };
    payment: {
        status: string;
    } | null;
};

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "ghost" | null }> = {
    PENDING: { label: "Pendente", variant: "outline" },
    SCHEDULED: { label: "Agendada", variant: "secondary" },
    ACTIVE: { label: "Em Andamento", variant: "default" },
    FINISHED: { label: "Concluída", variant: "default" }, // Usando default como success
    CANCELLED: { label: "Cancelada", variant: "destructive" },
    EXPIRED: { label: "Expirada", variant: "destructive" },
};

export const columns: ColumnDef<Lesson>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "scheduledAt",
        header: "Data/Hora",
        cell: ({ row }) => {
            return new Date(row.original.scheduledAt).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            });
        },
    },
    {
        id: "studentName",
        accessorFn: (row) => row.student.user.name,
        header: "Aluno",
    },
    {
        accessorKey: "instructor.user.name",
        header: "Instrutor",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = statusMap[row.original.status] || { label: row.original.status, variant: "outline" };
            return <Badge variant={status.variant as any}>{status.label}</Badge>;
        },
    },
    {
        accessorKey: "price",
        header: "Valor",
        cell: ({ row }) => {
            const amount = Number(row.original.price || 0);
            return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
        },
    },
    {
        accessorKey: "payment.status",
        header: "Pagamento",
        cell: ({ row }) => {
            const status = row.original.payment?.status || "PENDING";
            return (
                <Badge variant={status === "COMPLETED" ? "outline" : "secondary"}>
                    {status === "COMPLETED" ? "Pago" : status}
                </Badge>
            );
        },
    },
];
