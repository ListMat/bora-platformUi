import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { PaymentMethod, PaymentStatus } from "@bora/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia" as any,
});

export const bundleRouter = router({
  // Listar pacotes disponíveis (público)
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.bundle.findMany({
      where: { isActive: true },
      orderBy: [{ featured: "desc" }, { totalLessons: "asc" }],
    });
  }),

  // Comprar pacote
  purchase: protectedProcedure
    .input(
      z.object({
        bundleId: z.string(),
        method: z.nativeEnum(PaymentMethod),
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

      const bundle = await ctx.prisma.bundle.findUnique({
        where: { id: input.bundleId },
      });

      if (!bundle || !bundle.isActive) {
        throw new Error("Bundle not available");
      }

      // Calcular expiração se definida
      const expiresAt = bundle.expiryDays
        ? new Date(Date.now() + bundle.expiryDays * 24 * 60 * 60 * 1000)
        : null;

      // Criar compra do pacote
      const purchase = await ctx.prisma.bundlePurchase.create({
        data: {
          studentId: user.student.id,
          bundleId: bundle.id,
          totalCredits: bundle.totalLessons,
          remainingCredits: bundle.totalLessons,
          amount: bundle.price,
          expiresAt,
        },
      });

      return purchase;
    }),

  // Criar PaymentIntent para pacote
  createIntent: protectedProcedure
    .input(z.object({ bundlePurchaseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const purchase = await ctx.prisma.bundlePurchase.findUnique({
        where: { id: input.bundlePurchaseId },
        include: { student: { include: { user: true } }, bundle: true },
      });

      if (!purchase) {
        throw new Error("Purchase not found");
      }

      // Criar Payment Intent no Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(purchase.amount) * 100), // centavos
        currency: "brl",
        automatic_payment_methods: { enabled: true },
        metadata: {
          bundlePurchaseId: purchase.id,
          studentId: purchase.studentId,
          bundleName: purchase.bundle.name,
        },
      });

      // Criar registro de pagamento
      await ctx.prisma.bundlePayment.create({
        data: {
          bundlePurchaseId: purchase.id,
          amount: purchase.amount,
          method: "CREDIT_CARD",
          status: PaymentStatus.PROCESSING,
          stripePaymentId: paymentIntent.id,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      };
    }),

  // Confirmar compra de pacote
  confirmPurchase: protectedProcedure
    .input(z.object({ bundlePurchaseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const purchase = await ctx.prisma.bundlePurchase.update({
        where: { id: input.bundlePurchaseId },
        data: { paymentStatus: PaymentStatus.COMPLETED },
        include: { bundle: true },
      });

      return purchase;
    }),

  // Meus pacotes comprados
  myPurchases: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
      include: { student: true },
    });

    if (!user?.student) {
      throw new Error("Student profile not found");
    }

    return ctx.prisma.bundlePurchase.findMany({
      where: {
        studentId: user.student.id,
        paymentStatus: PaymentStatus.COMPLETED,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } },
        ],
      },
      include: { bundle: true },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Usar crédito do pacote (chamado ao agendar aula)
  useCredit: protectedProcedure
    .input(
      z.object({
        bundlePurchaseId: z.string(),
        lessonId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const purchase = await ctx.prisma.bundlePurchase.findUnique({
        where: { id: input.bundlePurchaseId },
      });

      if (!purchase || purchase.remainingCredits <= 0) {
        throw new Error("No credits available");
      }

      // Atualizar créditos
      const updated = await ctx.prisma.bundlePurchase.update({
        where: { id: input.bundlePurchaseId },
        data: {
          usedCredits: { increment: 1 },
          remainingCredits: { decrement: 1 },
        },
      });

      // Marcar aula como paga com crédito
      await ctx.prisma.lesson.update({
        where: { id: input.lessonId },
        data: {
          usedBundleCredit: true,
          bundlePurchaseId: input.bundlePurchaseId,
        },
      });

      return updated;
    }),

  // ADMIN: Criar novo pacote
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        totalLessons: z.number().int().positive(),
        price: z.number().positive(),
        discount: z.number().min(0).max(100).default(0),
        expiryDays: z.number().int().positive().optional(),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: Add admin check
      return ctx.prisma.bundle.create({
        data: input,
      });
    }),
});

