'use client';

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function StudentsPage() {
    const { data: students, isLoading } = api.admin.getStudents.useQuery();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Alunos</h2>
                    <p className="text-muted-foreground">
                        Liste e gerencie os alunos cadastrados no sistema
                    </p>
                </div>
            </div>

            <DataTable
                columns={columns}
                // @ts-ignore - Prisma Decimal type mismatch
                data={students || []}
                isLoading={isLoading}
                searchKey="userName"
                searchPlaceholder="Buscar por nome..."
            />
        </div>
    );
}
