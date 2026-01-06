"use client";

import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Star, Calendar, MapPin, Phone, Mail, Car } from "lucide-react";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const typeLabels: Record<string, string> = {
    INAPPROPRIATE_BEHAVIOR: "Comportamento Inadequado",
    INADEQUATE_VEHICLE: "Veículo Inadequado",
    HARASSMENT: "Assédio",
    DANGEROUS_DRIVING: "Direção Perigosa",
    OTHER: "Outro",
};

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    PENDING: { label: "Pendente", variant: "destructive" },
    UNDER_REVIEW: { label: "Em Análise", variant: "default" },
    RESOLVED: { label: "Resolvida", variant: "secondary" },
    DISMISSED: { label: "Arquivada", variant: "outline" },
};

export default function ComplaintDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: rawData, isLoading } = api.complaints.getById.useQuery({ id });
    const updateStatus = api.complaints.updateStatus.useMutation();

    const [newStatus, setNewStatus] = useState<string>("");
    const [resolution, setResolution] = useState<string>("");

    const complaint = (rawData as any)?.json || rawData;

    if (isLoading) {
        return <div className="p-8">Carregando...</div>;
    }

    if (!complaint) {
        return <div className="p-8">Denúncia não encontrada</div>;
    }

    const handleUpdateStatus = async () => {
        if (!newStatus) return;

        await updateStatus.mutateAsync({
            id: complaint.id,
            status: newStatus as any,
            resolution: resolution || undefined,
            resolvedBy: "admin-temp-id", // TODO: pegar do contexto de auth
        });

        router.refresh();
    };

    const statusBadge = statusConfig[complaint.status] || { label: complaint.status, variant: "outline" as const };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Denúncia #{complaint.id.slice(0, 8)}</h2>
                    <p className="text-muted-foreground">
                        Criada em {new Date(complaint.createdAt).toLocaleDateString("pt-BR")}
                    </p>
                </div>
                <Badge variant={statusBadge.variant} className="ml-auto">
                    {statusBadge.label}
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Informações da Denúncia */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detalhes da Denúncia</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                            <p className="text-lg">{typeLabels[complaint.type] || complaint.type}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                            <p className="text-sm">{complaint.description}</p>
                        </div>
                        {complaint.mediaUrls && complaint.mediaUrls.length > 0 && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground mb-2">Mídia</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {complaint.mediaUrls.map((url: string, i: number) => (
                                        <img
                                            key={i}
                                            src={url}
                                            alt={`Evidência ${i + 1}`}
                                            className="rounded-md object-cover w-full h-32"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Informações do Aluno */}
                <Card>
                    <CardHeader>
                        <CardTitle>Aluno Denunciante</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={complaint.student.user.image || ""} />
                                <AvatarFallback>
                                    {(complaint.student.user.name || "A").slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-medium">{complaint.student.user.name || "Sem nome"}</p>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {complaint.student.user.email}
                                </p>
                                {complaint.student.user.phone && (
                                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        {complaint.student.user.phone}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Informações Completas do Instrutor */}
            <Card>
                <CardHeader>
                    <CardTitle>Instrutor Denunciado - Análise Completa</CardTitle>
                    <CardDescription>Todos os dados relevantes para tomada de decisão</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Perfil */}
                    <div>
                        <h3 className="font-semibold mb-3">Perfil</h3>
                        <div className="flex items-start gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={complaint.instructor.user.image || ""} />
                                <AvatarFallback>
                                    {(complaint.instructor.user.name || "I").slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Nome</p>
                                    <p>{complaint.instructor.user.name || "Sem nome"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                                    <p className="text-sm">{complaint.instructor.user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Telefone</p>
                                    <p className="text-sm">{complaint.instructor.user.phone || "Não informado"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">CPF</p>
                                    <p className="text-sm">{complaint.instructor.cpf || "Não informado"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Credencial</p>
                                    <p className="text-sm">{complaint.instructor.credentialNumber || "Não informado"}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Preço/Hora</p>
                                    <p className="text-sm">R$ {Number(complaint.instructor.basePrice || 0).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Avaliações */}
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            Avaliações ({complaint.instructor.averageRating.toFixed(1)} ⭐)
                        </h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {complaint.instructor.ratings && complaint.instructor.ratings.length > 0 ? (
                                complaint.instructor.ratings.map((rating: any, i: number) => (
                                    <div key={i} className="border rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            {Array.from({ length: 5 }).map((_, j) => (
                                                <Star
                                                    key={j}
                                                    className={`h-3 w-3 ${j < rating.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(rating.createdAt).toLocaleDateString("pt-BR")}
                                            </span>
                                        </div>
                                        {rating.comment && <p className="text-sm">{rating.comment}</p>}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">Sem avaliações</p>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Histórico de Aulas */}
                    <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Histórico de Aulas ({complaint.instructor.totalLessons} total)
                        </h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {complaint.instructor.lessons && complaint.instructor.lessons.length > 0 ? (
                                complaint.instructor.lessons.map((lesson: any) => (
                                    <div key={lesson.id} className="border rounded-lg p-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium">
                                                {lesson.student.user.name || "Aluno"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(lesson.scheduledAt).toLocaleDateString("pt-BR")}
                                            </p>
                                        </div>
                                        <Badge variant="outline">{lesson.status}</Badge>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">Sem aulas registradas</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Ações do Admin */}
            <Card>
                <CardHeader>
                    <CardTitle>Ações do Administrador</CardTitle>
                    <CardDescription>Atualize o status da denúncia e adicione uma resolução</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">Novo Status</label>
                            <Select value={newStatus} onValueChange={setNewStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PENDING">Pendente</SelectItem>
                                    <SelectItem value="UNDER_REVIEW">Em Análise</SelectItem>
                                    <SelectItem value="RESOLVED">Resolvida</SelectItem>
                                    <SelectItem value="DISMISSED">Arquivada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Resolução / Comentário</label>
                        <Textarea
                            placeholder="Descreva a ação tomada ou motivo do arquivamento..."
                            value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <Button onClick={handleUpdateStatus} disabled={!newStatus || updateStatus.isPending}>
                        {updateStatus.isPending ? "Salvando..." : "Atualizar Status"}
                    </Button>
                    {complaint.resolution && (
                        <div className="mt-4 p-4 bg-muted rounded-lg">
                            <p className="text-sm font-medium mb-1">Resolução Anterior:</p>
                            <p className="text-sm">{complaint.resolution}</p>
                            {complaint.resolvedAt && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    Resolvido em {new Date(complaint.resolvedAt).toLocaleDateString("pt-BR")}
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
