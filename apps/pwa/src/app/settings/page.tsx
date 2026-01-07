'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AppNavbar from "@/components/Navbar";
import { api } from "@/utils/api";
import { Loader2, Upload, Eye, EyeOff } from "lucide-react";

export default function SettingsPage() {
    const { data: session, status, update: updateSession } = useSession();
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Estados do formulário - Perfil
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [basePrice, setBasePrice] = useState("");
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileSuccess, setProfileSuccess] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Estados do formulário - Senha
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    // Estados do formulário - Notificações
    const [lessonAlerts, setLessonAlerts] = useState(true);
    const [marketing, setMarketing] = useState(false);
    const [isSavingNotifications, setIsSavingNotifications] = useState(false);
    const [notificationsSuccess, setNotificationsSuccess] = useState(false);

    // Buscar dados do instrutor
    const { data: instructor, isLoading: loadingInstructor } = api.instructor.getStatus.useQuery(undefined, {
        enabled: !!session && session.user.role === 'INSTRUCTOR',
    });

    // Buscar preferências de notificação
    const { data: notificationPrefs } = api.user.getNotificationPreferences.useQuery(undefined, {
        enabled: !!session,
    });

    // Mutations
    const updateProfile = api.instructor.updateProfile.useMutation({
        onSuccess: async () => {
            setProfileSuccess(true);
            setTimeout(() => setProfileSuccess(false), 3000);
            // Atualizar sessão se o nome mudou
            if (name !== session?.user?.name) {
                await updateSession();
            }
        },
    });

    const updateProfileImage = api.user.updateProfileImage.useMutation({
        onSuccess: async () => {
            await updateSession();
        },
    });

    const updatePassword = api.user.updatePassword.useMutation({
        onSuccess: () => {
            setPasswordSuccess(true);
            setPasswordError("");
            setCurrentPassword("");
            setNewPassword("");
            setTimeout(() => setPasswordSuccess(false), 3000);
        },
        onError: (error) => {
            setPasswordError(error.message);
        },
    });

    const updateNotifications = api.user.updateNotificationPreferences.useMutation({
        onSuccess: () => {
            setNotificationsSuccess(true);
            setTimeout(() => setNotificationsSuccess(false), 3000);
        },
    });

    // Preencher formulário quando dados carregarem
    useEffect(() => {
        if (instructor) {
            setName(session?.user?.name || "");
            setBio(instructor.bio || "");
            setBasePrice(instructor.basePrice?.toString() || "0");
        } else if (session?.user) {
            setName(session.user.name || "");
        }
    }, [instructor, session]);

    useEffect(() => {
        if (notificationPrefs) {
            setLessonAlerts(notificationPrefs.lessonAlerts);
            setMarketing(notificationPrefs.marketing);
        }
    }, [notificationPrefs]);

    if (status === "loading" || loadingInstructor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    if (status === "unauthenticated") {
        router.push("/api/auth/signin");
        return null;
    }

    const handleSaveProfile = async () => {
        setIsSavingProfile(true);
        try {
            await updateProfile.mutateAsync({
                name: name || undefined,
                bio: bio || undefined,
                basePrice: basePrice ? parseFloat(basePrice) : undefined,
            });
        } catch (error) {
            console.error("Erro ao salvar:", error);
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingImage(true);
        try {
            // Upload da imagem
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erro ao fazer upload");
            }

            const data = await response.json();

            // Atualizar no banco
            await updateProfileImage.mutateAsync({
                imageUrl: data.url,
            });
        } catch (error) {
            console.error("Erro no upload:", error);
            alert("Erro ao fazer upload da imagem");
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleSavePassword = async () => {
        if (!currentPassword || !newPassword) {
            setPasswordError("Preencha todos os campos");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("A nova senha deve ter pelo menos 6 caracteres");
            return;
        }

        setIsSavingPassword(true);
        setPasswordError("");
        try {
            await updatePassword.mutateAsync({
                currentPassword,
                newPassword,
            });
        } finally {
            setIsSavingPassword(false);
        }
    };

    const handleSaveNotifications = async () => {
        setIsSavingNotifications(true);
        try {
            await updateNotifications.mutateAsync({
                lessonAlerts,
                marketing,
            });
        } finally {
            setIsSavingNotifications(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Tem certeza absoluta que deseja excluir sua conta? Esta ação é irreversível e apagará todos os seus dados.")) {
            return;
        }

        try {
            const res = await fetch('/api/auth/delete-account', { method: 'DELETE' });
            if (!res.ok) throw new Error('Falha ao excluir conta');
            alert('Conta excluída com sucesso.');
            window.location.href = '/';
        } catch (error) {
            alert('Erro ao excluir conta.');
        }
    };

    const isInstructor = session?.user?.role === 'INSTRUCTOR';

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />

            <div className="max-w-4xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold mb-6">Configurações</h1>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="profile">Perfil</TabsTrigger>
                        <TabsTrigger value="account">Conta</TabsTrigger>
                        <TabsTrigger value="notifications">Notificações</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Perfil</CardTitle>
                                <CardDescription>
                                    Gerencie suas informações públicas.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-20 h-20">
                                        <AvatarImage src={session?.user?.image || ""} />
                                        <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                        <Button
                                            variant="outline"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isUploadingImage}
                                        >
                                            {isUploadingImage ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Enviando...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="w-4 h-4 mr-2" />
                                                    Alterar Foto
                                                </>
                                            )}
                                        </Button>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            JPG, PNG ou WEBP (máx 5MB)
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome Completo</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                {isInstructor && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Biografia</Label>
                                            <Textarea
                                                id="bio"
                                                placeholder="Conte um pouco sobre você..."
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                rows={4}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="basePrice">Preço por Hora (R$)</Label>
                                            <Input
                                                id="basePrice"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={basePrice}
                                                onChange={(e) => setBasePrice(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={isSavingProfile}
                                >
                                    {isSavingProfile && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Salvar Alterações
                                </Button>
                                {profileSuccess && (
                                    <span className="text-sm text-green-600">
                                        ✓ Salvo com sucesso!
                                    </span>
                                )}
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Conta</CardTitle>
                                <CardDescription>
                                    Gerencie suas credenciais e segurança.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" defaultValue={session?.user?.email || ""} disabled />
                                </div>

                                <div className="border-t pt-4 space-y-4">
                                    <h3 className="font-semibold">Alterar Senha</h3>

                                    {passwordError && (
                                        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                                            {passwordError}
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label htmlFor="current-password">Senha Atual</Label>
                                        <div className="relative">
                                            <Input
                                                id="current-password"
                                                type={showCurrentPassword ? "text" : "password"}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            >
                                                {showCurrentPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">Nova Senha</Label>
                                        <div className="relative">
                                            <Input
                                                id="new-password"
                                                type={showNewPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                            >
                                                {showNewPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Mínimo 6 caracteres
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleSavePassword}
                                            disabled={isSavingPassword}
                                        >
                                            {isSavingPassword && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                            Atualizar Senha
                                        </Button>
                                        {passwordSuccess && (
                                            <span className="text-sm text-green-600 flex items-center">
                                                ✓ Senha atualizada!
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-8 border-destructive/50 bg-destructive/5">
                            <CardHeader>
                                <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                                <CardDescription className="text-destructive/80">
                                    Ações irreversíveis para sua conta.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Ao excluir sua conta, todos os seus dados pessoais, histórico de aulas e configurações serão apagados permanentemente.
                                </p>
                                <Button variant="destructive" onClick={handleDeleteAccount}>
                                    Excluir Minha Conta
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notificações</CardTitle>
                                <CardDescription>
                                    Escolha como você quer ser notificado.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Alertas de Aula</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receba notificações sobre suas próximas aulas.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={lessonAlerts}
                                        onCheckedChange={setLessonAlerts}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Marketing</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Receba novidades e promoções.
                                        </p>
                                    </div>
                                    <Switch
                                        checked={marketing}
                                        onCheckedChange={setMarketing}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex gap-2">
                                <Button
                                    onClick={handleSaveNotifications}
                                    disabled={isSavingNotifications}
                                >
                                    {isSavingNotifications && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Salvar Preferências
                                </Button>
                                {notificationsSuccess && (
                                    <span className="text-sm text-green-600">
                                        ✓ Preferências salvas!
                                    </span>
                                )}
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
