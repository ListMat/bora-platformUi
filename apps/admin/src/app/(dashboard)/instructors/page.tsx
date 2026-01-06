'use client';

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InstructorsPage() {
    const [status, setStatus] = useState<string>("all");
    const { data: instructors, isLoading } = api.admin.getInstructors.useQuery({ status });

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Instrutores</h2>
                    <p className="text-muted-foreground">
                        Gerencie e aprove instrutores do sistema
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Instrutor
                </Button>
            </div>

            <Tabs value={status} onValueChange={setStatus} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="PENDING_VERIFICATION">Pendentes</TabsTrigger>
                    <TabsTrigger value="ACTIVE">Ativos</TabsTrigger>
                    <TabsTrigger value="INACTIVE">Inativos</TabsTrigger>
                    <TabsTrigger value="SUSPENDED">Suspensos</TabsTrigger>
                </TabsList>

                <TabsContent value={status} className="space-y-4">
                    <DataTable
                        columns={columns}
                        data={instructors || []}
                        isLoading={isLoading}
                        searchKey="user.name"
                        searchPlaceholder="Buscar por nome..."
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
