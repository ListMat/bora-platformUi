'use client';

import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Download, DollarSign, TrendingUp, CreditCard, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function PaymentsPage() {
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

    const { data: payments, isLoading } = api.admin.getPayments.useQuery();

    // Filtrar por status se necessário
    const filteredPayments = statusFilter
        ? payments?.filter(p => p.status === statusFilter)
        : payments;

    // Estatísticas
    const totalPayments = payments?.length || 0;
    const completedPayments = payments?.filter(p => p.status === 'COMPLETED').length || 0;
    const pendingPayments = payments?.filter(p => p.status === 'PENDING').length || 0;
    const failedPayments = payments?.filter(p => p.status === 'FAILED').length || 0;

    const totalRevenue = payments
        ?.filter(p => p.status === 'COMPLETED')
        .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    const pendingRevenue = payments
        ?.filter(p => p.status === 'PENDING' || p.status === 'PROCESSING')
        .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Pagamentos</h2>
                    <p className="text-muted-foreground">
                        Gerencie todos os pagamentos da plataforma
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                            {completedPayments} pagamentos concluídos
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Receita Pendente
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            R$ {pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {pendingPayments} pagamentos pendentes
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total de Transações
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPayments}</div>
                        <p className="text-xs text-muted-foreground">
                            Todas as transações
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Pagamentos Falhados
                        </CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">{failedPayments}</div>
                        <p className="text-xs text-muted-foreground">
                            Requerem atenção
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for filtering */}
            <Tabs defaultValue="all" className="space-y-4" onValueChange={(value) => {
                setStatusFilter(value === 'all' ? undefined : value);
            }}>
                <TabsList>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="COMPLETED">Concluídos</TabsTrigger>
                    <TabsTrigger value="PENDING">Pendentes</TabsTrigger>
                    <TabsTrigger value="PROCESSING">Processando</TabsTrigger>
                    <TabsTrigger value="FAILED">Falhados</TabsTrigger>
                    <TabsTrigger value="REFUNDED">Reembolsados</TabsTrigger>
                </TabsList>

                <TabsContent value={statusFilter || 'all'} className="space-y-4">
                    <DataTable
                        columns={columns}
                        data={filteredPayments || []}
                        isLoading={isLoading}
                        searchKey="studentName"
                        searchPlaceholder="Buscar por aluno..."
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
