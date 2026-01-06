import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppNavbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/chip";
import {
    Star,
    ShieldCheck,
    Car,
    Calendar,
    TrendingUp,
    Sparkles,
    Crown,
    Zap,
    MapPin
} from "lucide-react";
import Link from "next/link";

export default async function InstructorProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/api/auth/signin");
    }

    // Buscar dados do instrutor
    const instructor = await prisma.instructor.findUnique({
        where: { userId: session.user.id },
        include: {
            user: true,
            plans: {
                where: { isActive: true },
                orderBy: { lessons: "asc" },
            },
            ratings: {
                include: {
                    student: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    image: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: 10,
            },
            lessons: {
                where: {
                    status: "FINISHED",
                },
                include: {
                    student: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                    payment: true,
                },
                orderBy: { scheduledAt: "desc" },
                take: 20,
            },
        },
    });

    if (!instructor) {
        redirect("/instructor/onboarding");
    }

    const user = instructor.user;

    // Verificar se teve pelo menos 1 pagamento confirmado
    const hasFirstPayment = instructor.lessons.some(
        (lesson) => lesson.payment?.status === "COMPLETED"
    );

    // Calcular estatísticas
    const totalEarnings = instructor.lessons
        .filter((l) => l.payment?.status === "COMPLETED")
        .reduce((sum, l) => sum + Number(l.price), 0);

    const instructorShare = totalEarnings * 0.85;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />

            <main className="max-w-5xl mx-auto px-6 py-8">
                {/* Header do Perfil - Mesmo estilo do /profile */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                    <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-xl">
                        <AvatarImage src={user.image || ""} />
                        <AvatarFallback className="text-2xl">{user.name?.[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-3xl font-bold">{user.name}</h1>
                            <Badge variant="default">Instrutor</Badge>
                            {instructor.status === 'ACTIVE' && (
                                <Badge variant="outline" className="text-green-600 border-green-600 gap-1">
                                    <ShieldCheck className="w-3 h-3" /> Verificado
                                </Badge>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-muted-foreground text-sm">
                            <div className="flex items-center gap-1">
                                <span>{user.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Membro desde {user.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '-'}
                            </div>
                        </div>
                    </div>

                    <Button asChild variant="outline">
                        <Link href="/settings">Editar Perfil</Link>
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Coluna Esquerda: Sobre e Veículos */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Sobre</CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm space-y-4">
                                <p className="text-muted-foreground leading-relaxed">
                                    {instructor.bio || "Nenhuma biografia informada."}
                                </p>

                                <div className="pt-4 border-t space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Preço/Hora</span>
                                        <span className="font-semibold">R$ {Number(instructor.basePrice || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Cidade</span>
                                        <span className="font-medium">{instructor.city || "Não informada"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Você recebe</span>
                                        <span className="font-semibold text-green-600">85% por aula</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Veículos */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Car className="w-5 h-5 text-primary" />
                                    Veículos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-center py-4 text-muted-foreground text-sm">
                                    Nenhum veículo cadastrado
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Coluna Direita: Stats e Conteúdo Principal */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4">
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <div className="mb-2 flex justify-center">
                                        <Star className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    <div className="text-2xl font-bold">{instructor.averageRating.toFixed(1)}</div>
                                    <div className="text-xs text-muted-foreground">Avaliação</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <div className="mb-2 flex justify-center">
                                        <Calendar className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div className="text-2xl font-bold">{instructor.totalLessons}</div>
                                    <div className="text-xs text-muted-foreground">Aulas Totais</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6 text-center">
                                    <div className="mb-2 flex justify-center">
                                        <Car className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div className="text-2xl font-bold">0</div>
                                    <div className="text-xs text-muted-foreground">Veículos</div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Planos de Aulas */}
                        {instructor.plans.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Seus Planos de Aulas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {instructor.plans.map((plan) => (
                                            <div key={plan.id} className="p-4 bg-muted/50 rounded-lg space-y-2">
                                                <div className="font-semibold">{plan.name}</div>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-2xl font-bold">
                                                        R$ {Number(plan.price).toFixed(2)}
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">
                                                        / {plan.lessons} {plan.lessons === 1 ? "aula" : "aulas"}
                                                    </span>
                                                </div>
                                                {plan.discount > 0 && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {plan.discount}% desconto
                                                    </Badge>
                                                )}
                                                <div className="text-xs text-muted-foreground">
                                                    Você recebe: R$ {(Number(plan.price) * 0.85).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Avaliações Recentes */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Avaliações Recentes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {instructor.ratings.length > 0 ? (
                                    <div className="space-y-4">
                                        {instructor.ratings.slice(0, 3).map((rating) => (
                                            <div key={rating.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarImage src={rating.student.user.image || ""} />
                                                    <AvatarFallback>
                                                        {rating.student.user.name?.[0] || "A"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="font-medium text-sm">
                                                            {rating.student.user.name || "Aluno"}
                                                        </p>
                                                        <div className="flex items-center gap-1">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-3 h-3 ${i < rating.rating
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "text-gray-300"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {rating.comment && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {rating.comment}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {new Date(rating.createdAt).toLocaleDateString("pt-BR")}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-muted-foreground">
                                        <p>Nenhuma atividade recente para exibir.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Upsell - Só aparece após primeiro pagamento */}
                        {hasFirstPayment && (
                            <Card className="border-2 border-purple-200 dark:border-purple-800">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-5 h-5 text-purple-600" />
                                        <CardTitle>Destaque seu perfil</CardTitle>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Instrutores em destaque recebem até 3x mais solicitações de aula
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {/* Destaque no Mapa */}
                                        <div className="p-4 border rounded-lg space-y-3">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-purple-600" />
                                                <Badge variant="outline" className="text-xs">POPULAR</Badge>
                                            </div>
                                            <div>
                                                <div className="font-semibold">Destaque no Mapa</div>
                                                <div className="text-2xl font-bold mt-1">R$ 5<span className="text-sm font-normal text-muted-foreground">/dia</span></div>
                                            </div>
                                            <Button size="sm" className="w-full" variant="outline">
                                                <Zap className="w-3 h-3 mr-1" />
                                                Ativar
                                            </Button>
                                        </div>

                                        {/* Destaque na Busca */}
                                        <div className="p-4 border rounded-lg space-y-3">
                                            <TrendingUp className="w-4 h-4 text-blue-600" />
                                            <div>
                                                <div className="font-semibold">Destaque na Busca</div>
                                                <div className="text-2xl font-bold mt-1">R$ 3<span className="text-sm font-normal text-muted-foreground">/dia</span></div>
                                            </div>
                                            <Button size="sm" className="w-full" variant="outline">
                                                Ativar
                                            </Button>
                                        </div>

                                        {/* Perfil Premium */}
                                        <div className="p-4 border-2 border-yellow-400 rounded-lg space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Crown className="w-4 h-4 text-yellow-600" />
                                                <Badge variant="outline" className="text-xs text-yellow-600">PREMIUM</Badge>
                                            </div>
                                            <div>
                                                <div className="font-semibold">Perfil Premium</div>
                                                <div className="text-2xl font-bold mt-1">R$ 100<span className="text-sm font-normal text-muted-foreground">/mês</span></div>
                                            </div>
                                            <Button size="sm" className="w-full bg-yellow-500 hover:bg-yellow-600">
                                                <Crown className="w-3 h-3 mr-1" />
                                                Assinar
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
