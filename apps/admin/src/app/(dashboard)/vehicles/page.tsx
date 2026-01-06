'use client';

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { api } from "@/lib/api";

export default function VehiclesPage() {
    const { data: vehicles, isLoading } = api.admin.getVehicles.useQuery();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Veículos</h2>
                    <p className="text-muted-foreground">
                        Frota de veículos cadastrados
                    </p>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={vehicles || []}
                isLoading={isLoading}
                searchKey="ownerName"
                searchPlaceholder="Buscar por proprietário..."
            />
        </div>
    );
}
