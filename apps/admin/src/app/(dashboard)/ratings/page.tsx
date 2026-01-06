"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { api } from "@/lib/api";

export default function RatingsPage() {
    const { data: rawData, isLoading } = api.admin.getRatings.useQuery();

    // Tratamento para SuperJSON wrapper se necessário
    const ratings = (rawData as any)?.json || rawData || [];

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Avaliações</h2>
                    <p className="text-muted-foreground">
                        Histórico de avaliações dos alunos sobre as aulas
                    </p>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={ratings}
                isLoading={isLoading}
                searchKey="instructorName" // Permite buscar por nome do instrutor (baseado no ID da coluna)
                searchPlaceholder="Buscar por instrutor..."
            />
        </div>
    );
}
