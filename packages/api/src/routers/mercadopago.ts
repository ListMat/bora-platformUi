import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import {
    createPixPayment,
    createPaymentPreference,
    getPaymentStatus,
    calculateSplit,
    processWebhook
} from "../modules/mercadopago";

export const mercadopagoRouter = router({
    // Criar pagamento Pix
    createPixPayment: protectedProcedure
        .input(
            z.object({
                lessonId: z.string(),
                amount: z.number().positive(),
                description: z.string(),
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

            // Buscar dados da aula
            const lesson = await ctx.prisma.lesson.findUnique({
                where: { id: input.lessonId },
                include: {
                    instructor: {
                        include: { user: true },
                    },
                },
            });

            if (!lesson) {
                throw new Error("Lesson not found");
            }

            // Criar pagamento Pix
            const payment = await createPixPayment({
                lessonId: input.lessonId,
                studentEmail: user.email!,
                studentName: user.name || "Aluno",
                instructorName: lesson.instructor.user.name || "Instrutor",
                amount: input.amount,
                description: input.description,
            });

            // Salvar informação do pagamento no banco
            await ctx.prisma.payment.create({
                data: {
                    lessonId: input.lessonId,
                    amount: input.amount,
                    method: "PIX",
                    status: "PENDING",
                    externalId: payment.id,
                },
            });

            return payment;
        }),

    // Criar preferência de pagamento (checkout)
    createPreference: protectedProcedure
        .input(
            z.object({
                lessonId: z.string(),
                amount: z.number().positive(),
                description: z.string(),
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

            const lesson = await ctx.prisma.lesson.findUnique({
                where: { id: input.lessonId },
                include: {
                    instructor: {
                        include: { user: true },
                    },
                },
            });

            if (!lesson) {
                throw new Error("Lesson not found");
            }

            const preference = await createPaymentPreference({
                lessonId: input.lessonId,
                studentEmail: user.email!,
                studentName: user.name || "Aluno",
                instructorName: lesson.instructor.user.name || "Instrutor",
                amount: input.amount,
                description: input.description,
            });

            return preference;
        }),

    // Consultar status do pagamento
    getPaymentStatus: protectedProcedure
        .input(z.object({ paymentId: z.string() }))
        .query(async ({ input }) => {
            const status = await getPaymentStatus(input.paymentId);
            return status;
        }),

    // Webhook (público)
    webhook: publicProcedure
        .input(z.any())
        .mutation(async ({ ctx, input }) => {
            const webhookData = await processWebhook(input);

            if (!webhookData) {
                return { success: false };
            }

            // Atualizar status do pagamento no banco
            if (webhookData.type === 'payment' && webhookData.lessonId) {
                const payment = await ctx.prisma.payment.findFirst({
                    where: {
                        externalId: webhookData.paymentId,
                        lessonId: webhookData.lessonId,
                    },
                });

                if (payment) {
                    // Mapear status do Mercado Pago para nosso sistema
                    let status: "PENDING" | "COMPLETED" | "FAILED" = "PENDING";

                    if (webhookData.status === 'approved') {
                        status = "COMPLETED";
                    } else if (webhookData.status === 'rejected' || webhookData.status === 'cancelled') {
                        status = "FAILED";
                    }

                    await ctx.prisma.payment.update({
                        where: { id: payment.id },
                        data: { status },
                    });

                    // Se aprovado, atualizar status da aula
                    if (status === "COMPLETED") {
                        await ctx.prisma.lesson.update({
                            where: { id: webhookData.lessonId },
                            data: { status: "SCHEDULED" },
                        });

                        // TODO: Enviar notificação para aluno e instrutor
                    }
                }
            }

            return { success: true };
        }),

    // Calcular split de pagamento
    calculateSplit: publicProcedure
        .input(
            z.object({
                amount: z.number().positive(),
                platformFee: z.number().min(0).max(1).optional(),
            })
        )
        .query(({ input }) => {
            return calculateSplit(input.amount, input.platformFee);
        }),

    // Listar pagamentos do aluno
    myPayments: protectedProcedure.query(async ({ ctx }) => {
        const user = await ctx.prisma.user.findUnique({
            where: { email: ctx.session.user.email! },
            include: { student: true },
        });

        if (!user?.student) {
            throw new Error("Student profile not found");
        }

        const payments = await ctx.prisma.payment.findMany({
            where: {
                lesson: {
                    studentId: user.student.id,
                },
            },
            include: {
                lesson: {
                    include: {
                        instructor: {
                            include: {
                                user: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 20,
        });

        return payments;
    }),

    // Listar recebimentos do instrutor
    myEarnings: protectedProcedure.query(async ({ ctx }) => {
        const user = await ctx.prisma.user.findUnique({
            where: { email: ctx.session.user.email! },
            include: { instructor: true },
        });

        if (!user?.instructor) {
            throw new Error("Instructor profile not found");
        }

        const payments = await ctx.prisma.payment.findMany({
            where: {
                lesson: {
                    instructorId: user.instructor.id,
                },
                status: "COMPLETED",
            },
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
            orderBy: {
                createdAt: "desc",
            },
            take: 20,
        });

        // Calcular totais
        const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);
        const split = calculateSplit(total);

        return {
            payments,
            summary: {
                total,
                instructorAmount: split.instructorAmount,
                platformAmount: split.platformAmount,
                count: payments.length,
            },
        };
    }),
});
