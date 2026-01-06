'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/chip";
import { Spinner } from "@/components/ui/spinner";
import { DayPicker } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import { format, addDays, setHours, setMinutes, isBefore, isAfter, startOfDay } from 'date-fns';
import { Calendar, Clock, Car, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/validations/onboarding';
import { api } from '@/utils/api';
import 'react-day-picker/dist/style.css';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    instructor: {
        id: string;
        name: string;
        basePrice: number;
        availability?: Array<{
            dayOfWeek: number;
            startTime: string;
            endTime: string;
        }>;
    };
    onSuccess?: (lessonId: string) => void;
}

const LESSON_TYPES = [
    { value: '1a-habilitacao', label: '1ª Habilitação', duration: 50 },
    { value: 'direcao-publica', label: 'Direção via pública', duration: 50 },
    { value: 'baliza-garagem', label: 'Baliza e Garagem', duration: 50 },
    { value: 'aula-noturna', label: 'Aula Noturna', duration: 50 },
    { value: 'reciclagem', label: 'Reciclagem', duration: 50 },
];

const PAYMENT_METHODS = [
    { value: 'PIX', label: 'Pix', icon: '💳' },
    { value: 'DINHEIRO', label: 'Dinheiro', icon: '💵' },
    { value: 'DEBITO', label: 'Débito', icon: '💳' },
    { value: 'CREDITO', label: 'Crédito', icon: '💳' },
];

