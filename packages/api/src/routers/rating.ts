import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const ratingRouter = router({
  // Criar avaliação pós-aula
  create: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
        rating: z.number().min(1).max(5),
        comment: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        include: { student: true, instructor: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Verificar se a aula existe e está finalizada
      const lesson = await ctx.prisma.lesson.findUnique({
        where: { id: input.lessonId },
        include: {
          student: true,
          instructor: true,
        },
      });

      if (!lesson) {
        throw new Error("Lesson not found");
      }

      if (lesson.status !== "FINISHED") {
        throw new Error("Cannot rate lesson that is not finished");
      }

      // Verificar se o usuário é aluno ou instrutor da aula
      const isStudent = lesson.studentId === user.student?.id;
      const isInstructor = lesson.instructorId === user.instructor?.id;

      if (!isStudent && !isInstructor) {
        throw new Error("You are not part of this lesson");
      }

      // Verificar se já avaliou
      const existingRating = await ctx.prisma.rating.findFirst({
        where: {
          lessonId: input.lessonId,
          raterId: user.id,
        },
      });

      if (existingRating) {
        throw new Error("You have already rated this lesson");
      }

      // Criar avaliação
      const ratedId = isStudent ? lesson.instructor.userId : lesson.student.userId;

      const rating = await ctx.prisma.rating.create({
        data: {
          lessonId: input.lessonId,
          raterId: user.id,
          ratedId: ratedId,
          rating: input.rating,
          comment: input.comment,
        },
      });

      // Atualizar média do avaliado
      if (isStudent) {
        // Aluno avaliando instrutor
        const instructorRatings = await ctx.prisma.rating.findMany({
          where: { ratedId: ratedId },
        });

        const avgRating =
          instructorRatings.reduce((acc, r) => acc + r.rating, 0) /
          instructorRatings.length;

        await ctx.prisma.instructor.update({
          where: { id: lesson.instructorId },
          data: {
            averageRating: avgRating,
            totalRatings: instructorRatings.length,
          },
        });
      }

      // Processar gamificação
      const { processRatingGiven, processRatingReceived } = await import("../modules/gamification");
      await processRatingGiven(user.id); // Quem avaliou ganha pontos
      await processRatingReceived(ratedId, input.rating); // Quem foi avaliado pode ganhar pontos/medalhas

      return rating;
    }),

  // Buscar avaliações de um usuário (instrutor)
  getByInstructor: protectedProcedure
    .input(
      z.object({
        instructorId: z.string(),
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const instructor = await ctx.prisma.instructor.findUnique({
        where: { id: input.instructorId },
      });

      if (!instructor) {
        throw new Error("Instructor not found");
      }

      const ratings = await ctx.prisma.rating.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: { ratedId: instructor.userId },
        orderBy: { createdAt: "desc" },
        include: {
          rater: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          lesson: {
            select: {
              id: true,
              scheduledAt: true,
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (ratings.length > input.limit) {
        const nextItem = ratings.pop();
        nextCursor = nextItem!.id;
      }

      return {
        ratings,
        nextCursor,
      };
    }),

  // Buscar avaliação de uma aula específica
  getByLesson: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const ratings = await ctx.prisma.rating.findMany({
        where: { lessonId: input.lessonId },
        include: {
          rater: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          rated: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      return ratings;
    }),

  // Verificar se usuário já avaliou uma aula
  hasRated: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
      });

      if (!user) {
        return false;
      }

      const rating = await ctx.prisma.rating.findFirst({
        where: {
          lessonId: input.lessonId,
          raterId: user.id,
        },
      });

      return !!rating;
    }),
});
