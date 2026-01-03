import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const skillRouter = router({
  // Listar todas as skills
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.skill.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });
  }),

  // Instrutor: Avaliar skills após aula
  evaluateLesson: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
        evaluations: z.array(
          z.object({
            skillId: z.string(),
            rating: z.number().int().min(1).max(5),
            comment: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        include: { instructor: true },
      });

      if (!user?.instructor) {
        throw new Error("Instructor profile not found");
      }

      const lesson = await ctx.prisma.lesson.findUnique({
        where: { id: input.lessonId },
        include: { student: true },
      });

      if (!lesson || lesson.instructorId !== user.instructor.id) {
        throw new Error("Lesson not found or unauthorized");
      }

      if (lesson.status !== "FINISHED") {
        throw new Error("Lesson must be finished to evaluate");
      }

      // Criar avaliações
      const evaluations = await Promise.all(
        input.evaluations.map((evaluation) =>
          ctx.prisma.skillEvaluation.upsert({
            where: {
              lessonId_skillId: {
                lessonId: input.lessonId,
                skillId: evaluation.skillId,
              },
            },
            create: {
              lessonId: input.lessonId,
              studentId: lesson.studentId,
              skillId: evaluation.skillId,
              instructorId: user.instructor!.id,
              rating: evaluation.rating,
              comment: evaluation.comment,
            },
            update: {
              rating: evaluation.rating,
              comment: evaluation.comment,
            },
          })
        )
      );

      return evaluations;
    }),

  // Aluno: Ver meu progresso
  myProgress: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
      include: { student: true },
    });

    if (!user?.student) {
      throw new Error("Student profile not found");
    }

    // Buscar todas as skills e suas médias
    const skills = await ctx.prisma.skill.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });

    const progressData = await Promise.all(
      skills.map(async (skill) => {
        const evaluations = await ctx.prisma.skillEvaluation.findMany({
          where: {
            studentId: user.student!.id,
            skillId: skill.id,
          },
          orderBy: { createdAt: "desc" },
          take: 10, // Últimas 10 avaliações
        });

        const avgRating =
          evaluations.length > 0
            ? evaluations.reduce((sum, e) => sum + e.rating, 0) /
            evaluations.length
            : 0;

        const lastRating = evaluations[0]?.rating || 0;
        const totalEvaluations = evaluations.length;

        return {
          skill,
          avgRating: Math.round(avgRating * 10) / 10,
          lastRating,
          totalEvaluations,
          recentEvaluations: evaluations.slice(0, 3),
        };
      })
    );

    // Calcular progresso geral (% para aprovação - média >= 4)
    const totalWeight = skills.reduce((sum, s) => sum + s.weight, 0);
    const achievedWeight = progressData.reduce((sum, p) => {
      return p.avgRating >= 4 ? sum + p.skill.weight : sum;
    }, 0);
    const overallProgress = Math.round((achievedWeight / totalWeight) * 100);

    return {
      skills: progressData,
      overallProgress,
      readyForExam: overallProgress >= 70, // >= 70% = pronto
    };
  }),

  // Histórico de avaliações de uma skill específica
  skillHistory: protectedProcedure
    .input(z.object({ skillId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        include: { student: true },
      });

      if (!user?.student) {
        throw new Error("Student profile not found");
      }

      return ctx.prisma.skillEvaluation.findMany({
        where: {
          studentId: user.student.id,
          skillId: input.skillId,
        },
        include: {
          lesson: true,
          instructor: { include: { user: true } },
          skill: true,
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  // ADMIN: Criar nova skill
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        category: z.enum(["BASIC", "INTERMEDIATE", "ADVANCED"]),
        weight: z.number().int().positive().default(1),
        order: z.number().int().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Add admin check
      return ctx.prisma.skill.create({
        data: input,
      });
    }),
});

