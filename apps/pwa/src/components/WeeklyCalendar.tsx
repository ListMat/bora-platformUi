'use client';

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/chip";
import { TimeSlot, getDayAbbr, calculateTotalHours } from '@/lib/validations/onboarding';

interface WeeklyCalendarProps {
    selectedSlots: TimeSlot[];
    onChange: (slots: TimeSlot[]) => void;
    minHours?: number;
}

export default function WeeklyCalendar({
    selectedSlots,
    onChange,
    minHours = 10
}: WeeklyCalendarProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<{ day: number; time: string } | null>(null);

    // Gerar horários de 6h às 22h em intervalos de 30min
    const timeSlots = Array.from({ length: 32 }, (_, i) => {
        const hour = Math.floor(i / 2) + 6;
        const minute = i % 2 === 0 ? '00' : '30';
        return `${hour.toString().padStart(2, '0')}:${minute}`;
    });

    // Verificar se um slot está selecionado
    const isSlotSelected = useCallback((day: number, time: string): boolean => {
        return selectedSlots.some(
            slot => slot.dayOfWeek === day && slot.startTime === time
        );
    }, [selectedSlots]);

    // Toggle de um slot individual
    const toggleSlot = useCallback((day: number, time: string) => {
        const timeIndex = timeSlots.indexOf(time);
        const endTime = timeSlots[timeIndex + 1] || '22:00';

        const newSlot: TimeSlot = {
            dayOfWeek: day,
            startTime: time,
            endTime: endTime,
        };

        const isSelected = isSlotSelected(day, time);

        if (isSelected) {
            // Remover slot
            onChange(selectedSlots.filter(
                slot => !(slot.dayOfWeek === day && slot.startTime === time)
            ));
        } else {
            // Adicionar slot
            onChange([...selectedSlots, newSlot]);
        }
    }, [selectedSlots, onChange, isSlotSelected, timeSlots]);

    // Início do drag
    const handleMouseDown = (day: number, time: string) => {
        setIsDragging(true);
        setDragStart({ day, time });
        toggleSlot(day, time);
    };

    // Durante o drag
    const handleMouseEnter = (day: number, time: string) => {
        if (isDragging && dragStart) {
            toggleSlot(day, time);
        }
    };

    // Fim do drag
    const handleMouseUp = () => {
        setIsDragging(false);
        setDragStart(null);
    };

    // Limpar todos os slots
    const clearAll = () => {
        onChange([]);
    };

    // Selecionar dia inteiro
    const selectFullDay = (day: number) => {
        const daySlots: TimeSlot[] = timeSlots.slice(0, -1).map((time, index) => ({
            dayOfWeek: day,
            startTime: time,
            endTime: timeSlots[index + 1],
        }));

        // Verificar se o dia já está totalmente selecionado
        const isDayFull = daySlots.every(slot =>
            isSlotSelected(slot.dayOfWeek, slot.startTime)
        );

        if (isDayFull) {
            // Remover todos os slots do dia
            onChange(selectedSlots.filter(slot => slot.dayOfWeek !== day));
        } else {
            // Adicionar todos os slots do dia
            const otherDaysSlots = selectedSlots.filter(slot => slot.dayOfWeek !== day);
            onChange([...otherDaysSlots, ...daySlots]);
        }
    };

    const totalHours = calculateTotalHours(selectedSlots);
    const isValid = totalHours >= minHours;

    return (
        <div className="space-y-6" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            {/* Header com stats */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Badge
                        variant={isValid ? "default" : "destructive"}
                        className="text-sm px-3 py-1"
                    >
                        {totalHours}h selecionadas
                    </Badge>
                    {!isValid && (
                        <span className="text-sm text-destructive font-medium">
                            Mínimo: {minHours}h
                        </span>
                    )}
                </div>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearAll}
                    disabled={selectedSlots.length === 0}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                    Limpar tudo
                </Button>
            </div>

            {/* Legenda */}
            <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded" />
                    <span className="text-muted-foreground">Selecionado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted rounded" />
                    <span className="text-muted-foreground">Disponível</span>
                </div>
            </div>

            {/* Calendário */}
            <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                    {/* Header com dias da semana */}
                    <div className="grid grid-cols-8 gap-2 mb-2">
                        <div className="text-xs font-semibold text-muted-foreground text-center self-end pb-2">
                            Horário
                        </div>
                        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                            <div key={day} className="text-center">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => selectFullDay(day)}
                                    className="w-full hover:bg-muted"
                                >
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs font-semibold">{getDayAbbr(day)}</span>
                                    </div>
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Grid de horários */}
                    <div className="space-y-1">
                        {timeSlots.slice(0, -1).map((time, timeIndex) => (
                            <div key={time} className="grid grid-cols-8 gap-2">
                                {/* Coluna de horário */}
                                <div className="flex items-center justify-center text-xs text-muted-foreground">
                                    {time}
                                </div>

                                {/* Slots para cada dia */}
                                {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                                    const selected = isSlotSelected(day, time);

                                    return (
                                        <div
                                            key={`${day}-${time}`}
                                            className={`
                                                h-8 rounded cursor-pointer transition-all select-none
                                                ${selected
                                                    ? 'bg-primary hover:bg-primary/90'
                                                    : 'bg-muted hover:bg-muted/80'
                                                }
                                            `}
                                            onMouseDown={() => handleMouseDown(day, time)}
                                            onMouseEnter={() => handleMouseEnter(day, time)}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dica */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className="text-sm text-primary">
                        <strong>Dica:</strong> Clique e arraste para selecionar múltiplos horários.
                        Clique no dia da semana para selecionar o dia inteiro.
                    </p>
                </div>
            </div>
        </div>
    );
}
