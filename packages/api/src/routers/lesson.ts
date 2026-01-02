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

  // Solicitar aula (novo fluxo guiado)
  request: studentProcedure
    .input(
      z.object({
        instructorId: z.string(),
        scheduledAt: z.date(),
        lessonType: z.string(), // "1ª Habilitação", "Direção via pública", etc.
        vehicleId: z.string().optional(), // ID do veículo da autoescola ou do aluno
        useOwnVehicle: z.boolean().default(false),
        planId: z.string().optional(), // ID do plano/pacote
        paymentMethod: z.enum(["PIX", "DINHEIRO", "DEBITO", "CREDITO"]),
        installments: z.number().int().min(1).max(3).default(1),
        pickupLatitude: z.number().optional(),
        pickupLongitude: z.number().optional(),
        pickupAddress: z.string().optional(),
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

      // Verificar se o instrutor existe e está disponível
      const instructor = await ctx.prisma.instructor.findUnique({
        where: { id: input.instructorId },
        include: { user: true },
      });

      if (!instructor || !instructor.isAvailable) {
        throw new Error("Instructor not available");
      }

      // Validar horário (mínimo 2h no futuro)
      const now = new Date();
      const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      if (input.scheduledAt < twoHoursFromNow) {
        throw new Error("A aula deve ser agendada com pelo menos 2 horas de antecedência");
      }

      // Verificar se o horário já está ocupado
      const existingLesson = await ctx.prisma.lesson.findFirst({
        where: {
          instructorId: input.instructorId,
          scheduledAt: input.scheduledAt,
          status: {
            in: ["PENDING", "SCHEDULED", "ACTIVE"],
          },
        },
      });

      if (existingLesson) {
        throw new Error("Horário já está ocupado");
      }

      // Criar aula com status PENDING (aguardando aprovação do instrutor)
      const lesson = await ctx.prisma.lesson.create({
        data: {
          studentId: user.student.id,
          instructorId: input.instructorId,
          scheduledAt: input.scheduledAt,
          pickupLatitude: input.pickupLatitude,
          pickupLongitude: input.pickupLongitude,
          pickupAddress: input.pickupAddress,
          price: input.price,
          status: "PENDING", // Aguardando resposta do instrutor
          lessonType: input.lessonType,
          vehicleId: input.vehicleId,
          useOwnVehicle: input.useOwnVehicle,
          planId: input.planId,
          paymentMethod: input.paymentMethod,
          installments: input.installments,
        },
        include: {
          instructor: {
            include: {
              user: true,
            },
          },
          student: {
            include: {
              user: true,
            },
          },
        },
      });

      // Criar mensagem inicial formatada
      const paymentMethodLabel = {
        PIX: "Pix",
        DINHEIRO: "Dinheiro",
        DEBITO: "Débito",
        CREDITO: "Crédito",
      }[input.paymentMethod];

      const dateStr = new Date(input.scheduledAt).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });

      const timeStr = new Date(input.scheduledAt).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const vehicleStr = input.useOwnVehicle ? "Carro próprio" : "Carro da autoescola";

      const initialMessage = `Solicitação de ${user.name || "Aluno"}
${dateStr} às ${timeStr}
${input.lessonType} – ${vehicleStr}
R$ ${input.price.toFixed(2)} (${paymentMethodLabel} ao final)`;

      // Implementar timer de 2 minutos para expiração
      // Nota: Em produção, usar um job queue (Bull, BullMQ) ou cron job
      setTimeout(async () => {
        try {
          const currentLesson = await ctx.prisma.lesson.findUnique({
            where: { id: lesson.id },
            include: {
              student: { include: { user: true } },
            },
          });

          if (currentLesson?.status === "PENDING") {
            await ctx.prisma.lesson.update({
              where: { id: lesson.id },
              data: { status: "EXPIRED" },
            });

            // Enviar notificação push para o aluno
            const { notifyStudentLessonExpired } = await import("../modules/pushNotifications");
            await notifyStudentLessonExpired({
              studentUserId: currentLesson.student.userId,
              lessonId: lesson.id,
            });

            console.log(`Lesson ${lesson.id} expired - instructor did not respond in time`);
          }
        } catch (error) {
          console.error("Error expiring lesson:", error);
        }
      }, 2 * 60 * 1000); // 2 minutos

      // Enviar notificação push para o instrutor
      const { notifyInstructorNewRequest } = await import("../modules/pushNotifications");
      await notifyInstructorNewRequest({
        instructorUserId: instructor.userId,
        studentName: user.name || "Aluno",
        lessonId: lesson.id,
        scheduledAt: input.scheduledAt,
      });

      console.log(`New lesson request from ${user.name} to instructor ${instructor.user.name}`);


      return {
        lesson,
        initialMessage,
      };
    }),

  // Listar próximas aulas do instrutor
  myUpcoming: instructorProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
      include: { instructor: true },
    });

    if (!user?.instructor) {
      throw new Error("Instructor profile not found");
    }

    const now = new Date();

    return ctx.prisma.lesson.findMany({
      where: {
        instructorId: user.instructor.id,
        scheduledAt: {
          gte: now,
        },
        status: {
          in: ["SCHEDULED", "ACTIVE"],
        },
      },
      include: {
        student: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        scheduledAt: "asc",
      },
      take: 5,
    });
  }),

  // Aceitar solicitação de aula
  acceptRequest: instructorProcedure
    .input(
      z.object({
        lessonId: z.string(),
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
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!lesson || lesson.instructorId !== user.instructor.id) {
        throw new Error("Lesson not found or unauthorized");
      }

      if (lesson.status !== "PENDING") {
        throw new Error("Lesson already processed");
      }

      // Atualizar status da aula para SCHEDULED
      const updatedLesson = await ctx.prisma.lesson.update({
        where: { id: input.lessonId },
        data: {
          status: "SCHEDULED", // Aceita pelo instrutor
        },
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
      });

      // Enviar notificação push para o aluno
      const { notifyStudentLessonAccepted } = await import("../modules/pushNotifications");
      await notifyStudentLessonAccepted({
        studentUserId: updatedLesson.student.userId,
        instructorName: user.name || "Instrutor",
        lessonId: updatedLesson.id,
        scheduledAt: updatedLesson.scheduledAt,
      });

      return updatedLesson;
    }),

  // Recusar solicitação de aula
  rejectRequest: instructorProcedure
    .input(
      z.object({
        lessonId: z.string(),
        reason: z.string().optional(),
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
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!lesson || lesson.instructorId !== user.instructor.id) {
        throw new Error("Lesson not found or unauthorized");
      }

      // Atualizar status da aula para cancelada
      const updatedLesson = await ctx.prisma.lesson.update({
        where: { id: input.lessonId },
        data: {
          status: LessonStatus.CANCELLED,
        },
      });

      // Enviar notificação push para o aluno
      const { notifyStudentLessonRejected } = await import("../modules/pushNotifications");
      await notifyStudentLessonRejected({
        studentUserId: lesson.student.userId,
        instructorName: user.name || "Instrutor",
        lessonId: updatedLesson.id,
        reason: input.reason,
      });

      return updatedLesson;
    }),

  // Reagendar aula
  reschedule: instructorProcedure
    .input(
      z.object({
        lessonId: z.string(),
        newScheduledAt: z.date(),
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
      });

      if (!lesson || lesson.instructorId !== user.instructor.id) {
        throw new Error("Lesson not found or unauthorized");
      }

      // Verificar se o novo horário é pelo menos 2 horas no futuro
      const now = new Date();
      const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      if (input.newScheduledAt < twoHoursFromNow) {
        throw new Error("O novo horário deve ser pelo menos 2 horas no futuro");
      }

      // Atualizar data da aula
      const updatedLesson = await ctx.prisma.lesson.update({
        where: { id: input.lessonId },
        data: {
          scheduledAt: input.newScheduledAt,
        },
        include: {
          student: {
            include: {
              user: true,
            },
          },
        },
      });

      // TODO: Enviar notificação push para o aluno sobre o reagendamento

      return updatedLesson;
    }),
});

