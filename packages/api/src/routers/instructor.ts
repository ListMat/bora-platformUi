import { z } from "zod";
import { router, protectedProcedure, instructorProcedure, adminProcedure } from "../trpc";
import { InstructorStatus } from "@bora/db";

export const instructorRouter = router({
  // Buscar instrutores próximos
  nearby: protectedProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        radius: z.number().default(10), // km
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      // Buscar instrutores ativos com localização
      const instructors = await ctx.prisma.instructor.findMany({
        where: {
          status: InstructorStatus.ACTIVE,
          isAvailable: true,
          latitude: { not: null },
          longitude: { not: null },
        },
        include: {
          user: true,
        },
      });

      // Calcular distância usando fórmula Haversine
      const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Raio da Terra em km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
      };

      // Filtrar e ordenar por distância
      const instructorsWithDistance = instructors
        .map(instructor => ({
          ...instructor,
          distance: calculateDistance(
            input.latitude,
            input.longitude,
            instructor.latitude!,
            instructor.longitude!
          ),
        }))
        .filter(instructor => instructor.distance <= input.radius)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, input.limit);

      return instructorsWithDistance;
    }),

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

