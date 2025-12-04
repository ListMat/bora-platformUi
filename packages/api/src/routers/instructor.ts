import { z } from "zod";
import { router, protectedProcedure, instructorProcedure, adminProcedure } from "../trpc";
import { InstructorStatus } from "@bora/db";

export const instructorRouter = router({
  // Listar instrutores disponíveis
  list: protectedProcedure
    .input(
      z.object({
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const instructors = await ctx.prisma.instructor.findMany({
        where: {
          status: InstructorStatus.ACTIVE,
          isAvailable: true,
        },
        take: input.limit,
        orderBy: { averageRating: "desc" },
        include: {
          user: true,
        },
      });

      return instructors;
    }),

  // Obter detalhes de instrutor
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const instructor = await ctx.prisma.instructor.findUnique({
        where: { id: input.id },
        include: {
          user: true,
          availability: true,
          ratings: {
            take: 10,
            orderBy: { createdAt: "desc" },
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

      return instructor;
    }),

  // Criar perfil de instrutor
  create: protectedProcedure
    .input(
      z.object({
        cpf: z.string(),
        cnhNumber: z.string(),
        credentialNumber: z.string(),
        credentialExpiry: z.date(),
        city: z.string(),
        state: z.string(),
        basePrice: z.number().positive(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const instructor = await ctx.prisma.instructor.create({
        data: {
          userId: user.id,
          cpf: input.cpf,
          cnhNumber: input.cnhNumber,
          credentialNumber: input.credentialNumber,
          credentialExpiry: input.credentialExpiry,
          city: input.city,
          state: input.state,
          basePrice: input.basePrice,
          status: InstructorStatus.PENDING_VERIFICATION,
        },
      });

      // Atualizar role do usuário
      await ctx.prisma.user.update({
        where: { id: user.id },
        data: { role: "INSTRUCTOR" },
      });

      return instructor;
    }),

  // Atualizar disponibilidade
  updateAvailability: instructorProcedure
    .input(
      z.object({
        isAvailable: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        include: { instructor: true },
      });

      if (!user?.instructor) {
        throw new Error("Instructor profile not found");
      }

      const instructor = await ctx.prisma.instructor.update({
        where: { id: user.instructor.id },
        data: {
          isAvailable: input.isAvailable,
        },
      });

      return instructor;
    }),

  // Atualizar localização
  updateLocation: instructorProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        include: { instructor: true },
      });

      if (!user?.instructor) {
        throw new Error("Instructor profile not found");
      }

      const instructor = await ctx.prisma.instructor.update({
        where: { id: user.instructor.id },
        data: {
          latitude: input.latitude,
          longitude: input.longitude,
        },
      });

      return instructor;
    }),

  // Aprovar instrutor (admin)
  approve: adminProcedure
    .input(
      z.object({
        instructorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const instructor = await ctx.prisma.instructor.update({
        where: { id: input.instructorId },
        data: {
          status: InstructorStatus.ACTIVE,
        },
      });

      return instructor;
    }),

  // Suspender instrutor (admin)
  suspend: adminProcedure
    .input(
      z.object({
        instructorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const instructor = await ctx.prisma.instructor.update({
        where: { id: input.instructorId },
        data: {
          status: InstructorStatus.SUSPENDED,
          isAvailable: false,
        },
      });

      return instructor;
    }),
});

