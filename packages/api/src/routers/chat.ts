import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { sendChatNotification, CHAT_EVENTS } from "../modules/pusher";

export const chatRouter = router({
  // Enviar mensagem
  sendMessage: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
        content: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
      });

      if (!user) throw new Error("User not found");

      // Verificar se o usuário pertence à aula
      const lesson = await ctx.prisma.lesson.findUnique({
        where: { id: input.lessonId },
        include: {
          student: { include: { user: true } },
          instructor: { include: { user: true } },
        },
      });

      if (!lesson) throw new Error("Lesson not found");

      const isParticipant =
        lesson.student.userId === user.id ||
        lesson.instructor.userId === user.id;

      if (!isParticipant) {
        throw new Error("Unauthorized");
      }

      // Verificar janela de tempo (permitir sempre se status é SCHEDULED para solicitações)
      // Se a aula já foi agendada, permitir chat 1h antes até 1h depois
      if (lesson.status === "SCHEDULED") {
        // Permitir chat para aulas agendadas (aguardando aprovação)
        // Não há restrição de tempo
      } else {
        const now = new Date();
        const scheduledTime = new Date(lesson.scheduledAt);
        const hourBefore = new Date(scheduledTime.getTime() - 60 * 60 * 1000);
        const hourAfter = lesson.endedAt
          ? new Date(lesson.endedAt.getTime() + 60 * 60 * 1000)
          : new Date(scheduledTime.getTime() + 3 * 60 * 60 * 1000);

        if (now < hourBefore || now > hourAfter) {
          throw new Error("Chat only available 1h before to 1h after lesson");
        }
      }

      // Criar mensagem
      const message = await ctx.prisma.chatMessage.create({
        data: {
          lessonId: input.lessonId,
          senderId: user.id,
          content: input.content,
        },
      });

      // Notificar via Pusher
      await sendChatNotification(input.lessonId, CHAT_EVENTS.NEW_MESSAGE, {
        id: message.id,
        senderId: user.id,
        senderName: user.name,
        content: message.content,
        createdAt: message.createdAt,
      });

      return message;
    }),

  // Listar mensagens da aula
  listMessages: protectedProcedure
    .input(z.object({ lessonId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.chatMessage.findMany({
        where: { lessonId: input.lessonId },
        orderBy: { createdAt: "asc" },
      });
    }),

  // Marcar como lida
  markAsRead: protectedProcedure
    .input(z.object({ messageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.chatMessage.update({
        where: { id: input.messageId },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });
    }),
});

