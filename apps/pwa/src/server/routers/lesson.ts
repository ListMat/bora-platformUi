import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const lessonRouter = createTRPCRouter({
    request: protectedProcedure
        .input(z.object({
            instructorId: z.string(),
            date: z.date(),
            price: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
            // Garantir que o aluno existe
            let student = await ctx.prisma.student.findUnique({
                where: { userId: ctx.session.user.id }
            });

            if (!student) {
                student = await ctx.prisma.student.create({
                    data: { userId: ctx.session.user.id }
                });
            }

            const lesson = await ctx.prisma.lesson.create({
                data: {
                    studentId: student.id,
                    instructorId: input.instructorId,
                    date: input.date,
                    price: input.price,
                    status: "PENDING",
                    duration: 50,
                }
            });

            return lesson;
        }),
});
