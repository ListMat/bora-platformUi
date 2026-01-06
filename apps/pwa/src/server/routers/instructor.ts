import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { firstPlanSchema } from "@/lib/validations/onboarding";

export const instructorRouter = createTRPCRouter({
    getStatus: protectedProcedure.query(async ({ ctx }) => {
        const instructor = await ctx.prisma.instructor.findUnique({
            where: { userId: ctx.session.user.id },
            // Removendo includes complexos para evitar erros de tipagem/schema por enquanto
        });
        return instructor;
    }),

    createFirstPlan: protectedProcedure
        .input(firstPlanSchema)
        .mutation(async ({ ctx, input }) => {
            const { weeklyHours, cep, pricePerHour, vehicle, photos, street, neighborhood, city, state } = input;
            const userId = ctx.session.user.id;

            console.log("📝 [createFirstPlan] Iniciando...", { userId, input });

            try {
                // 1. Geocodificar endereço para obter Lat/Lng
                let lat: number | null = null;
                let lng: number | null = null;
                const fullAddress = `${street || ''}, ${neighborhood || ''}, ${city} - ${state}, Brasil`;

                try {
                    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
                    if (token) {
                        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(fullAddress)}.json?access_token=${token}&country=br&limit=1`;
                        const res = await fetch(url);
                        const data = await res.json();
                        if (data.features && data.features.length > 0) {
                            lng = data.features[0].center[0];
                            lat = data.features[0].center[1];
                        }
                    }
                } catch (err) {
                    console.error("Erro ao geocodificar endereço:", err);
                }

                // 2. Upsert Instructor com Availability aninhado
                const instructor = await ctx.prisma.instructor.upsert({
                    where: { userId },
                    create: {
                        userId,
                        pricePerHour,
                        cep,
                        street,
                        neighborhood,
                        city,
                        state,
                        isOnline: true,
                        status: "ACTIVE",
                        isAvailable: true,
                        latitude: lat,
                        longitude: lng,
                        // @ts-ignore
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
                        pricePerHour,
                        cep,
                        isOnline: true,
                        latitude: lat ?? undefined,
                        longitude: lng ?? undefined,
                        // @ts-ignore
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
                    },
                });

                // 2. Criar Veículo via User update (nested write)
                await ctx.prisma.user.update({
                    where: { id: userId },
                    data: {
                        // @ts-ignore
                        vehicles: {
                            create: {
                                brand: "Não informada",
                                model: vehicle.model,
                                year: vehicle.year,
                                color: vehicle.color,
                                plateLastFour: vehicle.plate.slice(-4) || "0000",
                                category: "HATCH",
                                transmission: vehicle.transmission === 'automatic' ? "AUTOMATICO" : "MANUAL",
                                fuel: "FLEX",
                                engine: "1.0",
                                hasDualPedal: vehicle.hasDualPedals,
                                photoUrl: photos[0]?.url || "",
                                photos: photos.map(p => p.url),
                                status: "active"
                            }
                        }
                    }
                });

                console.log("✅ [createFirstPlan] Sucesso!");
                return { success: true, instructorId: instructor.id };

            } catch (error: any) {
                console.error("❌ [createFirstPlan] Erro:", error);
                // Log detalhado do erro Prisma se disponível
                if (error.code) {
                    console.error("❌ [createFirstPlan] Prisma Code:", error.code);
                    console.error("❌ [createFirstPlan] Prisma Meta:", error.meta);
                }
                throw error;
            }
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
