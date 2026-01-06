'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/utils/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/chip";
import { Spinner } from "@/components/ui/spinner";
import AppNavbar from '@/components/Navbar';
import BookingModal from '@/components/BookingModal';
import {
    MapPin,
    Star,
    Car,
    CheckCircle,
    Calendar,
    Clock,
    Award,
    Shield,
    ChevronLeft,
    MessageCircle,
    Phone,
    Mail
} from 'lucide-react';
import { formatPrice } from '@/lib/validations/onboarding';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function InstructorProfilePage() {
    const params = useParams();
    const router = useRouter();
    const instructorId = params.id as string;
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    const { data: instructor, isLoading } = api.instructor.getById.useQuery(
        { id: instructorId },
        { enabled: !!instructorId }
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!instructor) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Instrutor não encontrado</h1>
                <Button onClick={() => router.push('/search')}>Voltar para Busca</Button>
            </div>
        );
    }

    const vehicle = instructor.user.vehicles?.[0];
    const hasRatings = instructor.ratings && instructor.ratings.length > 0;

    return (
        <div className="min-h-screen bg-background">
            <AppNavbar />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Botão Voltar */}
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-6 -ml-2"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Voltar
                </Button>

                {/* Header do Perfil */}
                <Card className="mb-6 overflow-hidden">
                    {/* Banner com Foto do Veículo */}
                    <div className="relative h-64 bg-gradient-to-br from-primary/20 to-primary/5">
                        {vehicle?.photos?.[0] || vehicle?.photoUrl ? (
                            <img
                                src={vehicle.photos?.[0] || vehicle.photoUrl || ''}
                                alt="Veículo"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Car size={80} className="text-muted-foreground opacity-20" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    </div>

                    <CardContent className="relative -mt-20 pb-6">
                        <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
                            {/* Avatar */}
                            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
                                <AvatarImage src={instructor.user.image || undefined} />
                                <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                                    {instructor.user.name?.charAt(0) || 'I'}
                                </AvatarFallback>
                            </Avatar>

                            {/* Info Principal */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                    <div>
                                        <h1 className="text-3xl font-bold mb-2">{instructor.user.name}</h1>
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <Badge className="bg-green-600 hover:bg-green-700">
                                                <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-1.5" />
                                                Disponível Agora
                                            </Badge>
                                            <div className="flex items-center gap-1 text-lg">
                                                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                                <span className="font-bold">{instructor.averageRating?.toFixed(1) || '5.0'}</span>
                                                <span className="text-muted-foreground text-sm">
                                                    ({instructor.totalLessons || 0} aulas)
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground mb-1">A partir de</p>
                                        <p className="text-3xl font-bold text-primary">
                                            {formatPrice(Number(instructor.basePrice))}
                                            <span className="text-lg font-normal text-muted-foreground">/hora</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Ações */}
                                <div className="flex gap-3 flex-wrap">
                                    <Button
                                        size="lg"
                                        className="gap-2 shadow-md"
                                        onClick={() => setIsBookingModalOpen(true)}
                                    >
                                        <Calendar className="h-4 w-4" />
                                        Agendar Aula
                                    </Button>
                                    <Button size="lg" variant="outline" className="gap-2">
                                        <MessageCircle className="h-4 w-4" />
                                        Enviar Mensagem
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Coluna Principal */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Sobre */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-bold">Sobre o Instrutor</h2>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-muted-foreground leading-relaxed">
                                    {instructor.bio || 'Instrutor credenciado pelo DETRAN com experiência em formação de condutores. Aulas práticas personalizadas de acordo com o nível e necessidade de cada aluno.'}
                                </p>

                                <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <MapPin className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Localização</p>
                                            <p className="font-semibold">{instructor.city}, {instructor.state}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Award className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Aulas Realizadas</p>
                                            <p className="font-semibold">{instructor.totalLessons || 0} aulas</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Shield className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Credencial</p>
                                            <p className="font-semibold">DETRAN {instructor.state}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Status</p>
                                            <p className="font-semibold text-green-600">Verificado</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Veículo */}
                        {vehicle && (
                            <Card>
                                <CardHeader>
                                    <h2 className="text-xl font-bold">Veículo</h2>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-4">
                                        {vehicle.photos?.[0] || vehicle.photoUrl ? (
                                            <img
                                                src={vehicle.photos?.[0] || vehicle.photoUrl || ''}
                                                alt={vehicle.model}
                                                className="w-32 h-32 rounded-lg object-cover"
                                            />
                                        ) : null}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-bold mb-2">
                                                {vehicle.brand} {vehicle.model}
                                            </h3>
                                            <div className="space-y-1 text-sm text-muted-foreground">
                                                <p>Ano: {vehicle.year}</p>
                                                <p>Cor: {vehicle.color}</p>
                                                <p>Transmissão: {vehicle.transmission === 'AUTOMATICO' ? 'Automática' : 'Manual'}</p>
                                                {vehicle.hasDualPedal && (
                                                    <Badge variant="secondary" className="mt-2">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Duplo Pedal
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Avaliações */}
                        <Card>
                            <CardHeader>
                                <h2 className="text-xl font-bold">Avaliações</h2>
                            </CardHeader>
                            <CardContent>
                                {hasRatings ? (
                                    <div className="space-y-4">
                                        {instructor.ratings.slice(0, 5).map((rating) => (
                                            <div key={rating.id} className="pb-4 border-b last:border-0">
                                                <div className="flex items-start gap-3 mb-2">
                                                    <Avatar className="h-10 w-10">
                                                        <AvatarImage src={rating.student.user.image || undefined} />
                                                        <AvatarFallback>
                                                            {rating.student.user.name?.charAt(0) || 'A'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <p className="font-semibold">{rating.student.user.name}</p>
                                                            <div className="flex items-center gap-1">
                                                                {Array.from({ length: rating.rating }).map((_, i) => (
                                                                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            {format(new Date(rating.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                                        </p>
                                                        {rating.comment && (
                                                            <p className="text-sm">{rating.comment}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Star className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                        <p>Ainda sem avaliações</p>
                                        <p className="text-sm">Seja o primeiro a avaliar!</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Disponibilidade */}
                        <Card>
                            <CardHeader>
                                <h3 className="font-bold flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-primary" />
                                    Disponibilidade
                                </h3>
                            </CardHeader>
                            <CardContent>
                                {instructor.availability && instructor.availability.length > 0 ? (
                                    <div className="space-y-2">
                                        {instructor.availability.slice(0, 7).map((slot) => {
                                            const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                                            return (
                                                <div key={slot.id} className="flex justify-between text-sm">
                                                    <span className="font-medium">{days[slot.dayOfWeek]}</span>
                                                    <span className="text-muted-foreground">
                                                        {slot.startTime} - {slot.endTime}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Horários flexíveis
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        {/* CTA Card */}
                        <Card className="bg-primary text-primary-foreground">
                            <CardContent className="p-6 text-center">
                                <h3 className="text-lg font-bold mb-2">Pronto para começar?</h3>
                                <p className="text-sm opacity-90 mb-4">
                                    Agende sua primeira aula agora mesmo!
                                </p>
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="w-full"
                                    onClick={() => setIsBookingModalOpen(true)}
                                >
                                    Agendar Agora
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modal de Agendamento */}
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                instructor={{
                    id: instructor.id,
                    name: instructor.user.name || 'Instrutor',
                    basePrice: Number(instructor.basePrice),
                    availability: instructor.availability,
                }}
                onSuccess={(lessonId) => {
                    router.push(`/chat/${lessonId}`);
                }}
            />
        </div>
    );
}
