"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type Payment = {
    id: string;
    amount: any;
    method: string;
    status: string;
    createdAt: Date;
    lesson: {
        student: { user: { name: string | null } };
        instructor: { user: { name: string | null } };
    };
};

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "createdAt",
        header: "Data",
        cell: ({ row }) => {
            return new Date(row.original.createdAt).toLocaleString("pt-BR");
        },
    },
    {
        id: "payerName",
        accessorFn: (row) => row.lesson.student.user.name,
        header: "Pagador (Aluno)",
    },
    {
        accessorKey: "lesson.instructor.user.name",
        header: "Recebedor (Instrutor)",
    },
    {
        accessorKey: "amount",
        header: "Valor",
        cell: ({ row }) => {
            const amount = Number(row.original.amount || 0);
            return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
        },
    },
    {
        accessorKey: "method",
        header: "Método",
        cell: ({ row }) => <Badge variant="outline">{row.original.method}</Badge>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;
            let variant: "default" | "secondary" | "destructive" | "outline" = "default";

            if (status === "PENDING") variant = "secondary";
            if (status === "FAILED") variant = "destructive";
            if (status === "COMPLETED") variant = "default";

            return <Badge variant={variant}>{status}</Badge>;
        },
    },
];
