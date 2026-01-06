"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppNavbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DocumentosPage() {
    const router = useRouter();
    const [cnhFile, setCnhFile] = useState<File | null>(null);
    const [credentialFile, setCredentialFile] = useState<File | null>(null);
    const [confirmAutonomo, setConfirmAutonomo] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "cnh" | "credential") => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tamanho (máx 10 MB)
        if (file.size > 10 * 1024 * 1024) {
            setError("Arquivo muito grande. Máximo 10 MB.");
            return;
        }

        // Validar tipo
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
        if (!validTypes.includes(file.type)) {
            setError("Formato inválido. Use JPG, PNG ou PDF.");
            return;
        }

        setError("");
        if (type === "cnh") {
            setCnhFile(file);
        } else {
            setCredentialFile(file);
        }
    };

    const handleSubmit = async () => {
        if (!cnhFile) {
            setError("Envie o documento da CNH");
            return;
        }

        if (!confirmAutonomo) {
            setError("Confirme que você é instrutor autônomo");
            return;
        }

        setIsUploading(true);

        try {
            // TODO: Implementar upload real
            // const formData = new FormData();
            // formData.append("cnh", cnhFile);
            // if (credentialFile) formData.append("credential", credentialFile);

            // Simular upload
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Redirecionar para próxima etapa
            router.push("/instructor/onboarding/horarios");
        } catch (err) {
            setError("Erro ao enviar documentos. Tente novamente.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />

            <main className="max-w-2xl mx-auto px-6 py-8">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Etapa 1 de 3</span>
                        <span className="text-sm text-muted-foreground">Documentos</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-1/3 transition-all"></div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Envie seus documentos</CardTitle>
                        <CardDescription>
                            Precisamos validar sua CNH e credencial de instrutor para garantir a segurança dos alunos
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Upload CNH */}
                        <div className="space-y-2">
                            <Label htmlFor="cnh" className="text-base font-semibold">
                                CNH (Carteira Nacional de Habilitação) *
                            </Label>
                            <p className="text-sm text-muted-foreground mb-3">
                                Envie uma foto ou PDF da sua CNH válida
                            </p>
                            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                                <input
                                    id="cnh"
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                                    onChange={(e) => handleFileChange(e, "cnh")}
                                    className="hidden"
                                />
                                <label htmlFor="cnh" className="cursor-pointer">
                                    {cnhFile ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                                            <div className="text-left">
                                                <p className="font-medium">{cnhFile.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {(cnhFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                                            <p className="text-sm font-medium">
                                                Clique para fazer upload ou arraste o arquivo
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                JPG, PNG ou PDF (máx. 10 MB)
                                            </p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Upload Credencial (Opcional) */}
                        <div className="space-y-2">
                            <Label htmlFor="credential" className="text-base font-semibold">
                                Credencial de Instrutor (Opcional)
                            </Label>
                            <p className="text-sm text-muted-foreground mb-3">
                                Se você possui credencial de instrutor, envie aqui para aprovação mais rápida
                            </p>
                            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                                <input
                                    id="credential"
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,application/pdf"
                                    onChange={(e) => handleFileChange(e, "credential")}
                                    className="hidden"
                                />
                                <label htmlFor="credential" className="cursor-pointer">
                                    {credentialFile ? (
                                        <div className="flex items-center justify-center gap-3">
                                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                                            <div className="text-left">
                                                <p className="font-medium">{credentialFile.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {(credentialFile.size / 1024 / 1024).toFixed(2)} MB
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                                            <p className="text-sm font-medium">
                                                Clique para fazer upload ou arraste o arquivo
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                JPG, PNG ou PDF (máx. 10 MB)
                                            </p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Checkbox Confirmação */}
                        <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
                            <Checkbox
                                id="autonomo"
                                checked={confirmAutonomo}
                                onCheckedChange={(checked) => setConfirmAutonomo(checked as boolean)}
                            />
                            <div className="space-y-1">
                                <Label
                                    htmlFor="autonomo"
                                    className="text-sm font-medium leading-none cursor-pointer"
                                >
                                    Confirmo que sou instrutor autônomo *
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    Declaro que possuo CNH válida e estou apto a ministrar aulas de direção
                                </p>
                            </div>
                        </div>

                        {/* Informações */}
                        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <h4 className="font-semibold text-sm mb-2">📋 O que acontece depois?</h4>
                            <ul className="text-xs text-muted-foreground space-y-1">
                                <li>• Seus documentos serão analisados em até 24 horas</li>
                                <li>• Você receberá um email quando a análise for concluída</li>
                                <li>• Após aprovação, você poderá começar a receber alunos</li>
                            </ul>
                        </div>

                        {/* Botões */}
                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex-1"
                            >
                                Voltar
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!cnhFile || !confirmAutonomo || isUploading}
                                className="flex-1"
                            >
                                {isUploading ? "Enviando..." : "Continuar"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
