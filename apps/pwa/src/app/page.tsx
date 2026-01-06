'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from 'lucide-react';
import InstallPrompt from '@/components/InstallPrompt';
import OfflineIndicator from '@/components/OfflineIndicator';
import AppNavbar from '@/components/Navbar';

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <InstallPrompt />
      <OfflineIndicator />

      <div className="min-h-screen bg-background text-foreground">
        <AppNavbar />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-24 md:py-32">
          <div className="w-full max-w-screen-xl mx-auto px-6 lg:px-20">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-0 hover:bg-primary/20 leading-6 px-3 py-1">
                🚀 Plataforma #1 de Aulas de Direção
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Encontre o instrutor perfeito <br /> para sua habilitação
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Compare preços, avaliações e agende suas aulas práticas de direção com os melhores profissionais da sua região.
              </p>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto mb-8 relative z-10">
                <form onSubmit={handleSearch} className="bg-background/80 backdrop-blur-md p-2 rounded-2xl shadow-xl border border-border flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-primary w-5 h-5 pointer-events-none" />
                    <Input
                      placeholder="Onde você quer ter aula? (Ex: Centro)"
                      className="pl-10 h-12 bg-transparent border-0 shadow-none focus-visible:ring-0 text-base"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="font-semibold h-12 px-6"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </form>
              </div>

              {/* Quick Links */}
              <div className="flex gap-4 justify-center text-sm text-muted-foreground">
                <span>Populares:</span>
                <button onClick={() => setSearchQuery("Centro")} className="hover:text-primary underline">Centro</button>
                <button onClick={() => setSearchQuery("Zona Sul")} className="hover:text-primary underline">Zona Sul</button>
                <button onClick={() => setSearchQuery("Zona Norte")} className="hover:text-primary underline">Zona Norte</button>
              </div>
            </div>
          </div>
        </section>

        {/* Login Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Já tem uma conta?</h2>
              <p className="text-lg text-muted-foreground">
                Faça login para acessar sua área
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Login Aluno */}
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🎓</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Sou Aluno</h3>
                  <p className="text-muted-foreground mb-6">
                    Encontre instrutores, agende aulas e acompanhe seu progresso
                  </p>
                  <Button
                    size="lg"
                    className="w-full font-semibold text-lg h-14"
                    asChild
                  >
                    <Link href="/signin?role=student">
                      Entrar como Aluno
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Não tem conta?{' '}
                    <Link href="/signup/student" className="text-primary hover:underline font-semibold">
                      Cadastre-se grátis
                    </Link>
                  </p>
                </CardContent>
              </Card>

              {/* Login Instrutor */}
              <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-4xl">🚗</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Sou Instrutor</h3>
                  <p className="text-muted-foreground mb-6">
                    Gerencie suas aulas, alunos e ganhe mais com a plataforma
                  </p>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full font-semibold text-lg h-14"
                    asChild
                  >
                    <Link href="/signin?role=instructor">
                      Entrar como Instrutor
                    </Link>
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    Não tem conta?{' '}
                    <Link href="/signup/instructor" className="text-primary hover:underline font-semibold">
                      Cadastre-se grátis
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Credenciais de Teste */}
            <div className="mt-12 max-w-2xl mx-auto">
              <Card className="bg-muted/50 border-dashed">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4 text-center">🧪 Credenciais de Teste</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <p className="font-semibold text-blue-600 dark:text-blue-400">Aluno:</p>
                      <p className="font-mono bg-background px-3 py-2 rounded">julia.santos@bora.app</p>
                      <p className="font-mono bg-background px-3 py-2 rounded">aluna2026</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-green-600 dark:text-green-400">Instrutor:</p>
                      <p className="font-mono bg-background px-3 py-2 rounded">carlos.mendes@bora.app</p>
                      <p className="font-mono bg-background px-3 py-2 rounded">prof2026</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section id="categories" className="py-16 border-t border-border">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-20">
            <h2 className="text-2xl font-semibold mb-8">Explore por categoria</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: '🏎️', name: 'Carro Manual', count: '256 instrutores' },
                { icon: '🚗', name: 'Carro Automático', count: '189 instrutores' },
                { icon: '🏍️', name: 'Motocicleta', count: '142 instrutores' },
                { icon: '⚡', name: 'Aulas Intensivas', count: '95 instrutores' },
              ].map((category) => (
                <Card
                  key={category.name}
                  className="hover:scale-105 transition-transform cursor-pointer"
                  onClick={() => setSearchQuery(category.name)}
                >
                  <CardContent className="text-center p-6">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="text-base font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-20 text-center">
            <h2 className="text-3xl font-bold mb-6">Pronto para começar?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="font-semibold rounded-full px-8"
                asChild
              >
                <Link href="/signup/student">Criar Conta de Aluno</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="font-semibold rounded-full px-8"
                asChild
              >
                <Link href="/signup/instructor">Sou Instrutor</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-background">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-20 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">B</div>
                <span className="text-xl font-bold">bora</span>
              </div>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <a href="#" className="hover:text-primary">Termos</a>
                <a href="#" className="hover:text-primary">Privacidade</a>
                <a href="#" className="hover:text-primary">Ajuda</a>
              </div>
            </div>
            <div className="mt-8 text-center text-sm text-muted-foreground">
              © 2026 Bora, Inc. Todos os direitos reservados.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
