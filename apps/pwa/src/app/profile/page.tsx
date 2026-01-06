import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppNavbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/chip";
import { Edit, Calendar, Star, Car, Clock, ShieldCheck, Mail } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    // Buscar dados do usuário
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
            // @ts-ignore
            instructor: {
                include: {
                    // @ts-ignore
                    availability: true,
                }
            },
            student: true,
            // @ts-ignore
            vehicles: true,
        }
    });

    if (!user) return <div>Usuário não encontrado</div>;

    const isInstructor = user.role === 'INSTRUCTOR';
    // @ts-ignore
    const profileData = isInstructor ? user.instructor : user.student;

    // @ts-ignore
    const vehicles = user.vehicles || [];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />

            <main className="max-w-5xl mx-auto px-6 py-8">
                {/* Header do Perfil */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                    <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-xl">
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback className="text-2xl">{user.name?.[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-3xl font-bold">{user.name}</h1>
                            <Badge variant={isInstructor ? "default" : "secondary"}>
                                {isInstructor ? "Instrutor" : "Aluno"}
                            </Badge>
                            {/* @ts-ignore */}
                            {isInstructor && profileData?.status === 'VERIFIED' && (
                                <Badge variant="outline" className="text-green-600 border-green-600 gap-1">
                                    <ShieldCheck className="w-3 h-3" /> Verificado
                                </Badge>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-muted-foreground text-sm">
                            <div className="flex items-center gap-1">
                                <Mail className="w-4 h-4" />
                                {user.email}
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Membro desde {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}
                            </div>
                        </div>
                    </div>

                    <Button asChild variant="outline">
                        <Link href="/settings">
                            <Edit className="w-4 h-4 mr-2" />
                            Editar Perfil
                        </Link>
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Coluna Esquerda: Detalhes e Bio */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Sobre</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-4">
                                {/* @ts-ignore */}
                                <p className="text-muted-foreground leading-relaxed">
                                    {/* @ts-ignore */}
                                    {profileData?.bio || "Nenhuma biografia informada."}
                                </p>

                                {isInstructor && (
                                    <div className="pt-4 border-t space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Preço/Hora</span>
                                            {/* @ts-ignore */}
                                            <span className="font-semibold">R$ {Number(profileData?.basePrice || profileData?.pricePerHour || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Cidade</span>
                                            {/* @ts-ignore */}
                                            <span className="font-medium">{profileData?.city || "Não informada"}</span>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Veículos (Se tiver) */}
                        {vehicles.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Car className="w-5 h-5 text-primary" />
                                        Veículos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* @ts-ignore */}
                                    {vehicles.map((v: any, i: number) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                            {v.photoUrl && (
                                                <img src={v.photoUrl} alt={v.model} className="w-12 h-12 rounded object-cover" />
                                            )}
                                            <div>
                                                <p className="font-medium text-sm">{v.model}</p>
                                                {/* @ts-ignore */}
                                                <p className="text-xs text-muted-foreground">{v.brand} • {v.plateLastFour ? `Final ${v.plateLastFour}` : v.plate}</p>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Coluna Direita: Estatísticas e Conteúdo Principal */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <div className="mb-2 flex justify-center">
                                        <Star className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    {/* @ts-ignore */}
                                    <div className="text-2xl font-bold">{isInstructor ? Number(profileData?.averageRating || 0).toFixed(1) : "5.0"}</div>
                                    <div className="text-xs text-muted-foreground">Avaliação</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <div className="mb-2 flex justify-center">
                                        <Clock className="w-6 h-6 text-blue-500" />
                                    </div>
                                    {/* @ts-ignore */}
                                    <div className="text-2xl font-bold">{isInstructor ? (profileData?.totalLessons || 0) : "0"}</div>
                                    <div className="text-xs text-muted-foreground">Aulas Totais</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <div className="mb-2 flex justify-center">
                                        <Car className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div className="text-2xl font-bold">{vehicles.length}</div>
                                    <div className="text-xs text-muted-foreground">Veículos</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Avaliações ou Histórico (Placeholder) */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{isInstructor ? "Avaliações Recentes" : "Histórico de Aulas"}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12 text-muted-foreground">
                                    <p>Nenhuma atividade recente para exibir.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
