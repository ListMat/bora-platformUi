import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { firstPlanSchema } from "@/lib/validations/onboarding";

export const instructorRouter = createTRPCRouter({
    getStatus: protectedProcedure.query(async ({ ctx }) => {
        const instructor = await ctx.prisma.instructor.findUnique({
            where: { userId: ctx.session.user.id },
        });

        if (!instructor) return null;

        // Converter Decimal para number para serialização
        return {
            ...instructor,
            basePrice: instructor.basePrice ? Number(instructor.basePrice) : 0,
            averageRating: instructor.averageRating || 0,
        };
    }),

    updateAvailabilityAndLocation: protectedProcedure
        .input(z.object({
            cep: z.string(),
            street: z.string(),
            neighborhood: z.string(),
            city: z.string(),
            state: z.string(),
            latitude: z.number().optional(),
            longitude: z.number().optional(),
            weeklyHours: z.array(z.object({
                dayOfWeek: z.number(),
                startTime: z.string(),
                endTime: z.string(),
            })),
        }))
        .mutation(async ({ ctx, input }) => {
            console.log('[updateAvailabilityAndLocation] Raw input received:', JSON.stringify(input, null, 2));

            try {
                const { weeklyHours, cep, street, neighborhood, city, state, latitude, longitude } = input;
                const userId = ctx.session.user.id;

                const result = await ctx.prisma.instructor.upsert({
                    where: { userId },
                    create: {
                        userId,
                        cep,
                        street,
                        neighborhood,
                        city,
                        state,
                        latitude,
                        longitude,
                        basePrice: 0,
                        status: "PENDING_VERIFICATION",
                        availability: {
                            createMany: {
                                data: weeklyHours.map(slot => ({
                                    dayOfWeek: slot.dayOfWeek,
                                    startTime: slot.startTime,
                                    endTime: slot.endTime,
                                }))
                            }
                        }
                    },
                    update: {
                        cep,
                        street,
                        neighborhood,
                        city,
                        state,
                        latitude,
                        longitude,
                        availability: {
                            deleteMany: {},
                            createMany: {
                                data: weeklyHours.map(slot => ({
                                    dayOfWeek: slot.dayOfWeek,
                                    startTime: slot.startTime,
                                    endTime: slot.endTime,
                                }))
                            }
                        }
                    }
                });

                // Retornar apenas dados serializáveis (sem Decimal)
                return {
                    success: true,
                    instructorId: result.id
                };
            } catch (error) {
                throw error;
            }
        }),

    activateProfile: protectedProcedure
        .input(z.object({
            pricePerHour: z.number().min(1),
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            // Verificar se já tem veículo e disponibilidade de fato
            // (Poderíamos adicionar validações aqui)

            const instructor = await ctx.prisma.instructor.update({
                where: { userId },
                data: {
                    basePrice: input.pricePerHour,
                    status: "ACTIVE",
                    isOnline: true,
                    isAvailable: true,
                }
            });

            // Criar o plano "Aula Avulsa" padrão
            await ctx.prisma.plan.create({
                data: {
                    name: "Aula Avulsa",
                    description: "Aula prática de direção (50 minutos)",
                    lessons: 1,
                    price: input.pricePerHour,
                    instructorId: instructor.id,
                    isActive: true,
                }
            });

            return { success: true, instructorId: instructor.id };
        }),

    updateProfile: protectedProcedure
        .input(z.object({
            name: z.string().min(1).optional(),
            bio: z.string().optional(),
            basePrice: z.number().min(0).optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            const userId = ctx.session.user.id;

            // Atualizar User se name foi fornecido
            if (input.name) {
                await ctx.prisma.user.update({
                    where: { id: userId },
                    data: { name: input.name },
                });
            }

            // Atualizar Instructor
            const instructor = await ctx.prisma.instructor.update({
                where: { userId },
                data: {
                    ...(input.bio !== undefined && { bio: input.bio }),
                    ...(input.basePrice !== undefined && { basePrice: input.basePrice }),
                },
            });

            return {
                success: true,
                instructorId: instructor.id,
            };
        }),

    search: publicProcedure
        .input(z.object({
            query: z.string().optional(),
            latitude: z.number().optional(),
            longitude: z.number().optional(),
            radius: z.number().optional(),
            limit: z.number().optional(),
        }))
        .query(async ({ ctx, input }) => {
            const { query } = input;

            try {
                const instructors = await ctx.prisma.instructor.findMany({
                    where: {
                        // @ts-ignore - Status pode ser String ou Enum dependendo da versão do client local
                        status: 'ACTIVE',
                        isOnline: true,
                        ...(query ? {
                            OR: [
                                { city: { contains: query, mode: 'insensitive' } },
                                { neighborhood: { contains: query, mode: 'insensitive' } },
                                { user: { name: { contains: query, mode: 'insensitive' } } }
                            ]
                        } : {})
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                vehicles: {
                                    where: { status: 'active' },
                                    take: 1,
                                    select: {
                                        model: true,
                                        photoUrl: true,
                                        transmission: true
                                    }
                                }
                            }
                        },
                        ratings: {
                            take: 5,
                            orderBy: { createdAt: 'desc' },
                            include: {
                                student: { include: { user: { select: { name: true, image: true } } } }
                            }
                        }
                    },
                    take: 20,
                });

                return instructors;
            } catch (error) {
                console.error("Erro no search do instrutor:", error);
                throw error;
            }
        }),

    getPublicProfile: publicProcedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            const instructor = await ctx.prisma.instructor.findUnique({
                where: { id: input },
                include: {
                    user: {
                        select: {
                            name: true,
                            image: true,
                            createdAt: true,
                            // @ts-ignore
                            vehicles: true
                        }
                    },
                    // @ts-ignore
                    availability: true,
                },
            });
            return instructor;
        }),
});
