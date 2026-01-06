'use client';

import { useState } from 'react';
import { api } from '@/utils/api';
import InstructorMap from '@/components/InstructorMap';
import AppNavbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/chip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Map, List, Star, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/validations/onboarding';

export default function StudentDashboard() {
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [searchQuery, setSearchQuery] = useState('');

    // Buscar instrutores
    const { data: instructors, isLoading } = api.instructor.search.useQuery({
        query: searchQuery
    });

    // Mapear dados para o formato do mapa (garantindo tipos)
    const mapInstructors = instructors?.map(inst => ({
        ...inst,
        basePrice: Number(inst.basePrice), // Garantir number
        // Adicionar campos extras se faltar no tipo retornado
    })) || [];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <AppNavbar />

            {/* Filtros / Busca Header - Estilo Airbnb */}
            <div className="border-b px-6 py-4 flex items-center gap-4 sticky top-0 bg-background z-20 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por cidade, bairro ou instrutor"
                        className="pl-9 rounded-full bg-muted/40 border-muted-foreground/20"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="rounded-full gap-2 hidden sm:flex">
                    <Filter className="w-4 h-4" /> Filtros
                </Button>
            </div>

            <main className="flex-1 flex overflow-hidden relative" style={{ height: 'calc(100vh - 140px)' }}> {/* Ajuste de altura aproximado */}
                {/* Lista de Instrutores (Esquerda) */}
                <div className={`
                    w-full md:w-[55%] lg:w-[45%] xl:w-[40%] 
                    h-full overflow-y-auto 
                    ${viewMode === 'map' ? 'hidden md:block' : 'block'}
                `}>
                    <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6 pb-24 md:pb-6">
                        {isLoading ? (
                            <div className="col-span-full text-center py-10">Carregando instrutores...</div>
                        ) : instructors?.length === 0 ? (
                            <div className="col-span-full text-center py-10">
                                <p className="text-muted-foreground">Nenhum instrutor encontrado nessa região.</p>
                            </div>
                        ) : (
                            instructors?.map((instructor) => (
                                <Link href={`/instructors/${instructor.id}`} key={instructor.id} className="group">
                                    <div className="space-y-3">
                                        {/* Foto / Carrossel */}
                                        <div className="aspect-[4/3] relative rounded-xl overflow-hidden bg-muted">
                                            {/* @ts-ignore */}
                                            {instructor.user?.vehicles?.[0]?.photoUrl ? (
                                                <img
                                                    /* @ts-ignore */
                                                    src={instructor.user.vehicles[0].photoUrl}
                                                    alt="Veículo"
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/50">
                                                    <div className="text-4xl">🚗</div>
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3">
                                                <Badge className="bg-white/90 text-black hover:bg-white shadow-sm backdrop-blur">
                                                    <Star className="w-3 h-3 text-yellow-500 mr-1 fill-yellow-500" />
                                                    {Number(instructor.averageRating || 5).toFixed(1)}
                                                </Badge>
                                            </div>
                                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                                <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                                                    <AvatarImage src={instructor.user?.image || ""} />
                                                    <AvatarFallback>{instructor.user?.name?.[0]}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-white text-xs font-medium drop-shadow-md bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                                                    {instructor.user?.name}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-semibold text-base group-hover:underline decoration-primary truncate">
                                                    {instructor.city}, {instructor.state || 'Brasil'}
                                                </h3>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <span className="font-bold">
                                                        {formatPrice(Number(instructor.basePrice))}
                                                    </span>
                                                    <span className="text-sm font-normal text-muted-foreground">
                                                        / aula
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1 truncate">
                                                {/* @ts-ignore */}
                                                {instructor.user?.vehicles?.[0]?.model || "Carro Padrão"} •
                                                {/* @ts-ignore */}
                                                {instructor.user?.vehicles?.[0]?.transmission === 'AUTOMATICO' ? ' Automático' : ' Manual'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Disponível hoje
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Mapa (Direita) */}
                <div className={`
                    w-full md:w-[45%] lg:w-[55%] xl:w-[60%] 
                    h-full relative border-l border-border
                    bg-muted/30
                    ${viewMode === 'list' ? 'hidden md:block' : 'block'}
                `}>
                    <InstructorMap
                        // @ts-ignore
                        instructors={mapInstructors}
                        className="w-full h-full border-none rounded-none shadow-none"
                    />
                </div>

                {/* Mobile Floating Button Toggle */}
                <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
                    <Button
                        className="rounded-full shadow-xl bg-foreground text-background hover:bg-foreground/90 px-6 py-6 h-auto text-sm font-semibold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                        onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                    >
                        {viewMode === 'list' ? (
                            <>
                                Mapa <Map className="w-4 h-4 ml-1" />
                            </>
                        ) : (
                            <>
                                Lista <List className="w-4 h-4 ml-1" />
                            </>
                        )}
                    </Button>
                </div>
            </main>
        </div>
    );
}
