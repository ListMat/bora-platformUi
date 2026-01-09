"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    User,
    Mail,
    Phone,
    MapPin,
    Star,
    Car,
    Loader2,
    ExternalLink,
} from "lucide-react";

export default function AprovacaoDetalhesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { toast } = useToast();

    const [analysisNote, setAnalysisNote] = useState("");
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [showMoreDocsDialog, setShowMoreDocsDialog] = useState(false);

    // Buscar dados do instrutor
    const { data: documents } = trpc.instructorDocuments.getPendingApprovals.useQuery({
        limit: 1000,
    });

    const document = documents?.documents.find(d => d.instructorId === id);
    const instructor = document?.instructor;

    // Mutations
    const approveMutation = trpc.instructorDocuments.approveInstructor.useMutation({
        onSuccess: () => {
            toast({
                title: "Instrutor aprovado!",
                description: "O instrutor foi aprovado e pode começar a dar aulas.",
            });
            router.push("/aprovacoes");
        },
        onError: (error) => {
            toast({
                title: "Erro ao aprovar",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const rejectMutation = trpc.instructorDocuments.rejectInstructor.useMutation({
        onSuccess: () => {
            toast({
                title: "Instrutor rejeitado",
                description: "O instrutor foi notificado sobre a rejeição.",
            });
            router.push("/aprovacoes");
        },
        onError: (error) => {
            toast({
                title: "Erro ao rejeitar",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const requestMoreDocsMutation = trpc.instructorDocuments.requestMoreDocuments.useMutation({
        onSuccess: () => {
            toast({
                title: "Solicitação enviada",
                description: "O instrutor foi notificado para enviar mais documentos.",
            });
            router.push("/aprovacoes");
        },
        onError: (error) => {
            toast({
                title: "Erro ao solicitar",
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleApprove = () => {
        approveMutation.mutate({
            instructorId: id,
            analysisNote: analysisNote || undefined,
        });
    };

    const handleReject = () => {
        if (!analysisNote || analysisNote.length < 10) {
            toast({
                title: "Nota de análise obrigatória",
                description: "Por favor, forneça uma explicação detalhada (mínimo 10 caracteres)",
                variant: "destructive",
            });
            return;
        }
        rejectMutation.mutate({
            instructorId: id,
            analysisNote,
        });
    };

    const handleRequestMoreDocs = () => {
        if (!analysisNote || analysisNote.length < 10) {
            toast({
                title: "Nota de análise obrigatória",
                description: "Por favor, especifique quais documentos são necessários (mínimo 10 caracteres)",
                variant: "destructive",
            });
            return;
        }
        requestMoreDocsMutation.mutate({
            instructorId: id,
            analysisNote,
        });
    };

    if (!document || !instructor) {
        return (
            <div className="container mx-auto py-16 px-4">
                <Card>
                    <CardContent className="py-12 text-center">
                        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Carregando...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    ← Voltar
                </Button>
                <h1 className="text-3xl font-bold mb-2">Análise de Instrutor</h1>
                <p className="text-muted-foreground">
                    Revise os documentos e informações do instrutor
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Informações do Instrutor */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Informações Pessoais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Nome</Label>
                                    <p className="font-medium">{instructor.user.name || "N/A"}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">CPF</Label>
                                    <p className="font-medium">{instructor.cpf || "N/A"}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Email</Label>
                                    <p className="font-medium flex items-center gap-2">
                                        <Mail className="h-4 w-4" />
                                        {instructor.user.email}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Telefone</Label>
                                    <p className="font-medium flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {instructor.user.phone || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Cidade</Label>
                                    <p className="font-medium flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        {instructor.city || "N/A"}, {instructor.state || "N/A"}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">CNH</Label>
                                    <p className="font-medium">{instructor.cnhNumber || "N/A"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Documentos */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Documentos Enviados
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* CNH Frente */}
                            <div>
                                <Label>CNH - Frente</Label>
                                <a
                                    href={document.cnhFrontUrl || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary hover:underline"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Visualizar documento
                                </a>
                            </div>

                            {/* CNH Verso */}
                            <div>
                                <Label>CNH - Verso</Label>
                                <a
                                    href={document.cnhBackUrl || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary hover:underline"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Visualizar documento
                                </a>
                            </div>

                            {/* Certificado */}
                            <div>
                                <Label>Certificado CNH Brasil</Label>
                                <a
                                    href={document.certificateUrl || "#"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-primary hover:underline"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Visualizar documento
                                </a>
                            </div>

                            {/* Confirmação */}
                            <div className="pt-4 border-t">
                                <Label>Confirmação de Instrutor Autônomo</Label>
                                <p className="text-sm text-muted-foreground">
                                    {document.confirmedAutonomous ? "✅ Confirmado" : "❌ Não confirmado"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Histórico */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Star className="h-5 w-5" />
                                Histórico
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
                                        {instructor.averageRating > 0 ? instructor.averageRating.toFixed(1) : "N/A"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Avaliação</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{instructor.ratings?.length || 0}</p>
                                    <p className="text-sm text-muted-foreground">Reviews</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Coluna Lateral - Ações */}
                <div className="space-y-6">
                    {/* Status Atual */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status Atual</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge className="w-full justify-center py-2">
                                {document.status}
                            </Badge>
                            {document.submittedAt && (
                                <p className="text-sm text-muted-foreground mt-4">
                                    Enviado em: {new Date(document.submittedAt).toLocaleDateString("pt-BR")}
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Análise */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Análise</CardTitle>
                            <CardDescription>
                                Adicione observações sobre a aprovação (opcional para aprovar, obrigatório para rejeitar)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Ex: Documentos válidos e dentro da validade..."
                                value={analysisNote}
                                onChange={(e) => setAnalysisNote(e.target.value)}
                                rows={6}
                            />
                            <p className="text-sm text-muted-foreground mt-2">
                                {analysisNote.length} caracteres
                            </p>
                        </CardContent>
                    </Card>

                    {/* Botões de Ação */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                onClick={() => setShowApproveDialog(true)}
                                className="w-full"
                                variant="default"
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Aprovar Instrutor
                            </Button>

                            <Button
                                onClick={() => setShowRejectDialog(true)}
                                className="w-full"
                                variant="destructive"
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Rejeitar Instrutor
                            </Button>

                            <Button
                                onClick={() => setShowMoreDocsDialog(true)}
                                className="w-full"
                                variant="outline"
                            >
                                <AlertCircle className="mr-2 h-4 w-4" />
                                Solicitar Mais Documentos
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Dialogs de Confirmação */}
            <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Aprovar Instrutor</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja aprovar este instrutor? Ele poderá começar a dar aulas imediatamente.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                            Cancelar
                        </Button>
                        <Button onClick={handleApprove} disabled={approveMutation.isLoading}>
                            {approveMutation.isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Aprovando...
                                </>
                            ) : (
                                "Confirmar Aprovação"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rejeitar Instrutor</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja rejeitar este instrutor? Uma nota de análise é obrigatória.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={rejectMutation.isLoading || analysisNote.length < 10}
                        >
                            {rejectMutation.isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Rejeitando...
                                </>
                            ) : (
                                "Confirmar Rejeição"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showMoreDocsDialog} onOpenChange={setShowMoreDocsDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Solicitar Mais Documentos</DialogTitle>
                        <DialogDescription>
                            Especifique quais documentos adicionais são necessários na nota de análise.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowMoreDocsDialog(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleRequestMoreDocs}
                            disabled={requestMoreDocsMutation.isLoading || analysisNote.length < 10}
                        >
                            {requestMoreDocsMutation.isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                "Enviar Solicitação"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
