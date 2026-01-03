import { PrismaClient, InstructorStatus, VehicleCategory, TransmissionType, FuelType, UserRole, LessonStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // 1. Seed Skills
  console.log("Creating/Updating skills...");
  const skills = [
    { name: "Controle de Embreagem", category: "BASIC", weight: 2 },
    { name: "Controle de Volante", category: "BASIC", weight: 2 },
    { name: "Baliza", category: "INTERMEDIATE", weight: 3 },
    { name: "Direção Defensiva", category: "ADVANCED", weight: 3 },
  ];

  for (const skill of skills) {
    const existing = await prisma.skill.findFirst({ where: { name: skill.name } });
    if (!existing) {
      await prisma.skill.create({
        data: {
          name: skill.name,
          category: skill.category as any,
          weight: skill.weight,
          description: `Habilidade de ${skill.name}`,
          order: 1
        }
      });
    }
  }

  // 2. Bundles
  console.log("Creating Bundles...");
  const bundles = [
    { name: "Pacote Iniciante", lessons: 5, price: 350.0, totalLessons: 5 },
    { name: "Pacote Padrão", lessons: 10, price: 650.0, totalLessons: 10 },
  ];

  for (const bundle of bundles) {
    const existing = await prisma.bundle.findFirst({ where: { name: bundle.name } });
    if (!existing) {
      await prisma.bundle.create({
        data: {
          name: bundle.name,
          price: bundle.price,
          totalLessons: bundle.totalLessons,
          description: "Pacote global",
          isActive: true,
          expiryDays: 90,
          discount: 0
        }
      });
    }
  }

  // 3. Instrutores
  console.log("Creating Instructors...");

  const instructors = [
    {
      email: "carlos@bora.com",
      name: "Carlos Silva",
      bio: "Instrutor calmo e paciente, especialista em alunos nervosos e baliza perfeita. Mais de 15 anos de experiência.",
      city: "Belo Horizonte",
      state: "MG",
      lat: -19.9167,
      lng: -43.9345, // Centro BH
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      car: {
        brand: "Honda", model: "Civic", plateLastFour: "2024",
        category: VehicleCategory.SEDAN, color: "Preto", year: 2022
      },
      packages: [
        { name: "Intuito de Baliza", lessons: 5, price: 400, desc: "Foco total na baliza." },
        { name: "Pacote Mensal", lessons: 10, price: 750, desc: "Aulas regulares." }
      ],
      shifts: { morning: true, afternoon: true, evening: false }
    },
    {
      email: "ana@bora.com",
      name: "Ana Souza",
      bio: "Aulas dinâmicas e focadas na prática urbana. Vamos perder o medo do trânsito juntas!",
      city: "Belo Horizonte",
      state: "MG",
      lat: -19.9300,
      lng: -43.9200, // Savassi
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      car: {
        brand: "Fiat", model: "Mobi", plateLastFour: "1234",
        category: VehicleCategory.HATCH, color: "Branco", year: 2023
      },
      packages: [
        { name: "Recém-Habilitados", lessons: 3, price: 250, desc: "Perca o medo." },
      ],
      shifts: { morning: false, afternoon: true, evening: true }
    },
    {
      email: "roberto@bora.com",
      name: "Roberto Mendes",
      bio: "Treinamento VIP em carro automático. Segurança e conforto em primeiro lugar.",
      city: "Belo Horizonte",
      state: "MG",
      lat: -19.8500,
      lng: -43.9600, // Pampulha
      image: "https://randomuser.me/api/portraits/men/55.jpg",
      car: {
        brand: "Toyota", model: "Corolla", plateLastFour: "9999",
        category: VehicleCategory.SEDAN, color: "Prata", year: 2021
      },
      packages: [
        { name: "Experiência VIP", lessons: 8, price: 900, desc: "Conforto total." },
      ],
      shifts: { morning: true, afternoon: false, evening: false }
    },
    {
      email: "julia@bora.com",
      name: "Julia Lima",
      bio: "Instrutora jovem e didática. Aprenda de forma leve e divertida.",
      city: "Contagem",
      state: "MG",
      lat: -19.9000,
      lng: -44.0200, // Contagem
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      car: {
        brand: "Hyundai", model: "HB20", plateLastFour: "5555",
        category: VehicleCategory.HATCH, color: "Vermelho", year: 2024
      },
      packages: [
        { name: "Iniciante Total", lessons: 20, price: 1800, desc: "Do zero à carta na mão." },
      ],
      shifts: { morning: true, afternoon: true, evening: true }
    }
  ];

  for (const data of instructors) {
    // Upsert User
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: { name: data.name, image: data.image },
      create: {
        email: data.email,
        name: data.name,
        image: data.image,
        role: UserRole.INSTRUCTOR,
        emailVerified: new Date(),
      }
    });

    // Upsert Instructor Profile
    const instructor = await prisma.instructor.upsert({
      where: { userId: user.id },
      update: { latitude: data.lat, longitude: data.lng, status: InstructorStatus.ACTIVE },
      create: {
        userId: user.id,
        bio: data.bio,
        city: data.city,
        state: data.state,
        latitude: data.lat,
        longitude: data.lng,
        cpf: `123-${data.name}`,
        status: InstructorStatus.ACTIVE,
        isAvailable: true,
        averageRating: 4.9,
        totalLessons: 120,
      }
    });

    // Create/Reset Vehicle
    await prisma.vehicle.deleteMany({ where: { userId: user.id } });

    await prisma.vehicle.create({
      data: {
        userId: user.id,
        brand: data.car.brand,
        model: data.car.model,
        year: data.car.year,
        color: data.car.color,
        plateLastFour: data.car.plateLastFour,
        category: data.car.category,
        fuel: FuelType.FLEX,
        transmission: TransmissionType.MANUAL,
        status: "active",
        photoUrl: "https://img.freepik.com/free-photo/silver-sedan-car_1101-229.jpg",
        pedalPhotoUrl: "https://img.freepik.com/free-photo/car-pedals_1101-331.jpg",
        engine: "1.6 Flex",
      }
    });

    // Create/Reset Custom Packages (Plans)
    await prisma.plan.deleteMany({ where: { instructorId: instructor.id } });
    for (const pkg of data.packages) {
      await prisma.plan.create({
        data: {
          instructorId: instructor.id,
          name: pkg.name,
          lessons: pkg.lessons,
          price: pkg.price,
          description: pkg.desc,
          isActive: true,
          discount: 0
        }
      });
    }

    // Create Availability (Agenda)
    await prisma.instructorAvailability.deleteMany({ where: { instructorId: instructor.id } });

    const shiftsToCreate = [];
    const days = [1, 2, 3, 4, 5];

    for (const day of days) {
      if (data.shifts.morning) {
        shiftsToCreate.push({ instructorId: instructor.id, dayOfWeek: day, startTime: "08:00", endTime: "12:00" });
      }
      if (data.shifts.afternoon) {
        shiftsToCreate.push({ instructorId: instructor.id, dayOfWeek: day, startTime: "13:00", endTime: "17:00" });
      }
      if (data.shifts.evening) {
        shiftsToCreate.push({ instructorId: instructor.id, dayOfWeek: day, startTime: "18:00", endTime: "22:00" });
      }
    }

    if (shiftsToCreate.length > 0) {
      await prisma.instructorAvailability.createMany({ data: shiftsToCreate });
    }

    console.log(`Verified instructor: ${data.name}`);
  }

  // 4. Alunos
  console.log("Creating Students...");
  const students = [
    { email: "lucas@aluno.com", name: "Lucas Aluno", image: "https://randomuser.me/api/portraits/men/11.jpg" },
    { email: "mari@aluno.com", name: "Mariana Aluno", image: "https://randomuser.me/api/portraits/women/22.jpg" },
    { email: "pedro@aluno.com", name: "Pedro Aluno", image: "https://randomuser.me/api/portraits/men/33.jpg" },
  ];

  for (const s of students) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: {
        email: s.email,
        name: s.name,
        image: s.image,
        role: UserRole.STUDENT,
        emailVerified: new Date(),
      }
    });

    // Upsert Student Profile
    // Student has UNIQUE userId, so we can mock verify
    const student = await prisma.student.findUnique({ where: { userId: user.id } });
    if (!student) {
      await prisma.student.create({
        data: {
          userId: user.id,
          cpf: `111-${s.name.replace(/\s+/g, '')}`, // Mock CPF unique
          level: 1,
          points: 0,
        }
      });
    }

    console.log(`Verified student: ${s.name}`);
  }

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
