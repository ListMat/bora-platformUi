'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/chip";
import AppNavbar from '@/components/Navbar';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function StudentSignupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isLoadingCep, setIsLoadingCep] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        cep: '',
        city: '',
        state: '',
        lessonType: 'B',
    });

    const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const formattedValue = rawValue.replace(/\D/g, '').slice(0, 8);
        const maskedValue = formattedValue.replace(/^(\d{5})(\d)/, '$1-$2');

        setFormData(prev => ({ ...prev, cep: maskedValue }));

        if (formattedValue.length === 8) {
            setIsLoadingCep(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${formattedValue}/json/`);
                const data = await response.json();

                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        city: data.localidade,
                        state: data.uf,
                    }));
                }
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
            } finally {
                setIsLoadingCep(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('As senhas não coincidem');
            return;
        }

        setIsLoading(true);

        try {
            // 1. Criar conta via API direta
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'STUDENT',
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao criar conta');
            }

            // 2. Fazer login automático
            setIsLoggingIn(true);
            const loginResult = await signIn('credentials', {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (loginResult?.ok) {
                window.location.href = '/student/dashboard';
            } else {
                throw new Error('Conta criada, mas erro ao fazer login automático. Tente entrar manualmente.');
            }

        } catch (error: any) {
            alert(error.message);
            setIsLoading(false);
            setIsLoggingIn(false);
        }
    };

    const progress = (step / 2) * 100;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <AppNavbar />

            <div className="max-w-2xl mx-auto px-6 py-12">
                {/* Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium">
                            Passo {step} de 2
                        </span>
                        <Badge className="bg-green-100 text-green-700 border-0 hover:bg-green-200">
                            100% Gratuito
                        </Badge>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Card */}
                <Card className="shadow-lg">
                    <CardContent className="p-8">
                        {step === 1 && (
                            <div>
                                <h1 className="text-3xl font-bold mb-2">
                                    Crie sua Conta Gratuita
                                </h1>
                                <p className="text-muted-foreground mb-8">
                                    Encontre os melhores instrutores perto de você
                                </p>

                                <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nome Completo</Label>
                                        <Input
                                            id="name"
                                            placeholder="João Silva"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="joao@email.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Senha</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Mínimo 6 caracteres"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                placeholder="Repita sua senha"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Telefone/WhatsApp</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="(11) 99999-9999"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full font-semibold"
                                    >
                                        Continuar
                                    </Button>
                                </form>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <Button
                                    variant="ghost"
                                    onClick={() => setStep(1)}
                                    className="mb-6 pl-0 hover:pl-2 transition-all"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Voltar
                                </Button>

                                <h2 className="text-3xl font-bold mb-2">
                                    Quase lá!
                                </h2>
                                <p className="text-muted-foreground mb-8">
                                    Precisamos saber sua localização para encontrar instrutores próximos
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="cep">CEP</Label>
                                        <div className="relative">
                                            <Input
                                                id="cep"
                                                placeholder="00000-000"
                                                value={formData.cep}
                                                onChange={handleCepChange}
                                                required
                                            />
                                            {isLoadingCep && (
                                                <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">Cidade</Label>
                                            <Input
                                                id="city"
                                                placeholder="São Paulo"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Estado</Label>
                                            <Select
                                                value={formData.state}
                                                onValueChange={(value) => setFormData({ ...formData, state: value })}
                                                required
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="SP">São Paulo</SelectItem>
                                                    <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                                                    <SelectItem value="MG">Minas Gerais</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label className="block mb-3">
                                            Tipo de Habilitação
                                        </Label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {[
                                                { value: 'A', label: 'Moto', icon: '🏍️' },
                                                { value: 'B', label: 'Carro', icon: '🚗' },
                                                { value: 'AB', label: 'Ambos', icon: '🏍️🚗' },
                                            ].map((option) => (
                                                <div
                                                    key={option.value}
                                                    onClick={() => setFormData({ ...formData, lessonType: option.value })}
                                                    className={`
                                                        cursor-pointer border-2 rounded-xl p-4 text-center transition-all hover:scale-105
                                                        ${formData.lessonType === option.value
                                                            ? 'border-primary bg-primary/10'
                                                            : 'border-muted hover:border-primary/50'
                                                        }
                                                    `}
                                                >
                                                    <div className="text-3xl mb-2">{option.icon}</div>
                                                    <div className="text-sm font-semibold">{option.label}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full font-semibold"
                                        disabled={isLoading || isLoggingIn}
                                    >
                                        {(isLoading || isLoggingIn) && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        {isLoading ? 'Criando conta...' : isLoggingIn ? 'Entrando...' : 'Criar Conta e Buscar'}
                                    </Button>

                                    <p className="text-xs text-muted-foreground text-center">
                                        Ao criar uma conta, você concorda com nossos{' '}
                                        <a href="#" className="text-primary hover:underline">
                                            Termos de Uso
                                        </a>{' '}
                                        e{' '}
                                        <a href="#" className="text-primary hover:underline">
                                            Política de Privacidade
                                        </a>
                                    </p>
                                </form>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Benefits */}
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: '✅',
                            title: '100% Gratuito',
                            description: 'Sem mensalidades ou taxas ocultas',
                        },
                        {
                            icon: '🔒',
                            title: 'Seguro',
                            description: 'Instrutores verificados e avaliados',
                        },
                        {
                            icon: '⚡',
                            title: 'Rápido',
                            description: 'Encontre instrutores em minutos',
                        },
                    ].map((benefit) => (
                        <Card key={benefit.title} className="text-center">
                            <CardContent className="p-6">
                                <div className="text-4xl mb-2">{benefit.icon}</div>
                                <h3 className="font-semibold mb-1">{benefit.title}</h3>
                                <p className="text-sm text-muted-foreground">{benefit.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
