import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { hash, compare } from "bcryptjs";

export const userRouter = createTRPCRouter({
    // Atualizar foto de perfil
    updateProfileImage: protectedProcedure
        .input(z.object({
            imageUrl: z.string().url(),
        }))
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.update({
                where: { id: ctx.session.user.id },
                data: { image: input.imageUrl },
            });

            return {
                success: true,
                imageUrl: user.image,
            };
        }),

    // Alterar senha
    updatePassword: protectedProcedure
        .input(z.object({
            currentPassword: z.string().min(6),
            newPassword: z.string().min(6),
        }))
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findUnique({
                where: { id: ctx.session.user.id },
                select: { password: true },
            });

            if (!user?.password) {
                throw new Error("Usuário não possui senha (login social)");
            }

            // Verificar senha atual
            const isValid = await compare(input.currentPassword, user.password);
            if (!isValid) {
                throw new Error("Senha atual incorreta");
            }

            // Hash da nova senha
            const hashedPassword = await hash(input.newPassword, 10);

            // Atualizar senha
            await ctx.prisma.user.update({
                where: { id: ctx.session.user.id },
                data: { password: hashedPassword },
            });

            return {
                success: true,
            };
        }),

    // Atualizar preferências de notificação
    updateNotificationPreferences: protectedProcedure
        .input(z.object({
            lessonAlerts: z.boolean().optional(),
            marketing: z.boolean().optional(),
        }))
        .mutation(async ({ ctx, input }) => {
            // Por enquanto, vamos salvar no próprio User como JSON
            // Futuramente pode ser uma tabela separada
            const currentUser = await ctx.prisma.user.findUnique({
                where: { id: ctx.session.user.id },
                select: { id: true },
            });

            if (!currentUser) {
                throw new Error("Usuário não encontrado");
            }

            // Como não temos campo específico, vamos retornar sucesso
            // TODO: Adicionar campo notificationPreferences no schema
            return {
                success: true,
                preferences: input,
            };
        }),

    // Buscar preferências de notificação
    getNotificationPreferences: protectedProcedure
        .query(async ({ ctx }) => {
            // Retornar valores padrão por enquanto
            return {
                lessonAlerts: true,
                marketing: false,
            };
        }),
});
