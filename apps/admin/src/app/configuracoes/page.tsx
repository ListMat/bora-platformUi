"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
    Settings,
    Bell,
    Shield,
    Mail,
    Database,
    Palette,
    Save,
    Loader2,
} from "lucide-react";

export default function ConfiguracoesPage() {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);

    // Estados para as configurações
    const [generalSettings, setGeneralSettings] = useState({
        siteName: "Bora Platform",
        siteDescription: "Plataforma de aulas de direção",
        supportEmail: "suporte@bora.com",
        supportPhone: "(31) 99999-9999",
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        notifyNewInstructor: true,
        notifyNewStudent: true,
        notifyNewLesson: true,
        notifyPayment: true,
    });

    const [securitySettings, setSecuritySettings] = useState({
        requireEmailVerification: true,
        require2FA: false,
        sessionTimeout: "30",
        maxLoginAttempts: "5",
    });

    const [emailSettings, setEmailSettings] = useState({
        smtpHost: "smtp.gmail.com",
        smtpPort: "587",
        smtpUser: "noreply@bora.com",
        smtpPassword: "••••••••",
        fromEmail: "noreply@bora.com",
        fromName: "Bora Platform",
    });

    const handleSaveGeneral = async () => {
        setIsSaving(true);
        // Simular salvamento
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast({
            title: "Configurações salvas",
            description: "As configurações gerais foram atualizadas com sucesso.",
        });
        setIsSaving(false);
    };

    const handleSaveNotifications = async () => {
        setIsSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast({
            title: "Configurações salvas",
            description: "As configurações de notificações foram atualizadas com sucesso.",
        });
        setIsSaving(false);
    };

    const handleSaveSecurity = async () => {
        setIsSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast({
            title: "Configurações salvas",
            description: "As configurações de segurança foram atualizadas com sucesso.",
        });
        setIsSaving(false);
    };

    const handleSaveEmail = async () => {
        setIsSaving(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast({
            title: "Configurações salvas",
            description: "As configurações de e-mail foram atualizadas com sucesso.",
        });
        setIsSaving(false);
    };

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    <Settings className="h-8 w-8" />
                    Configurações
                </h1>
                <p className="text-muted-foreground">
                    Gerencie as configurações da plataforma
                </p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="general">
                        <Settings className="h-4 w-4 mr-2" />
                        Geral
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="h-4 w-4 mr-2" />
                        Notificações
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        <Shield className="h-4 w-4 mr-2" />
                        Segurança
                    </TabsTrigger>
                    <TabsTrigger value="email">
                        <Mail className="h-4 w-4 mr-2" />
                        E-mail
                    </TabsTrigger>
                    <TabsTrigger value="appearance">
                        <Palette className="h-4 w-4 mr-2" />
                        Aparência
                    </TabsTrigger>
                </TabsList>

                {/* Geral */}
                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações Gerais</CardTitle>
                            <CardDescription>
                                Configure as informações básicas da plataforma
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Nome do Site</Label>
                                <Input
                                    id="siteName"
                                    value={generalSettings.siteName}
                                    onChange={(e) =>
                                        setGeneralSettings({ ...generalSettings, siteName: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="siteDescription">Descrição</Label>
                                <Textarea
                                    id="siteDescription"
                                    value={generalSettings.siteDescription}
                                    onChange={(e) =>
                                        setGeneralSettings({
                                            ...generalSettings,
                                            siteDescription: e.target.value,
                                        })
                                    }
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="supportEmail">E-mail de Suporte</Label>
                                    <Input
                                        id="supportEmail"
                                        type="email"
                                        value={generalSettings.supportEmail}
                                        onChange={(e) =>
                                            setGeneralSettings({
                                                ...generalSettings,
                                                supportEmail: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="supportPhone">Telefone de Suporte</Label>
                                    <Input
                                        id="supportPhone"
                                        value={generalSettings.supportPhone}
                                        onChange={(e) =>
                                            setGeneralSettings({
                                                ...generalSettings,
                                                supportPhone: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <Button onClick={handleSaveGeneral} disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Salvar Alterações
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notificações */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações de Notificações</CardTitle>
                            <CardDescription>
                                Configure como e quando receber notificações
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold">Canais de Notificação</h3>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Notificações por E-mail</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receba notificações por e-mail
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notificationSettings.emailNotifications}
                                        onCheckedChange={(checked) =>
                                            setNotificationSettings({
                                                ...notificationSettings,
                                                emailNotifications: checked,
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Notificações Push</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receba notificações push no navegador
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notificationSettings.pushNotifications}
                                        onCheckedChange={(checked) =>
                                            setNotificationSettings({
                                                ...notificationSettings,
                                                pushNotifications: checked,
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Notificações por SMS</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receba notificações por SMS
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notificationSettings.smsNotifications}
                                        onCheckedChange={(checked) =>
                                            setNotificationSettings({
                                                ...notificationSettings,
                                                smsNotifications: checked,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold">Eventos</h3>
                                <div className="flex items-center justify-between">
                                    <Label>Novo Instrutor</Label>
                                    <Switch
                                        checked={notificationSettings.notifyNewInstructor}
                                        onCheckedChange={(checked) =>
                                            setNotificationSettings({
                                                ...notificationSettings,
                                                notifyNewInstructor: checked,
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label>Novo Aluno</Label>
                                    <Switch
                                        checked={notificationSettings.notifyNewStudent}
                                        onCheckedChange={(checked) =>
                                            setNotificationSettings({
                                                ...notificationSettings,
                                                notifyNewStudent: checked,
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label>Nova Aula</Label>
                                    <Switch
                                        checked={notificationSettings.notifyNewLesson}
                                        onCheckedChange={(checked) =>
                                            setNotificationSettings({
                                                ...notificationSettings,
                                                notifyNewLesson: checked,
                                            })
                                        }
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label>Novo Pagamento</Label>
                                    <Switch
                                        checked={notificationSettings.notifyPayment}
                                        onCheckedChange={(checked) =>
                                            setNotificationSettings({
                                                ...notificationSettings,
                                                notifyPayment: checked,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <Button onClick={handleSaveNotifications} disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Salvar Alterações
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Segurança */}
                <TabsContent value="security" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações de Segurança</CardTitle>
                            <CardDescription>
                                Configure as políticas de segurança da plataforma
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Verificação de E-mail Obrigatória</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Usuários devem verificar o e-mail para acessar
                                    </p>
                                </div>
                                <Switch
                                    checked={securitySettings.requireEmailVerification}
                                    onCheckedChange={(checked) =>
                                        setSecuritySettings({
                                            ...securitySettings,
                                            requireEmailVerification: checked,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>Autenticação de Dois Fatores</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Exigir 2FA para todos os administradores
                                    </p>
                                </div>
                                <Switch
                                    checked={securitySettings.require2FA}
                                    onCheckedChange={(checked) =>
                                        setSecuritySettings({
                                            ...securitySettings,
                                            require2FA: checked,
                                        })
                                    }
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sessionTimeout">Tempo de Sessão (minutos)</Label>
                                    <Input
                                        id="sessionTimeout"
                                        type="number"
                                        value={securitySettings.sessionTimeout}
                                        onChange={(e) =>
                                            setSecuritySettings({
                                                ...securitySettings,
                                                sessionTimeout: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxLoginAttempts">Máximo de Tentativas de Login</Label>
                                    <Input
                                        id="maxLoginAttempts"
                                        type="number"
                                        value={securitySettings.maxLoginAttempts}
                                        onChange={(e) =>
                                            setSecuritySettings({
                                                ...securitySettings,
                                                maxLoginAttempts: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <Button onClick={handleSaveSecurity} disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Salvar Alterações
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* E-mail */}
                <TabsContent value="email" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações de E-mail</CardTitle>
                            <CardDescription>
                                Configure o servidor SMTP para envio de e-mails
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="smtpHost">Servidor SMTP</Label>
                                    <Input
                                        id="smtpHost"
                                        value={emailSettings.smtpHost}
                                        onChange={(e) =>
                                            setEmailSettings({ ...emailSettings, smtpHost: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtpPort">Porta</Label>
                                    <Input
                                        id="smtpPort"
                                        value={emailSettings.smtpPort}
                                        onChange={(e) =>
                                            setEmailSettings({ ...emailSettings, smtpPort: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="smtpUser">Usuário SMTP</Label>
                                    <Input
                                        id="smtpUser"
                                        value={emailSettings.smtpUser}
                                        onChange={(e) =>
                                            setEmailSettings({ ...emailSettings, smtpUser: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="smtpPassword">Senha SMTP</Label>
                                    <Input
                                        id="smtpPassword"
                                        type="password"
                                        value={emailSettings.smtpPassword}
                                        onChange={(e) =>
                                            setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fromEmail">E-mail Remetente</Label>
                                    <Input
                                        id="fromEmail"
                                        type="email"
                                        value={emailSettings.fromEmail}
                                        onChange={(e) =>
                                            setEmailSettings({ ...emailSettings, fromEmail: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="fromName">Nome Remetente</Label>
                                    <Input
                                        id="fromName"
                                        value={emailSettings.fromName}
                                        onChange={(e) =>
                                            setEmailSettings({ ...emailSettings, fromName: e.target.value })
                                        }
                                    />
                                </div>
                            </div>
                            <Button onClick={handleSaveEmail} disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Salvar Alterações
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Aparência */}
                <TabsContent value="appearance" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configurações de Aparência</CardTitle>
                            <CardDescription>
                                Personalize a aparência da plataforma
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="theme">Tema</Label>
                                <Select defaultValue="light">
                                    <SelectTrigger id="theme">
                                        <SelectValue placeholder="Selecione um tema" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">Claro</SelectItem>
                                        <SelectItem value="dark">Escuro</SelectItem>
                                        <SelectItem value="system">Sistema</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="primaryColor">Cor Primária</Label>
                                <div className="flex gap-2">
                                    <Input id="primaryColor" type="color" defaultValue="#3b82f6" className="w-20" />
                                    <Input value="#3b82f6" readOnly />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="logo">Logo</Label>
                                <Input id="logo" type="file" accept="image/*" />
                                <p className="text-sm text-muted-foreground">
                                    Recomendado: PNG ou SVG, máximo 2MB
                                </p>
                            </div>
                            <Button disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Salvar Alterações
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
