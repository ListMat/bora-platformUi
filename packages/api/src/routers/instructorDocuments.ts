import { z } from "zod";
import { router, instructorProcedure, adminProcedure } from "../trpc";
import { DocumentStatus } from "@bora/db";

export const instructorDocumentsRouter = router({
    // Upload de documentos (CNH + Certificado)
    uploadDocuments: instructorProcedure
        .input(
            z.object({
                cnhFrontUrl: z.string().url("URL da CNH (frente) inválida"),
                cnhBackUrl: z.string().url("URL da CNH (verso) inválida"),
                certificateUrl: z.string().url("URL do certificado inválida"),
                confirmedAutonomous: z.boolean().refine(val => val === true, {
                    message: "Você deve confirmar que é instrutor autônomo"
                }),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findUnique({
                where: { email: ctx.session.user.email! },
                include: { instructor: true },
            });

            if (!user?.instructor) {
                throw new Error("Perfil de instrutor não encontrado");
            }

            // Verificar se já existe documento
            const existingDoc = await ctx.prisma.instructorDocument.findUnique({
                where: { instructorId: user.instructor.id },
            });

            if (existingDoc) {
                // Atualizar documento existente
                const document = await ctx.prisma.instructorDocument.update({
                    where: { instructorId: user.instructor.id },
                    data: {
                        cnhFrontUrl: input.cnhFrontUrl,
                        cnhBackUrl: input.cnhBackUrl,
                        certificateUrl: input.certificateUrl,
                        confirmedAutonomous: input.confirmedAutonomous,
                        status: DocumentStatus.PENDING,
                        submittedAt: new Date(),
                        reviewedAt: null,
                        reviewedBy: null,
                        analysisNote: null,
                    },
                });

                return document;
            }

            // Criar novo documento
            const document = await ctx.prisma.instructorDocument.create({
                data: {
                    instructorId: user.instructor.id,
                    cnhFrontUrl: input.cnhFrontUrl,
                    cnhBackUrl: input.cnhBackUrl,
                    certificateUrl: input.certificateUrl,
                    confirmedAutonomous: input.confirmedAutonomous,
                    status: DocumentStatus.PENDING,
                    submittedAt: new Date(),
                },
            });

            return document;
        }),

    // Obter status dos documentos
    getDocumentStatus: instructorProcedure
        .query(async ({ ctx }) => {
            const user = await ctx.prisma.user.findUnique({
                where: { email: ctx.session.user.email! },
                include: { instructor: true },
            });

            if (!user?.instructor) {
                throw new Error("Perfil de instrutor não encontrado");
            }

            const document = await ctx.prisma.instructorDocument.findUnique({
                where: { instructorId: user.instructor.id },
            });

            return document;
        }),

    // Admin: Listar aprovações pendentes
    getPendingApprovals: adminProcedure
        .input(
            z.object({
                status: z.enum(["PENDING", "APPROVED", "REJECTED", "PENDING_MORE_DOCS"]).optional(),
                limit: z.number().min(1).max(100).default(20),
                skip: z.number().min(0).default(0),
            })
        )
        .query(async ({ ctx, input }) => {
            const where = input.status ? { status: input.status as DocumentStatus } : {};

            const [documents, total] = await Promise.all([
                ctx.prisma.instructorDocument.findMany({
                    where,
                    take: input.limit,
                    skip: input.skip,
                    orderBy: { submittedAt: "desc" },
                    include: {
                        instructor: {
                            include: {
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        image: true,
                                        phone: true,
                                    },
                                },
                                ratings: {
                                    take: 5,
                                    orderBy: { createdAt: "desc" },
                                },
                                lessons: {
                                    take: 10,
                                    orderBy: { createdAt: "desc" },
                                    include: {
                                        student: {
                                            include: {
                                                user: {
                                                    select: {
                                                        name: true,
                                                        image: true,
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                }),
                ctx.prisma.instructorDocument.count({ where }),
            ]);

            return {
                documents,
                total,
                hasMore: input.skip + input.limit < total,
            };
        }),

    // Admin: Aprovar instrutor
    approveInstructor: adminProcedure
        .input(
            z.object({
                instructorId: z.string(),
                analysisNote: z.string().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const document = await ctx.prisma.instructorDocument.update({
                where: { instructorId: input.instructorId },
                data: {
                    status: DocumentStatus.APPROVED,
                    reviewedAt: new Date(),
                    reviewedBy: ctx.session.user.id,
                    analysisNote: input.analysisNote,
                },
            });

            // Atualizar status do instrutor
            await ctx.prisma.instructor.update({
                where: { id: input.instructorId },
                data: {
                    status: "ACTIVE",
                },
            });

            // Buscar usuário do instrutor
            const instructor = await ctx.prisma.instructor.findUnique({
                where: { id: input.instructorId },
                include: { user: true },
            });

            // Enviar notificação
            if (instructor) {
                await ctx.prisma.notification.create({
                    data: {
                        userId: instructor.userId,
                        type: "DOCUMENT_APPROVED",
                        title: "Documentos Aprovados! 🎉",
                        message: input.analysisNote || "Seus documentos foram aprovados! Você já pode começar a dar aulas.",
                        data: {
                            documentId: document.id,
                            instructorId: input.instructorId,
                        },
                    },
                });
            }

            return document;
        }),

    // Admin: Rejeitar instrutor
    rejectInstructor: adminProcedure
        .input(
            z.object({
                instructorId: z.string(),
                analysisNote: z.string().min(10, "Nota de análise é obrigatória (mínimo 10 caracteres)"),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const document = await ctx.prisma.instructorDocument.update({
                where: { instructorId: input.instructorId },
                data: {
                    status: DocumentStatus.REJECTED,
                    reviewedAt: new Date(),
                    reviewedBy: ctx.session.user.id,
                    analysisNote: input.analysisNote,
                },
            });

            // Atualizar status do instrutor
            await ctx.prisma.instructor.update({
                where: { id: input.instructorId },
                data: {
                    status: "INACTIVE",
                },
            });

            // Buscar usuário do instrutor
            const instructor = await ctx.prisma.instructor.findUnique({
                where: { id: input.instructorId },
                include: { user: true },
            });

            // Enviar notificação
            if (instructor) {
                await ctx.prisma.notification.create({
                    data: {
                        userId: instructor.userId,
                        type: "DOCUMENT_REJECTED",
                        title: "Documentos Rejeitados",
                        message: input.analysisNote,
                        data: {
                            documentId: document.id,
                            instructorId: input.instructorId,
                        },
                    },
                });
            }

            return document;
        }),

    // Admin: Solicitar mais documentos
    requestMoreDocuments: adminProcedure
        .input(
            z.object({
                instructorId: z.string(),
                analysisNote: z.string().min(10, "Nota de análise é obrigatória (mínimo 10 caracteres)"),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const document = await ctx.prisma.instructorDocument.update({
                where: { instructorId: input.instructorId },
                data: {
                    status: DocumentStatus.PENDING_MORE_DOCS,
                    reviewedAt: new Date(),
                    reviewedBy: ctx.session.user.id,
                    analysisNote: input.analysisNote,
                },
            });

            // Buscar usuário do instrutor
            const instructor = await ctx.prisma.instructor.findUnique({
                where: { id: input.instructorId },
                include: { user: true },
            });

            // Enviar notificação
            if (instructor) {
                await ctx.prisma.notification.create({
                    data: {
                        userId: instructor.userId,
                        type: "DOCUMENT_MORE_DOCS_REQUESTED",
                        title: "Documentos Adicionais Necessários",
                        message: input.analysisNote,
                        data: {
                            documentId: document.id,
                            instructorId: input.instructorId,
                        },
                    },
                });
            }

            return document;
        }),

    // Admin: KPIs de aprovação
    getApprovalMetrics: adminProcedure
        .input(
            z.object({
                startDate: z.date().optional(),
                endDate: z.date().optional(),
            })
        )
        .query(async ({ ctx, input }) => {
            const where: any = {};

            if (input.startDate || input.endDate) {
                where.submittedAt = {};
                if (input.startDate) where.submittedAt.gte = input.startDate;
                if (input.endDate) where.submittedAt.lte = input.endDate;
            }

            const [total, approved, rejected, pendingMoreDocs, pending] = await Promise.all([
                ctx.prisma.instructorDocument.count({ where }),
                ctx.prisma.instructorDocument.count({ where: { ...where, status: DocumentStatus.APPROVED } }),
                ctx.prisma.instructorDocument.count({ where: { ...where, status: DocumentStatus.REJECTED } }),
                ctx.prisma.instructorDocument.count({ where: { ...where, status: DocumentStatus.PENDING_MORE_DOCS } }),
                ctx.prisma.instructorDocument.count({ where: { ...where, status: DocumentStatus.PENDING } }),
            ]);

            // Calcular tempo médio de análise
            const reviewedDocuments = await ctx.prisma.instructorDocument.findMany({
                where: {
                    ...where,
                    reviewedAt: { not: null },
                    submittedAt: { not: null },
                },
                select: {
                    submittedAt: true,
                    reviewedAt: true,
                },
            });

            const avgAnalysisTime = reviewedDocuments.length > 0
                ? reviewedDocuments.reduce((sum, doc) => {
                    const diff = doc.reviewedAt!.getTime() - doc.submittedAt!.getTime();
                    return sum + diff;
                }, 0) / reviewedDocuments.length / (1000 * 60 * 60) // Converter para horas
                : 0;

            const approvalRate = total > 0 ? (approved / total) * 100 : 0;
            const rejectionRate = total > 0 ? (rejected / total) * 100 : 0;
            const pendingMoreDocsRate = total > 0 ? (pendingMoreDocs / total) * 100 : 0;

            return {
                total,
                approved,
                rejected,
                pendingMoreDocs,
                pending,
                approvalRate: Math.round(approvalRate * 100) / 100,
                rejectionRate: Math.round(rejectionRate * 100) / 100,
                pendingMoreDocsRate: Math.round(pendingMoreDocsRate * 100) / 100,
                avgAnalysisTime: Math.round(avgAnalysisTime * 100) / 100, // horas
            };
        }),
});
