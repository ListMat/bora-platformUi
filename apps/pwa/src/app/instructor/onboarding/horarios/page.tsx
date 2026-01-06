"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppNavbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/chip";
import { Clock, AlertCircle, MapPin } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DAYS_OF_WEEK = [
    { value: 0, label: "Dom" },
    { value: 1, label: "Seg" },
    { value: 2, label: "Ter" },
    { value: 3, label: "Qua" },
    { value: 4, label: "Qui" },
    { value: 5, label: "Sex" },
    { value: 6, label: "Sáb" },
];

const TIME_SLOTS = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
];

type Schedule = {
    [key: number]: string[]; // day: ["06:00", "06:30", ...]
};

export default function HorariosPage() {
    const router = useRouter();
    const [selectedDay, setSelectedDay] = useState<number>(1); // Segunda por padrão
    const [schedule, setSchedule] = useState<Schedule>({});
    const [cep, setCep] = useState("");
    const [address, setAddress] = useState({
        street: "",
        neighborhood: "",
        city: "",
        state: "",
    });
    const [loadingCep, setLoadingCep] = useState(false);
    const [error, setError] = useState("");

    const toggleTimeSlot = (time: string) => {
        setSchedule((prev) => {
            const daySlots = prev[selectedDay] || [];
            const newSlots = daySlots.includes(time)
                ? daySlots.filter((t) => t !== time)
                : [...daySlots, time].sort();

            return {
                ...prev,
                [selectedDay]: newSlots,
            };
        });
    };

    const getTotalHours = () => {
        let total = 0;
        Object.values(schedule).forEach((slots) => {
            total += slots.length * 0.5; // Cada slot = 30 min = 0.5h
        });
        return total;
    };

    const handleCepBlur = async () => {
        const cleanCep = cep.replace(/\D/g, "");
        if (cleanCep.length !== 8) return;

        setLoadingCep(true);
        setError("");

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (data.erro) {
                setError("CEP não encontrado");
                return;
            }

            setAddress({
                street: data.logradouro || "",
                neighborhood: data.bairro || "",
                city: data.localidade || "",
                state: data.uf || "",
            });
        } catch (err) {
            setError("Erro ao buscar CEP");
        } finally {
            setLoadingCep(false);
        }
    };

    const handleSubmit = () => {
        const totalHours = getTotalHours();

        if (totalHours < 10) {
            setError("Selecione pelo menos 10 horas por semana");
            return;
        }

        if (!cep || !address.city) {
            setError("Preencha o CEP válido");
            return;
        }

        // TODO: Salvar horários e localização
        router.push("/instructor/onboarding/veiculos");
    };

    const totalHours = getTotalHours();
    const daySlots = schedule[selectedDay] || [];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />

            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Etapa 2 de 3</span>
                        <span className="text-sm text-muted-foreground">Horários e Localização</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-2/3 transition-all"></div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Localização */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                <CardTitle>Onde você atende?</CardTitle>
                            </div>
                            <CardDescription>
                                Informe seu CEP para que os alunos possam encontrar você
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cep">CEP *</Label>
                                    <Input
                                        id="cep"
                                        placeholder="00000-000"
                                        value={cep}
                                        onChange={(e) => setCep(e.target.value)}
                                        onBlur={handleCepBlur}
                                        maxLength={9}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Estado</Label>
                                    <Input value={address.state} disabled />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Cidade</Label>
                                    <Input value={address.city} disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label>Bairro</Label>
                                    <Input value={address.neighborhood} disabled />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Rua</Label>
                                <Input value={address.street} disabled />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Horários */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-primary" />
                                <CardTitle>Selecione seus horários</CardTitle>
                            </div>
                            <CardDescription>
                                Escolha os dias e horários que você está disponível (mínimo 10h/semana)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Indicador de horas */}
                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total selecionado</p>
                                    <p className="text-2xl font-bold">
                                        {totalHours}h <span className="text-sm font-normal text-muted-foreground">/ semana</span>
                                    </p>
                                </div>
                                {totalHours >= 10 ? (
                                    <Badge variant="default">✓ Mínimo atingido</Badge>
                                ) : (
                                    <Badge variant="outline">Faltam {(10 - totalHours).toFixed(1)}h</Badge>
                                )}
                            </div>

                            {/* Seletor de dia */}
                            <div>
                                <Label className="mb-3 block">Dia da semana</Label>
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {DAYS_OF_WEEK.map((day) => {
                                        const hasSlots = (schedule[day.value] || []).length > 0;
                                        return (
                                            <button
                                                key={day.value}
                                                onClick={() => setSelectedDay(day.value)}
                                                className={`
                                                    px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all
                                                    ${selectedDay === day.value
                                                        ? "bg-primary text-primary-foreground"
                                                        : hasSlots
                                                            ? "bg-primary/10 text-primary border border-primary"
                                                            : "bg-muted hover:bg-muted/80"
                                                    }
                                                `}
                                            >
                                                {day.label}
                                                {hasSlots && (
                                                    <span className="ml-1 text-xs">
                                                        ({schedule[day.value].length})
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Seletor de horário */}
                            <div>
                                <Label className="mb-3 block">
                                    Horários disponíveis - {DAYS_OF_WEEK[selectedDay].label}
                                </Label>
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-96 overflow-y-auto p-2">
                                    {TIME_SLOTS.map((time) => {
                                        const isSelected = daySlots.includes(time);
                                        return (
                                            <button
                                                key={time}
                                                onClick={() => toggleTimeSlot(time)}
                                                className={`
                                                    px-3 py-2 rounded-lg text-sm font-medium transition-all
                                                    ${isSelected
                                                        ? "bg-primary text-primary-foreground shadow-md"
                                                        : "bg-muted hover:bg-muted/80"
                                                    }
                                                `}
                                            >
                                                {time}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Dica */}
                            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                <p className="text-sm">
                                    💡 <strong>Dica:</strong> Quanto mais horários disponíveis, mais alunos você pode atender
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botões */}
                    <div className="flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            className="flex-1"
                        >
                            Voltar
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={totalHours < 10 || !address.city}
                            className="flex-1"
                        >
                            Continuar
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
