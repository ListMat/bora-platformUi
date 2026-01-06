import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
    // Dashboard Stats
    getStats: protectedProcedure.query(async ({ ctx }) => {
        const [
            totalStudents,
            activeInstructors,
            lessonsToday,
            lessonsPending,
            activeSOS,
            monthlyRevenue,
        ] = await Promise.all([
            ctx.prisma.student.count(),
            ctx.prisma.instructor.count({ where: { status: "ACTIVE" } }),
            ctx.prisma.lesson.count({
                where: {
                    scheduledAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        lt: new Date(new Date().setHours(23, 59, 59, 999)),
                    },
                },
            }),
            ctx.prisma.lesson.count({ where: { status: "PENDING" } }),
            0,
            ctx.prisma.payment.aggregate({
                where: {
                    status: "COMPLETED",
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                    },
                },
                _sum: { amount: true },
            }),
        ]);

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

        const recentActivities = await ctx.prisma.activityLog.findMany({
            take: 10,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, image: true } } },
        });

        return {
            totalStudents,
            activeInstructors,
            lessonsToday,
            lessonsPending,
            activeSOS,
            monthlyRevenue: Number(monthlyRevenue._sum.amount || 0),
            conversionRate: 75,
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
    getInstructors: protectedProcedure
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

            return ctx.prisma.instructor.findMany({
                where,
                include: {
                    user: { select: { name: true, email: true, image: true } },
                },
                orderBy: { createdAt: "desc" },
            });
        }),

    approveInstructor: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.instructor.update({
                where: { id: input.id },
                data: { status: "ACTIVE" },
            });
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

        return ctx.prisma.student.findMany({
            include: {
                user: { select: { name: true, email: true, image: true } },
            },
            orderBy: { createdAt: "desc" },
        });
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
});
