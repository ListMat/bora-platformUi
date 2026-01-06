'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { api } from '@/utils/api';
import ChatWindow from '@/components/ChatWindow';
import AppNavbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Calendar, Car, Clock } from 'lucide-react';
import { Spinner } from "@/components/ui/spinner";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();
    const lessonId = params.lessonId as string;

    const { data: lesson, isLoading } = api.lesson.getById.useQuery(
        { lessonId },
        { enabled: !!lessonId && status === 'authenticated' }
    );

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (status === 'unauthenticated') {
        router.push('/login');
        return null;
    }

    if (!lesson) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Aula não encontrada</h1>
                <Button onClick={() => router.back()}>Voltar</Button>
            </div>
        );
    }

    const currentUserId = session?.user?.id || '';
    const isStudent = lesson.student.userId === currentUserId;
    const isInstructor = lesson.instructor.userId === currentUserId;

    if (!isStudent && !isInstructor) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold text-destructive">Acesso negado</h1>
                <p>Você não é participante desta aula.</p>
                <Button onClick={() => router.push('/')}>Ir para Início</Button>
            </div>
        );
    }

    const otherUser = isStudent ? lesson.instructor.user : lesson.student.user;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <AppNavbar />

            <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 flex flex-col gap-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4">
                    <Button
                        variant="ghost"
                        className="w-fit -ml-2 text-muted-foreground hover:text-foreground"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Voltar
                    </Button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/30 p-4 rounded-lg border">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">Chat da Aula</h1>
                            <p className="text-muted-foreground">
                                {format(new Date(lesson.scheduledAt), "dd 'de' MMMM", { locale: ptBR })} • {format(new Date(lesson.scheduledAt), "HH:mm")}
                            </p>
                        </div>

                        <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-md border shadow-sm">
                                <Car className="w-4 h-4 text-primary" />
                                <span>{lesson.lessonType || 'Aula Prática'}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-background px-3 py-1.5 rounded-md border shadow-sm">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>{lesson.duration || 50} min</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Window */}
                <div className="flex-1 min-h-[500px]">
                    <ChatWindow
                        lessonId={lessonId}
                        currentUserId={currentUserId}
                        otherUserName={otherUser.name || 'Usuário'}
                        otherUserImage={otherUser.image}
                        className="h-full min-h-[600px]"
                    />
                </div>
            </div>
        </div>
    );
}
