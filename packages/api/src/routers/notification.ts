import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

// Cliente Expo Push Notifications
const sendPushNotification = async (
  pushToken: string,
  title: string,
  body: string,
  data?: any
) => {
  const message = {
    to: pushToken,
    sound: "default",
    title,
    body,
    data,
    priority: "high",
  };

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();
    console.log("Push notification sent:", result);
    return result;
  } catch (error) {
    console.error("Error sending push notification:", error);
    throw error;
  }
};

export const notificationRouter = router({
  // Registrar token de push notification
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

      // Salvar token no banco
      await ctx.prisma.user.update({
        where: { id: user.id },
        data: {
          pushToken: input.token,
        },
      });

      return { success: true };
    }),

  // Enviar notificação para um usuário específico
  sendToUser: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string(),
        body: z.string(),
        data: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        select: { pushToken: true },
      });

      if (!user?.pushToken) {
        console.log(`User ${input.userId} has no push token`);
        return { success: false, error: "No push token" };
      }

      await sendPushNotification(
        user.pushToken,
        input.title,
        input.body,
        input.data
      );

      return { success: true };
    }),

  // Notificar instrutor sobre nova solicitação de aula
  notifyInstructorNewLesson: protectedProcedure
    .input(
      z.object({
        instructorId: z.string(),
        lessonId: z.string(),
        studentName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const instructor = await ctx.prisma.instructor.findUnique({
        where: { id: input.instructorId },
        include: { user: true },
      });

      if (!instructor?.user.pushToken) {
        return { success: false };
      }

      await sendPushNotification(
        instructor.user.pushToken,
        "Nova Solicitação de Aula",
        `${input.studentName} solicitou uma aula com você!`,
        {
          type: "new_lesson_request",
          lessonId: input.lessonId,
        }
      );

      return { success: true };
    }),

  // Notificar aluno que instrutor aceitou a aula
  notifyStudentLessonAccepted: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
        lessonId: z.string(),
        instructorName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const student = await ctx.prisma.student.findUnique({
        where: { id: input.studentId },
        include: { user: true },
      });

      if (!student?.user.pushToken) {
        return { success: false };
      }

      await sendPushNotification(
        student.user.pushToken,
        "Aula Confirmada!",
        `${input.instructorName} aceitou sua solicitação de aula!`,
        {
          type: "lesson_accepted",
          lessonId: input.lessonId,
        }
      );

      return { success: true };
    }),

  // Notificar aluno que aula está prestes a começar
  notifyLessonStartingSoon: protectedProcedure
    .input(
      z.object({
        studentId: z.string(),
        lessonId: z.string(),
        minutesUntilStart: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const student = await ctx.prisma.student.findUnique({
        where: { id: input.studentId },
        include: { user: true },
      });

      if (!student?.user.pushToken) {
        return { success: false };
      }

      await sendPushNotification(
        student.user.pushToken,
        "Sua Aula Começa em Breve!",
        `Sua aula começa em ${input.minutesUntilStart} minutos`,
        {
          type: "lesson_starting",
          lessonId: input.lessonId,
        }
      );

      return { success: true };
    }),

  // Notificar sobre SOS acionado
  notifyEmergencySOS: protectedProcedure
    .input(
      z.object({
        userIds: z.array(z.string()),
        lessonId: z.string(),
        latitude: z.number(),
        longitude: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const users = await ctx.prisma.user.findMany({
        where: {
          id: { in: input.userIds },
          pushToken: { not: null },
        },
        select: { pushToken: true },
      });

      const notifications = users.map((user) =>
        sendPushNotification(
          user.pushToken!,
          "🚨 EMERGÊNCIA - SOS ACIONADO",
          "Um SOS foi acionado durante uma aula. Equipe notificada.",
          {
            type: "emergency_sos",
            lessonId: input.lessonId,
            latitude: input.latitude,
            longitude: input.longitude,
          }
        )
      );

      await Promise.all(notifications);

      return { success: true, sent: users.length };
    }),
});
