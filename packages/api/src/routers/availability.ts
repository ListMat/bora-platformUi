import { z } from "zod";
import { router, instructorProcedure, protectedProcedure } from "../trpc";

// Definição dos turnos fixos para MVP
// No futuro, isso pode ser flexível
const SHIFTS = {
    MORNING: { start: "08:00", end: "12:00" },
    AFTERNOON: { start: "13:00", end: "17:00" },
    EVENING: { start: "18:00", end: "22:00" },
};

export const availabilityRouter = router({
    // Buscar disponibilidade de um instrutor específico (Para o Aluno)
    getByInstructorId: protectedProcedure
        .input(z.object({ instructorId: z.string() }))
        .query(async ({ ctx, input }) => {
            const availabilities = await ctx.prisma.instructorAvailability.findMany({
                where: { instructorId: input.instructorId }
            });

            return Array.from({ length: 7 }).map((_, dayIndex) => {
                const dayRecords = availabilities.filter(a => a.dayOfWeek === dayIndex);
                return {
                    dayOfWeek: dayIndex,
                    morning: dayRecords.some(r => r.startTime === SHIFTS.MORNING.start),
                    afternoon: dayRecords.some(r => r.startTime === SHIFTS.AFTERNOON.start),
                    evening: dayRecords.some(r => r.startTime === SHIFTS.EVENING.start),
                };
            });
        }),

    // Buscar configurações atuais (Para o Instrutor logado)
    getMySettings: instructorProcedure.query(async ({ ctx }) => {
        const instructor = await ctx.prisma.instructor.findUnique({
            where: { userId: ctx.user.id }
        });
        if (!instructor) throw new Error("Instrutor não encontrado");

        const availabilities = await ctx.prisma.instructorAvailability.findMany({
            where: { instructorId: instructor.id }
        });

        // Inicializar array de 7 dias (0=Domingo a 6=Sábado) com tudo false
        const weeklySchedule = Array.from({ length: 7 }).map((_, dayIndex) => {
            const dayRecords = availabilities.filter(a => a.dayOfWeek === dayIndex);

            // Verifica se tem horários batendo com os turnos
            // Nota: Se o instrutor tiver horários "quebrados" (ex: 09:00), isso simplificará para não marcado
            // Para MVP assumimos horários fixos
            const hasMorning = dayRecords.some(r => r.startTime === SHIFTS.MORNING.start);
            const hasAfternoon = dayRecords.some(r => r.startTime === SHIFTS.AFTERNOON.start);
            const hasEvening = dayRecords.some(r => r.startTime === SHIFTS.EVENING.start);

            return {
                dayOfWeek: dayIndex,
                morning: hasMorning,
                afternoon: hasAfternoon,
                evening: hasEvening
            };
        });

        return weeklySchedule;
    }),

    // Salvar configurações
    updateSettings: instructorProcedure
        .input(z.array(z.object({
            dayOfWeek: z.number().min(0).max(6),
            morning: z.boolean(),
            afternoon: z.boolean(),
            evening: z.boolean()
        })))
        .mutation(async ({ ctx, input }) => {
            const instructor = await ctx.prisma.instructor.findUnique({
                where: { userId: ctx.user.id }
            });
            if (!instructor) throw new Error("Instrutor não encontrado");

            // Transaction: Deletar tudo e recriar para garantir sincronia
            return ctx.prisma.$transaction(async (tx) => {
                // 1. Limpar disponibilidade atual
                await tx.instructorAvailability.deleteMany({
                    where: { instructorId: instructor.id }
                });

                // 2. Criar novos registros
                const newRecords = [];
                for (const day of input) {
                    if (day.morning) {
                        newRecords.push({
                            instructorId: instructor.id,
                            dayOfWeek: day.dayOfWeek,
                            startTime: SHIFTS.MORNING.start,
                            endTime: SHIFTS.MORNING.end
                        });
                    }
                    if (day.afternoon) {
                        newRecords.push({
                            instructorId: instructor.id,
                            dayOfWeek: day.dayOfWeek,
                            startTime: SHIFTS.AFTERNOON.start,
                            endTime: SHIFTS.AFTERNOON.end
                        });
                    }
                    if (day.evening) {
                        newRecords.push({
                            instructorId: instructor.id,
                            dayOfWeek: day.dayOfWeek,
                            startTime: SHIFTS.EVENING.start,
                            endTime: SHIFTS.EVENING.end
                        });
                    }
                }

                if (newRecords.length > 0) {
                    await tx.instructorAvailability.createMany({
                        data: newRecords
                    });
                }

                return { success: true, count: newRecords.length };
            });
        })
});
