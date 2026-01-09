'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, GraduationCap, Calendar, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";

interface StatsCardsProps {
    stats: any;
}

export function StatsCards({ stats }: StatsCardsProps) {
    const formatGrowth = (growth: number) => {
        const sign = growth >= 0 ? '+' : '';
        return `${sign}${growth}% do mês passado`;
    };

    const cards = [
        {
            title: "Total de Alunos",
            value: stats?.totalStudents || 0,
            change: formatGrowth(stats?.studentsGrowth || 0),
            icon: Users,
            color: "text-blue-600",
        },
        {
            title: "Instrutores Ativos",
            value: stats?.activeInstructors || 0,
            change: formatGrowth(stats?.instructorsGrowth || 0),
            icon: GraduationCap,
            color: "text-green-600",
        },
        {
            title: "Aulas Hoje",
            value: stats?.lessonsToday || 0,
            change: `${stats?.lessonsPending || 0} pendentes`,
            icon: Calendar,
            color: "text-orange-600",
        },
        {
            title: "Receita do Mês",
            value: `R$ ${(stats?.monthlyRevenue || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: formatGrowth(stats?.revenueGrowth || 0),
            icon: DollarSign,
            color: "text-emerald-600",
        },
        {
            title: "Taxa de Conversão",
            value: `${stats?.conversionRate || 0}%`,
            change: "Aulas concluídas vs agendadas",
            icon: TrendingUp,
            color: "text-purple-600",
        },
        {
            title: "SOS Ativos",
            value: stats?.activeSOS || 0,
            change: stats?.activeSOS > 0 ? "Requer atenção!" : "Tudo tranquilo",
            icon: AlertTriangle,
            color: stats?.activeSOS > 0 ? "text-red-600" : "text-gray-400",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cards.map((card, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {card.title}
                        </CardTitle>
                        <card.icon className={`h-4 w-4 ${card.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{card.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {card.change}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
