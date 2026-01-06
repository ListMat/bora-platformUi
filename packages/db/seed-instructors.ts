import { PrismaClient, InstructorStatus, VehicleCategory, TransmissionType, FuelType, UserRole, LessonStatus, PaymentMethod } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed de instrutores...');

    const instructorsData = [
        {
            name: 'Carlos Silva',
            email: 'carlos.instrutor@bora.com',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150',
            cpf: '11122233344',
            phone: '11999998888',
            city: 'São Paulo',
            state: 'SP',
            lat: -23.550520,
            lng: -46.633308,
            price: 60,
            description: 'Instrutor experiente com foco em direção defensiva.',
            vehicle: { model: 'HB20', brand: 'Hyundai', year: 2021, color: 'Branco', plate: 'ABC1234', transmission: 'MANUAL', photo: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?fit=crop&w=400&h=300' }
        },
        {
            name: 'Ana Souza',
            email: 'ana.instrutor@bora.com',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?fit=crop&w=150&h=150',
            cpf: '22233344455',
            phone: '11988887777',
            city: 'São Paulo',
            state: 'SP',
            lat: -23.5615,
            lng: -46.6559, // Perto da Paulista
            price: 85,
            description: 'Aulas personalizadas para habilitados com medo de dirigir.',
            vehicle: { model: 'Civic', brand: 'Honda', year: 2020, color: 'Prata', plate: 'XYZ9876', transmission: 'AUTOMATICO', photo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?fit=crop&w=400&h=300' }
        },
        {
            name: 'Roberto Oliveira',
            email: 'roberto.instrutor@bora.com',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=150&h=150',
            cpf: '33344455566',
            phone: '11977776666',
            city: 'São Paulo',
            state: 'SP',
            lat: -23.5986,
            lng: -46.6766, // Itaim/Vila Olimpia
            price: 70,
            description: 'Paciência e didática para quem está começando.',
            vehicle: { model: 'Onix', brand: 'Chevrolet', year: 2022, color: 'Vermelho', plate: 'DEF4567', transmission: 'MANUAL', photo: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?fit=crop&w=400&h=300' }
        },
        {
            name: 'Mariana Costa',
            email: 'mariana.instrutor@bora.com',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=150&h=150',
            cpf: '44455566677',
            phone: '11966665555',
            city: 'Osasco',
            state: 'SP',
            lat: -23.5329,
            lng: -46.7917,
            price: 55,
            description: 'Instrutora credenciada pelo DETRAN há 10 anos.',
            vehicle: { model: 'Ka', brand: 'Ford', year: 2019, color: 'Branco', plate: 'GHI9012', transmission: 'MANUAL', photo: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?fit=crop&w=400&h=300' }
        },
        {
            name: 'Instrutor de Tiradentes',
            email: 'tiradentes@bora.com',
            image: null,
            cpf: '55566677788',
            city: 'Tiradentes',
            state: 'MG',
            lat: -21.1102,
            lng: -44.1731,
            price: 50,
            description: 'Aulas práticas em Tiradentes e região.',
            vehicle: { model: 'Gol', brand: 'VW', year: 2018, color: 'Branco', plate: 'JJA2020', transmission: 'MANUAL', photo: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?fit=crop&w=400&h=300' }
        }
    ];

    for (const data of instructorsData) {
        // 1. User
        let user = await prisma.user.findUnique({ where: { email: data.email } });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: '$2a$10$abcdef123456',
                    role: UserRole.INSTRUCTOR,
                    image: data.image,
                    phone: data.phone,
                    emailVerified: new Date(),
                }
            });
            console.log(`👤 Usuário ${user.name} criado.`);
        } else {
            console.log(`👤 Usuário ${user.name} já existe.`);
        }

        // 2. Instructor Profile
        let instructor = await prisma.instructor.findUnique({ where: { userId: user.id } });

        if (!instructor) {
            instructor = await prisma.instructor.create({
                data: {
                    userId: user.id,
                    cpf: data.cpf,
                    cnhNumber: data.cpf,
                    credentialNumber: '123456',
                    credentialExpiry: new Date('2030-01-01'),
                    city: data.city,
                    state: data.state,
                    basePrice: data.price,
                    latitude: data.lat,
                    longitude: data.lng,
                    status: InstructorStatus.ACTIVE,
                    isOnline: true,
                    isAvailable: true,
                    bio: data.description,
                }
            });
        } else {
            // Atualizar localização e status
            instructor = await prisma.instructor.update({
                where: { id: instructor.id },
                data: {
                    latitude: data.lat,
                    longitude: data.lng,
                    status: InstructorStatus.ACTIVE,
                    isOnline: true,
                    isAvailable: true,
                }
            });
        }

        // 3. Availability
        const countAvail = await prisma.instructorAvailability.count({ where: { instructorId: instructor.id } });
        if (countAvail === 0) {
            const slots = [];
            for (let i = 1; i <= 5; i++) {
                slots.push({ instructorId: instructor.id, dayOfWeek: i, startTime: '08:00', endTime: '18:00' });
            }
            await prisma.instructorAvailability.createMany({ data: slots });
        }

        // 4. Vehicle
        const countVehicle = await prisma.vehicle.count({ where: { userId: user.id } });
        if (countVehicle === 0) {
            await prisma.vehicle.create({
                data: {
                    userId: user.id,
                    brand: data.vehicle.brand,
                    model: data.vehicle.model,
                    year: data.vehicle.year,
                    color: data.vehicle.color,
                    plateLastFour: data.vehicle.plate.slice(-4),
                    transmission: data.vehicle.transmission === 'AUTOMATICO' ? TransmissionType.AUTOMATICO : TransmissionType.MANUAL,
                    category: VehicleCategory.HATCH,
                    fuel: FuelType.FLEX,
                    engine: '1.0',
                    hasDualPedal: true,
                    status: 'active',
                    photoUrl: data.vehicle.photo,
                    photos: [data.vehicle.photo]
                }
            });
        }

        // 5. Ratings (Dummy)
        try {
            const countRating = await prisma.rating.count({ where: { instructorId: instructor.id } });
            if (countRating === 0) {
                let student = await prisma.user.findFirst({ where: { email: 'aluno.teste@bora.com' } });
                if (!student) {
                    student = await prisma.user.create({
                        data: {
                            name: 'Aluno Teste',
                            email: 'aluno.teste@bora.com',
                            password: '$2a$10$abcdef123456',
                            role: UserRole.STUDENT,
                        }
                    });
                    await prisma.student.create({ data: { userId: student.id, cpf: '99988877766' } });
                }

                const studentProfile = await prisma.student.findUnique({ where: { userId: student.id } });

                if (studentProfile) {
                    const lesson = await prisma.lesson.create({
                        data: {
                            instructorId: instructor.id,
                            studentId: studentProfile.id,
                            duration: 60,
                            price: instructor.basePrice,
                            status: LessonStatus.FINISHED,
                            scheduledAt: new Date(Date.now() - 86400000), // Ontem
                            paymentMethod: PaymentMethod.DINHEIRO, // PIX talvez não exista no enum antigo se foi gerado partial
                            pickupAddress: 'Rua Teste, 123',
                        }
                    });

                    await prisma.rating.create({
                        data: {
                            lessonId: lesson.id,
                            instructorId: instructor.id,
                            studentId: studentProfile.id,
                            rating: 5,
                            comment: 'Instrutor muito atencioso, recomendo!',
                        }
                    });

                    // Update average
                    await prisma.instructor.update({
                        where: { id: instructor.id },
                        data: { averageRating: 5.0, totalLessons: 10 }
                    });
                }
            }
        } catch (e) { console.error('Skip rating', e) }
    }

    console.log('✅ Seed finalizado com sucesso!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
