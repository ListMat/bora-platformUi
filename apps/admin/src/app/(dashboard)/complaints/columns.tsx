"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

export type Complaint = {
    id: string;
    type: string;
    description: string;
    status: string;
    createdAt: Date;
    student: {
        user: {
            name: string | null;
            email: string;
        };
    };
    instructor: {
        user: {
            name: string | null;
            email: string;
        };
    };
};

const typeLabels: Record<string, string> = {
    INAPPROPRIATE_BEHAVIOR: "Comportamento Inadequado",
    INADEQUATE_VEHICLE: "Veículo Inadequado",
    HARASSMENT: "Assédio",
    DANGEROUS_DRIVING: "Direção Perigosa",
    OTHER: "Outro",
};

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    PENDING: { label: "Pendente", variant: "destructive" },
    UNDER_REVIEW: { label: "Em Análise", variant: "default" },
    RESOLVED: { label: "Resolvida", variant: "secondary" },
    DISMISSED: { label: "Arquivada", variant: "outline" },
};

export const columns: ColumnDef<Complaint>[] = [
    {
        id: "studentName",
        accessorFn: (row) => row.student.user.name || "Aluno",
        header: "Aluno",
    },
    {
        id: "instructorName",
        accessorFn: (row) => row.instructor.user.name || "Instrutor",
        header: "Instrutor",
    },
    {
        accessorKey: "type",
        header: "Tipo",
        cell: ({ row }) => typeLabels[row.getValue("type")] || row.getValue("type"),
    },
    {
        accessorKey: "description",
        header: "Descrição",
        cell: ({ row }) => (
            <div className="max-w-[300px] truncate" title={row.getValue("description")}>
                {row.getValue("description")}
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const config = statusLabels[status] || { label: status, variant: "outline" as const };
            return <Badge variant={config.variant}>{config.label}</Badge>;
        },
    },
    {
        accessorKey: "createdAt",
        header: "Data",
        cell: ({ row }) => {
            return new Date(row.original.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        },
    },
    {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => (
            <Link href={`/complaints/${row.original.id}`}>
                <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                </Button>
            </Link>
        ),
    },
];
