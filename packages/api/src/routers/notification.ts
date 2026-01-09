import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";
import { NotificationType } from "@bora/db";

export const notificationRouter = router({
  // Obter notificações do usuário
  getMyNotifications: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        skip: z.number().min(0).default(0),
        unreadOnly: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: any = {
        userId: ctx.session.user.id,
      };

      if (input.unreadOnly) {
        where.read = false;
      }

      const [notifications, total, unreadCount] = await Promise.all([
        ctx.prisma.notification.findMany({
          where,
          take: input.limit,
          skip: input.skip,
          orderBy: { createdAt: "desc" },
        }),
        ctx.prisma.notification.count({ where }),
        ctx.prisma.notification.count({
          where: {
            userId: ctx.session.user.id,
            read: false,
          },
        }),
      ]);

      return {
        notifications,
        total,
        unreadCount,
        hasMore: input.skip + input.limit < total,
      };
    }),

  // Marcar notificação como lida
  markAsRead: protectedProcedure
    .input(
      z.object({
        notificationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.prisma.notification.update({
        where: {
          id: input.notificationId,
          userId: ctx.session.user.id, // Garantir que é do usuário
        },
        data: {
          read: true,
          readAt: new Date(),
        },
      });

      return notification;
    }),

  // Marcar todas como lidas
  markAllAsRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      await ctx.prisma.notification.updateMany({
        where: {
          userId: ctx.session.user.id,
          read: false,
        },
        data: {
          read: true,
          readAt: new Date(),
        },
      });

      return { success: true };
    }),

  // Deletar notificação
  deleteNotification: protectedProcedure
    .input(
      z.object({
        notificationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.notification.delete({
        where: {
          id: input.notificationId,
          userId: ctx.session.user.id,
        },
      });

      return { success: true };
    }),

  // Criar notificação (admin ou sistema)
  createNotification: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        type: z.enum([
          "DOCUMENT_APPROVED",
          "DOCUMENT_REJECTED",
          "DOCUMENT_MORE_DOCS_REQUESTED",
          "LESSON_SCHEDULED",
          "LESSON_CANCELLED",
          "PAYMENT_RECEIVED",
          "SYSTEM_ALERT",
        ]),
        title: z.string(),
        message: z.string(),
        data: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.prisma.notification.create({
        data: {
          userId: input.userId,
          type: input.type as NotificationType,
          title: input.title,
          message: input.message,
          data: input.data,
        },
      });

      return notification;
    }),

  // Obter contagem de não lidas
  getUnreadCount: protectedProcedure
    .query(async ({ ctx }) => {
      const count = await ctx.prisma.notification.count({
        where: {
          userId: ctx.session.user.id,
          read: false,
        },
      });

      return { count };
    }),
});
