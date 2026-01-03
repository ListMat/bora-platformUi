'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface Instructor {
    id: string;
    name: string;
    photo: string;
    rating: number;
    price: number;
    lat: number;
    lng: number;
    vehicle?: string;
    bio?: string;
}

interface BottomSheetWebProps {
    instructors: Instructor[];
    selectedInstructor: Instructor | null;
    onCardClick: (instructor: Instructor) => void;
}

export default function BottomSheetWeb({
    instructors,
    selectedInstructor,
    onCardClick,
}: BottomSheetWebProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Scroll para o instrutor selecionado
    useEffect(() => {
        if (selectedInstructor && scrollRef.current) {
            const index = instructors.findIndex((i) => i.id === selectedInstructor.id);
            if (index !== -1) {
                const cardWidth = 320; // largura do card + gap
                scrollRef.current.scrollTo({
                    left: index * cardWidth,
                    behavior: 'smooth',
                });
                setIsExpanded(true);
            }
        }
    }, [selectedInstructor, instructors]);

    if (instructors.length === 0) {
        return (
            <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-lg p-6">
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                        Ninguém por aqui. Tenta ampliar a área.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-lg transition-all duration-300 ${isExpanded ? 'h-[400px] md:h-[500px]' : 'h-[200px]'
                }`}
        >
            {/* Handle para arrastar */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-3 flex justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 rounded-t-3xl"
                aria-label={isExpanded ? 'Recolher' : 'Expandir'}
            >
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </button>

            {/* Título */}
            <div className="px-6 pb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Instrutores perto de você
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {instructors.length} {instructors.length === 1 ? 'instrutor' : 'instrutores'}{' '}
                    disponíveis
                </p>
            </div>

            {/* Cards horizontais */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto px-6 pb-6 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {instructors.map((instructor) => (
                    <div
                        key={instructor.id}
                        onClick={() => onCardClick(instructor)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                onCardClick(instructor);
                            }
                        }}
                        aria-label={`Ver disponibilidade de ${instructor.name}`}
                        className={`min-w-[300px] bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-all snap-start ${selectedInstructor?.id === instructor.id
                            ? 'ring-2 ring-blue-500'
                            : 'hover:ring-2 hover:ring-gray-300'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <Image
                                src={instructor.photo}
                                alt={instructor.name}
                                width={60}
                                height={60}
                                className="rounded-full object-cover"
                                suppressHydrationWarning
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {instructor.name}
                                </h3>
                                <div className="flex items-center gap-1 mt-1">
                                    <span className="text-yellow-500">⭐</span>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {instructor.rating.toFixed(1)}
                                    </span>
                                </div>
                                {instructor.vehicle && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {instructor.vehicle}
                                    </p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                    R$ {instructor.price.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">/hora</p>
                            </div>
                        </div>

                        {isExpanded && instructor.bio && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">
                                {instructor.bio}
                            </p>
                        )}

                        <button
                            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            aria-label={`Ver disponibilidade de ${instructor.name}`}
                        >
                            Ver disponibilidade
                        </button>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
        </div>
    );
}
