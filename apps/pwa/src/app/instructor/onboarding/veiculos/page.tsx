"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppNavbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Car, Plus, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/utils/api";
import VehiclePhotoUpload from "@/components/VehiclePhotoUpload";
import { VehiclePhoto } from "@/lib/validations/onboarding";

// --- Constantes e Dados ---

const BRANDS = [
    "Chevrolet", "Fiat", "Ford", "Honda", "Hyundai", "Nissan", "Renault",
    "Toyota", "Volkswagen", "Jeep", "Peugeot", "Citroën"
].map(b => ({ value: b, label: b }));

const MODELS_BY_BRAND: Record<string, { value: string; label: string }[]> = {
    "Chevrolet": ["Onix", "Prisma", "Cruze", "Tracker", "S10"].map(m => ({ value: m, label: m })),
    "Fiat": ["Argo", "Cronos", "Mobi", "Toro", "Strada"].map(m => ({ value: m, label: m })),
    "Ford": ["Ka", "Fiesta", "Focus", "EcoSport", "Ranger"].map(m => ({ value: m, label: m })),
    "Honda": ["Civic", "City", "HR-V", "CR-V", "Fit"].map(m => ({ value: m, label: m })),
    "Hyundai": ["HB20", "Creta", "Tucson", "ix35", "Azera"].map(m => ({ value: m, label: m })),
    "Nissan": ["Versa", "Kicks", "Frontier", "Sentra", "March"].map(m => ({ value: m, label: m })),
    "Renault": ["Kwid", "Sandero", "Logan", "Duster", "Captur"].map(m => ({ value: m, label: m })),
    "Toyota": ["Corolla", "Yaris", "Hilux", "SW4", "Etios"].map(m => ({ value: m, label: m })),
    "Volkswagen": ["Gol", "Voyage", "Polo", "Virtus", "T-Cross"].map(m => ({ value: m, label: m })),
    "Jeep": ["Renegade", "Compass", "Commander", "Wrangler"].map(m => ({ value: m, label: m })),
    "Peugeot": ["208", "2008", "3008", "5008"].map(m => ({ value: m, label: m })),
    "Citroën": ["C3", "C4 Cactus", "Aircross"].map(m => ({ value: m, label: m })),
};

const COLORS = [
    "Branco", "Preto", "Prata", "Cinza", "Vermelho", "Azul",
    "Verde", "Amarelo", "Laranja", "Marrom", "Bege"
].map(c => ({ value: c, label: c }));

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i).map(y => ({ value: y.toString(), label: y.toString() }));

const VEHICLE_CATEGORIES = [
    { value: "HATCH", label: "Hatch" },
    { value: "SEDAN", label: "Sedan" },
    { value: "SUV", label: "SUV" },
    { value: "PICKUP", label: "Picape" },
    { value: "SPORTIVO", label: "Esportivo" },
    { value: "COMPACTO", label: "Compacto" },
    { value: "ELETRICO", label: "Elétrico" },
    { value: "MOTO", label: "Moto" }
];

const FUEL_TYPES = [
    { value: "GASOLINA", label: "Gasolina" },
    { value: "ETANOL", label: "Etanol" },
    { value: "FLEX", label: "Flex" },
    { value: "DIESEL", label: "Diesel" },
    { value: "ELETRICO", label: "Elétrico" },
    { value: "HIBRIDO", label: "Híbrido" }
];

const TRANSMISSION_TYPES = [
    { value: "MANUAL", label: "Manual" },
    { value: "AUTOMATICO", label: "Automático" },
    { value: "CVT", label: "CVT" },
    { value: "SEMI_AUTOMATICO", label: "Automatizado" },
    { value: "SEQUENCIAL", label: "Sequencial" },
    { value: "DUAL_CLUTCH", label: "Dual-clutch" },
    { value: "ELETRICO", label: "Elétrico" }
];

// --- Types ---

