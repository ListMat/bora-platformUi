'use client';

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { api } from "@/lib/api";

export default function PaymentsPage() {
    const { data, isLoading } = api.admin.getPayments.useQuery();
    const payments = (data as any)?.json || data || [];

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Pagamentos</h2>
                    <p className="text-muted-foreground">
                        Histórico financeiro de transações
                    </p>
                </div>
            </div>

            <DataTable
                columns={columns}
                // @ts-ignore
                data={payments || []}
                isLoading={isLoading}
                searchKey="payerName"
                searchPlaceholder="Buscar por aluno..."
            />
        </div>
    );
}
