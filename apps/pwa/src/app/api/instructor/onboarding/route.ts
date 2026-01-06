import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
        }

        const body = await req.json();
        const { weeklyHours, cep, pricePerHour, vehicle, photos } = body;

        // Garantir ID do usuário
        let userId = session.user.id;
        if (!userId) {
            const user = await prisma.user.findUnique({ where: { email: session.user.email } });
            if (!user) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
            userId = user.id;
        }

        console.log("📝 [API/ONBOARDING] Iniciando para user:", userId);

        // 1. Upsert Instructor
        const instructor = await prisma.instructor.upsert({
            where: { userId: userId },
            create: {
                userId: userId,
                // @ts-ignore
                basePrice: Number(pricePerHour),
                cep,
                isOnline: true,
                // status: "PENDING_VERIFICATION", // Usar default do schema
            },
            update: {
                // @ts-ignore
                basePrice: Number(pricePerHour),
                cep,
                isOnline: true,
            },
        });

        // 2. Atualizar Disponibilidade
        // @ts-ignore
        await prisma.instructorAvailability.deleteMany({
            where: { instructorId: instructor.id }
        });

        if (weeklyHours && weeklyHours.length > 0) {
            // @ts-ignore
            await prisma.instructorAvailability.createMany({
                data: weeklyHours.map((slot: any) => ({
                    instructorId: instructor.id,
                    dayOfWeek: slot.dayOfWeek,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                }))
            });
        }

        // 3. Criar Veículo
        // @ts-ignore
        await prisma.vehicle.create({
            data: {
                // @ts-ignore
                userId: userId,
                brand: "Não informada",
                model: vehicle.model,
                year: Number(vehicle.year),
                color: vehicle.color,
                plateLastFour: vehicle.plate.slice(-4) || "0000",
                category: "HATCH",
                transmission: vehicle.transmission === 'automatic' ? "AUTOMATICO" : "MANUAL",
                fuel: "FLEX",
                engine: "1.0",
                hasDualPedal: vehicle.hasDualPedals,
                photoUrl: photos && photos[0]?.url ? photos[0].url : "",
                photos: photos ? photos.map((p: any) => p.url) : [],
                status: "active"
            }
        });

        return NextResponse.json({ success: true, instructorId: instructor.id });

    } catch (error: any) {
        console.error("❌ [API/ONBOARDING] Erro:", error);
        return NextResponse.json(
            { error: error.message || 'Erro interno no servidor' },
            { status: 500 }
        );
    }
}
