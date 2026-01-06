"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppNavbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/chip";
import { Clock, AlertCircle, MapPin, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DAYS_OF_WEEK = [
    { value: 0, label: "Dom", fullLabel: "Domingo" },
    { value: 1, label: "Seg", fullLabel: "Segunda" },
    { value: 2, label: "Ter", fullLabel: "Terça" },
    { value: 3, label: "Qua", fullLabel: "Quarta" },
    { value: 4, label: "Qui", fullLabel: "Quinta" },
    { value: 5, label: "Sex", fullLabel: "Sexta" },
    { value: 6, label: "Sáb", fullLabel: "Sábado" },
];

const TIME_SLOTS = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
];

type Schedule = {
    [key: number]: { [key: string]: boolean }; // day: { "06:00": true, ... }
};

export default function HorariosPage() {
    const router = useRouter();
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

    const toggleTimeSlot = (day: number, time: string) => {
        setSchedule((prev) => {
            const daySchedule = prev[day] || {};
            const newDaySchedule = {
                ...daySchedule,
                [time]: !daySchedule[time],
            };

            return {
                ...prev,
                [day]: newDaySchedule,
            };
        });
    };

    const getTotalHours = () => {
        let total = 0;
        Object.values(schedule).forEach((daySchedule) => {
            total += Object.values(daySchedule).filter(Boolean).length * 0.5;
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

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />

            <main className="max-w-7xl mx-auto px-6 py-8">
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

                    {/* Calendário de Horários */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <CardTitle>Selecione seus horários</CardTitle>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">
                                        {totalHours}h
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {totalHours >= 10 ? "✓ Mínimo atingido" : `Faltam ${(10 - totalHours).toFixed(1)}h`}
                                    </div>
                                </div>
                            </div>
                            <CardDescription>
                                Clique nas células para selecionar os horários disponíveis (mínimo 10h/semana)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Calendário Grid */}
                            <div className="overflow-x-auto">
                                <div className="inline-block min-w-full">
                                    {/* Header dos dias */}
                                    <div className="grid grid-cols-8 gap-1 mb-2">
                                        <div className="text-xs font-medium text-muted-foreground p-2">
                                            Horário
                                        </div>
                                        {DAYS_OF_WEEK.map((day) => (
                                            <div
                                                key={day.value}
                                                className="text-center p-2 bg-muted rounded-t-lg"
                                            >
                                                <div className="font-semibold text-sm">{day.label}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {Object.values(schedule[day.value] || {}).filter(Boolean).length * 0.5}h
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Grid de horários */}
                                    <div className="space-y-1">
                                        {TIME_SLOTS.map((time) => (
                                            <div key={time} className="grid grid-cols-8 gap-1">
                                                {/* Coluna de horário */}
                                                <div className="text-xs font-medium text-muted-foreground p-2 flex items-center">
                                                    {time}
                                                </div>

                                                {/* Células de cada dia */}
                                                {DAYS_OF_WEEK.map((day) => {
                                                    const isSelected = schedule[day.value]?.[time];
                                                    return (
                                                        <button
                                                            key={`${day.value}-${time}`}
                                                            onClick={() => toggleTimeSlot(day.value, time)}
                                                            className={`
                                                                h-10 rounded transition-all border
                                                                ${isSelected
                                                                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                                                    : "bg-background hover:bg-muted border-border"
                                                                }
                                                            `}
                                                            title={`${day.fullLabel} às ${time}`}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Legenda */}
                            <div className="mt-6 flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-primary rounded border border-primary"></div>
                                    <span className="text-muted-foreground">Disponível</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-background rounded border border-border"></div>
                                    <span className="text-muted-foreground">Indisponível</span>
                                </div>
                            </div>

                            {/* Dica */}
                            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg flex gap-3">
                                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium mb-1">💡 Dica para aumentar seus ganhos</p>
                                    <p className="text-muted-foreground">
                                        Quanto mais horários disponíveis, mais alunos você pode atender.
                                        Instrutores com 20h+ semanais ganham até 2x mais!
                                    </p>
                                </div>
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
