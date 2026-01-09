"use client";

import { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Star,
    GraduationCap,
    CreditCard,
    Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function StudentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get("tab") || "info";

    const { data: student, isLoading } = trpc.admin.getStudentById.useQuery({
        id,
    });

    const { data: lessons } = trpc.admin.getStudentLessons.useQuery({
        studentId: id,
        limit: 20,
        skip: 0,
    });

    const { data: payments } = trpc.admin.getStudentPayments.useQuery({
        studentId: id,
        limit: 20,
        skip: 0,
    });

    if (isLoading) {
        return (
            <div className="container mx-auto py-16 px-4">
                <div className="flex justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="container mx-auto py-16 px-4">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">Aluno não encontrado</p>
                        <Button onClick={() => router.back()} className="mt-4">
                            Voltar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const totalPaid = payments?.reduce((sum, payment) => sum + Number(payment.amount || 0), 0) || 0;

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    ← Voltar
                </Button>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{student.user.name || "N/A"}</h1>
                        <p className="text-muted-foreground">{student.user.email}</p>
                    </div>
                </div>
            </div>

            <Tabs defaultValue={defaultTab} className="space-y-6">
                <TabsList>
                    <TabsTrigger value="info">Informações</TabsTrigger>
                    <TabsTrigger value="lessons">
                        Aulas ({student.lessons?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="payments">
                        Pagamentos ({payments?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value="ratings">
                        Avaliações ({student.ratings?.length || 0})
                    </TabsTrigger>
                </TabsList>

                {/* Informações */}
                <TabsContent value="info" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Dados Pessoais */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Dados Pessoais
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground">Nome</label>
                                    <p className="font-medium">{student.user.name || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">CPF</label>
                                    <p className="font-medium">{student.cpf || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Data de Nascimento</label>
                                    <p className="font-medium">
                                        {student.birthDate
                                            ? new Date(student.birthDate).toLocaleDateString("pt-BR")
                                            : "N/A"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contato */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Contato
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground">Email</label>
                                    <p className="font-medium">{student.user.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Telefone</label>
                                    <p className="font-medium">{student.user.phone || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Endereço</label>
                                    <p className="font-medium">
                                        {student.city || "N/A"}, {student.state || "N/A"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Estatísticas */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5" />
                                    Estatísticas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold">{student.lessons?.length || 0}</p>
                                        <p className="text-sm text-muted-foreground">Aulas</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">R$ {totalPaid.toFixed(2)}</p>
                                        <p className="text-sm text-muted-foreground">Total Pago</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Informações Adicionais */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações Adicionais</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground">Cadastrado em</label>
                                    <p className="font-medium">
                                        {new Date(student.createdAt).toLocaleDateString("pt-BR")}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Última atualização</label>
                                    <p className="font-medium">
                                        {new Date(student.updatedAt).toLocaleDateString("pt-BR")}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Aulas */}
                <TabsContent value="lessons">
                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico de Aulas</CardTitle>
                            <CardDescription>Todas as aulas do aluno</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {lessons && lessons.length > 0 ? (
                                <div className="space-y-4">
                                    {lessons.map((lesson: any) => (
                                        <div
                                            key={lesson.id}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium">
                                                        {lesson.instructor?.user?.name || "N/A"}
                                                    </p>
                                                    <Badge>{lesson.status}</Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {lesson.instructor?.user?.email || "N/A"}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(lesson.createdAt).toLocaleDateString("pt-BR")} às{" "}
                                                    {new Date(lesson.createdAt).toLocaleTimeString("pt-BR", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    R$ {lesson.payment?.amount?.toFixed(2) || "0.00"}
                                                </p>
                                                {lesson.payment && (
                                                    <Badge variant="outline">{lesson.payment.status}</Badge>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">
                                    Nenhuma aula encontrada
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Pagamentos */}
                <TabsContent value="payments">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Histórico de Pagamentos
                            </CardTitle>
                            <CardDescription>
                                Total pago: R$ {totalPaid.toFixed(2)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {payments && payments.length > 0 ? (
                                <div className="space-y-4">
                                    {payments.map((payment: any) => (
                                        <div
                                            key={payment.id}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium">
                                                        Aula com {payment.lesson?.instructor?.user?.name || "N/A"}
                                                    </p>
                                                    <Badge variant={payment.status === "PAID" ? "default" : "secondary"}>
                                                        {payment.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Método: {payment.method}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(payment.createdAt).toLocaleDateString("pt-BR")} às{" "}
                                                    {new Date(payment.createdAt).toLocaleTimeString("pt-BR", {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold">
                                                    R$ {Number(payment.amount || 0).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">
                                    Nenhum pagamento encontrado
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Avaliações */}
                <TabsContent value="ratings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Avaliações Dadas</CardTitle>
                            <CardDescription>Avaliações que o aluno deu aos instrutores</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {student.ratings && student.ratings.length > 0 ? (
                                <div className="space-y-4">
                                    {student.ratings.map((rating: any) => (
                                        <div key={rating.id} className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-medium">
                                                    {rating.instructor?.user?.name || "N/A"}
                                                </p>
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-medium">{rating.rating}</span>
                                                </div>
                                            </div>
                                            {rating.comment && (
                                                <p className="text-sm text-muted-foreground">{rating.comment}</p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {formatDistanceToNow(new Date(rating.createdAt), {
                                                    addSuffix: true,
                                                    locale: ptBR,
                                                })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">
                                    Nenhuma avaliação encontrada
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
