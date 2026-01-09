"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileCheck, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DocumentosPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [cnhFront, setCnhFront] = useState<string | null>(null);
    const [cnhBack, setCnhBack] = useState<string | null>(null);
    const [certificate, setCertificate] = useState<string | null>(null);
    const [confirmedAutonomous, setConfirmedAutonomous] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const uploadMutation = trpc.instructorDocuments.uploadDocuments.useMutation({
        onSuccess: () => {
            toast({
                title: "Documentos enviados!",
                description: "Seus documentos estão sendo analisados. Você receberá uma notificação em breve.",
            });
            router.push("/instrutor/aguardando-aprovacao");
        },
        onError: (error) => {
            toast({
                title: "Erro ao enviar documentos",
                description: error.message,
                variant: "destructive",
            });
            setIsUploading(false);
        },
    });

    const handleFileUpload = async (
        file: File,
        setter: (url: string) => void
    ) => {
        // Validar tamanho (máx 10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast({
                title: "Arquivo muito grande",
                description: "O arquivo deve ter no máximo 10MB",
                variant: "destructive",
            });
            return;
        }

        // Validar tipo
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
        if (!validTypes.includes(file.type)) {
            toast({
                title: "Tipo de arquivo inválido",
                description: "Apenas JPG, PNG ou PDF são permitidos",
                variant: "destructive",
            });
            return;
        }

        // TODO: Upload para Supabase Storage
        // Por enquanto, vamos usar uma URL de exemplo
        const mockUrl = `https://storage.supabase.co/documents/${file.name}`;
        setter(mockUrl);

        toast({
            title: "Arquivo carregado",
            description: file.name,
        });
    };

    const handleSubmit = async () => {
        if (!cnhFront || !cnhBack || !certificate) {
            toast({
                title: "Documentos incompletos",
                description: "Por favor, envie todos os documentos obrigatórios",
                variant: "destructive",
            });
            return;
        }

        if (!confirmedAutonomous) {
            toast({
                title: "Confirmação necessária",
                description: "Você deve confirmar que é instrutor autônomo",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);

        uploadMutation.mutate({
            cnhFrontUrl: cnhFront,
            cnhBackUrl: cnhBack,
            certificateUrl: certificate,
            confirmedAutonomous,
        });
    };

    return (
        <div className="container max-w-4xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Envio de Documentos</h1>
                <p className="text-muted-foreground">
                    Envie seus documentos para aprovação. Todos os campos são obrigatórios.
                </p>
            </div>

            <Alert className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    <strong>Importante:</strong> Certifique-se de que todos os documentos estão legíveis e dentro da validade.
                    Arquivos em PDF ou imagem (JPG/PNG), máximo 10MB cada.
                </AlertDescription>
            </Alert>

            <div className="space-y-6">
                {/* CNH Frente */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            CNH - Frente
                        </CardTitle>
                        <CardDescription>
                            Foto ou scan da frente da sua CNH
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,application/pdf"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(file, setCnhFront);
                                }}
                                className="flex-1"
                                id="cnh-front"
                            />
                            {cnhFront && (
                                <FileCheck className="h-5 w-5 text-green-600" />
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* CNH Verso */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            CNH - Verso
                        </CardTitle>
                        <CardDescription>
                            Foto ou scan do verso da sua CNH
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,application/pdf"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(file, setCnhBack);
                                }}
                                className="flex-1"
                                id="cnh-back"
                            />
                            {cnhBack && (
                                <FileCheck className="h-5 w-5 text-green-600" />
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Certificado */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5" />
                            Certificado CNH Brasil
                        </CardTitle>
                        <CardDescription>
                            Certificado de instrutor de trânsito emitido pela CNH Brasil
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,application/pdf"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleFileUpload(file, setCertificate);
                                }}
                                className="flex-1"
                                id="certificate"
                            />
                            {certificate && (
                                <FileCheck className="h-5 w-5 text-green-600" />
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Confirmação */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start space-x-3">
                            <Checkbox
                                id="confirm"
                                checked={confirmedAutonomous}
                                onCheckedChange={(checked) => setConfirmedAutonomous(checked as boolean)}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <Label
                                    htmlFor="confirm"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Confirmo que sou instrutor autônomo
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    Declaro que possuo habilitação e certificação válidas para atuar como instrutor de trânsito autônomo.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Botão de Envio */}
                <div className="flex justify-end gap-4">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isUploading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isUploading || !cnhFront || !cnhBack || !certificate || !confirmedAutonomous}
                        className="min-w-[150px]"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            "Enviar Documentos"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
