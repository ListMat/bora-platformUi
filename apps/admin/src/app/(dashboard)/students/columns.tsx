'use client';

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Mail, Phone } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Student = {
    id: string;
    user: {
        name: string | null;
        email: string;
        image: string | null;
        phone: string | null;
    };
    level: number;
    points: number;
    walletBalance: number;
    createdAt: Date;
};

export const columns: ColumnDef<Student>[] = [
    {
        id: "name",
        accessorFn: (row) => row.user.name,
        header: "Aluno",
        cell: ({ row }) => {
            const student = row.original;
            const initials = student.user.name
                ?.split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || "AL";

            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={student.user.image || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{student.user.name || "Sem nome"}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {student.user.email}
                        </div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: "user.phone",
        header: "Telefone",
        cell: ({ row }) => {
            const phone = row.original.user.phone;
            if (!phone) return <span className="text-muted-foreground">-</span>;
            return (
                <div className="flex items-center gap-1 text-sm">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    {phone}
                </div>
            );
        },
    },
    {
        accessorKey: "level",
        header: "Nível",
        cell: ({ row }) => {
            const level = row.getValue("level") as number;
            return (
                <Badge variant="secondary" className="font-semibold">
                    Nível {level}
                </Badge>
            );
        },
    },
    {
        accessorKey: "points",
        header: "Pontos",
        cell: ({ row }) => {
            const points = row.getValue("points") as number;
            return (
                <div className="flex items-center gap-1">
                    <span className="font-medium">{points.toLocaleString('pt-BR')}</span>
                    <span className="text-xs text-muted-foreground">pts</span>
                </div>
            );
        },
    },
    {
        accessorKey: "walletBalance",
        header: "Saldo",
        cell: ({ row }) => {
            const balance = row.getValue("walletBalance") as number;
            return (
                <div className="font-medium">
                    R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Cadastro",
        cell: ({ row }) => {
            const date = row.getValue("createdAt") as Date;
            return (
                <div className="text-sm text-muted-foreground">
                    {new Date(date).toLocaleDateString('pt-BR')}
                </div>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const student = row.original;

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
                            onClick={() => navigator.clipboard.writeText(student.id)}
                        >
                            Copiar ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Ver detalhes</DropdownMenuItem>
                        <DropdownMenuItem>Ver aulas</DropdownMenuItem>
                        <DropdownMenuItem>Ver pagamentos</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                            Suspender conta
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
