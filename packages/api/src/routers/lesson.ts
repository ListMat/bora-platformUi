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
        recordingConsent: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const lesson = await ctx.prisma.lesson.update({
        where: { id: input.lessonId },
        data: {
          status: LessonStatus.ACTIVE,
          startedAt: new Date(),
          recordingConsent: input.recordingConsent || false,
        },
      });

      return lesson;
    }),

  // Atualizar URL de gravação (se habilitada)
  updateRecording: instructorProcedure
    .input(
      z.object({
        lessonId: z.string(),
        recordingUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const lesson = await ctx.prisma.lesson.findUnique({
        where: { id: input.lessonId },
      });

      if (!lesson) {
        throw new Error("Lesson not found");
      }

      if (!lesson.recordingConsent) {
        throw new Error("Recording not authorized for this lesson");
      }

      const updatedLesson = await ctx.prisma.lesson.update({
        where: { id: input.lessonId },
        data: { recordingUrl: input.recordingUrl },
      });

      return updatedLesson;
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
        include: {
          student: { include: { user: true } },
          instructor: { include: { user: true } },
        },
      });

      if (!startedLesson?.startedAt) {
        throw new Error("Lesson not started");
      }

      const duration = Math.floor(
        (new Date().getTime() - startedLesson.startedAt.getTime()) / 1000 / 60
      );

      const endedAt = new Date();

      // Gerar recibo PDF
      const { generateReceipt, generateReceiptFilename } = await import("../modules/receiptGenerator");
      const { uploadReceipt } = await import("../modules/supabaseStorage");

      const pdfBuffer = await generateReceipt({
        lessonId: input.lessonId,
        studentName: startedLesson.student.user.name || "Aluno",
        studentCPF: startedLesson.student.cpf || undefined,
        instructorName: startedLesson.instructor.user.name || "Instrutor",
        instructorCNH: startedLesson.instructor.cnhNumber || undefined,
        instructorCredential: startedLesson.instructor.credentialNumber || undefined,
        scheduledAt: startedLesson.scheduledAt,
        startedAt: startedLesson.startedAt,
        endedAt: endedAt,
        duration: duration,
        price: Number(startedLesson.price),
        pickupAddress: startedLesson.pickupAddress || "",
      });

      const filename = generateReceiptFilename(input.lessonId);
      const receiptUrl = await uploadReceipt(input.lessonId, pdfBuffer, filename);

      const lesson = await ctx.prisma.lesson.update({
        where: { id: input.lessonId },
        data: {
          status: LessonStatus.FINISHED,
          endedAt: endedAt,
          duration,
          instructorNotes: input.instructorNotes,
          receiptUrl: receiptUrl,
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

      // Processar gamificação
      const { processLessonCompletion } = await import("../modules/gamification");
      await processLessonCompletion(startedLesson.student.userId, input.lessonId, endedAt);

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

  // Atualizar localização do instrutor em tempo real
  updateLocation: instructorProcedure
    .input(
      z.object({
        lessonId: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verificar se a aula pertence ao instrutor
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        include: { instructor: true },
      });

      const lesson = await ctx.prisma.lesson.findFirst({
        where: {
          id: input.lessonId,
          instructorId: user?.instructor?.id,
        },
      });

      if (!lesson) {
        throw new Error("Lesson not found or unauthorized");
      }

      const updatedLesson = await ctx.prisma.lesson.update({
        where: { id: input.lessonId },
        data: {
          currentLatitude: input.latitude,
          currentLongitude: input.longitude,
        },
      });

      return updatedLesson;
    }),

  // Buscar detalhes da aula (para tela ao vivo)
  getById: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const lesson = await ctx.prisma.lesson.findUnique({
        where: { id: input.lessonId },
        include: {
          student: {
            include: {
              user: true,
            },
          },
          instructor: {
            include: {
              user: true,
            },
          },
          payment: true,
          rating: true,
        },
      });

      if (!lesson) {
        throw new Error("Lesson not found");
      }

      return lesson;
    }),
});

