"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppNavbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AlertCircle, CheckCircle2, Upload, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const complaintTypes = [
    { value: "INAPPROPRIATE_BEHAVIOR", label: "Comportamento Inadequado" },
    { value: "INADEQUATE_VEHICLE", label: "Veículo Inadequado" },
    { value: "HARASSMENT", label: "Assédio" },
    { value: "DANGEROUS_DRIVING", label: "Direção Perigosa" },
    { value: "OTHER", label: "Outro" },
];

type Instructor = {
    id: string;
    user: {
        name: string | null;
    };
};

export default function ComplaintPage() {
    const router = useRouter();
    const [instructors, setInstructors] = useState<Instructor[]>([]);
    const [loadingInstructors, setLoadingInstructors] = useState(true);
    const [instructorId, setInstructorId] = useState("");
    const [type, setType] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Buscar instrutores que o aluno já teve aula
    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                const response = await fetch("/api/trpc/lesson.getMyLessons");
                if (response.ok) {
                    const data = await response.json();
                    const lessons = data.result?.data?.json || data.result?.data || [];

                    // Extrair instrutores únicos
                    const uniqueInstructors = Array.from(
                        new Map(
                            lessons.map((lesson: any) => [
                                lesson.instructor.id,
                                lesson.instructor,
                            ])
                        ).values()
                    );

                    setInstructors(uniqueInstructors as Instructor[]);
                }
            } catch (err) {
                console.error("Erro ao buscar instrutores:", err);
            } finally {
                setLoadingInstructors(false);
            }
        };

        fetchInstructors();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (!instructorId || !type || !description) {
            setError("Preencha todos os campos obrigatórios");
            return;
        }

        if (description.length < 10) {
            setError("A descrição deve ter no mínimo 10 caracteres");
            return;
        }

        if (description.length > 500) {
            setError("A descrição deve ter no máximo 500 caracteres");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/trpc/complaint.create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    json: {
                        instructorId,
                        type,
                        description,
                    },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Erro ao enviar denúncia");
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/");
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao enviar denúncia");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />

            <main className="max-w-2xl mx-auto px-6 py-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Fazer Denúncia</CardTitle>
                        <CardDescription>
                            Relate problemas com instrutores. Todas as denúncias são analisadas pela equipe.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {success ? (
                            <Alert className="bg-green-50 border-green-200">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800">
                                    Denúncia enviada com sucesso! Você será redirecionado...
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="instructor">Instrutor *</Label>
                                    {loadingInstructors ? (
                                        <div className="flex items-center gap-2 p-3 border rounded-md">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span className="text-sm text-muted-foreground">
                                                Carregando instrutores...
                                            </span>
                                        </div>
                                    ) : instructors.length === 0 ? (
                                        <Alert>
                                            <AlertDescription>
                                                Você ainda não teve aulas com nenhum instrutor.
                                            </AlertDescription>
                                        </Alert>
                                    ) : (
                                        <Select value={instructorId} onValueChange={setInstructorId}>
                                            <SelectTrigger id="instructor">
                                                <SelectValue placeholder="Selecione o instrutor" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {instructors.map((instructor) => (
                                                    <SelectItem key={instructor.id} value={instructor.id}>
                                                        {instructor.user.name || "Instrutor sem nome"}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Selecione o instrutor que você teve aula
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Tipo de Denúncia *</Label>
                                    <Select value={type} onValueChange={setType}>
                                        <SelectTrigger id="type">
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {complaintTypes.map((ct) => (
                                                <SelectItem key={ct.value} value={ct.value}>
                                                    {ct.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Descrição *</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Descreva o que aconteceu..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={6}
                                        maxLength={500}
                                    />
                                    <p className="text-xs text-muted-foreground text-right">
                                        {description.length}/500 caracteres
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Fotos/Vídeos (Opcional)</Label>
                                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">
                                            Arraste arquivos ou clique para fazer upload
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Máximo 10 MB por arquivo
                                        </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Upload de mídia será implementado em breve
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.back()}
                                        className="flex-1"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || instructors.length === 0}
                                        className="flex-1"
                                    >
                                        {isSubmitting ? "Enviando..." : "Enviar Denúncia"}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>

                <div className="mt-6 p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2 text-sm">Informações Importantes</h3>
                    <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Todas as denúncias são analisadas pela equipe em até 48 horas</li>
                        <li>• Denúncias falsas podem resultar em suspensão da conta</li>
                        <li>• Você receberá uma notificação quando a denúncia for resolvida</li>
                        <li>• Em casos graves, entre em contato direto: suporte@bora.com</li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
