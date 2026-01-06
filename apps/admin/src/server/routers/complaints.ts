import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const complaintsRouter = createTRPCRouter({
    // Listar todas as denúncias (admin)
    getAll: publicProcedure
        .query(async ({ ctx }) => {
            return ctx.prisma.complaint.findMany({
                include: {
                    student: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    email: true,
                                    image: true,
                                },
                            },
                        },
                    },
                    instructor: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    email: true,
                                    image: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }),

    // Buscar denúncia por ID com dados completos do instrutor
    getById: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            return ctx.prisma.complaint.findUnique({
                where: { id: input.id },
                include: {
                    student: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    email: true,
                                    image: true,
                                    phone: true,
                                },
                            },
                        },
                    },
                    instructor: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    email: true,
                                    image: true,
                                    phone: true,
                                },
                            },
                            ratings: {
                                select: {
                                    rating: true,
                                    comment: true,
                                    createdAt: true,
                                },
                                orderBy: {
                                    createdAt: "desc",
                                },
                                take: 10,
                            },
                            lessons: {
                                select: {
                                    id: true,
                                    scheduledAt: true,
                                    status: true,
                                    student: {
                                        select: {
                                            user: {
                                                select: {
                                                    name: true,
                                                },
                                            },
                                        },
                                    },
                                },
                                orderBy: {
                                    scheduledAt: "desc",
                                },
                                take: 20,
                            },
                        },
                    },
                },
            });
        }),

    // Criar denúncia (aluno)
    create: publicProcedure
        .input(
            z.object({
                studentId: z.string(),
                instructorId: z.string(),
                type: z.enum([
                    "INAPPROPRIATE_BEHAVIOR",
                    "INADEQUATE_VEHICLE",
                    "HARASSMENT",
                    "DANGEROUS_DRIVING",
                    "OTHER",
                ]),
                description: z.string().min(10).max(500),
                mediaUrls: z.array(z.string()).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.complaint.create({
                data: {
                    studentId: input.studentId,
                    instructorId: input.instructorId,
                    type: input.type,
                    description: input.description,
                    mediaUrls: input.mediaUrls || [],
                },
            });
        }),

    // Atualizar status da denúncia (admin)
    updateStatus: publicProcedure
        .input(
            z.object({
                id: z.string(),
                status: z.enum(["PENDING", "UNDER_REVIEW", "RESOLVED", "DISMISSED"]),
                resolution: z.string().optional(),
                resolvedBy: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            return ctx.prisma.complaint.update({
                where: { id: input.id },
                data: {
                    status: input.status,
                    resolution: input.resolution,
                    resolvedAt: input.status === "RESOLVED" || input.status === "DISMISSED"
                        ? new Date()
                        : undefined,
                    resolvedBy: input.resolvedBy,
                },
            });
        }),
});
