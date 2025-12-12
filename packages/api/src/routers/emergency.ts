import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { checkRateLimit, RATE_LIMITS, RateLimitError } from "../modules/rateLimiter";

export const emergencyRouter = router({
  // Criar chamado de emergência (SOS)
  create: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        description: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Rate limiting para SOS
      const rateLimitResult = await checkRateLimit(
        `emergency:${ctx.session.user.email}`,
        RATE_LIMITS.EMERGENCY
      );

      if (rateLimitResult.limited) {
        throw new RateLimitError(rateLimitResult.remaining);
      }

      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Verificar se a aula existe e está em andamento
      const lesson = await ctx.prisma.lesson.findUnique({
        where: { id: input.lessonId },
        include: {
          student: { include: { user: true } },
          instructor: { include: { user: true } },
        },
      });

      if (!lesson) {
        throw new Error("Lesson not found");
      }

      if (lesson.status !== "IN_PROGRESS") {
        throw new Error("Lesson is not in progress");
      }

      // Criar registro de emergência
      const emergency = await ctx.prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "EMERGENCY_SOS",
          resource: "LESSON",
          metadata: {
            lessonId: input.lessonId,
            latitude: input.latitude,
            longitude: input.longitude,
            description: input.description,
            studentId: lesson.student.userId,
            instructorId: lesson.instructor.userId,
            timestamp: new Date().toISOString(),
          },
        },
      });

      // TODO: Enviar notificação push para ambas as partes
      // TODO: Notificar equipe de suporte
      // TODO: Integrar com serviços de emergência se necessário

      return {
        id: emergency.id,
        message: "Chamado de emergência registrado. Ajuda está a caminho.",
      };
    }),

  // Listar chamados de emergência (admin)
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const emergencies = await ctx.prisma.activityLog.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: { action: "EMERGENCY_SOS" },
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (emergencies.length > input.limit) {
        const nextItem = emergencies.pop();
        nextCursor = nextItem!.id;
      }

      return {
        emergencies,
        nextCursor,
      };
    }),

  // Resolver chamado de emergência
  resolve: protectedProcedure
    .input(
      z.object({
        emergencyId: z.string(),
        resolution: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const emergency = await ctx.prisma.activityLog.findUnique({
        where: { id: input.emergencyId },
      });

      if (!emergency) {
        throw new Error("Emergency not found");
      }

      // Atualizar metadata com resolução
      const metadata = emergency.metadata as any;
      metadata.resolved = true;
      metadata.resolvedAt = new Date().toISOString();
      metadata.resolution = input.resolution;
      metadata.resolvedBy = ctx.session.user.email;

      await ctx.prisma.activityLog.update({
        where: { id: input.emergencyId },
        data: { metadata },
      });

      return { success: true };
    }),
});
