import { PrismaClient, UserRole, InstructorStatus, VehicleCategory, TransmissionType, FuelType } from "@prisma/client";

const prisma = new PrismaClient();

async function cleanUser(email: string, cpf?: string, cnh?: string) {
    let userIdToDelete: string | null = null;

    // Tenta achar por email
    const u = await prisma.user.findUnique({ where: { email } });
    if (u) userIdToDelete = u.id;

    // Se não achou, tenta por CPF (Student)
    if (!userIdToDelete && cpf) {
        const s = await prisma.student.findUnique({ where: { cpf } });
        if (s) userIdToDelete = s.userId;
    }

    // Se não achou, tenta por CPF (Instructor)
    if (!userIdToDelete && cpf) {
        const i = await prisma.instructor.findUnique({ where: { cpf } });
        if (i) userIdToDelete = i.userId;
    }

    // Se não achou, tenta por CNH
    if (!userIdToDelete && cnh) {
        const i = await prisma.instructor.findUnique({ where: { cnhNumber: cnh } });
        if (i) userIdToDelete = i.userId;
    }

    if (userIdToDelete) {
        console.log(`Deleting existing user (ID: ${userIdToDelete})...`);
        try {
            await prisma.user.delete({ where: { id: userIdToDelete } });
        } catch (e: any) {
            console.log("Warning during delete:", e.code || e.message);
        }
    }
}

async function main() {
    console.log("🌱 Creating test users...");

    // 1. Aluno
    const sEmail = "aluno.teste@bora.com";
    const sCpf = "12345678901";

    await cleanUser(sEmail, sCpf);

    const studentUser = await prisma.user.create({
        data: {
            email: sEmail,
            name: "Aluno Teste Completo",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            phone: "11999999999",
            role: UserRole.STUDENT,
            student: {
                create: {
                    cpf: sCpf,
                    dateOfBirth: new Date("2000-01-01"),
                    address: "Rua dos Alunos, 123",
                    city: "São Paulo",
                    state: "SP",
                    zipCode: "01001-000",
                    walletBalance: 1000.00,
                }
            }
        },
        include: { student: true }
    });
    console.log(`✓ Created Student: ${studentUser.email}`);

    // 2. Instrutor
    const iEmail = "instrutor.teste@bora.com";
    const iCpf = "98765432100";
    const iCnh = "12345678900";

    await cleanUser(iEmail, iCpf, iCnh);

    const instructorUser = await prisma.user.create({
        data: {
            email: iEmail,
            name: "Instrutor Mestre",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
            phone: "11988888888",
            role: UserRole.INSTRUCTOR,
            instructor: {
                create: {
                    cpf: iCpf,
                    cnhNumber: iCnh,
                    status: InstructorStatus.ACTIVE,
                    isOnline: true,
                    isAvailable: true,
                    basePrice: 80.00,
                    bio: "Instrutor experiente...",
                    acceptsOwnVehicle: true,
                    city: "São Paulo",
                    state: "SP",
                    availability: {
                        create: [
                            { dayOfWeek: 1, startTime: "08:00", endTime: "18:00" },
                            { dayOfWeek: 2, startTime: "08:00", endTime: "18:00" },
                            { dayOfWeek: 3, startTime: "08:00", endTime: "18:00" },
                            { dayOfWeek: 4, startTime: "08:00", endTime: "18:00" },
                            { dayOfWeek: 5, startTime: "08:00", endTime: "18:00" },
                        ]
                    }
                }
            },
            vehicles: {
                create: {
                    brand: "Volkswagen",
                    model: "Gol",
                    year: 2022,
                    color: "Branco",
                    plateLastFour: "5678",
                    photoUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1000",
                    category: VehicleCategory.HATCH,
                    transmission: TransmissionType.MANUAL,
                    fuel: FuelType.FLEX,
                    engine: "1.0",
                    hasDualPedal: true,
                    status: "active"
                }
            }
        },
        include: { instructor: true }
    });
    console.log(`✓ Created Instructor: ${instructorUser.email}`);
    console.log("\nSuccess! Database seeded.");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed with code:", e.code || "UNKNOWN");
        console.error("Message:", e.message);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
