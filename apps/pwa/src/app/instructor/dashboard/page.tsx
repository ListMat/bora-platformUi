'use client';

import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/chip";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import AppNavbar from "@/components/Navbar";
import { Calendar, Users, Briefcase } from "lucide-react";
import { useState } from "react";

export default function InstructorDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isOnlineState, setIsOnlineState] = useState(false);

    const { data: instructor, isLoading } = api.instructor.getStatus.useQuery(undefined, {
        enabled: !!session,
    });

    // Mock toggle online handler
    const handleToggleOnline = (checked: boolean) => {
        setIsOnlineState(checked);
        // Chamar API real aqui
    };

    if (status === "loading" || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (status === "unauthenticated") {
        router.push("/api/auth/signin");
        return null;
    }

    const firstName = session?.user?.name?.split(' ')[0] || "Instrutor";
    const isOnline = instructor?.isOnline || isOnlineState;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Olá, {firstName}! 👋</h1>
                        <p className="text-muted-foreground">
                            {isOnline ? "Você está online e visível para alunos." : "Você está offline."}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-muted-foreground'}`}>
                            {isOnline ? 'ONLINE' : 'OFFLINE'}
                        </span>
                        <Switch checked={isOnline} onCheckedChange={handleToggleOnline} />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="text-center py-6">
                            <div className="flex flex-col items-center gap-1">
                                <p className="text-3xl font-bold text-primary">0</p>
                                <p className="text-xs text-muted-foreground">Visualizações</p>
                                <Badge variant="secondary" className="mt-1">Novo</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="text-center py-6">
                            <div className="flex flex-col items-center gap-1">
                                <p className="text-3xl font-bold text-primary">0</p>
                                <p className="text-xs text-muted-foreground">Solicitações</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="text-center py-6">
                            <div className="flex flex-col items-center gap-1">
                                <p className="text-3xl font-bold text-primary">0</p>
                                <p className="text-xs text-muted-foreground">Aulas Realizadas</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="text-center py-6">
                            <div className="flex flex-col items-center gap-1">
                                <p className="text-3xl font-bold text-primary">R$ 0</p>
                                <p className="text-xs text-muted-foreground">Ganhos (Mês)</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Boost Status (Placeholder - Upsell) */}
                <Card className="mb-8 border border-primary/20 bg-primary/5">
                    <CardHeader className="flex gap-3 flex-row items-center space-y-0 pb-2">
                        <div className="p-2 bg-primary/10 rounded-full mr-2">
                            <Briefcase className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="text-lg font-bold">Impulsione seu perfil</h3>
                            <p className="text-sm text-muted-foreground">Consiga mais alunos aparecendo no topo das buscas.</p>
                        </div>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="default" size="sm">
                            Ativar Boost
                        </Button>
                    </CardFooter>
                </Card>

                {/* Requests Empty State */}
                <Card className="mb-8">
                    <CardHeader>
                        <h2 className="text-xl font-bold">📬 Novas Solicitações</h2>
                    </CardHeader>
                    <CardContent className="py-12 flex flex-col items-center text-center">
                        <div className="bg-muted p-4 rounded-full mb-4">
                            <Users className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">Nenhuma solicitação ainda</h3>
                        <p className="text-muted-foreground max-w-sm mt-2">
                            Assim que os alunos encontrarem seu perfil, as solicitações aparecerão aqui. Mantenha seu perfil completo!
                        </p>
                    </CardContent>
                </Card>

                {/* Schedule Empty State */}
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-bold">📅 Agenda</h2>
                    </CardHeader>
                    <CardContent className="py-12 flex flex-col items-center text-center">
                        <div className="bg-muted p-4 rounded-full mb-4">
                            <Calendar className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">Sua agenda está livre</h3>
                        <p className="text-muted-foreground max-w-sm mt-2">
                            Você ainda não tem aulas agendadas.
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="outline">
                            Gerenciar Horários
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
