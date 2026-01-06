"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Tipo inferido do retorno da API (simplificado para UI)
export type Student = {
    id: string;
    userId: string;
    cpf: string | null;
    points: number;
    level: number;
    walletBalance: any; // Decimal do Prisma costuma vir como string ou object
    createdAt: Date;
    user: {
        name: string | null;
        email: string | null;
        image: string | null;
    };
};

export const columns: ColumnDef<Student>[] = [
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
        id: "userName",
        accessorFn: (row) => row.user.name,
        header: "Aluno",
        cell: ({ row }) => {
            const user = row.original.user;
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.image || ""} alt={user.name || ""} />
                        <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "cpf",
        header: "CPF",
        cell: ({ row }) => row.original.cpf || "-",
    },
    {
        accessorKey: "level",
        header: "Nível",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Badge variant="outline">Nível {row.original.level}</Badge>
                <span className="text-xs text-muted-foreground">{row.original.points} pts</span>
            </div>
        ),
    },
    {
        accessorKey: "walletBalance",
        header: "Saldo",
        cell: ({ row }) => {
            const balance = Number(row.original.walletBalance || 0);
            return (
                <span className={balance > 0 ? "text-green-600 font-medium" : "text-muted-foreground"}>
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(balance)}
                </span>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Cadastro",
        cell: ({ row }) => {
            return new Date(row.original.createdAt).toLocaleDateString("pt-BR");
        },
    },
];
