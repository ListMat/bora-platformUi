import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const vehicleRouter = createTRPCRouter({
    // Criar veículo
    create: protectedProcedure
        .input(
            z.object({
                brand: z.string().min(1, "Marca é obrigatória"),
                model: z.string().min(1, "Modelo é obrigatório"),
                year: z.number().min(1900).max(new Date().getFullYear() + 1),
                color: z.string().min(1, "Cor é obrigatória"),
                transmission: z.enum(["MANUAL", "AUTOMATICO", "CVT", "SEMI_AUTOMATICO"]),
                plateLastFour: z.string().length(4, "Placa deve ter 4 caracteres"),
                category: z.enum(["HATCH", "SEDAN", "SUV", "PICKUP", "SPORTIVO", "COMPACTO", "ELETRICO", "MOTO"]).optional(),
                fuel: z.enum(["GASOLINA", "ETANOL", "FLEX", "DIESEL", "ELETRICO", "HIBRIDO"]).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.vehicle.create({
                data: {
                    userId: ctx.session.user.id,
                    brand: input.brand,
                    model: input.model,
                    year: input.year,
                    color: input.color,
                    transmission: input.transmission,
                    plateLastFour: input.plateLastFour.toUpperCase(),
                    category: input.category || "SEDAN",
                    fuel: input.fuel || "FLEX",
                    engine: "1.0", // Valor padrão
                    status: "active",
                },
            });
        }),

    // Listar veículos do usuário
    getMyVehicles: protectedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.vehicle.findMany({
            where: {
                userId: ctx.session.user.id,
                status: "active",
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }),

    // Deletar veículo
    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // Verificar se o veículo pertence ao usuário
            const vehicle = await ctx.prisma.vehicle.findFirst({
                where: {
                    id: input.id,
                    userId: ctx.session.user.id,
                },
            });

            if (!vehicle) {
                throw new Error("Veículo não encontrado");
            }

            // Soft delete
            return ctx.prisma.vehicle.update({
                where: { id: input.id },
                data: { status: "inactive" },
            });
        }),

    // Atualizar veículo
    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                brand: z.string().min(1).optional(),
                model: z.string().min(1).optional(),
                year: z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
                color: z.string().min(1).optional(),
                transmission: z.enum(["MANUAL", "AUTOMATICO", "CVT", "SEMI_AUTOMATICO"]).optional(),
                plateLastFour: z.string().length(4).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...data } = input;

            // Verificar se o veículo pertence ao usuário
            const vehicle = await ctx.prisma.vehicle.findFirst({
                where: {
                    id,
                    userId: ctx.session.user.id,
                },
            });

            if (!vehicle) {
                throw new Error("Veículo não encontrado");
            }

            return ctx.prisma.vehicle.update({
                where: { id },
                data: {
                    ...data,
                    plateLastFour: data.plateLastFour?.toUpperCase(),
                },
            });
        }),
});