type Vehicle = {
    id: string;
    brand: string;
    model: string;
    year: string;
    color: string;
    transmission: string;
    category: string;
    fuel: string;
    plateLastFour: string;
    photos: VehiclePhoto[];
};

// --- Component Helper ---

const FormSelect = ({
    label,
    value,
    onChange,
    options,
    placeholder,
    disabled = false
}: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
    disabled?: boolean;
}) => (
    <div className="space-y-2">
        <Label>{label}</Label>
        <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger>
                <SelectValue placeholder={placeholder}>
                    {value ? options.find(o => o.value === value)?.label || value : <span className="text-muted-foreground">{placeholder}</span>}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);

export default function VeiculosPage() {
    const router = useRouter();
    const [vehicles, setVehicles] = useState<Vehicle[]>([
        {
            id: "1",
            brand: "",
            model: "",
            year: "",
            color: "",
            transmission: "",
            category: "",
            fuel: "",
            plateLastFour: "",
            photos: [],
        },
    ]);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const createVehicle = api.vehicle.create.useMutation();

    const addVehicle = () => {
        setVehicles([
            ...vehicles,
            {
                id: Date.now().toString(),
                brand: "",
                model: "",
                year: "",
                color: "",
                transmission: "",
                category: "",
                fuel: "",
                plateLastFour: "",
                photos: [],
            },
        ]);
    };

    const removeVehicle = (id: string) => {
        if (vehicles.length === 1) {
            setError("Você precisa ter pelo menos 1 veículo cadastrado");
            return;
        }
        setVehicles(vehicles.filter((v) => v.id !== id));
        setError("");
    };

    const updateVehicle = (id: string, field: keyof Vehicle, value: any) => {
        setVehicles(prev => prev.map(v => {
            if (v.id !== id) return v;

            // Se mudar a marca, reseta o modelo
            if (field === 'brand') {
                return { ...v, [field]: value, model: '' };
            }

            return { ...v, [field]: value };
        }));
    };

    const validateVehicles = () => {
        for (const vehicle of vehicles) {
            if (!vehicle.brand || !vehicle.model || !vehicle.year || !vehicle.color || !vehicle.transmission || !vehicle.category || !vehicle.fuel || !vehicle.plateLastFour) {
                return false;
            }
            if (vehicle.plateLastFour.length !== 4) {
                return false;
            }
            if (vehicle.photos.length === 0) {
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateVehicles()) {
            setError("Preencha todos os campos e adicione pelo menos uma foto para cada veículo.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            for (const vehicle of vehicles) {
                const mainPhoto = vehicle.photos.find(p => p.type === 'main') || vehicle.photos[0];
                const photoUrls = vehicle.photos.map(p => p.url);

                await createVehicle.mutateAsync({
                    brand: vehicle.brand,
                    model: vehicle.model,
                    year: parseInt(vehicle.year),
                    color: vehicle.color,
                    transmission: vehicle.transmission as any,
                    category: vehicle.category as any,
                    fuel: vehicle.fuel as any,
                    plateLastFour: vehicle.plateLastFour,
                    photoUrl: mainPhoto?.url || "",
                    photos: photoUrls,
                });
            }

            router.push("/instructor/onboarding/first-plan");
        } catch (err) {
            setError("Erro ao salvar veículos. Tente novamente.");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isValid = validateVehicles();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />

            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Header da Página */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Seus Veículos</h1>
                    <p className="text-muted-foreground">
                        Cadastre os veículos que você utilizará para as aulas.
                    </p>
                </div>

                {/* Progress Bar Simplificada */}
                <div className="w-full bg-muted h-2 rounded-full mb-8 overflow-hidden">
                    <div className="bg-primary h-full w-full transition-all duration-500" />
                </div>

                <div className="space-y-6">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {vehicles.map((vehicle, index) => (
                        <Card key={vehicle.id} className="relative overflow-hidden border-2">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />

                            <CardHeader className="bg-muted/30 pb-4 border-b">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {index + 1}
                                        </div>
                                        <CardTitle className="text-lg">Dados do Veículo</CardTitle>
                                    </div>
                                    {vehicles.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => removeVehicle(vehicle.id)}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>

                            <CardContent className="p-6 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormSelect
                                        label="Marca *"
                                        placeholder="Selecione a marca"
                                        value={vehicle.brand}
                                        onChange={(val) => updateVehicle(vehicle.id, 'brand', val)}
                                        options={BRANDS}
                                    />

                                    <FormSelect
                                        label="Modelo *"
                                        placeholder="Selecione o modelo"
                                        value={vehicle.model}
                                        onChange={(val) => updateVehicle(vehicle.id, 'model', val)}
                                        options={vehicle.brand ? MODELS_BY_BRAND[vehicle.brand] || [] : []}
                                        disabled={!vehicle.brand}
                                    />

                                    <FormSelect
                                        label="Ano *"
                                        placeholder="Ano"
                                        value={vehicle.year}
                                        onChange={(val) => updateVehicle(vehicle.id, 'year', val)}
                                        options={YEARS}
                                    />

                                    <FormSelect
                                        label="Cor *"
                                        placeholder="Cor"
                                        value={vehicle.color}
                                        onChange={(val) => updateVehicle(vehicle.id, 'color', val)}
                                        options={COLORS}
                                    />

                                    <FormSelect
                                        label="Categoria *"
                                        placeholder="Categoria (ex: Hatch)"
                                        value={vehicle.category}
                                        onChange={(val) => updateVehicle(vehicle.id, 'category', val)}
                                        options={VEHICLE_CATEGORIES}
                                    />

                                    <FormSelect
                                        label="Combustível *"
                                        placeholder="Tipo de combustível"
                                        value={vehicle.fuel}
                                        onChange={(val) => updateVehicle(vehicle.id, 'fuel', val)}
                                        options={FUEL_TYPES}
                                    />

                                    <FormSelect
                                        label="Transmissão *"
                                        placeholder="Tipo de câmbio"
                                        value={vehicle.transmission}
                                        onChange={(val) => updateVehicle(vehicle.id, 'transmission', val)}
                                        options={TRANSMISSION_TYPES}
                                    />

                                    <div className="space-y-2">
                                        <Label>Placa (Últimos 4 dígitos) *</Label>
                                        <Input
                                            className="uppercase tracking-widest font-mono"
                                            placeholder="Ex: 9A00"
                                            maxLength={4}
                                            value={vehicle.plateLastFour}
                                            onChange={(e) => updateVehicle(vehicle.id, 'plateLastFour', e.target.value.toUpperCase().slice(0, 4))}
                                        />
                                        <p className="text-xs text-muted-foreground">Apenas para identificação interna</p>
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <div className="mb-4">
                                        <Label className="text-base font-semibold">Fotos do Veículo</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Adicione fotos reais do veículo. Isso aumenta a confiança dos alunos.
                                        </p>
                                    </div>
                                    <VehiclePhotoUpload
                                        photos={vehicle.photos}
                                        onChange={(photos) => updateVehicle(vehicle.id, 'photos', photos)}
                                        maxPhotos={5}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full border-dashed border-2 py-8 h-auto text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                        onClick={addVehicle}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <Plus className="w-6 h-6" />
                            <span className="font-medium">Cadastrar Outro Veículo</span>
                        </div>
                    </Button>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <Button variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
                        Voltar
                    </Button>
                    <Button
                        size="lg"
                        onClick={handleSubmit}
                        disabled={isSubmitting} // Removing !isValid check to allow inline errors to show if we wanted, but keeping simple for now
                        className="px-8"
                    >
                        {isSubmitting ? "Salvando..." : (
                            <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Finalizar Cadastro
                            </>
                        )}
                    </Button>
                </div>
            </main>
        </div>
    );
}
