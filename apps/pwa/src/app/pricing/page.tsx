'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/chip";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import AppNavbar from '@/components/Navbar';
import { Check, X } from 'lucide-react';

export default function PricingPage() {
    const [isAnnual, setIsAnnual] = useState(true);

    const plans = [
        {
            id: 'free',
            name: 'Gratuito',
            price: { monthly: 0, annual: 0 },
            commission: 20,
            features: [
                'Perfil básico',
                'Até 10 aulas/mês',
                'Suporte por email',
                'Visibilidade normal',
            ],
            notIncluded: [
                'Badge profissional',
                'Analytics',
                'Boost grátis',
                'Prioridade',
            ],
        },
        {
            id: 'pro',
            name: 'Pro',
            price: { monthly: 79, annual: 63 },
            commission: 15,
            popular: true,
            features: [
                'Tudo do Gratuito',
                'Aulas ilimitadas',
                'Badge "PRO"',
                'Analytics básico',
                '3 boosts grátis/mês',
                'Prioridade moderada',
            ],
            notIncluded: [
                'Badge Premium',
                'Analytics avançado',
            ],
        },
        {
            id: 'premium',
            name: 'Premium',
            price: { monthly: 149, annual: 119 },
            commission: 12,
            features: [
                'Tudo do Pro',
                'Badge "PREMIUM" + Verificado',
                'Analytics avançado',
                '10 boosts grátis/mês',
                'Prioridade máxima',
                'Gerente de conta',
                'Marketing personalizado',
            ],
            notIncluded: [],
        },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />

            {/* Hero */}
            <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
                <div className="max-w-screen-xl mx-auto px-6 lg:px-20 text-center">
                    <Badge variant="secondary" className="mb-6 px-4 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 border-0">
                        💰 Planos para Instrutores
                    </Badge>
                    <h1 className="text-5xl font-bold mb-6">
                        Escolha o plano ideal para você
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Comece grátis e escale conforme seu negócio cresce
                    </p>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                            Mensal
                        </span>
                        <Switch
                            checked={isAnnual}
                            onCheckedChange={setIsAnnual}
                            className="scale-125"
                        />
                        <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                            Anual
                        </span>
                        {isAnnual && (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">
                                Economize 20%
                            </Badge>
                        )}
                    </div>
                </div>
            </section>

            {/* Plans */}
            <section className="py-16 -mt-20">
                <div className="max-w-screen-xl mx-auto px-6 lg:px-20">
                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <Card
                                key={plan.id}
                                className={`relative transition-all duration-300 ${plan.popular
                                    ? 'border-2 border-primary scale-105 shadow-2xl z-10'
                                    : 'hover:shadow-lg'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
                                            MAIS POPULAR
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader className="flex-col items-start gap-2 pt-8">
                                    <h3 className="text-2xl font-bold">
                                        {plan.name}
                                    </h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold">
                                            R$ {isAnnual ? plan.price.annual : plan.price.monthly}
                                        </span>
                                        {plan.price.monthly > 0 && (
                                            <span className="text-muted-foreground">/mês</span>
                                        )}
                                    </div>
                                    {isAnnual && plan.price.monthly > 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            Cobrado anualmente (R$ {plan.price.annual * 12})
                                        </p>
                                    )}
                                </CardHeader>

                                <CardContent className="gap-4 grid">
                                    <div className="bg-primary/10 rounded-lg p-4 text-center">
                                        <p className="text-xs text-foreground/70 mb-1">Comissão por aula</p>
                                        <p className="text-3xl font-bold text-primary">{plan.commission}%</p>
                                    </div>

                                    <div className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm">{feature}</span>
                                            </div>
                                        ))}
                                        {plan.notIncluded.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-2 opacity-50">
                                                <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                                                <span className="text-sm text-muted-foreground">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>

                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        variant={plan.popular ? "default" : "outline"}
                                        size="lg"
                                    >
                                        {plan.id === 'free' ? 'Começar Grátis' : 'Assinar Agora'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 bg-muted/30">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-8 text-center">
                        Perguntas Frequentes
                    </h2>

                    <Accordion className="space-y-4">
                        <AccordionItem
                            key="1"
                            title="Como funciona a comissão?"
                        >
                            <p className="text-muted-foreground">
                                A comissão é descontada automaticamente de cada aula realizada. Por exemplo, em uma aula de R$ 120 com comissão de 15%, você recebe R$ 102 e a plataforma fica com R$ 18.
                            </p>
                        </AccordionItem>

                        <AccordionItem
                            key="2"
                            title="Posso mudar de plano a qualquer momento?"
                        >
                            <p className="text-muted-foreground">
                                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças entram em vigor imediatamente.
                            </p>
                        </AccordionItem>

                        <AccordionItem
                            key="3"
                            title="O que são boosts grátis?"
                        >
                            <p className="text-muted-foreground">
                                Boosts aumentam a visibilidade do seu perfil nos resultados de busca. Planos pagos incluem boosts gratuitos mensais que você pode ativar quando quiser.
                            </p>
                        </AccordionItem>

                        <AccordionItem
                            key="4"
                            title="Preciso assinar contrato de longo prazo?"
                        >
                            <p className="text-muted-foreground">
                                Não! Todos os planos são sem compromisso. Você pode cancelar a qualquer momento e não será cobrado no próximo ciclo.
                            </p>
                        </AccordionItem>
                    </Accordion>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Pronto para começar?
                    </h2>
                    <p className="text-xl text-primary-foreground/90 mb-8">
                        Junte-se a centenas de instrutores que já estão crescendo com a Bora
                    </p>
                    <Button
                        size="lg"
                        className="bg-background text-primary hover:bg-background/90 rounded-full font-semibold px-8"
                        asChild
                    >
                        <a href="/signup/instructor">Criar Conta Gratuita</a>
                    </Button>
                </div>
            </section>
        </div>
    );
}
