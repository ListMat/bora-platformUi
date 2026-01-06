'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import { api } from '@/utils/api';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/chip";
import { Spinner } from "@/components/ui/spinner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import AppNavbar from '@/components/Navbar';
import {
    MapPin,
    Star,
    Car,
    CheckCircle,
    SlidersHorizontal,
    Search,
    Navigation,
    DollarSign,
    Award,
    List,
    Map as MapIcon
} from 'lucide-react';
import { formatPrice } from '@/lib/validations/onboarding';
import Link from 'next/link';

// Lazy load do mapa para melhor performance
const InstructorMap = lazy(() => import('@/components/InstructorMap'));

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [filters, setFilters] = useState({
        minPrice: undefined as number | undefined,
        maxPrice: undefined as number | undefined,
        minRating: undefined as number | undefined,
        transmission: undefined as 'manual' | 'automatic' | undefined,
        radius: 20,
    });
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    // Obter localização do usuário
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Erro ao obter localização:', error);
                    // Fallback para São Paulo
                    setUserLocation({ lat: -23.5505, lng: -46.6333 });
                }
            );
        } else {
            // Fallback para São Paulo
            setUserLocation({ lat: -23.5505, lng: -46.6333 });
        }
    }, []);

    const { data: instructors, isLoading } = api.instructor.search.useQuery(
        {
            query: searchQuery || undefined,
            latitude: userLocation?.lat,
            longitude: userLocation?.lng,
            radius: filters.radius,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            minRating: filters.minRating,
            transmission: filters.transmission,
        },
        { enabled: !!userLocation }
    );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header de Busca */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Encontre seu Instrutor</h1>
                    <p className="text-muted-foreground">
                        {instructors?.length || 0} instrutores disponíveis perto de você
                    </p>
                </div>

                {/* Barra de Busca e Filtros */}
                <div className="mb-8 space-y-4">
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nome, cidade ou região..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-12 text-base"
                            />
                        </div>
                        <Button
                            type="button"
                            variant={showFilters ? "default" : "outline"}
                            size="lg"
                            onClick={() => setShowFilters(!showFilters)}
                            className="gap-2"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filtros
                        </Button>

                        {/* Toggle Lista/Mapa */}
                        <div className="flex border rounded-lg overflow-hidden">
                            <Button
                                type="button"
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                size="lg"
                                onClick={() => setViewMode('list')}
                                className="rounded-none gap-2"
                            >
                                <List className="h-4 w-4" />
                                Lista
                            </Button>
                            <Button
                                type="button"
                                variant={viewMode === 'map' ? 'default' : 'ghost'}
                                size="lg"
                                onClick={() => setViewMode('map')}
                                className="rounded-none gap-2"
                            >
                                <MapIcon className="h-4 w-4" />
                                Mapa
                            </Button>
                        </div>
                    </form>

                    {/* Painel de Filtros */}
                    {showFilters && (
                        <Card className="p-6 bg-muted/30">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Preço Mínimo */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-primary" />
                                        Preço Mínimo
                                    </Label>
                                    <Input
                                        type="number"
                                        placeholder="R$ 0"
                                        value={filters.minPrice || ''}
                                        onChange={(e) => setFilters({
                                            ...filters,
                                            minPrice: e.target.value ? Number(e.target.value) : undefined
                                        })}
                                    />
                                </div>

                                {/* Preço Máximo */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-primary" />
                                        Preço Máximo
                                    </Label>
                                    <Input
                                        type="number"
                                        placeholder="R$ 500"
                                        value={filters.maxPrice || ''}
                                        onChange={(e) => setFilters({
                                            ...filters,
                                            maxPrice: e.target.value ? Number(e.target.value) : undefined
                                        })}
                                    />
                                </div>

                                {/* Avaliação Mínima */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Award className="h-4 w-4 text-primary" />
                                        Avaliação Mínima
                                    </Label>
                                    <Select
                                        value={filters.minRating?.toString() || "all"}
                                        onValueChange={(value) => setFilters({
                                            ...filters,
                                            minRating: value === "all" ? undefined : Number(value)
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Qualquer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Qualquer</SelectItem>
                                            <SelectItem value="3">3+ ⭐</SelectItem>
                                            <SelectItem value="4">4+ ⭐</SelectItem>
                                            <SelectItem value="4.5">4.5+ ⭐</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Transmissão */}
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <Car className="h-4 w-4 text-primary" />
                                        Transmissão
                                    </Label>
                                    <Select
                                        value={filters.transmission || "all"}
                                        onValueChange={(value) => setFilters({
                                            ...filters,
                                            transmission: value === "all" ? undefined : value as 'manual' | 'automatic'
                                        })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Qualquer" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Qualquer</SelectItem>
                                            <SelectItem value="manual">Manual</SelectItem>
                                            <SelectItem value="automatic">Automático</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Raio de Busca */}
                                <div className="space-y-2 md:col-span-2 lg:col-span-4">
                                    <Label className="flex items-center gap-2">
                                        <Navigation className="h-4 w-4 text-primary" />
                                        Raio de Busca: {filters.radius} km
                                    </Label>
                                    <input
                                        type="range"
                                        min="5"
                                        max="100"
                                        step="5"
                                        value={filters.radius}
                                        onChange={(e) => setFilters({ ...filters, radius: Number(e.target.value) })}
                                        className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>5 km</span>
                                        <span>100 km</span>
                                    </div>
                                </div>
                            </div>

                            {/* Botão Limpar Filtros */}
                            <div className="mt-6 flex justify-end">
                                <Button
                                    variant="ghost"
                                    onClick={() => setFilters({
                                        minPrice: undefined,
                                        maxPrice: undefined,
                                        minRating: undefined,
                                        transmission: undefined,
                                        radius: 20,
                                    })}
                                >
                                    Limpar Filtros
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Visualização: Lista ou Mapa */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Spinner size="lg" />
                    </div>
                ) : !instructors || instructors.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-2xl font-bold mb-2">Nenhum instrutor encontrado</h2>
                        <p className="text-muted-foreground mb-6">
                            Tente ajustar os filtros ou expandir o raio de busca.
                        </p>
                        <Button onClick={() => setShowFilters(true)}>
                            Ajustar Filtros
                        </Button>
                    </div>
                ) : viewMode === 'map' ? (
                    <Suspense fallback={<div className="flex justify-center py-20"><Spinner size="lg" /></div>}>
                        <InstructorMap
                            instructors={instructors as any}
                            center={userLocation || undefined}
                            className="w-full h-[700px]"
                        />
                    </Suspense>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {instructors.map((instructor) => {
                            const vehicle = instructor.user.vehicles?.[0];
                            const hasDistance = instructor.distance !== undefined;

                            return (
                                <Card
                                    key={instructor.id}
                                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                >
                                    {/* Imagem do Veículo */}
                                    <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 overflow-hidden">
                                        {vehicle?.photos?.[0] || vehicle?.photoUrl ? (
                                            <img
                                                src={vehicle.photos?.[0] || vehicle.photoUrl || ''}
                                                alt={vehicle.model}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <Car size={64} className="opacity-20" />
                                            </div>
                                        )}

                                        {/* Badge Online */}
                                        <div className="absolute top-3 right-3">
                                            <Badge className="bg-green-600 hover:bg-green-700 border-0 shadow-lg">
                                                <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-1.5" />
                                                ONLINE
                                            </Badge>
                                        </div>

                                        {/* Distância */}
                                        {hasDistance && (
                                            <div className="absolute bottom-3 left-3">
                                                <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    {instructor.distance!.toFixed(1)} km
                                                </Badge>
                                            </div>
                                        )}
                                    </div>

                                    <CardContent className="p-5">
                                        {/* Header com Avatar */}
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold mb-1 line-clamp-1">
                                                    {instructor.user.name}
                                                </h3>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-semibold">
                                                        {instructor.averageRating?.toFixed(1) || '5.0'}
                                                    </span>
                                                    <span className="text-muted-foreground ml-1">
                                                        ({instructor.totalLessons || 0} aulas)
                                                    </span>
                                                </div>
                                            </div>
                                            <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                                                <AvatarImage src={instructor.user.image || undefined} />
                                                <AvatarFallback className="bg-primary text-primary-foreground">
                                                    {instructor.user.name?.charAt(0) || 'I'}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>

                                        {/* Informações */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                                                <span className="line-clamp-1">
                                                    {instructor.city}, {instructor.state}
                                                </span>
                                            </div>

                                            {vehicle && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Car className="h-4 w-4 text-primary flex-shrink-0" />
                                                    <span className="line-clamp-1">
                                                        {vehicle.brand} {vehicle.model} • {vehicle.transmission === 'AUTOMATICO' ? 'Automático' : 'Manual'}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                <span>Credenciado DETRAN</span>
                                            </div>
                                        </div>

                                        {/* Footer com Preço e Ação */}
                                        <div className="flex items-center justify-between pt-4 border-t">
                                            <div>
                                                <span className="text-xs text-muted-foreground block mb-0.5">
                                                    A partir de
                                                </span>
                                                <p className="text-2xl font-bold text-primary">
                                                    {formatPrice(Number(instructor.basePrice))}
                                                    <span className="text-sm font-normal text-muted-foreground">/hora</span>
                                                </p>
                                            </div>
                                            <Button asChild size="lg" className="shadow-md">
                                                <Link href={`/instructors/${instructor.id}`}>
                                                    Ver Perfil
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
