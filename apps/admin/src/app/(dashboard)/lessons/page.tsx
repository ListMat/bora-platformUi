'use client';

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { api } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LessonsPage() {
    const [status, setStatus] = useState<string>("all");
    const { data: lessons, isLoading } = api.admin.getLessons.useQuery({ status });

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Aulas</h2>
                    <p className="text-muted-foreground">
                        Histórico de aulas agendadas e realizadas
                    </p>
                </div>
            </div>

            <Tabs value={status} onValueChange={setStatus} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="PENDING">Pendentes</TabsTrigger>
                    <TabsTrigger value="SCHEDULED">Agendadas</TabsTrigger>
                    <TabsTrigger value="FINISHED">Concluídas</TabsTrigger>
                    <TabsTrigger value="CANCELLED">Canceladas</TabsTrigger>
                </TabsList>

                <TabsContent value={status} className="space-y-4">
                    <DataTable
                        columns={columns}
                        // @ts-ignore
                        data={lessons || []}
                        isLoading={isLoading}
                        searchKey="studentName"
                        searchPlaceholder="Buscar por aluno..."
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
