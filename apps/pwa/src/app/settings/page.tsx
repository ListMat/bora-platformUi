'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AppNavbar from "@/components/Navbar";

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
    }

    if (status === "unauthenticated") {
        router.push("/api/auth/signin");
        return null;
    }

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
                                    <Button variant="outline">Alterar Foto</Button>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome Completo</Label>
                                    <Input id="name" defaultValue={session?.user?.name || ""} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Biografia</Label>
                                    <Input id="bio" placeholder="Conte um pouco sobre você..." />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Salvar Alterações</Button>
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
                                <div className="space-y-2">
                                    <Label htmlFor="current-password">Senha Atual</Label>
                                    <Input id="current-password" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="new-password">Nova Senha</Label>
                                    <Input id="new-password" type="password" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Atualizar Senha</Button>
                            </CardFooter>
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
                                        <p className="text-sm text-muted-foreground">Receba notificações sobre suas próximas aulas.</p>
                                    </div>
                                    <Switch />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Marketing</Label>
                                        <p className="text-sm text-muted-foreground">Receba novidades e promoções.</p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline">Salvar Preferências</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
