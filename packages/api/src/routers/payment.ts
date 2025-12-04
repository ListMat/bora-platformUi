import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";
import { PaymentMethod, PaymentStatus } from "@bora/db";

export const paymentRouter = router({
  // Criar pagamento
  create: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
        method: z.nativeEnum(PaymentMethod),
        amount: z.number().positive(),
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

      const payment = await ctx.prisma.payment.create({
        data: {
          lessonId: input.lessonId,
          studentId: user.student.id,
          amount: input.amount,
          method: input.method,
          status: PaymentStatus.PENDING,
        },
      });

      // TODO: Integrar com Stripe aqui
      // Se PIX: gerar QR Code via Stripe BR
      // Se CREDIT_CARD: processar via Stripe

      return payment;
    }),

  // Webhook do Stripe (processar eventos)
  stripeWebhook: protectedProcedure
    .input(
      z.object({
        paymentId: z.string(),
        status: z.nativeEnum(PaymentStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const payment = await ctx.prisma.payment.update({
        where: { id: input.paymentId },
        data: {
          status: input.status,
        },
      });

      return payment;
    }),

  // Listar pagamentos (admin)
  list: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
        status: z.nativeEnum(PaymentStatus).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const payments = await ctx.prisma.payment.findMany({
        where: input.status ? { status: input.status } : undefined,
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          lesson: {
            include: {
              student: { include: { user: true } },
              instructor: { include: { user: true } },
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (payments.length > input.limit) {
        const nextItem = payments.pop();
        nextCursor = nextItem!.id;
      }

      return {
        payments,
        nextCursor,
      };
    }),

  // Meus pagamentos
  myPayments: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        cursor: z.string().optional(),
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

      const payments = await ctx.prisma.payment.findMany({
        where: {
          studentId: user.student.id,
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          lesson: {
            include: {
              instructor: { include: { user: true } },
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (payments.length > input.limit) {
        const nextItem = payments.pop();
        nextCursor = nextItem!.id;
      }

      return {
        payments,
        nextCursor,
      };
    }),
});

