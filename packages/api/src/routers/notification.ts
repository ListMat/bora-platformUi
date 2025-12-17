import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const notificationRouter = router({
  // Registrar token de notificação push
  registerToken: protectedProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // TODO: Salvar token no banco de dados (criar tabela UserNotificationToken)
      // Por enquanto, apenas retornar sucesso
      return { success: true };
    }),

  // Enviar notificação (usado pelo backend)
  send: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string(),
        body: z.string(),
        data: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Implementar envio de notificação push via Expo Push Notification Service
      // Por enquanto, apenas retornar sucesso
      return { success: true };
    }),
});

