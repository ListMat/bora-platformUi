'use client';

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Download, Calendar, TrendingUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function LessonsPage() {
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

    const { data: lessons, isLoading } = api.admin.getLessons.useQuery({
        status: statusFilter
    });

    // Estatísticas
    const totalLessons = lessons?.length || 0;
    const completedLessons = lessons?.filter(l => l.status === 'FINISHED').length || 0;
    const activeLessons = lessons?.filter(l => l.status === 'ACTIVE' || l.status === 'SCHEDULED').length || 0;
    const totalRevenue = lessons
        ?.filter(l => l.paymentStatus === 'COMPLETED')
        .reduce((sum, l) => sum + Number(l.price), 0) || 0;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Aulas</h2>
                    <p className="text-muted-foreground">
                        Gerencie todas as aulas da plataforma
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total de Aulas
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalLessons}</div>
                        <p className="text-xs text-muted-foreground">
                            Todas as aulas
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Concluídas
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completedLessons}</div>
                        <p className="text-xs text-muted-foreground">
                            Aulas finalizadas
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Ativas/Agendadas
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeLessons}</div>
                        <p className="text-xs text-muted-foreground">
                            Em andamento
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Receita Total
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Aulas pagas
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for filtering */}
            <Tabs defaultValue="all" className="space-y-4" onValueChange={(value) => {
                setStatusFilter(value === 'all' ? undefined : value);
            }}>
                <TabsList>
                    <TabsTrigger value="all">Todas</TabsTrigger>
                    <TabsTrigger value="PENDING">Pendentes</TabsTrigger>
                    <TabsTrigger value="SCHEDULED">Agendadas</TabsTrigger>
                    <TabsTrigger value="ACTIVE">Ativas</TabsTrigger>
                    <TabsTrigger value="FINISHED">Concluídas</TabsTrigger>
                    <TabsTrigger value="CANCELLED">Canceladas</TabsTrigger>
                </TabsList>

                <TabsContent value={statusFilter || 'all'} className="space-y-4">
                    <DataTable
                        columns={columns}
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
