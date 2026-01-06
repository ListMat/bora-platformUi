import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const complaintRouter = createTRPCRouter({
    // Criar denúncia
    create: protectedProcedure
        .input(
            z.object({
                instructorId: z.string(),
                type: z.enum([
                    "INAPPROPRIATE_BEHAVIOR",
                    "INADEQUATE_VEHICLE",
                    "HARASSMENT",
                    "DANGEROUS_DRIVING",
                    "OTHER",
                ]),
                description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres").max(500, "Descrição deve ter no máximo 500 caracteres"),
                mediaUrls: z.array(z.string()).optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            // Buscar studentId do usuário logado
            const student = await ctx.prisma.student.findUnique({
                where: { userId: ctx.session.user.id },
            });

            if (!student) {
                throw new Error("Perfil de aluno não encontrado");
            }

            return ctx.prisma.complaint.create({
                data: {
                    studentId: student.id,
                    instructorId: input.instructorId,
                    type: input.type,
                    description: input.description,
                    mediaUrls: input.mediaUrls || [],
                },
            });
        }),

    // Listar denúncias do aluno
    getMyComplaints: protectedProcedure.query(async ({ ctx }) => {
        const student = await ctx.prisma.student.findUnique({
            where: { userId: ctx.session.user.id },
        });

        if (!student) {
            return [];
        }

        return ctx.prisma.complaint.findMany({
            where: { studentId: student.id },
            include: {
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
            orderBy: { createdAt: "desc" },
        });
    }),
});
