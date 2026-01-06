'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/chip";
import AppNavbar from '@/components/Navbar';
import { Check, Flame, Zap, Gem, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function BoostPage() {
    const [selectedBoost, setSelectedBoost] = useState<string>('boost-week');

    const boostOptions = [
        {
            id: 'boost-24h',
            name: 'Boost 24 Horas',
            icon: <Flame className="w-12 h-12 text-orange-500" />,
            duration: '24 horas',
            price: 19.90,
            multiplier: '3x',
            benefits: [
                'Aparece no topo dos resultados',
                'Badge "Em Destaque" visível',
                '3x mais visualizações do perfil',
                'Notificação para alunos próximos',
            ],
            bestFor: 'Teste rápido de visibilidade',
        },
        {
            id: 'boost-week',
            name: 'Boost Semanal',
            icon: <Zap className="w-12 h-12 text-yellow-500" />,
            duration: '7 dias',
            price: 59.90,
            multiplier: '5x',
            benefits: [
                'Tudo do Boost 24h',
                'Destaque por 7 dias completos',
                '5x mais visualizações',
                'Análise de performance detalhada',
                'Prioridade em notificações',
            ],
            popular: true,
            bestFor: 'Melhor custo-benefício',
            savings: 'Economize R$ 79,40 vs diário',
        },
        {
            id: 'boost-month',
            name: 'Boost Mensal',
            icon: <Gem className="w-12 h-12 text-blue-500" />,
            duration: '30 dias',
            price: 179.90,
            multiplier: '10x',
            benefits: [
                'Tudo do Boost Semanal',
                'Destaque por 30 dias inteiros',
                'Badge "Top Instrutor"',
                '10x mais visualizações',
                'Prioridade máxima em buscas',
                'Analytics avançado em tempo real',
                'Suporte prioritário',
            ],
            bestFor: 'Máximo de aulas',
            savings: 'Economize R$ 417,10 vs diário',
        },
    ];

    const stats = {
        avgViewsNormal: 45,
        avgViewsBoosted: 450,
        avgConversionRate: 0.15,
        avgLessonPrice: 120,
    };

    const selectedOption = boostOptions.find((opt) => opt.id === selectedBoost)!;
    const estimatedViews = stats.avgViewsNormal * parseInt(selectedOption.multiplier);
    const estimatedBookings = Math.floor(estimatedViews * stats.avgConversionRate);
    const estimatedRevenue = estimatedBookings * stats.avgLessonPrice;
    const roi = ((estimatedRevenue - selectedOption.price) / selectedOption.price) * 100;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/90 to-primary text-primary-foreground py-20">
                <div className="max-w-screen-xl mx-auto px-6 lg:px-20 text-center">
                    <h1 className="text-5xl font-bold mb-6">
                        Impulsione Seu Perfil
                    </h1>
                    <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                        Apareça no topo dos resultados e receba até <span className="font-bold">10x mais visualizações</span>
                    </p>

                    {/* Quick Stats */}
                    <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        {[
                            { label: 'Mais Visualizações', value: 'Até 10x' },
                            { label: 'Mais Aulas', value: '+250%' },
                            { label: 'ROI Médio', value: '+380%' },
                        ].map((stat) => (
                            <div key={stat.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                                <div className="text-sm text-primary-foreground/80">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Boost Options */}
            <section className="py-20">
                <div className="max-w-screen-xl mx-auto px-6 lg:px-20">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        Escolha Seu Boost
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {boostOptions.map((option) => (
                            <Card
                                key={option.id}
                                onClick={() => setSelectedBoost(option.id)}
                                className={cn(
                                    "cursor-pointer transition-all relative overflow-hidden",
                                    selectedBoost === option.id ? "border-primary ring-2 ring-primary ring-offset-2 scale-105 shadow-xl" : "hover:shadow-lg"
                                )}
                            >
                                {option.popular && (
                                    <div className="absolute top-0 inset-x-0 h-6 bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground tracking-wider uppercase">
                                        Mais Popular
                                    </div>
                                )}
                                <CardContent className={cn("p-8", option.popular && "pt-10")}>
                                    <div className="text-center mb-6">
                                        <div className="flex justify-center mb-4">{option.icon}</div>
                                        <h3 className="text-2xl font-bold mb-2">
                                            {option.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{option.bestFor}</p>
                                    </div>

                                    <div className="text-center mb-6">
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-sm font-medium text-muted-foreground">R$</span>
                                            <span className="text-4xl font-bold">
                                                {option.price.toFixed(2).replace('.', ',')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{option.duration}</p>
                                        {option.savings && (
                                            <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700 hover:bg-green-100">
                                                {option.savings}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="bg-primary/5 rounded-xl p-4 mb-6 text-center">
                                        <div className="text-3xl font-bold text-primary">{option.multiplier}</div>
                                        <div className="text-xs text-muted-foreground">mais visualizações</div>
                                    </div>

                                    <ul className="space-y-3">
                                        {option.benefits.map((benefit, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-sm text-muted-foreground">{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* ROI Calculator */}
            <section className="py-20 bg-muted/30">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-8 text-center">
                        Calculadora de Retorno
                    </h2>

                    <Card className="p-8">
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-primary" />
                                    Com Boost ({selectedOption.name})
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Visualizações:</span>
                                        <span className="font-bold text-primary">{estimatedViews}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Aulas esperadas:</span>
                                        <span className="font-bold text-primary">{estimatedBookings}</span>
                                    </div>
                                    <div className="flex justify-between p-3 bg-primary/5 rounded-lg">
                                        <span className="font-medium">Receita estimada:</span>
                                        <span className="font-bold text-primary text-lg">
                                            R$ {estimatedRevenue.toLocaleString('pt-BR')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
                                    Sem Boost (Normal)
                                </h3>
                                <div className="space-y-3 opacity-70">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Visualizações:</span>
                                        <span className="font-medium">{stats.avgViewsNormal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Aulas esperadas:</span>
                                        <span className="font-medium">
                                            {Math.floor(stats.avgViewsNormal * stats.avgConversionRate)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between p-3 border rounded-lg">
                                        <span className="font-medium">Receita estimada:</span>
                                        <span className="font-medium">
                                            R$ {(Math.floor(stats.avgViewsNormal * stats.avgConversionRate) * stats.avgLessonPrice).toLocaleString('pt-BR')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ROI Highlight */}
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 text-center shadow-lg">
                            <div className="text-sm font-medium mb-1 opacity-90">Retorno sobre Investimento</div>
                            <div className="text-4xl font-bold mb-2">+{roi.toFixed(0)}%</div>
                            <div className="text-sm opacity-90">
                                Para cada R$ 1 investido, você recebe R$ {(roi / 100 + 1).toFixed(2)}
                            </div>
                        </div>
                    </Card>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Pronto para Receber Mais Aulas?
                    </h2>
                    <p className="text-xl text-primary-foreground/90 mb-8">
                        Ative seu Boost agora e comece a receber mais solicitações em minutos
                    </p>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20">
                        <div className="text-lg mb-4 text-primary-foreground/80">Você selecionou:</div>
                        <div className="text-3xl font-bold mb-2">{selectedOption.name}</div>
                        <div className="text-5xl font-bold mb-4">
                            R$ {selectedOption.price.toFixed(2).replace('.', ',')}
                        </div>
                        <div className="text-primary-foreground/80 mb-8">{selectedOption.duration} de destaque</div>

                        <Button
                            size="lg"
                            variant="secondary"
                            className="w-full max-w-md h-14 text-lg font-bold shadow-xl"
                        >
                            Ativar Boost Agora
                        </Button>
                    </div>

                    <p className="text-sm text-primary-foreground/70">
                        Garantia de 7 dias • Cancele quando quiser
                    </p>
                </div>
            </section>
        </div>
    );
}
