'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell, Shield, Database, Save } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simular salvamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);

        toast({
            title: "Configurações salvas",
            description: "As alterações foram salvas com sucesso.",
        });
    };

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
                    <p className="text-muted-foreground">
                        Gerencie as configurações do sistema
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Configurações Gerais */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Settings className="h-5 w-5 text-primary" />
                            <CardTitle>Configurações Gerais</CardTitle>
                        </div>
                        <CardDescription>
                            Configurações básicas da plataforma
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="platform-name">Nome da Plataforma</Label>
                            <Input id="platform-name" defaultValue="Bora" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="support-email">Email de Suporte</Label>
                            <Input id="support-email" type="email" defaultValue="suporte@bora.com" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="commission">Taxa de Comissão (%)</Label>
                            <Input id="commission" type="number" defaultValue="15" min="0" max="100" />
                            <p className="text-xs text-muted-foreground">
                                Percentual cobrado sobre cada aula
                            </p>
                        </div>
                        <Separator />
                        <Button className="w-full" onClick={handleSave} disabled={isSaving}>
                            <Save className="mr-2 h-4 w-4" />
                            {isSaving ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Notificações */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Bell className="h-5 w-5 text-primary" />
                            <CardTitle>Notificações</CardTitle>
                        </div>
                        <CardDescription>
                            Configure as notificações do sistema
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Notificações por Email</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receber alertas por email
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Alertas de Emergência</Label>
                                <p className="text-sm text-muted-foreground">
                                    Notificar sobre SOS imediatamente
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Relatórios Diários</Label>
                                <p className="text-sm text-muted-foreground">
                                    Resumo diário por email às 9h
                                </p>
                            </div>
                            <Switch />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Notificações Push</Label>
                                <p className="text-sm text-muted-foreground">
                                    Alertas no navegador
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                {/* Segurança */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <CardTitle>Segurança</CardTitle>
                        </div>
                        <CardDescription>
                            Configurações de segurança e privacidade
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Autenticação de Dois Fatores</Label>
                                <p className="text-sm text-muted-foreground">
                                    Requer 2FA para login (em breve)
                                </p>
                            </div>
                            <Switch disabled />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Logs de Auditoria</Label>
                                <p className="text-sm text-muted-foreground">
                                    Registrar todas as ações dos admins
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label htmlFor="session-timeout">Timeout de Sessão (minutos)</Label>
                            <Input id="session-timeout" type="number" defaultValue="60" min="5" max="1440" />
                            <p className="text-xs text-muted-foreground">
                                Tempo de inatividade antes do logout automático
                            </p>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Forçar HTTPS</Label>
                                <p className="text-sm text-muted-foreground">
                                    Redirecionar HTTP para HTTPS
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                {/* Banco de Dados */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Database className="h-5 w-5 text-primary" />
                            <CardTitle>Banco de Dados</CardTitle>
                        </div>
                        <CardDescription>
                            Manutenção e backup do banco de dados
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Último Backup</Label>
                            <p className="text-sm text-muted-foreground">
                                {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <Separator />
                        <Button variant="outline" className="w-full" disabled>
                            <Database className="mr-2 h-4 w-4" />
                            Criar Backup Agora
                        </Button>
                        <Button variant="outline" className="w-full" disabled>
                            <Database className="mr-2 h-4 w-4" />
                            Restaurar Backup
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                            Funcionalidade em desenvolvimento
                        </p>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Backup Automático</Label>
                                <p className="text-sm text-muted-foreground">
                                    Backup diário às 3h da manhã
                                </p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label>Estatísticas do Banco</Label>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="p-2 bg-muted rounded">
                                    <p className="text-muted-foreground">Usuários</p>
                                    <p className="font-semibold">-</p>
                                </div>
                                <div className="p-2 bg-muted rounded">
                                    <p className="text-muted-foreground">Aulas</p>
                                    <p className="font-semibold">-</p>
                                </div>
                                <div className="p-2 bg-muted rounded">
                                    <p className="text-muted-foreground">Pagamentos</p>
                                    <p className="font-semibold">-</p>
                                </div>
                                <div className="p-2 bg-muted rounded">
                                    <p className="text-muted-foreground">Tamanho</p>
                                    <p className="font-semibold">- MB</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
