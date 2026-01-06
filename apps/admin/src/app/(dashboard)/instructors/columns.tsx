'use client';

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, CheckCircle, XCircle, Eye, Ban } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export type Instructor = {
    id: string;
    user: {
        name: string | null;
        email: string;
        image: string | null;
    };
    cpf: string | null;
    status: string;
    averageRating: number;
    totalLessons: number;
    basePrice: number;
    createdAt: Date;
};

const statusMap = {
    PENDING_VERIFICATION: { label: "Pendente", variant: "secondary" as const },
    ACTIVE: { label: "Ativo", variant: "default" as const },
    INACTIVE: { label: "Inativo", variant: "outline" as const },
    SUSPENDED: { label: "Suspenso", variant: "destructive" as const },
};

function ActionsCell({ instructor }: { instructor: Instructor }) {
    const { toast } = useToast();
    const utils = api.useUtils();

    const approveMutation = api.admin.approveInstructor.useMutation({
        onSuccess: () => {
            toast({ title: "Instrutor aprovado com sucesso!" });
            utils.admin.getInstructors.invalidate();
        },
    });

    const suspendMutation = api.admin.suspendInstructor.useMutation({
        onSuccess: () => {
            toast({ title: "Instrutor suspenso com sucesso!" });
            utils.admin.getInstructors.invalidate();
        },
    });

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Detalhes
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {instructor.status === "PENDING_VERIFICATION" && (
                    <DropdownMenuItem
                        onClick={() => approveMutation.mutate({ id: instructor.id })}
                    >
                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                        Aprovar
                    </DropdownMenuItem>
                )}
                {instructor.status === "ACTIVE" && (
                    <DropdownMenuItem
                        onClick={() => suspendMutation.mutate({ id: instructor.id })}
                    >
                        <Ban className="mr-2 h-4 w-4 text-red-600" />
                        Suspender
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem className="text-destructive">
                    <XCircle className="mr-2 h-4 w-4" />
                    Rejeitar
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export const columns: ColumnDef<Instructor>[] = [
    {
        id: "instructorName",
        accessorFn: (row) => row.user.name || "Sem Nome",
        header: "Instrutor",
        cell: ({ row }) => {
            const instructor = row.original;
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={instructor.user.image || undefined} />
                        <AvatarFallback>{instructor.user.name?.charAt(0) || "I"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{instructor.user.name || "Sem Nome"}</div>
                        <div className="text-sm text-muted-foreground">{instructor.user.email}</div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as keyof typeof statusMap;
            const config = statusMap[status];
            return <Badge variant={config.variant}>{config.label}</Badge>;
        },
    },
    {
        accessorKey: "averageRating",
        header: "Avaliação",
        cell: ({ row }) => {
            const rating = row.getValue("averageRating") as number;
            return (
                <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span>{rating.toFixed(1)}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "totalLessons",
        header: "Aulas",
        cell: ({ row }) => {
            return <div>{row.getValue("totalLessons")}</div>;
        },
    },
    {
        accessorKey: "basePrice",
        header: "Preço/Hora",
        cell: ({ row }) => {
            const price = Number(row.getValue("basePrice") || 0);
            return <div>R$ {price.toFixed(2)}</div>;
        },
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionsCell instructor={row.original} />,
    },
];
