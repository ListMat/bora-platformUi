"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

// Tipo correspondente ao retorno do backend
export type Rating = {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
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

export const columns: ColumnDef<Rating>[] = [
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
        accessorKey: "rating",
        header: "Nota",
        cell: ({ row }) => {
            const rating = row.getValue("rating") as number;
            return (
                <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                }`}
                        />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">({rating})</span>
                </div>
            );
        },
    },
    {
        accessorKey: "comment",
        header: "Comentário",
        cell: ({ row }) => (
            <div className="max-w-[300px] truncate" title={row.getValue("comment") || ""}>
                {row.getValue("comment") || <span className="text-muted-foreground italic">Sem comentário</span>}
            </div>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Data",
        cell: ({ row }) => {
            return new Date(row.original.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        },
    },
];
