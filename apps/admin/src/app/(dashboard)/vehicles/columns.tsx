"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

export type Vehicle = {
    id: string;
    brand: string;
    model: string;
    year: number;
    plateLastFour: string;
    category: string;
    transmission: string;
    status: string;
    user: {
        name: string | null;
        email: string | null;
    };
};

export const columns: ColumnDef<Vehicle>[] = [
    {
        id: "ownerName",
        accessorFn: (row) => row.user.name,
        header: "Proprietário",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.user.name}</span>
                <span className="text-xs text-muted-foreground">{row.original.user.email}</span>
            </div>
        ),
    },
    {
        id: "vehicle",
        header: "Veículo",
        accessorFn: (row) => `${row.brand} ${row.model}`,
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.brand} {row.original.model}</span>
                <span className="text-xs text-muted-foreground">{row.original.year}</span>
            </div>
        ),
    },
    {
        accessorKey: "plateLastFour",
        header: "Placa (Final)",
        cell: ({ row }) => `...${row.original.plateLastFour}`,
    },
    {
        accessorKey: "category",
        header: "Categoria",
        cell: ({ row }) => <Badge variant="outline">{row.original.category}</Badge>,
    },
    {
        accessorKey: "transmission",
        header: "Câmbio",
        cell: ({ row }) => (
            <Badge variant={row.original.transmission === "AUTOMATIC" ? "secondary" : "outline"}>
                {row.original.transmission}
            </Badge>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <Badge variant={row.original.status === "ACTIVE" ? "default" : "destructive"}>
                {row.original.status}
            </Badge>
        ),
    },
];
