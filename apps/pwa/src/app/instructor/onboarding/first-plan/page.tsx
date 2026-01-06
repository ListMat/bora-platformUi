"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppNavbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import { api } from "@/utils/api";

const MIN_PRICE = 50;
const SUGGESTED_PRICES = [60, 80, 100];

export default function FirstPlanPage() {
    const router = useRouter();
    const [pricePerHour, setPricePerHour] = useState<number>(80);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const activateProfile = api.instructor.activateProfile.useMutation();

    // Calcular ganhos (85% para o instrutor)
    // TODO: Buscar percentual real do backend se possível
    const platformFee = 0.15;
    const instructorEarning = pricePerHour * (1 - platformFee);

    const handleSubmit = async () => {
        if (pricePerHour < MIN_PRICE) {
            setError(`O preço mínimo por aula é R$ ${MIN_PRICE},00`);
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            await activateProfile.mutateAsync({
                pricePerHour: pricePerHour,
            });

            // Redirecionar para dashboard
            router.push("/instructor/dashboard");
        } catch (err) {
            console.error(err);
            setError("Erro ao ativar perfil. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />

            <main className="max-w-xl mx-auto px-6 py-12">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">Defina seu preço</h1>
                    <p className="text-muted-foreground">
                        Para finalizar, escolha quanto você quer cobrar por aula
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <CardTitle>Valor da Aula (50 minutos)</CardTitle>
                        </div>
                        <CardDescription>
                            Você pode alterar esse valor a qualquer momento
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Preço por aula</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold">R$</span>
                                    <Input
                                        type="number"
                                        min={MIN_PRICE}
                                        step="5"
                                        value={pricePerHour}
                                        onChange={(e) => setPricePerHour(Number(e.target.value))}
                                        className="pl-10 text-lg font-semibold"
                                    />
                                </div>
                            </div>

                            {/* Sugestões de preço */}
                            <div className="flex gap-3">
                                {SUGGESTED_PRICES.map((price) => (
                                    <button
                                        key={price}
                                        type="button"
                                        onClick={() => setPricePerHour(price)}
                                        className={`flex-1 py-2 text-sm font-medium rounded-md border transition-colors
                                            ${pricePerHour === price
                                                ? 'bg-primary text-primary-foreground border-primary'
                                                : 'hover:bg-muted border-input'}`}
                                    >
                                        R$ {price}
                                    </button>
                                ))}
                            </div>

                            {/* Card de Ganhos */}
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                <h4 className="font-semibold text-green-800 dark:text-green-300 mb-1">
                                    Seu ganho por aula
                                </h4>
                                <div className="flex items-baseline gap-1 text-green-700 dark:text-green-400">
                                    <span className="text-2xl font-bold">
                                        R$ {instructorEarning.toFixed(2).replace('.', ',')}
                                    </span>
                                    <span className="text-sm">
                                        / 50 min
                                    </span>
                                </div>
                                <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                                    Taxa da plataforma: 15% (já descontada)
                                </p>
                            </div>
                        </div>

                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleSubmit}
                            disabled={isSubmitting || pricePerHour < MIN_PRICE}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Ativando Perfil...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Finalizar e Entrar Online
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
