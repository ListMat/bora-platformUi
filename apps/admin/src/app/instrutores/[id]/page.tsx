"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Star,
    Car,
    FileText,
    Ban,
    CheckCircle,
    Loader2,
    Calendar,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function InstructorDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { toast } = useToast();
    const [showSuspendDialog, setShowSuspendDialog] = useState(false);
    const [showActivateDialog, setShowActivateDialog] = useState(false);

    const { data: instructor, isLoading, refetch } = trpc.admin.getInstructorById.useQuery({
        id,
    });

    const suspendMutation = trpc.instructor.suspend.useMutation({
        onSuccess: () => {
            toast({
                title: "Instrutor suspenso",
                description: "O instrutor foi suspenso com sucesso.",
            });
            setShowSuspendDialog(false);
            refetch();
        },
        onError: (error) => {
            toast({
                title: "Erro ao suspender",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const activateMutation = trpc.instructor.approve.useMutation({
        onSuccess: () => {
            toast({
                title: "Instrutor ativado",
                description: "O instrutor foi ativado com sucesso.",
            });
            setShowActivateDialog(false);
            refetch();
        },
        onError: (error) => {
            toast({
                title: "Erro ao ativar",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleSuspend = () => {
        suspendMutation.mutate({ instructorId: id });
    };

    const handleActivate = () => {
        activateMutation.mutate({ instructorId: id });
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-16 px-4">
                <div className="flex justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            </div>
        );
    }

    if (!instructor) {
        return (
            <div className="container mx-auto py-16 px-4">
                <Card>
                    <CardContent className="py-12 text-center">
                        <p className="text-muted-foreground">Instrutor não encontrado</p>
                        <Button onClick={() => router.back()} className="mt-4">
                            Voltar
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return <Badge variant="default">Ativo</Badge>;
            case "PENDING_VERIFICATION":
                return <Badge variant="secondary">Pendente</Badge>;
            case "SUSPENDED":
                return <Badge variant="destructive">Suspenso</Badge>;
            case "INACTIVE":
                return <Badge variant="outline">Inativo</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    ← Voltar
                </Button>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{instructor.user.name || "N/A"}</h1>
                        <p className="text-muted-foreground">{instructor.user.email}</p>
                    </div>
                    <div className="flex gap-2">
                        {getStatusBadge(instructor.status)}
                        {instructor.status === "ACTIVE" && (
                            <Button
                                variant="destructive"
                                onClick={() => setShowSuspendDialog(true)}
                            >
                                <Ban className="mr-2 h-4 w-4" />
                                Suspender
                            </Button>
                        )}
                        {(instructor.status === "SUSPENDED" || instructor.status === "INACTIVE") && (
                            <Button onClick={() => setShowActivateDialog(true)}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Ativar
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <Tabs defaultValue="info" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="info">Informações</TabsTrigger>
                    <TabsTrigger value="lessons">Aulas ({instructor.lessons?.length || 0})</TabsTrigger>
                    <TabsTrigger value="ratings">Avaliações ({instructor.ratings?.length || 0})</TabsTrigger>
                    <TabsTrigger value="vehicles">Veículos ({instructor.user.vehicles?.length || 0})</TabsTrigger>
                    <TabsTrigger value="documents">Documentos</TabsTrigger>
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
                                    <p className="font-medium">{instructor.user.name || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">CPF</label>
                                    <p className="font-medium">{instructor.cpf || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">CNH</label>
                                    <p className="font-medium">{instructor.cnhNumber || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Data de Nascimento</label>
                                    <p className="font-medium">
                                        {instructor.birthDate
                                            ? new Date(instructor.birthDate).toLocaleDateString("pt-BR")
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
                                    <p className="font-medium">{instructor.user.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Telefone</label>
                                    <p className="font-medium">{instructor.user.phone || "N/A"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Endereço</label>
                                    <p className="font-medium">
                                        {instructor.city || "N/A"}, {instructor.state || "N/A"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Estatísticas */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Star className="h-5 w-5" />
                                    Estatísticas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <p className="text-2xl font-bold">{instructor.totalLessons}</p>
                                        <p className="text-sm text-muted-foreground">Aulas</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">
                                            {instructor.averageRating > 0
                                                ? instructor.averageRating.toFixed(1)
                                                : "N/A"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Avaliação</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">
                                            R$ {instructor.basePrice?.toFixed(2) || "0.00"}
                                        </p>
                                        <p className="text-sm text-muted-foreground">Preço Base</p>
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
                                    <label className="text-sm text-muted-foreground">Bio</label>
                                    <p className="font-medium">{instructor.bio || "Nenhuma bio cadastrada"}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-muted-foreground">Cadastrado em</label>
                                    <p className="font-medium">
                                        {new Date(instructor.createdAt).toLocaleDateString("pt-BR")}
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
                            <CardDescription>Últimas 20 aulas do instrutor</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {instructor.lessons && instructor.lessons.length > 0 ? (
                                <div className="space-y-4">
                                    {instructor.lessons.map((lesson: any) => (
                                        <div
                                            key={lesson.id}
                                            className="flex items-center justify-between p-4 border rounded-lg"
                                        >
                                            <div>
                                                <p className="font-medium">{lesson.student?.user?.name || "N/A"}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {lesson.student?.user?.email || "N/A"}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(lesson.createdAt).toLocaleDateString("pt-BR")}
                                                </p>
                                            </div>
                                            <Badge>{lesson.status}</Badge>
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

                {/* Avaliações */}
                <TabsContent value="ratings">
                    <Card>
                        <CardHeader>
                            <CardTitle>Avaliações Recebidas</CardTitle>
                            <CardDescription>Últimas 10 avaliações</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {instructor.ratings && instructor.ratings.length > 0 ? (
                                <div className="space-y-4">
                                    {instructor.ratings.map((rating: any) => (
                                        <div key={rating.id} className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-medium">{rating.student?.user?.name || "N/A"}</p>
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

                {/* Veículos */}
                <TabsContent value="vehicles">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Car className="h-5 w-5" />
                                Veículos Cadastrados
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {instructor.user.vehicles && instructor.user.vehicles.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {instructor.user.vehicles.map((vehicle: any) => (
                                        <div key={vehicle.id} className="p-4 border rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-medium">
                                                    {vehicle.brand} {vehicle.model}
                                                </p>
                                                <Badge variant={vehicle.status === "ACTIVE" ? "default" : "secondary"}>
                                                    {vehicle.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">Placa: {vehicle.plate}</p>
                                            <p className="text-sm text-muted-foreground">Ano: {vehicle.year}</p>
                                            <p className="text-sm text-muted-foreground">Cor: {vehicle.color}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">
                                    Nenhum veículo cadastrado
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Documentos */}
                <TabsContent value="documents">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Documentos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {instructor.documents ? (
                                <div className="space-y-4">
                                    <div className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold">Status da Aprovação</h3>
                                            <Badge>{instructor.documents.status}</Badge>
                                        </div>
                                        {instructor.documents.analysisNote && (
                                            <div className="mb-4">
                                                <label className="text-sm text-muted-foreground">Nota de Análise</label>
                                                <p className="text-sm mt-1">{instructor.documents.analysisNote}</p>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <label className="text-muted-foreground">Enviado em:</label>
                                                <p>
                                                    {instructor.documents.submittedAt
                                                        ? new Date(instructor.documents.submittedAt).toLocaleDateString("pt-BR")
                                                        : "N/A"}
                                                </p>
                                            </div>
                                            {instructor.documents.reviewedAt && (
                                                <div>
                                                    <label className="text-muted-foreground">Revisado em:</label>
                                                    <p>
                                                        {new Date(instructor.documents.reviewedAt).toLocaleDateString("pt-BR")}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">
                                    Nenhum documento enviado
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Dialogs */}
            <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Suspender Instrutor</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja suspender este instrutor? Ele não poderá dar aulas até ser
                            reativado.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSuspendDialog(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleSuspend}
                            disabled={suspendMutation.isLoading}
                        >
                            {suspendMutation.isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Suspendendo...
                                </>
                            ) : (
                                "Confirmar Suspensão"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ativar Instrutor</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja ativar este instrutor? Ele poderá dar aulas novamente.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowActivateDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleActivate} disabled={activateMutation.isLoading}>
                            {activateMutation.isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Ativando...
                                </>
                            ) : (
                                "Confirmar Ativação"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
