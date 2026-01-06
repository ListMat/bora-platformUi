import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AppNavbar from "@/components/Navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/chip";
import {
    Star,
    ShieldCheck,
    MapPin,
    Calendar,
    TrendingUp,
    Sparkles,
    Crown,
    Zap
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

    // Verificar se teve pelo menos 1 pagamento confirmado
    const hasFirstPayment = instructor.lessons.some(
        (lesson) => lesson.payment?.status === "COMPLETED"
    );

    // Calcular estatísticas
    const totalEarnings = instructor.lessons
        .filter((l) => l.payment?.status === "COMPLETED")
        .reduce((sum, l) => sum + Number(l.price), 0);

    const instructorShare = totalEarnings * 0.85; // 85% para o instrutor

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Header - Estilo Airbnb */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                        <Avatar className="w-32 h-32 border-4 border-background shadow-2xl">
                            <AvatarImage src={instructor.user.image || ""} />
                            <AvatarFallback className="text-4xl">
                                {instructor.user.name?.[0] || "I"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold">{instructor.user.name}</h1>
                                {instructor.status === "ACTIVE" && (
                                    <Badge variant="default" className="gap-1">
                                        <ShieldCheck className="w-3 h-3" />
                                        Verificado
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center gap-4 text-lg mb-3">
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold">
                                        {instructor.averageRating.toFixed(1)}
                                    </span>
                                </div>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">
                                    {instructor.totalLessons} aulas realizadas
                                </span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">
                                    {instructor.ratings.length} avaliações
                                </span>
                            </div>

                            {instructor.city && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span>{instructor.city}, {instructor.state}</span>
                                </div>
                            )}
                        </div>

                        <Button asChild size="lg">
                            <Link href="/settings">Editar Perfil</Link>
                        </Button>
                    </div>

                    {/* Bio */}
                    {instructor.bio && (
                        <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                            {instructor.bio}
                        </p>
                    )}
                </div>

                {/* Estatísticas Rápidas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-green-600">
                                R$ {instructorShare.toFixed(2)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                Você recebe 85% de cada aula
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold">
                                {instructor.totalLessons}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Aulas realizadas</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold flex items-center gap-1">
                                <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                {instructor.averageRating.toFixed(1)}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Avaliação média</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold">
                                {instructor.ratings.length}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">Avaliações</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Planos de Aulas */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">Seus Planos de Aulas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {instructor.plans.map((plan) => (
                            <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                                    {plan.description && (
                                        <CardDescription>{plan.description}</CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold">
                                                R$ {Number(plan.price).toFixed(2)}
                                            </span>
                                            <span className="text-muted-foreground">
                                                / {plan.lessons} {plan.lessons === 1 ? "aula" : "aulas"}
                                            </span>
                                        </div>
                                        {plan.discount > 0 && (
                                            <Badge variant="secondary">
                                                {plan.discount}% de desconto
                                            </Badge>
                                        )}
                                        <div className="text-sm text-muted-foreground">
                                            Você recebe: R${" "}
                                            {(Number(plan.price) * 0.85).toFixed(2)}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Avaliações - Estilo Airbnb */}
                <section className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                        <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                        <h2 className="text-2xl font-bold">
                            {instructor.averageRating.toFixed(1)} · {instructor.ratings.length}{" "}
                            avaliações
                        </h2>
                    </div>

                    {instructor.ratings.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {instructor.ratings.map((rating) => (
                                <Card key={rating.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-4">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage
                                                    src={rating.student.user.image || ""}
                                                />
                                                <AvatarFallback>
                                                    {rating.student.user.name?.[0] || "A"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <p className="font-semibold">
                                                            {rating.student.user.name || "Aluno"}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(
                                                                rating.createdAt
                                                            ).toLocaleDateString("pt-BR", {
                                                                month: "long",
                                                                year: "numeric",
                                                            })}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-4 h-4 ${i < rating.rating
                                                                        ? "fill-yellow-400 text-yellow-400"
                                                                        : "text-gray-300"
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                {rating.comment && (
                                                    <p className="text-sm leading-relaxed">
                                                        {rating.comment}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                <Star className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>Você ainda não recebeu avaliações</p>
                                <p className="text-sm mt-2">
                                    Complete sua primeira aula para receber feedback dos alunos
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </section>

                {/* Upsell - Só aparece após primeiro pagamento */}
                {hasFirstPayment && (
                    <section className="mb-12">
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-2xl p-8 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Sparkles className="w-6 h-6 text-purple-600" />
                                <h2 className="text-2xl font-bold">
                                    Destaque seu perfil e receba mais alunos
                                </h2>
                            </div>
                            <p className="text-muted-foreground mb-6">
                                Instrutores em destaque recebem até 3x mais solicitações de aula
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Destaque no Mapa */}
                            <Card className="border-2 border-purple-200 dark:border-purple-800 hover:shadow-xl transition-all">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-5 h-5 text-purple-600" />
                                        <Badge variant="outline" className="text-purple-600 border-purple-600">
                                            POPULAR
                                        </Badge>
                                    </div>
                                    <CardTitle>Destaque no Mapa</CardTitle>
                                    <CardDescription>
                                        Apareça no topo do mapa quando alunos buscarem instrutores
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-3xl font-bold">R$ 5</span>
                                            <span className="text-muted-foreground">/dia</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Cancele quando quiser
                                        </p>
                                    </div>
                                    <Button className="w-full" variant="outline">
                                        <Zap className="w-4 h-4 mr-2" />
                                        Ativar Destaque
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Destaque na Busca */}
                            <Card className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <TrendingUp className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <CardTitle>Destaque na Busca</CardTitle>
                                    <CardDescription>
                                        Apareça primeiro nos resultados de busca
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-3xl font-bold">R$ 3</span>
                                            <span className="text-muted-foreground">/dia</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Cancele quando quiser
                                        </p>
                                    </div>
                                    <Button className="w-full" variant="outline">
                                        Ativar Destaque
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Perfil Premium */}
                            <Card className="border-2 border-yellow-200 dark:border-yellow-800 hover:shadow-xl transition-all">
                                <CardHeader>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Crown className="w-5 h-5 text-yellow-600" />
                                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                            PREMIUM
                                        </Badge>
                                    </div>
                                    <CardTitle>Perfil Premium</CardTitle>
                                    <CardDescription>
                                        Selo de destaque + prioridade em todas as buscas
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <div className="flex items-baseline gap-2 mb-1">
                                            <span className="text-3xl font-bold">R$ 100</span>
                                            <span className="text-muted-foreground">/mês</span>
                                        </div>
                                        <p className="text-sm text-green-600 font-medium">
                                            Economize 33% vs diário
                                        </p>
                                    </div>
                                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600">
                                        <Crown className="w-4 h-4 mr-2" />
                                        Assinar Premium
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                )}

                {/* Histórico de Aulas */}
                <section>
                    <h2 className="text-2xl font-bold mb-6">Histórico de Aulas</h2>
                    {instructor.lessons.length > 0 ? (
                        <div className="space-y-4">
                            {instructor.lessons.map((lesson) => (
                                <Card key={lesson.id}>
                                    <CardContent className="pt-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Calendar className="w-5 h-5 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">
                                                        {lesson.student.user.name || "Aluno"}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(lesson.scheduledAt).toLocaleDateString(
                                                            "pt-BR",
                                                            {
                                                                day: "2-digit",
                                                                month: "long",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    R$ {Number(lesson.price).toFixed(2)}
                                                </p>
                                                <Badge
                                                    variant={
                                                        lesson.payment?.status === "COMPLETED"
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                >
                                                    {lesson.payment?.status === "COMPLETED"
                                                        ? "Pago"
                                                        : "Pendente"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center text-muted-foreground">
                                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>Nenhuma aula realizada ainda</p>
                                <p className="text-sm mt-2">
                                    Aguarde solicitações de alunos para começar
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </section>
            </main>
        </div>
    );
}
