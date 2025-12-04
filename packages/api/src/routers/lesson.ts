import { z } from "zod";
import { router, protectedProcedure, studentProcedure, instructorProcedure } from "../trpc";
import { LessonStatus } from "@bora/db";

export const lessonRouter = router({
  // Criar aula (estudante)
  create: studentProcedure
    .input(
      z.object({
        instructorId: z.string(),
        scheduledAt: z.date(),
        pickupLatitude: z.number(),
        pickupLongitude: z.number(),
        pickupAddress: z.string(),
        price: z.number().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        include: { student: true },
      });

      if (!user?.student) {
        throw new Error("Student profile not found");
      }

      const lesson = await ctx.prisma.lesson.create({
        data: {
          studentId: user.student.id,
          instructorId: input.instructorId,
          scheduledAt: input.scheduledAt,
          pickupLatitude: input.pickupLatitude,
          pickupLongitude: input.pickupLongitude,
          pickupAddress: input.pickupAddress,
          price: input.price,
          status: LessonStatus.SCHEDULED,
        },
        include: {
          instructor: {
            include: {
              user: true,
            },
          },
        },
      });

      return lesson;
    }),

  // Iniciar aula (instrutor)
  start: instructorProcedure
    .input(
      z.object({
        lessonId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const lesson = await ctx.prisma.lesson.update({
        where: { id: input.lessonId },
        data: {
          status: LessonStatus.ACTIVE,
          startedAt: new Date(),
        },
      });

      return lesson;
    }),

  // Finalizar aula (instrutor)
  end: instructorProcedure
    .input(
      z.object({
        lessonId: z.string(),
        instructorNotes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const startedLesson = await ctx.prisma.lesson.findUnique({
        where: { id: input.lessonId },
      });

      if (!startedLesson?.startedAt) {
        throw new Error("Lesson not started");
      }

      const duration = Math.floor(
        (new Date().getTime() - startedLesson.startedAt.getTime()) / 1000 / 60
      );

      const lesson = await ctx.prisma.lesson.update({
        where: { id: input.lessonId },
        data: {
          status: LessonStatus.FINISHED,
          endedAt: new Date(),
          duration,
          instructorNotes: input.instructorNotes,
        },
      });

      // Atualizar total de aulas do instrutor
      await ctx.prisma.instructor.update({
        where: { id: lesson.instructorId },
        data: {
          totalLessons: {
            increment: 1,
          },
        },
      });

      return lesson;
    }),

  // Listar aulas do estudante
  myLessons: studentProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
        status: z.nativeEnum(LessonStatus).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        include: { student: true },
      });

      if (!user?.student) {
        throw new Error("Student profile not found");
      }

      const lessons = await ctx.prisma.lesson.findMany({
        where: {
          studentId: user.student.id,
          ...(input.status && { status: input.status }),
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { scheduledAt: "desc" },
        include: {
          instructor: {
            include: {
              user: true,
            },
          },
          payment: true,
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (lessons.length > input.limit) {
        const nextItem = lessons.pop();
        nextCursor = nextItem!.id;
      }

      return {
        lessons,
        nextCursor,
      };
    }),

  // Listar aulas do instrutor
  instructorLessons: instructorProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
        status: z.nativeEnum(LessonStatus).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        include: { instructor: true },
      });

      if (!user?.instructor) {
        throw new Error("Instructor profile not found");
      }

      const lessons = await ctx.prisma.lesson.findMany({
        where: {
          instructorId: user.instructor.id,
          ...(input.status && { status: input.status }),
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { scheduledAt: "desc" },
        include: {
          student: {
            include: {
              user: true,
            },
          },
          payment: true,
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (lessons.length > input.limit) {
        const nextItem = lessons.pop();
        nextCursor = nextItem!.id;
      }

      return {
        lessons,
        nextCursor,
      };
    }),

  // Cancelar aula
  cancel: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const lesson = await ctx.prisma.lesson.update({
        where: { id: input.lessonId },
        data: {
          status: LessonStatus.CANCELLED,
        },
      });

      return lesson;
    }),
});

