import { Button } from "@bora/ui";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">BORA</h1>
          <nav className="hidden space-x-6 md:flex">
            <Link href="#como-funciona" className="text-sm hover:underline">
              Como funciona
            </Link>
            <Link href="#beneficios" className="text-sm hover:underline">
              Benefícios
            </Link>
            <Link href="#depoimentos" className="text-sm hover:underline">
              Depoimentos
            </Link>
            <Link href="#faq" className="text-sm hover:underline">
              FAQ
            </Link>
          </nav>
          <div className="flex gap-2">
            <Button variant="ghost">Entrar</Button>
            <Button>Cadastrar</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-5xl font-bold leading-tight">
              Aprenda a Dirigir com os Melhores Instrutores
            </h2>
            <p className="mb-8 text-xl text-muted-foreground">
              Conecte-se com instrutores qualificados, agende aulas flexíveis e aprenda no seu ritmo.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" className="text-lg">
                Começar Agora
              </Button>
              <Button size="lg" variant="outline" className="text-lg">
                Sou Instrutor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold">Como Funciona</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Encontre um Instrutor</h3>
              <p className="text-muted-foreground">
                Busque instrutores próximos a você e escolha o melhor avaliado.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Agende sua Aula</h3>
              <p className="text-muted-foreground">
                Escolha o horário que melhor se encaixa na sua rotina.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Aprenda e Evolua</h3>
              <p className="text-muted-foreground">
                Receba feedback personalizado e acompanhe seu progresso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="bg-muted/10 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold">Por que BORA?</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-2 text-xl font-semibold">Instrutores Certificados</h3>
              <p className="text-muted-foreground">
                Todos os instrutores são verificados e possuem credenciais válidas.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-2 text-xl font-semibold">Flexibilidade Total</h3>
              <p className="text-muted-foreground">
                Agende aulas quando e onde você quiser, sem compromisso fixo.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-2 text-xl font-semibold">Pagamento Seguro</h3>
              <p className="text-muted-foreground">
                Pague com cartão, PIX ou boleto. Seus dados estão protegidos.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-2 text-xl font-semibold">Avaliações Reais</h3>
              <p className="text-muted-foreground">
                Veja avaliações de outros alunos antes de escolher seu instrutor.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-2 text-xl font-semibold">Simulados Teóricos</h3>
              <p className="text-muted-foreground">
                Prepare-se para a prova teórica com nossos simulados gratuitos.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-2 text-xl font-semibold">Suporte 24/7</h3>
              <p className="text-muted-foreground">
                Nossa equipe está sempre disponível para ajudar você.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold">Pronto para Começar?</h2>
          <p className="mb-8 text-xl">
            Cadastre-se agora e agende sua primeira aula com desconto especial!
          </p>
          <Button size="lg" variant="secondary" className="text-lg">
            Cadastrar Grátis
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-lg font-semibold">BORA</h3>
              <p className="text-sm text-muted-foreground">
                A melhor plataforma de aulas de direção do Brasil.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#">Para Alunos</Link>
                </li>
                <li>
                  <Link href="#">Para Instrutores</Link>
                </li>
                <li>
                  <Link href="#">Preços</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#">Sobre</Link>
                </li>
                <li>
                  <Link href="#">Blog</Link>
                </li>
                <li>
                  <Link href="#">Carreiras</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#">Termos de Uso</Link>
                </li>
                <li>
                  <Link href="#">Privacidade</Link>
                </li>
                <li>
                  <Link href="#">LGPD</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © 2024 BORA. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

