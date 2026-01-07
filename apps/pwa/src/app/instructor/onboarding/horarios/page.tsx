"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppNavbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/chip";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Clock, AlertCircle, MapPin, Plus, Trash2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/utils/api";

const DAYS_OF_WEEK = [
    { value: "0", label: "Domingo" },
    { value: "1", label: "Segunda-feira" },
    { value: "2", label: "Terça-feira" },
    { value: "3", label: "Quarta-feira" },
    { value: "4", label: "Quinta-feira" },
    { value: "5", label: "Sexta-feira" },
    { value: "6", label: "Sábado" },
];

const TIME_SLOTS = [
    "06:00", "06:30", "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30",
];

type ScheduleSlot = {
    id: string;
    day: string;
    startTime: string;
    endTime: string;
};

export default function HorariosPage() {
    const router = useRouter();
    const [scheduleSlots, setScheduleSlots] = useState<ScheduleSlot[]>([
        { id: "1", day: "", startTime: "", endTime: "" },
    ]);
    const [cep, setCep] = useState("");
    const [address, setAddress] = useState({
        street: "",
        neighborhood: "",
        city: "",
        state: "",
    });
    const [loadingCep, setLoadingCep] = useState(false);
    const [error, setError] = useState("");
    const [coords, setCoords] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });

    const addScheduleSlot = () => {
        setScheduleSlots([
            ...scheduleSlots,
            { id: Date.now().toString(), day: "", startTime: "", endTime: "" },
        ]);
    };

    const removeScheduleSlot = (id: string) => {
        if (scheduleSlots.length === 1) {
            setError("Você precisa ter pelo menos 1 horário cadastrado");
            return;
        }
        setScheduleSlots(scheduleSlots.filter((slot) => slot.id !== id));
        setError("");
    };

    const updateScheduleSlot = (id: string, field: keyof ScheduleSlot, value: string) => {
        setScheduleSlots(
            scheduleSlots.map((slot) =>
                slot.id === id ? { ...slot, [field]: value } : slot
            )
        );
    };

    const getTotalHours = () => {
        let total = 0;
        scheduleSlots.forEach((slot) => {
            if (slot.startTime && slot.endTime) {
                const start = parseInt(slot.startTime.split(":")[0]) * 2 + parseInt(slot.startTime.split(":")[1]) / 30;
                const end = parseInt(slot.endTime.split(":")[0]) * 2 + parseInt(slot.endTime.split(":")[1]) / 30;
                total += (end - start) * 0.5;
            }
        });
        return total;
    };

    const handleCepBlur = async () => {
        const cleanCep = cep.replace(/\D/g, "");
        if (cleanCep.length !== 8) return;

        setLoadingCep(true);
        setError("");

        try {
            // 1. Buscar endereço via ViaCEP
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (data.erro) {
                setError("CEP não encontrado");
                return;
            }

            const newAddress = {
                street: data.logradouro || "",
                neighborhood: data.bairro || "",
                city: data.localidade || "",
                state: data.uf || "",
            };

            setAddress(newAddress);

            // 2. Geocodificar usando Mapbox
            const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
            if (token && newAddress.street && newAddress.city) {
                const fullAddress = `${newAddress.street}, ${newAddress.neighborhood}, ${newAddress.city} - ${newAddress.state}, Brasil`;
                const mapboxUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=${token}&country=br&limit=1`;

                const geoRes = await fetch(mapboxUrl);
                const geoData = await geoRes.json();

                if (geoData.features && geoData.features.length > 0) {
                    const [lng, lat] = geoData.features[0].center;
                    setCoords({ lat, lng });
                    console.log("Geocoded:", { lat, lng });
                }
            }

        } catch (err) {
            setError("Erro ao buscar CEP ou geolocalização");
            console.error(err);
        } finally {
            setLoadingCep(false);
        }
    };

    const validateSchedules = () => {
        for (const slot of scheduleSlots) {
            if (!slot.day || !slot.startTime || !slot.endTime) {
                return false;
            }
            // Validar se horário final é maior que inicial
            if (slot.startTime >= slot.endTime) {
                return false;
            }
        }
        return true;
    };

    const updateAvailability = api.instructor.updateAvailabilityAndLocation.useMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        const totalHours = getTotalHours();

        if (!validateSchedules()) {
            setError("Preencha todos os horários corretamente");
            return;
        }

        if (totalHours < 10) {
            setError("Selecione pelo menos 10 horas por semana");
            return;
        }

        if (!cep || !address.city) {
            setError("Preencha o CEP válido");
            return;
        }

        setIsSubmitting(true);
        setError("");

        console.log('[handleSubmit] Iniciando...', { cep, address, coords, scheduleSlots });

        try {
            // Construir objeto de input com tipos corretos
            const inputData = {
                cep: cep,
                street: address.street,
                neighborhood: address.neighborhood,
                city: address.city,
                state: address.state,
                ...(coords.lat !== null && coords.lng !== null ? {
                    latitude: coords.lat,
                    longitude: coords.lng,
                } : {}),
                weeklyHours: scheduleSlots.map(slot => ({
                    dayOfWeek: parseInt(slot.day),
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                })),
            };

            await updateAvailability.mutateAsync(inputData);

            // Redirecionar para veiculos
            router.push("/instructor/onboarding/veiculos");
        } catch (err) {
            setError(`Erro ao salvar horários: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const totalHours = getTotalHours();
    const isValid = validateSchedules() && totalHours >= 10 && address.city;

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
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary" />
                                    <CardTitle>Selecione seus horários</CardTitle>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold">
                                        {totalHours.toFixed(1)}h
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {totalHours >= 10 ? "✓ Mínimo atingido" : `Faltam ${(10 - totalHours).toFixed(1)}h`}
                                    </div>
                                </div>
                            </div>
                            <CardDescription>
                                Adicione os dias e horários que você está disponível (mínimo 10h/semana)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Lista de horários */}
                            <div className="space-y-4">
                                {scheduleSlots.map((slot, index) => (
                                    <div key={slot.id} className="p-4 border rounded-lg space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold">Horário {index + 1}</h4>
                                            {scheduleSlots.length > 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeScheduleSlot(slot.id)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Dia da semana */}
                                            <div className="space-y-2">
                                                <Label>Dia da semana *</Label>
                                                <Select
                                                    value={slot.day}
                                                    onValueChange={(value) =>
                                                        updateScheduleSlot(slot.id, "day", value)
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o dia" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {DAYS_OF_WEEK.map((day) => (
                                                            <SelectItem key={day.value} value={day.value}>
                                                                {day.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Horário inicial */}
                                            <div className="space-y-2">
                                                <Label>Horário inicial *</Label>
                                                <Select
                                                    value={slot.startTime}
                                                    onValueChange={(value) =>
                                                        updateScheduleSlot(slot.id, "startTime", value)
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Das" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {TIME_SLOTS.map((time) => (
                                                            <SelectItem key={time} value={time}>
                                                                {time}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Horário final */}
                                            <div className="space-y-2">
                                                <Label>Horário final *</Label>
                                                <Select
                                                    value={slot.endTime}
                                                    onValueChange={(value) =>
                                                        updateScheduleSlot(slot.id, "endTime", value)
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Até" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {TIME_SLOTS.map((time) => (
                                                            <SelectItem key={time} value={time}>
                                                                {time}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Botão adicionar horário */}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addScheduleSlot}
                                className="w-full"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar outro horário
                            </Button>

                            {/* Dica */}
                            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                <p className="text-sm">
                                    💡 <strong>Dica:</strong> Quanto mais horários disponíveis, mais alunos você pode atender.
                                    Instrutores com 20h+ semanais ganham até 2x mais!
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
                            disabled={!isValid}
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
