import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
    // Dashboard Stats
    getStats: protectedProcedure.query(async ({ ctx }) => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const [
            totalStudents,
            studentsLastMonth,
            activeInstructors,
            activeInstructorsLastMonth,
            lessonsToday,
            lessonsPending,
            activeSOS,
            monthlyRevenue,
            lastMonthRevenue,
        ] = await Promise.all([
            // Total de alunos atual
            ctx.prisma.student.count(),
            // Total de alunos até o mês passado
            ctx.prisma.student.count({
                where: { createdAt: { lt: startOfMonth } }
            }),
            // Instrutores ativos agora
            ctx.prisma.instructor.count({ where: { status: "ACTIVE" } }),
            // Instrutores ativos no mês passado
            ctx.prisma.instructor.count({
                where: {
                    status: "ACTIVE",
                    createdAt: { lt: startOfMonth }
                }
            }),
            // Aulas hoje
            ctx.prisma.lesson.count({
                where: {
                    scheduledAt: {
                        gte: new Date(now.setHours(0, 0, 0, 0)),
                        lt: new Date(now.setHours(23, 59, 59, 999)),
                    },
                },
            }),
            // Aulas pendentes
            ctx.prisma.lesson.count({ where: { status: "PENDING" } }),
            // SOS ativos (placeholder)
            0,
            // Receita do mês atual
            ctx.prisma.payment.aggregate({
                where: {
                    status: "COMPLETED",
                    createdAt: { gte: startOfMonth },
                },
                _sum: { amount: true },
            }),
            // Receita do mês passado
            ctx.prisma.payment.aggregate({
                where: {
                    status: "COMPLETED",
                    createdAt: {
                        gte: startOfLastMonth,
                        lt: startOfMonth,
                    },
                },
                _sum: { amount: true },
            }),
        ]);

        // Calcular porcentagens de crescimento
        const calculateGrowth = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        const studentsGrowth = calculateGrowth(totalStudents, studentsLastMonth);
        const instructorsGrowth = calculateGrowth(activeInstructors, activeInstructorsLastMonth);
        const revenueGrowth = calculateGrowth(
            Number(monthlyRevenue._sum.amount || 0),
            Number(lastMonthRevenue._sum.amount || 0)
        );

        // Receita por mês (últimos 12 meses)
        const revenueByMonth = await Promise.all(
            Array.from({ length: 12 }, async (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
                const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

                const revenue = await ctx.prisma.payment.aggregate({
                    where: {
                        status: "COMPLETED",
                        createdAt: { gte: startOfMonth, lte: endOfMonth },
                    },
                    _sum: { amount: true },
                });

                return {
                    name: date.toLocaleDateString("pt-BR", { month: "short" }),
                    total: Number(revenue._sum.amount || 0),
                };
            })
        );

        // Atividades recentes
        const recentActivities = await ctx.prisma.activityLog.findMany({
            take: 10,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, image: true } } },
        });

        // Taxa de conversão (aulas agendadas vs concluídas no mês)
        const [scheduledLessons, completedLessons] = await Promise.all([
            ctx.prisma.lesson.count({
                where: {
                    createdAt: { gte: startOfMonth },
                    status: { in: ["SCHEDULED", "FINISHED"] }
                }
            }),
            ctx.prisma.lesson.count({
                where: {
                    createdAt: { gte: startOfMonth },
                    status: "FINISHED"
                }
            }),
        ]);

        const conversionRate = scheduledLessons > 0
            ? Math.round((completedLessons / scheduledLessons) * 100)
            : 0;

        return {
            totalStudents,
            studentsGrowth,
            activeInstructors,
            instructorsGrowth,
            lessonsToday,
            lessonsPending,
            activeSOS,
            monthlyRevenue: Number(monthlyRevenue._sum.amount || 0),
            revenueGrowth,
            conversionRate,
            revenueByMonth: revenueByMonth.reverse(),
            recentActivities: recentActivities.map((activity) => ({
                id: activity.id,
                type: activity.action,
                user: activity.user,
                description: activity.action,
                createdAt: activity.createdAt,
            })),
        };
    }),

    // Instructors
    getInstructors: publicProcedure
        .query(async ({ ctx }) => {
            const input = { status: "all" }; // Hardcoded for test
            const where =
                input.status && input.status !== "all"
                    ? { status: input.status as any }
                    : {};

            const instructors = await ctx.prisma.instructor.findMany({
                where,
                include: {
                    user: { select: { name: true, email: true, image: true } },
                },
                orderBy: { createdAt: "desc" },
            });

            console.log(`[getInstructors] Status: ${input.status}, Retornando ${instructors.length} instrutores`);
            return instructors;
        }),

    approveInstructor: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            console.log('[approveInstructor] Recebido ID:', input.id);

            if (!input.id) {
                throw new Error('ID do instrutor é obrigatório');
            }

            try {
                const instructor = await ctx.prisma.instructor.findUnique({
                    where: { id: input.id },
                });

                if (!instructor) {
                    throw new Error(`Instrutor com ID ${input.id} não encontrado`);
                }

                console.log('[approveInstructor] Instrutor encontrado:', instructor.id);

                const updated = await ctx.prisma.instructor.update({
                    where: { id: input.id },
                    data: { status: "ACTIVE" },
                });

                console.log('[approveInstructor] Instrutor aprovado com sucesso:', updated.id);
                return updated;
            } catch (error) {
                console.error('[approveInstructor] Erro:', error);
                throw error;
            }
        }),

    suspendInstructor: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.instructor.update({
                where: { id: input.id },
                data: { status: "SUSPENDED" },
            });
        }),

    // Students
    getStudents: protectedProcedure.query(async ({ ctx }) => {
        // CORREÇÃO AUTOMÁTICA
        try {
            const usersWithoutProfile = await ctx.prisma.user.findMany({
                where: { role: 'STUDENT', student: { is: null } }
            });

            if (usersWithoutProfile.length > 0) {
                for (const user of usersWithoutProfile) {
                    await ctx.prisma.student.create({
                        data: {
                            userId: user.id,
                            points: 0,
                            level: 1,
                            walletBalance: 0,
                        }
                    });
                }
            }
        } catch (e) {
            console.error("Erro no auto-fix:", e);
        }

        const students = await ctx.prisma.student.findMany({
            include: {
                user: { select: { name: true, email: true, image: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        console.log(`[getStudents] Retornando ${students.length} alunos.`);
        return students;
    }),

    // Lessons
    getLessons: protectedProcedure
        .input(
            z.object({
                status: z.string().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const where =
                input.status && input.status !== "all"
                    ? { status: input.status as any }
                    : {};

            return ctx.prisma.lesson.findMany({
                where,
                include: {
                    student: { include: { user: { select: { name: true } } } },
                    instructor: { include: { user: { select: { name: true } } } },
                    payment: true,
                },
                orderBy: { scheduledAt: "desc" },
                take: 100,
            });
        }),

    // Payments
    getPayments: protectedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.payment.findMany({
            include: {
                lesson: {
                    include: {
                        student: { include: { user: { select: { name: true } } } },
                        instructor: { include: { user: { select: { name: true } } } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });
    }),

    // Ratings
    getRatings: protectedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.rating.findMany({
            include: {
                student: { include: { user: { select: { name: true } } } },
                instructor: { include: { user: { select: { name: true } } } },
                lesson: true,
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });
    }),

    // Vehicles
    getVehicles: protectedProcedure.query(async ({ ctx }) => {
        return ctx.prisma.vehicle.findMany({
            include: {
                user: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }),

    // Wallet
    addBalance: protectedProcedure
        .input(
            z.object({
                studentId: z.string(),
                amount: z.number(),
                description: z.string().optional(),
                type: z.enum(["DEPOSIT", "WITHDRAW", "BONUS"]).default("DEPOSIT"),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Transaction para garantir atomicidade
            return ctx.prisma.$transaction(async (tx) => {
                // 1. Criar transação
                const transaction = await tx.walletTransaction.create({
                    data: {
                        studentId: input.studentId,
                        amount: input.amount,
                        type: input.type,
                        description: input.description,
                    },
                });

                // 2. Atualizar saldo do aluno
                const student = await tx.student.findUnique({
                    where: { id: input.studentId },
                });

                if (!student) throw new Error("Student not found");

                const oldBalance = Number(student.walletBalance);
                const newBalance = oldBalance + input.amount;

                await tx.student.update({
                    where: { id: input.studentId },
                    data: { walletBalance: newBalance },
                });

                return transaction;
            });
        }),

    getWalletTransactions: protectedProcedure
        .input(z.object({ studentId: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.walletTransaction.findMany({
                where: { studentId: input.studentId },
                orderBy: { createdAt: "desc" },
            });
        }),
});
