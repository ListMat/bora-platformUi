'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MapWeb from '@/components/MapWeb';
import BottomSheetWeb from '@/components/BottomSheetWeb';

// Dados mock dos instrutores
const mockInstructors = [
    {
        id: '1',
        name: 'Instrutor Mestre',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
        rating: 4.8,
        price: 80,
        lat: -15.7801,
        lng: -47.9292,
        vehicle: 'Volkswagen Gol 2022 - Manual',
        bio: 'Instrutor experiente com foco em direção defensiva e aprovação no detran.',
    },
    {
        id: '2',
        name: 'Carlos Silva',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
        rating: 4.9,
        price: 75,
        lat: -15.7850,
        lng: -47.9350,
        vehicle: 'Honda Civic 2023 - Automático',
        bio: 'Especialista em primeira habilitação e aulas para idosos.',
    },
    {
        id: '3',
        name: 'Ana Paula',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
        rating: 5.0,
        price: 90,
        lat: -15.7750,
        lng: -47.9250,
        vehicle: 'Toyota Corolla 2024 - Automático',
        bio: 'Instrutora com 15 anos de experiência. Paciência e dedicação.',
    },
    {
        id: '4',
        name: 'Roberto Lima',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
        rating: 4.7,
        price: 70,
        lat: -15.7900,
        lng: -47.9400,
        vehicle: 'Fiat Argo 2022 - Manual',
        bio: 'Aulas práticas com foco em segurança e confiança ao volante.',
    },
];

function MapPageContent() {
    const searchParams = useSearchParams();
    const [selectedInstructor, setSelectedInstructor] = useState<typeof mockInstructors[0] | null>(
        null
    );
    const [instructors, setInstructors] = useState(mockInstructors);

    // Deep-link: /mapa?lat=X&lng=Y
    useEffect(() => {
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');

        if (lat && lng) {
            // Filtrar instrutores próximos às coordenadas fornecidas
            // Por enquanto, apenas mostra todos
            console.log('Deep-link coords:', { lat, lng });
        }
    }, [searchParams]);

    const handleMarkerClick = (instructor: typeof mockInstructors[0]) => {
        setSelectedInstructor(instructor);
    };

    const handleCardClick = (instructor: typeof mockInstructors[0]) => {
        // Navegar para página do instrutor
        window.location.href = `/instrutor/${instructor.id}`;
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Mapa */}
            <div className="absolute inset-0">
                <MapWeb
                    instructors={instructors}
                    onMarkerClick={handleMarkerClick}
                    selectedInstructor={selectedInstructor}
                />
            </div>

            {/* Bottom Sheet */}
            <BottomSheetWeb
                instructors={instructors}
                selectedInstructor={selectedInstructor}
                onCardClick={handleCardClick}
            />

            {/* Loading skeleton (opcional) */}
            {instructors.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Carregando instrutores...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function MapPage() {
    return (
        <Suspense
            fallback={
                <div className="w-full h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            }
        >
            <MapPageContent />
        </Suspense>
    );
}
