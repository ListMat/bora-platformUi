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

// Dados de veículos (simplificado - em produção viria de uma API)
const BRANDS = [
    "Chevrolet", "Fiat", "Ford", "Honda", "Hyundai", "Nissan", "Renault",
    "Toyota", "Volkswagen", "Jeep", "Peugeot", "Citroën"
];

const MODELS_BY_BRAND: Record<string, string[]> = {
    "Chevrolet": ["Onix", "Prisma", "Cruze", "Tracker", "S10"],
    "Fiat": ["Argo", "Cronos", "Mobi", "Toro", "Strada"],
    "Ford": ["Ka", "Fiesta", "Focus", "EcoSport", "Ranger"],
    "Honda": ["Civic", "City", "HR-V", "CR-V", "Fit"],
    "Hyundai": ["HB20", "Creta", "Tucson", "ix35", "Azera"],
    "Nissan": ["Versa", "Kicks", "Frontier", "Sentra", "March"],
    "Renault": ["Kwid", "Sandero", "Logan", "Duster", "Captur"],
    "Toyota": ["Corolla", "Yaris", "Hilux", "SW4", "Etios"],
    "Volkswagen": ["Gol", "Voyage", "Polo", "Virtus", "T-Cross"],
    "Jeep": ["Renegade", "Compass", "Commander", "Wrangler"],
    "Peugeot": ["208", "2008", "3008", "5008"],
    "Citroën": ["C3", "C4 Cactus", "Aircross"],
};

const COLORS = [
    "Branco", "Preto", "Prata", "Cinza", "Vermelho", "Azul",
    "Verde", "Amarelo", "Laranja", "Marrom", "Bege"
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

type Vehicle = {
    id: string;
    brand: string;
    model: string;
    year: string;
    color: string;
    transmission: string;
    plateLastFour: string;
};

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
            plateLastFour: "",
        },
    ]);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

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
                plateLastFour: "",
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

    const updateVehicle = (id: string, field: keyof Vehicle, value: string) => {
        setVehicles(
            vehicles.map((v) =>
                v.id === id ? { ...v, [field]: value } : v
            )
        );
    };

    const validateVehicles = () => {
        for (const vehicle of vehicles) {
            if (!vehicle.brand || !vehicle.model || !vehicle.year || !vehicle.color || !vehicle.transmission || !vehicle.plateLastFour) {
                return false;
            }
            if (vehicle.plateLastFour.length !== 4) {
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateVehicles()) {
            setError("Preencha todos os campos de todos os veículos");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            // TODO: Salvar veículos no backend
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Redirecionar para criação do primeiro plano
            router.push("/instructor/onboarding/first-plan");
        } catch (err) {
            setError("Erro ao salvar veículos. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isValid = validateVehicles();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />

            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Etapa 3 de 3</span>
                        <span className="text-sm text-muted-foreground">Veículos</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-full transition-all"></div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Car className="w-5 h-5 text-primary" />
                            <CardTitle>Cadastre seus veículos</CardTitle>
                        </div>
                        <CardDescription>
                            Adicione os veículos que você usa para dar aulas (mínimo 1)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Lista de Veículos */}
                        <div className="space-y-6">
                            {vehicles.map((vehicle, index) => (
                                <div key={vehicle.id} className="p-6 border rounded-lg space-y-4 relative">
                                    {/* Header do Card */}
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold">Veículo {index + 1}</h3>
                                        {vehicles.length > 1 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeVehicle(vehicle.id)}
                                            >
                                                <Trash2 className="w-4 h-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>

                                    {/* Campos */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Marca */}
                                        <div className="space-y-2">
                                            <Label>Marca *</Label>
                                            <Select
                                                value={vehicle.brand}
                                                onValueChange={(value) => {
                                                    console.log("Marca selecionada:", value);
                                                    updateVehicle(vehicle.id, "brand", value);
                                                    updateVehicle(vehicle.id, "model", ""); // Reset model
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione a marca">
                                                        {vehicle.brand || "Selecione a marca"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {BRANDS.map((brand) => (
                                                        <SelectItem key={brand} value={brand}>
                                                            {brand}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Modelo */}
                                        <div className="space-y-2">
                                            <Label>Modelo *</Label>
                                            <Select
                                                value={vehicle.model}
                                                onValueChange={(value) =>
                                                    updateVehicle(vehicle.id, "model", value)
                                                }
                                                disabled={!vehicle.brand}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o modelo">
                                                        {vehicle.model || "Selecione o modelo"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {vehicle.brand &&
                                                        MODELS_BY_BRAND[vehicle.brand]?.map((model) => (
                                                            <SelectItem key={model} value={model}>
                                                                {model}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Ano */}
                                        <div className="space-y-2">
                                            <Label>Ano *</Label>
                                            <Select
                                                value={vehicle.year}
                                                onValueChange={(value) =>
                                                    updateVehicle(vehicle.id, "year", value)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione o ano">
                                                        {vehicle.year || "Selecione o ano"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {YEARS.map((year) => (
                                                        <SelectItem key={year} value={year.toString()}>
                                                            {year}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Cor */}
                                        <div className="space-y-2">
                                            <Label>Cor *</Label>
                                            <Select
                                                value={vehicle.color}
                                                onValueChange={(value) =>
                                                    updateVehicle(vehicle.id, "color", value)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione a cor">
                                                        {vehicle.color || "Selecione a cor"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {COLORS.map((color) => (
                                                        <SelectItem key={color} value={color}>
                                                            {color}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Transmissão */}
                                        <div className="space-y-2">
                                            <Label>Transmissão *</Label>
                                            <Select
                                                value={vehicle.transmission}
                                                onValueChange={(value) =>
                                                    updateVehicle(vehicle.id, "transmission", value)
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione a transmissão">
                                                        {vehicle.transmission || "Selecione a transmissão"}
                                                    </SelectValue>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="manual">Manual</SelectItem>
                                                    <SelectItem value="automatic">Automático</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Placa (últimos 4 dígitos) */}
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Últimos 4 caracteres da placa *</Label>
                                            <Input
                                                placeholder="Ex: 1A2B"
                                                value={vehicle.plateLastFour}
                                                onChange={(e) =>
                                                    updateVehicle(
                                                        vehicle.id,
                                                        "plateLastFour",
                                                        e.target.value.toUpperCase().slice(0, 4)
                                                    )
                                                }
                                                maxLength={4}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Por segurança, pedimos apenas os 4 últimos caracteres
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Botão Adicionar Veículo */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={addVehicle}
                            className="w-full"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar outro veículo
                        </Button>

                        {/* Informações */}
                        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <h4 className="font-semibold text-sm mb-2">🚗 Por que cadastrar veículos?</h4>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• Os alunos veem os veículos disponíveis antes de agendar</li>
                                <li>• Você pode oferecer aulas com seu carro ou com o carro do aluno</li>
                                <li>• Quanto mais veículos, mais opções para os alunos</li>
                            </ul>
                        </div>

                        {/* Botões */}
                        <div className="flex gap-4 pt-4">
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
                                disabled={!isValid || isSubmitting}
                                className="flex-1"
                            >
                                {isSubmitting ? (
                                    "Finalizando..."
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Finalizar Cadastro
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
