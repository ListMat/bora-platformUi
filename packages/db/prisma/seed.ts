import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Seed Skills (Phase 2)
  console.log("Creating skills...");
  
  const basicSkills = [
    {
      name: "Controle de Embreagem",
      description: "Domínio do pedal da embreagem para engatar marchas suavemente",
      category: "BASIC",
      weight: 2,
      order: 1,
    },
    {
      name: "Controle de Volante",
      description: "Capacidade de manobrar o volante corretamente",
      category: "BASIC",
      weight: 2,
      order: 2,
    },
    {
      name: "Uso de Espelhos",
      description: "Verificação constante dos espelhos retrovisores",
      category: "BASIC",
      weight: 2,
      order: 3,
    },
    {
      name: "Freios e Aceleração",
      description: "Controle suave de acelerador e freios",
      category: "BASIC",
      weight: 2,
      order: 4,
    },
  ];

  const intermediateSkills = [
    {
      name: "Baliza",
      description: "Estacionar o veículo em vaga delimitada",
      category: "INTERMEDIATE",
      weight: 3,
      order: 5,
    },
    {
      name: "Conversões",
      description: "Realizar conversões à esquerda e direita com segurança",
      category: "INTERMEDIATE",
      weight: 3,
      order: 6,
    },
    {
      name: "Troca de Faixas",
      description: "Mudar de faixa com segurança e sinalização adequada",
      category: "INTERMEDIATE",
      weight: 2,
      order: 7,
    },
    {
      name: "Rotatórias",
      description: "Navegar por rotatórias respeitando a preferência",
      category: "INTERMEDIATE",
      weight: 2,
      order: 8,
    },
  ];

  const advancedSkills = [
    {
      name: "Direção em Rodovia",
      description: "Condução segura em velocidades mais altas",
      category: "ADVANCED",
      weight: 3,
      order: 9,
    },
    {
      name: "Direção Noturna",
      description: "Adaptação à condução com baixa visibilidade",
      category: "ADVANCED",
      weight: 2,
      order: 10,
    },
    {
      name: "Direção em Chuva",
      description: "Controle do veículo em condições adversas",
      category: "ADVANCED",
      weight: 2,
      order: 11,
    },
    {
      name: "Estacionamento Paralelo",
      description: "Estacionar na rua entre dois veículos",
      category: "ADVANCED",
      weight: 3,
      order: 12,
    },
  ];

  const allSkills = [...basicSkills, ...intermediateSkills, ...advancedSkills];

  for (const skill of allSkills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: skill,
      create: skill,
    });
  }

  console.log(`✓ Created ${allSkills.length} skills`);

  // Seed Bundles (Phase 1)
  console.log("Creating bundle packages...");

  const bundles = [
    {
      name: "Pacote Iniciante",
      description: "Ideal para começar sua jornada",
      totalLessons: 5,
      price: 350.0,
      discount: 0,
      expiryDays: 60,
      isActive: true,
      featured: false,
    },
    {
      name: "Pacote Completo",
      description: "Mais popular! Melhor custo-benefício",
      totalLessons: 10,
      price: 650.0,
      discount: 10,
      expiryDays: 90,
      isActive: true,
      featured: true,
    },
    {
      name: "Pacote Premium",
      description: "Para quem quer dominar a direção",
      totalLessons: 20,
      price: 1200.0,
      discount: 15,
      expiryDays: 120,
      isActive: true,
      featured: false,
    },
    {
      name: "Pacote Intensivo",
      description: "Preparação express para o exame",
      totalLessons: 30,
      price: 1700.0,
      discount: 20,
      expiryDays: 180,
      isActive: true,
      featured: false,
    },
  ];

  for (const bundle of bundles) {
    await prisma.bundle.upsert({
      where: { name: bundle.name },
      update: bundle,
      create: bundle,
    });
  }

  console.log(`✓ Created ${bundles.length} bundle packages`);

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

