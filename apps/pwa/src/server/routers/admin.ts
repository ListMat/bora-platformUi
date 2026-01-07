import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
    getLessons: protectedProcedure
        .input(z.object({
            status: z.enum(["all", "PENDING", "SCHEDULED", "ACTIVE", "FINISHED", "CANCELLED", "EXPIRED"]).default("all"),
            limit: z.number().min(1).max(100).default(50),
            offset: z.number().min(0).default(0),
        }))
        .query(async ({ ctx, input }) => {
            const where = input.status === "all" ? {} : { status: input.status as any };

            const [lessons, total] = await Promise.all([
                ctx.prisma.lesson.findMany({
                    where,
                    take: input.limit,
                    skip: input.offset,
                    orderBy: { createdAt: "desc" },
                    include: {
                        student: {
                            include: {
                                user: {
                                    select: {
                                        name: true,
                                        email: true,
                                        image: true,
                                    }
                                }
                            }
                        },
                        instructor: {
                            include: {
                                user: {
                                    select: {
                                        name: true,
                                        email: true,
                                        image: true,
                                    }
                                }
                            }
                        }
                    }
                }),
                ctx.prisma.lesson.count({ where })
            ]);

            return {
                lessons,
                total,
                hasMore: input.offset + input.limit < total
            };
        }),

    getStats: protectedProcedure
        .query(async ({ ctx }) => {
            const [
                totalLessons,
                pendingLessons,
                completedLessons,
                totalRevenue
            ] = await Promise.all([
                ctx.prisma.lesson.count(),
                ctx.prisma.lesson.count({ where: { status: "PENDING" as any } }),
                ctx.prisma.lesson.count({ where: { status: "FINISHED" as any } }),
                ctx.prisma.lesson.aggregate({
                    where: { status: "FINISHED" as any },
                    _sum: { price: true }
                })
            ]);

            return {
                totalLessons,
                pendingLessons,
                completedLessons,
                totalRevenue: totalRevenue._sum?.price || 0
            };
        }),
});

