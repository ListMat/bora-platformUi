import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";
import { PaymentMethod, PaymentStatus } from "@bora/db";
import Stripe from "stripe";
import { checkRateLimit, RATE_LIMITS, RateLimitError } from "../modules/rateLimiter";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

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
      // Rate limiting
      const rateLimitResult = await checkRateLimit(
        `payment:${ctx.session.user.email}`,
        RATE_LIMITS.PAYMENT
      );

      if (rateLimitResult.limited) {
        throw new RateLimitError(rateLimitResult.remaining);
      }

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

      return payment;
    }),

  // Criar PaymentIntent do Stripe (cartão)
  createIntent: protectedProcedure
    .input(
      z.object({
        paymentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const payment = await ctx.prisma.payment.findUnique({
        where: { id: input.paymentId },
        include: {
          student: { include: { user: true } },
        },
      });

      if (!payment) {
        throw new Error("Payment not found");
      }

      // Criar ou recuperar customer do Stripe
      let customerId = payment.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: payment.student.user.email,
          name: payment.student.user.name || undefined,
          metadata: {
            studentId: payment.studentId,
          },
        });
        customerId = customer.id;
        
        await ctx.prisma.payment.update({
          where: { id: payment.id },
          data: { stripeCustomerId: customerId },
        });
      }

      // Criar PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(payment.amount) * 100), // Centavos
        currency: "brl",
        customer: customerId,
        metadata: {
          paymentId: payment.id,
          lessonId: payment.lessonId,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Atualizar payment com Stripe ID
      await ctx.prisma.payment.update({
        where: { id: payment.id },
        data: {
          stripePaymentId: paymentIntent.id,
          status: PaymentStatus.PROCESSING,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    }),

  // Criar pagamento PIX
  createPix: protectedProcedure
    .input(
      z.object({
        paymentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const payment = await ctx.prisma.payment.findUnique({
        where: { id: input.paymentId },
        include: {
          student: { include: { user: true } },
        },
      });

      if (!payment) {
        throw new Error("Payment not found");
      }

      // Criar PaymentIntent com PIX
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(payment.amount) * 100),
        currency: "brl",
        payment_method_types: ["pix"],
        metadata: {
          paymentId: payment.id,
          lessonId: payment.lessonId,
        },
      });

      // Obter QR Code do PIX
      const paymentMethod = await stripe.paymentMethods.create({
        type: "pix",
      });

      await stripe.paymentIntents.confirm(paymentIntent.id, {
        payment_method: paymentMethod.id,
      });

      // Buscar o PaymentIntent atualizado com dados do PIX
      const confirmedIntent = await stripe.paymentIntents.retrieve(paymentIntent.id);
      
      // @ts-ignore - PIX data structure
      const pixData = confirmedIntent.next_action?.pix_display_qr_code;

      // Atualizar payment
      await ctx.prisma.payment.update({
        where: { id: payment.id },
        data: {
          stripePaymentId: paymentIntent.id,
          pixQrCode: pixData?.data || "",
          pixCopyPaste: pixData?.data || "",
          status: PaymentStatus.PROCESSING,
        },
      });

      return {
        qrCode: pixData?.data || "",
        copyPaste: pixData?.data || "",
        expiresAt: pixData?.expires_at,
      };
    }),

  // Verificar status do PIX
  checkPixStatus: protectedProcedure
    .input(
      z.object({
        paymentId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const payment = await ctx.prisma.payment.findUnique({
        where: { id: input.paymentId },
      });

      if (!payment?.stripePaymentId) {
        throw new Error("Payment not found or not initialized");
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(payment.stripePaymentId);

      // Atualizar status se mudou
      if (paymentIntent.status === "succeeded" && payment.status !== PaymentStatus.COMPLETED) {
        await ctx.prisma.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.COMPLETED },
        });

        // Creditar wallet do aluno
        await ctx.prisma.student.update({
          where: { id: payment.studentId },
          data: {
            walletBalance: {
              increment: payment.amount,
            },
          },
        });
      }

      return {
        status: paymentIntent.status,
        isPaid: paymentIntent.status === "succeeded",
      };
    }),

  // Confirmar pagamento (após sucesso no client)
  confirm: protectedProcedure
    .input(
      z.object({
        paymentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const payment = await ctx.prisma.payment.findUnique({
        where: { id: input.paymentId },
      });

      if (!payment) {
        throw new Error("Payment not found");
      }

      // Atualizar status
      const updatedPayment = await ctx.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.COMPLETED },
      });

      // Creditar wallet do aluno
      await ctx.prisma.student.update({
        where: { id: payment.studentId },
        data: {
          walletBalance: {
            increment: payment.amount,
          },
        },
      });

      return updatedPayment;
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

  // Receita do instrutor
  instructorRevenue: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        include: { instructor: true },
      });

      if (!user?.instructor) {
        throw new Error("Instructor profile not found");
      }

      // Buscar todas as aulas finalizadas do instrutor
      const lessons = await ctx.prisma.lesson.findMany({
        where: {
          instructorId: user.instructor.id,
          status: "FINISHED",
        },
        include: {
          payment: true,
        },
      });

      // Calcular receitas
      const totalRevenue = lessons.reduce((sum, lesson) => {
        if (lesson.payment?.status === "COMPLETED") {
          // Instrutor recebe 80% do valor (plataforma fica com 20%)
          return sum + Number(lesson.payment.amount) * 0.8;
        }
        return sum;
      }, 0);

      const pendingRevenue = lessons.reduce((sum, lesson) => {
        if (lesson.payment?.status === "PENDING" || lesson.payment?.status === "PROCESSING") {
          return sum + Number(lesson.payment.amount) * 0.8;
        }
        return sum;
      }, 0);

      // Buscar transações recentes
      const recentPayments = await ctx.prisma.payment.findMany({
        where: {
          lesson: {
            instructorId: user.instructor.id,
          },
          status: "COMPLETED",
        },
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          lesson: {
            include: {
              student: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      return {
        totalRevenue,
        pendingRevenue,
        availableForWithdrawal: totalRevenue, // Simplificado - em produção, subtrair saques já feitos
        recentPayments: recentPayments.map(payment => ({
          id: payment.id,
          amount: Number(payment.amount) * 0.8,
          studentName: payment.lesson.student.user.name,
          date: payment.createdAt,
          lessonDate: payment.lesson.scheduledAt,
        })),
      };
    }),
});

