'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { api } from '@/utils/api';
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Chip } from "@/components/ui/chip";
import { Select, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
    Calendar,
    MapPin,
    DollarSign,
    Car,
    CheckCircle,
    ArrowLeft,
    Lightbulb,
    TrendingUp,
    AlertCircle,
    Loader2
} from 'lucide-react';
import AppNavbar from '@/components/Navbar';
import WeeklyCalendar from '@/components/WeeklyCalendar';
import VehiclePhotoUpload from '@/components/VehiclePhotoUpload';
import {
    TimeSlot,
    VehiclePhoto,
    validateCEP,
    calculateEarnings,
    formatPrice
} from '@/lib/validations/onboarding';

type Step = 1 | 2 | 3 | 4 | 5;

interface VehicleData {
    model: string;
    year: number;
    color: string;
    plate: string;
    transmission: 'manual' | 'automatic';
    hasDualPedals: boolean;
}

interface PlanData {
    weeklyHours: TimeSlot[];
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    pricePerHour: number;
    vehicle: VehicleData;
    photos: VehiclePhoto[];
}

export default function FirstPlanPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [step, setStep] = useState<Step>(1);
    const [isLoadingCEP, setIsLoadingCEP] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [planData, setPlanData] = useState<PlanData>({
        weeklyHours: [],
        cep: '',
        street: '',
        neighborhood: '',
        city: '',
        state: '',
        pricePerHour: 79,
        vehicle: {
            model: '',
            year: new Date().getFullYear(),
            color: '',
            plate: '',
            transmission: 'manual',
            hasDualPedals: true,
        },
        photos: [],
    });



    const progress = (step / 5) * 100;

    const handleNext = () => {
        if (step < 5) {
            setStep((step + 1) as Step);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep((step - 1) as Step);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/instructor/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    weeklyHours: planData.weeklyHours,
                    cep: planData.cep,
                    street: planData.street,
                    neighborhood: planData.neighborhood,
                    city: planData.city,
                    state: planData.state,
                    pricePerHour: planData.pricePerHour,
                    vehicle: planData.vehicle,
                    photos: planData.photos,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao criar plano');
            }

            console.log("✅ Plano criado com sucesso!");
            router.push('/instructor/dashboard');

        } catch (error: any) {
            console.error("❌ Erro ao criar plano:", error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchAddress = async (cep: string) => {
        if (cep.length === 8) {
            setIsLoadingCEP(true);
            try {
                const result = await validateCEP(cep);
                if (result.valid && result.data) {
                    setPlanData(prev => ({
                        ...prev,
                        cep,
                        street: result.data!.street,
                        neighborhood: result.data!.neighborhood,
                        city: result.data!.city,
                        state: result.data!.state,
                    }));
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            } finally {
                setIsLoadingCEP(false);
            }
        }
    };

    const updateVehicle = (field: keyof VehicleData, value: any) => {
        setPlanData(prev => ({
            ...prev,
            vehicle: { ...prev.vehicle, [field]: value }
        }));
    };

    const earnings = calculateEarnings(planData.pricePerHour);

    const canProceed = {
        1: planData.weeklyHours.length >= 20,
        2: planData.cep.length === 8 && planData.city !== '',
        3: planData.pricePerHour >= 50,
        4: planData.vehicle.model.length > 2 && planData.vehicle.plate.length >= 7 && planData.photos.length >= 1,
        5: !isSubmitting,
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />

            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8 text-center">
                    <Chip color="primary" variant="secondary" className="mb-4">
                        Primeiro Plano
                    </Chip>
                    <h1 className="text-3xl font-bold mb-2">
                        Crie seu primeiro plano
                    </h1>
                    <p className="text-muted-foreground">
                        Configure seus horários, localização e preço para começar a receber alunos
                    </p>
                </div>

                {/* Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium">
                            Passo {step} de 5
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {step === 1 && 'Horários'}
                            {step === 2 && 'Localidade'}
                            {step === 3 && 'Preço'}
                            {step === 4 && 'Veículo'}
                            {step === 5 && 'Confirmação'}
                        </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Card */}
                <Card className="shadow-lg">
                    <div className="flex-col items-start gap-2 p-8 border-b">
                        <div className="flex items-center gap-3">
                            {step === 1 && <Calendar className="w-6 h-6 text-primary" />}
                            {step === 2 && <MapPin className="w-6 h-6 text-primary" />}
                            {step === 3 && <DollarSign className="w-6 h-6 text-primary" />}
                            {step === 4 && <Car className="w-6 h-6 text-primary" />}
                            {step === 5 && <CheckCircle className="w-6 h-6 text-primary" />}

                            <h2 className="text-2xl font-bold">
                                {step === 1 && 'Seus Horários'}
                                {step === 2 && 'Onde você atende?'}
                                {step === 3 && 'Defina seu preço'}
                                {step === 4 && 'Cadastre seu veículo'}
                                {step === 5 && 'Confirme seu plano'}
                            </h2>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Step 1: Horários */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <Lightbulb className="w-5 h-5 text-yellow-700 dark:text-yellow-300 flex-shrink-0 mt-0.5" />
                                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                            <strong>Dica:</strong> Quanto mais horários disponíveis, mais alunos você receberá!
                                        </p>
                                    </div>
                                </div>
                                <WeeklyCalendar
                                    selectedSlots={planData.weeklyHours}
                                    onChange={(slots) => setPlanData({ ...planData, weeklyHours: slots })}
                                    minHours={10}
                                />
                            </div>
                        )}

                        {/* Step 2: Localidade */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label>CEP</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="00000-000"
                                            value={planData.cep}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                const cepNumbers = value.replace(/\D/g, '');
                                                setPlanData(prev => ({ ...prev, cep: cepNumbers }));
                                                fetchAddress(cepNumbers);
                                            }}
                                            maxLength={8}
                                            disabled={isLoadingCEP}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Rua</Label>
                                    <Input value={planData.street} readOnly className="bg-muted" />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Bairro</Label>
                                        <Input value={planData.neighborhood} readOnly className="bg-muted" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Cidade</Label>
                                        <Input value={planData.city} readOnly className="bg-muted" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Estado</Label>
                                    <Input value={planData.state} readOnly className="bg-muted" />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Preço */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <TrendingUp className="w-5 h-5 text-green-700 dark:text-green-300 flex-shrink-0 mt-0.5" />
                                        <div className="text-sm text-green-700 dark:text-green-300">
                                            <strong>Você receberá 85% de cada aula</strong>
                                            <br />
                                            Exemplo: Aula de R$ 79 → Você recebe {formatPrice(earnings.instructorPay)}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Preço por Hora</Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground font-semibold">R$</span>
                                        <Input
                                            type="number"
                                            value={planData.pricePerHour.toString()}
                                            onChange={(e) => setPlanData(prev => ({ ...prev, pricePerHour: Number(e.target.value) }))}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                {/* Suggestions */}
                                <div className="grid grid-cols-3 gap-4">
                                    {[59, 79, 99].map((price) => (
                                        <div
                                            key={price}
                                            onClick={() => setPlanData(prev => ({ ...prev, pricePerHour: price }))}
                                            className={`
                                                cursor-pointer border rounded-xl p-4 text-center transition-all hover:scale-105
                                                ${planData.pricePerHour === price
                                                    ? 'border-2 border-primary bg-primary/10'
                                                    : 'border-input hover:border-primary/50'}
                                            `}
                                        >
                                            <div className="text-2xl font-bold">{formatPrice(price)}</div>
                                            <div className="text-xs text-muted-foreground">Você: {formatPrice(calculateEarnings(price).instructorPay)}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Step 4: Veículo */}
                        {step === 4 && (
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Modelo do Carro</Label>
                                        <div className="relative">
                                            <Car className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Ex: Fiat Uno"
                                                value={planData.vehicle.model}
                                                onChange={(e) => updateVehicle('model', e.target.value)}
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Ano</Label>
                                        <Input
                                            type="number"
                                            placeholder="2024"
                                            value={planData.vehicle.year.toString()}
                                            onChange={(e) => updateVehicle('year', Number(e.target.value))}
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Cor</Label>
                                        <Input
                                            placeholder="Ex: Branco"
                                            value={planData.vehicle.color}
                                            onChange={(e) => updateVehicle('color', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Placa</Label>
                                        <Input
                                            placeholder="ABC-1234"
                                            value={planData.vehicle.plate}
                                            onChange={(e) => updateVehicle('plate', e.target.value.toUpperCase())}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center p-4 border rounded-lg">
                                    <Label>Transmissão Automática</Label>
                                    <Switch
                                        checked={planData.vehicle.transmission === 'automatic'}
                                        onCheckedChange={(v: boolean) => updateVehicle('transmission', v ? 'automatic' : 'manual')}
                                    />
                                </div>

                                <div className="flex justify-between items-center p-4 border rounded-lg">
                                    <Label>Possui Duplo Pedal?</Label>
                                    <Switch
                                        checked={planData.vehicle.hasDualPedals}
                                        onCheckedChange={(v: boolean) => updateVehicle('hasDualPedals', v)}
                                    />
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="font-semibold mb-4">Fotos do Veículo</h3>
                                    <VehiclePhotoUpload
                                        photos={planData.photos}
                                        onChange={(photos) => setPlanData(prev => ({ ...prev, photos }))}
                                        maxPhotos={5}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 5: Confirmação */}
                        {step === 5 && (
                            <div className="space-y-6">
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle className="w-6 h-6 text-green-700 dark:text-green-300 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                                                Tudo pronto para começar!
                                            </h3>
                                            <p className="text-sm text-green-600 dark:text-green-400">
                                                Ao criar seu plano, você ficará <strong>online</strong> e começará a receber solicitações.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Card className="p-4 bg-muted/50">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold mb-1">Horários</h4>
                                                <p className="text-sm text-muted-foreground">{planData.weeklyHours.length / 2} horas/semana</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Car className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="font-semibold mb-1">Veículo</h4>
                                                <p className="text-sm text-muted-foreground">{planData.vehicle.model} - {planData.vehicle.plate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex gap-4 mt-8">
                            {step > 1 && (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={handleBack}
                                    disabled={isSubmitting}
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Voltar
                                </Button>
                            )}

                            <Button
                                className="w-full"
                                size="lg"
                                onClick={step === 5 ? handleSubmit : handleNext}
                                disabled={!canProceed[step] || isSubmitting}
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {step === 5 ? 'Criar Plano e Ficar Online' : 'Continuar'}
                                {step < 5 && !isSubmitting}
                            </Button>
                        </div>

                        {/* Validation warning */}
                        {!canProceed[step] && !isSubmitting && (
                            <div className="flex items-center gap-2 mt-4 text-sm text-destructive">
                                <AlertCircle className="w-4 h-4" />
                                <span>
                                    {step === 1 && 'Selecione pelo menos 10 horas'}
                                    {step === 2 && 'Preencha o CEP'}
                                    {step === 3 && 'Defina um preço válido'}
                                    {step === 4 && 'Preencha os dados do carro e adicione fotos'}
                                </span>
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