export default function BookingModal({ isOpen, onClose, instructor, onSuccess }: BookingModalProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [lessonType, setLessonType] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('');
    const [useOwnVehicle, setUseOwnVehicle] = useState(false);

    const requestLessonMutation = api.lesson.request.useMutation({
        onSuccess: (data) => {
            onSuccess?.(data.lesson.id);
            handleClose();
        },
        onError: (error) => {
            alert('Erro ao solicitar aula: ' + error.message);
        },
    });

    const handleClose = () => {
        setStep(1);
        setSelectedDate(undefined);
        setSelectedTime('');
        setLessonType('');
        setPaymentMethod('');
        setUseOwnVehicle(false);
        onClose();
    };

    const handleSubmit = () => {
        if (!selectedDate || !selectedTime || !lessonType || !paymentMethod) {
            alert('Preencha todos os campos');
            return;
        }

        const [hours, minutes] = selectedTime.split(':').map(Number);
        const scheduledAt = setMinutes(setHours(selectedDate, hours), minutes);

        requestLessonMutation.mutate({
            instructorId: instructor.id,
            scheduledAt,
            lessonType,
            paymentMethod: paymentMethod as any,
            useOwnVehicle,
            price: instructor.basePrice,
        });
    };

    // Gerar horários disponíveis baseado na disponibilidade do instrutor
    const getAvailableTimeSlots = () => {
        if (!selectedDate || !instructor.availability) return [];

        const dayOfWeek = selectedDate.getDay();
        const availability = instructor.availability.find(a => a.dayOfWeek === dayOfWeek);

        if (!availability) return [];

        const slots: string[] = [];
        const [startHour, startMin] = availability.startTime.split(':').map(Number);
        const [endHour, endMin] = availability.endTime.split(':').map(Number);

        let currentHour = startHour;
        let currentMin = startMin;

        while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
            slots.push(`${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`);

            currentMin += 30;
            if (currentMin >= 60) {
                currentMin = 0;
                currentHour += 1;
            }
        }

        return slots;
    };

    const availableSlots = getAvailableTimeSlots();

    // Desabilitar datas passadas e sem disponibilidade
    const disabledDays = (date: Date) => {
        if (isBefore(date, startOfDay(new Date()))) return true;
        if (isAfter(date, addDays(new Date(), 30))) return true; // Máximo 30 dias no futuro

        const dayOfWeek = date.getDay();
        const hasAvailability = instructor.availability?.some(a => a.dayOfWeek === dayOfWeek);
        return !hasAvailability;
    };

    const selectedLesson = LESSON_TYPES.find(l => l.value === lessonType);
    const totalPrice = instructor.basePrice;

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Agendar Aula com {instructor.name}</DialogTitle>
                    <DialogDescription>
                        Escolha a data, horário e tipo de aula desejada
                    </DialogDescription>
                </DialogHeader>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-2 my-6">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center">
                            <div className={`
                                w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all
                                ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                            `}>
                                {s}
                            </div>
                            {s < 3 && (
                                <div className={`w-12 h-1 mx-2 ${step > s ? 'bg-primary' : 'bg-muted'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1: Data e Horário */}
                {step === 1 && (
                    <div className="space-y-6">
                        <div>
                            <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                Escolha a Data
                            </Label>
                            <div className="flex justify-center border rounded-lg p-4 bg-muted/30">
                                <DayPicker
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    disabled={disabledDays}
                                    locale={ptBR}
                                    className="rdp-custom"
                                    modifiersClassNames={{
                                        selected: 'bg-primary text-primary-foreground',
                                        today: 'font-bold text-primary',
                                    }}
                                />
                            </div>
                        </div>

                        {selectedDate && (
                            <div>
                                <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Escolha o Horário
                                </Label>
                                {availableSlots.length > 0 ? (
                                    <div className="grid grid-cols-4 gap-2">
                                        {availableSlots.map((slot) => (
                                            <button
                                                key={slot}
                                                onClick={() => setSelectedTime(slot)}
                                                className={`
                                                    px-4 py-2 rounded-lg border-2 font-medium transition-all
                                                    ${selectedTime === slot
                                                        ? 'border-primary bg-primary text-primary-foreground'
                                                        : 'border-muted hover:border-primary/50 hover:bg-muted'
                                                    }
                                                `}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p>Nenhum horário disponível nesta data</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button variant="outline" onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={() => setStep(2)}
                                disabled={!selectedDate || !selectedTime}
                            >
                                Continuar
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Tipo de Aula */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div>
                            <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                                <Car className="h-5 w-5 text-primary" />
                                Tipo de Aula
                            </Label>
                            <div className="grid gap-3">
                                {LESSON_TYPES.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setLessonType(type.value)}
                                        className={`
                                            p-4 rounded-lg border-2 text-left transition-all
                                            ${lessonType === type.value
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted hover:border-primary/50'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold">{type.label}</p>
                                                <p className="text-sm text-muted-foreground">{type.duration} minutos</p>
                                            </div>
                                            {lessonType === type.value && (
                                                <CheckCircle className="h-5 w-5 text-primary" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Label className="flex items-center gap-2 mb-2">
                                <input
                                    type="checkbox"
                                    checked={useOwnVehicle}
                                    onChange={(e) => setUseOwnVehicle(e.target.checked)}
                                    className="w-4 h-4"
                                />
                                Usar meu próprio veículo
                            </Label>
                            <p className="text-sm text-muted-foreground ml-6">
                                Caso tenha veículo próprio e queira praticar nele
                            </p>
                        </div>

                        <div className="flex justify-between gap-3 pt-4 border-t">
                            <Button variant="outline" onClick={() => setStep(1)}>
                                Voltar
                            </Button>
                            <Button
                                onClick={() => setStep(3)}
                                disabled={!lessonType}
                            >
                                Continuar
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Pagamento e Confirmação */}
                {step === 3 && (
                    <div className="space-y-6">
                        <div>
                            <Label className="text-base font-semibold mb-3 flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-primary" />
                                Forma de Pagamento
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                                {PAYMENT_METHODS.map((method) => (
                                    <button
                                        key={method.value}
                                        onClick={() => setPaymentMethod(method.value)}
                                        className={`
                                            p-4 rounded-lg border-2 transition-all
                                            ${paymentMethod === method.value
                                                ? 'border-primary bg-primary/5'
                                                : 'border-muted hover:border-primary/50'
                                            }
                                        `}
                                    >
                                        <div className="text-2xl mb-1">{method.icon}</div>
                                        <p className="font-semibold text-sm">{method.label}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Resumo */}
                        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                            <h3 className="font-bold text-lg mb-3">Resumo da Aula</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Data:</span>
                                    <span className="font-semibold">
                                        {selectedDate && format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Horário:</span>
                                    <span className="font-semibold">{selectedTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Tipo:</span>
                                    <span className="font-semibold">{selectedLesson?.label}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Duração:</span>
                                    <span className="font-semibold">{selectedLesson?.duration} min</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Veículo:</span>
                                    <span className="font-semibold">
                                        {useOwnVehicle ? 'Próprio' : 'Do instrutor'}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-3 border-t">
                                    <span className="text-muted-foreground">Pagamento:</span>
                                    <span className="font-semibold">
                                        {PAYMENT_METHODS.find(m => m.value === paymentMethod)?.label}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-3 border-t">
                                    <span className="font-bold">Total:</span>
                                    <span className="font-bold text-xl text-primary">
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                                <strong>Importante:</strong> O instrutor tem 2 minutos para aceitar sua solicitação.
                                Você será notificado assim que ele responder.
                            </p>
                        </div>

                        <div className="flex justify-between gap-3 pt-4 border-t">
                            <Button variant="outline" onClick={() => setStep(2)}>
                                Voltar
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!paymentMethod || requestLessonMutation.isPending}
                                size="lg"
                                className="gap-2"
                            >
                                {requestLessonMutation.isPending ? (
                                    <>
                                        <Spinner className="h-4 w-4" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-4 w-4" />
                                        Confirmar Agendamento
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
