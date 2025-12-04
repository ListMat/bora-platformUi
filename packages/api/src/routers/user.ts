import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../trpc";
import { UserRole } from "@bora/db";

export const userRouter = router({
  // Obter usuário atual
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
      include: {
        student: true,
        instructor: true,
      },
    });
    return user;
  }),

  // Listar todos os usuários (admin)
  list: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        role: z.nativeEnum(UserRole).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const users = await ctx.prisma.user.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: input.role ? { role: input.role } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          student: true,
          instructor: true,
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (users.length > input.limit) {
        const nextItem = users.pop();
        nextCursor = nextItem!.id;
      }

      return {
        users,
        nextCursor,
      };
    }),

  // Atualizar perfil
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(100).optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { email: ctx.session.user.email! },
        data: input,
      });
      return user;
    }),

  // Banir/desbanir usuário (admin)
  toggleBan: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        banned: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Implementação depende de como você quer implementar ban
      // Por enquanto, apenas um log
      await ctx.prisma.activityLog.create({
        data: {
          userId: ctx.session.user.email!,
          action: input.banned ? "BAN_USER" : "UNBAN_USER",
          resource: input.userId,
          metadata: { banned: input.banned },
        },
      });
      return { success: true };
    }),

  // Deletar dados (LGPD/GDPR)
  deleteMyData: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Log da ação
    await ctx.prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "DELETE_USER_DATA",
        resource: "USER",
      },
    });

    // Deletar usuário (cascade deletará tudo relacionado)
    await ctx.prisma.user.delete({
      where: { id: user.id },
    });

    return { success: true };
  }),
});

