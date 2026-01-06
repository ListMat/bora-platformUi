"use client";

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { api } from "@/lib/api";

export default function ComplaintsPage() {
    const { data: rawData, isLoading } = api.complaints.getAll.useQuery();

    const complaints = (rawData as any)?.json || rawData || [];

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Denúncias</h2>
                    <p className="text-muted-foreground">
                        Gerencie denúncias de alunos contra instrutores
                    </p>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={complaints}
                isLoading={isLoading}
                searchKey="instructorName"
                searchPlaceholder="Buscar por instrutor..."
            />
        </div>
    );
}
