import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../trpc";
import { VehicleCategory, TransmissionType, FuelType } from "@bora/db";
import {
  uploadVehiclePhoto,
  deleteAllVehiclePhotos,
  base64ToBuffer,
  generatePhotoFilename,
} from "../modules/vehicleStorage";

// Schema de validação para criação de veículo
const vehicleCreateSchema = z.object({
  // Step 1 - Dados básicos
  brand: z.string().min(1, "Marca obrigatória"),
  model: z.string().min(1, "Modelo obrigatório"),
  year: z.number().int().min(1980).max(2026, "Ano deve estar entre 1980 e 2026"),
  color: z.string().min(1, "Cor obrigatória"),
  plateLastFour: z.string().regex(/^[A-Z0-9]{4}$/, "Formato inválido (ex: 1D23)"),
  photoBase64: z.string().min(1, "Foto obrigatória"),
  
  // Step 2 - Especificações
  category: z.nativeEnum(VehicleCategory),
  transmission: z.nativeEnum(TransmissionType),
  fuel: z.nativeEnum(FuelType),
  engine: z.string().min(1, "Motor obrigatório"),
  horsePower: z.number().int().positive().optional(),
  
  // Step 3 - Segurança & Acessórios
  hasDualPedal: z.boolean(),
  pedalPhotoBase64: z.string().optional(),
  acceptStudentCar: z.boolean().default(false),
  safetyFeatures: z.array(z.string()).default([]),
  comfortFeatures: z.array(z.string()).default([]),
}).refine(
  (data) => !data.hasDualPedal || data.pedalPhotoBase64,
  { 
    message: "Foto do pedal obrigatória quando duplo-pedal está marcado", 
    path: ["pedalPhotoBase64"] 
  }
);

const vehicleUpdateSchema = z.object({
  id: z.string(),
  brand: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  year: z.number().int().min(1980).max(2026).optional(),
  color: z.string().min(1).optional(),
  plateLastFour: z.string().regex(/^[A-Z0-9]{4}$/).optional(),
  photoBase64: z.string().optional(),
  category: z.nativeEnum(VehicleCategory).optional(),
  transmission: z.nativeEnum(TransmissionType).optional(),
  fuel: z.nativeEnum(FuelType).optional(),
  engine: z.string().min(1).optional(),
  horsePower: z.number().int().positive().optional().nullable(),
  hasDualPedal: z.boolean().optional(),
  pedalPhotoBase64: z.string().optional(),
  acceptStudentCar: z.boolean().optional(),
  safetyFeatures: z.array(z.string()).optional(),
  comfortFeatures: z.array(z.string()).optional(),
});

export const vehicleRouter = router({
  // Criar veículo
  create: protectedProcedure
    .input(vehicleCreateSchema)
    .mutation(async ({ ctx, input }) => {
      // Buscar informações do usuário
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        select: { id: true, role: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Se for instrutor, validar limite de 3 veículos
      if (user.role === "INSTRUCTOR") {
        const vehicleCount = await ctx.prisma.vehicle.count({
          where: {
            userId: user.id,
            status: "active",
          },
        });

        if (vehicleCount >= 3) {
          throw new Error("Você pode cadastrar no máximo 3 veículos");
        }

        // Duplo-pedal é obrigatório para carros (não para motos)
        if (input.category !== VehicleCategory.MOTO && !input.hasDualPedal) {
          throw new Error("Duplo-pedal é obrigatório para carros de instrutores");
        }
      }

      // Criar veículo temporário para obter ID
      const tempVehicle = await ctx.prisma.vehicle.create({
        data: {
          userId: user.id,
          brand: input.brand,
          model: input.model,
          year: input.year,
          color: input.color,
          plateLastFour: input.plateLastFour,
          photoUrl: "temp", // Temporário
          category: input.category,
          transmission: input.transmission,
          fuel: input.fuel,
          engine: input.engine,
          horsePower: input.horsePower,
          hasDualPedal: input.hasDualPedal,
          pedalPhotoUrl: null,
          acceptStudentCar: input.acceptStudentCar,
          safetyFeatures: input.safetyFeatures,
          comfortFeatures: input.comfortFeatures,
        },
      });

      try {
        // Upload foto principal
        const photoBuffer = base64ToBuffer(input.photoBase64);
        const photoFilename = generatePhotoFilename(tempVehicle.id);
        const photoUrl = await uploadVehiclePhoto(
          tempVehicle.id,
          photoBuffer,
          photoFilename,
          'main'
        );

        // Upload foto do pedal se fornecida
        let pedalPhotoUrl: string | null = null;
        if (input.pedalPhotoBase64) {
          const pedalBuffer = base64ToBuffer(input.pedalPhotoBase64);
          const pedalFilename = generatePhotoFilename(tempVehicle.id);
          pedalPhotoUrl = await uploadVehiclePhoto(
            tempVehicle.id,
            pedalBuffer,
            pedalFilename,
            'pedal'
          );
        }

        // Atualizar veículo com URLs das fotos
        const vehicle = await ctx.prisma.vehicle.update({
          where: { id: tempVehicle.id },
          data: {
            photoUrl,
            pedalPhotoUrl,
          },
        });

        return vehicle;
      } catch (error) {
        // Se upload falhar, remover veículo
        await ctx.prisma.vehicle.delete({
          where: { id: tempVehicle.id },
        });
        throw error;
      }
    }),

  // Listar veículos do usuário
  myVehicles: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return ctx.prisma.vehicle.findMany({
      where: {
        userId: user.id,
        status: 'active',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }),

  // Buscar veículo por ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        select: { id: true, role: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const vehicle = await ctx.prisma.vehicle.findUnique({
        where: { id: input.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      // Verificar permissões: usuário só pode ver seus próprios veículos ou admin pode ver todos
      if (vehicle.userId !== user.id && user.role !== "ADMIN") {
        throw new Error("Unauthorized");
      }

      return vehicle;
    }),

  // Editar veículo
  update: protectedProcedure
    .input(vehicleUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, photoBase64, pedalPhotoBase64, ...updateData } = input;

      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        select: { id: true, role: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Verificar se veículo pertence ao usuário
      const existingVehicle = await ctx.prisma.vehicle.findUnique({
        where: { id },
      });

      if (!existingVehicle) {
        throw new Error("Vehicle not found");
      }

      if (existingVehicle.userId !== user.id) {
        throw new Error("Unauthorized");
      }

      // Se for instrutor, duplo-pedal é obrigatório
      if (user.role === "INSTRUCTOR" && updateData.hasDualPedal === false) {
        throw new Error("Duplo-pedal é obrigatório para instrutores");
      }

      // Preparar dados de atualização
      const dataToUpdate: any = { ...updateData };

      // Upload nova foto principal se fornecida
      if (photoBase64) {
        const photoBuffer = base64ToBuffer(photoBase64);
        const photoFilename = generatePhotoFilename(id);
        dataToUpdate.photoUrl = await uploadVehiclePhoto(
          id,
          photoBuffer,
          photoFilename,
          'main'
        );
      }

      // Upload nova foto do pedal se fornecida
      if (pedalPhotoBase64) {
        const pedalBuffer = base64ToBuffer(pedalPhotoBase64);
        const pedalFilename = generatePhotoFilename(id);
        dataToUpdate.pedalPhotoUrl = await uploadVehiclePhoto(
          id,
          pedalBuffer,
          pedalFilename,
          'pedal'
        );
      }

      return ctx.prisma.vehicle.update({
        where: { id },
        data: dataToUpdate,
      });
    }),

  // Soft delete (marcar como inativo)
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        select: { id: true },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Verificar se veículo pertence ao usuário
      const vehicle = await ctx.prisma.vehicle.findUnique({
        where: { id: input.id },
      });

      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      if (vehicle.userId !== user.id) {
        throw new Error("Unauthorized");
      }

      return ctx.prisma.vehicle.update({
        where: { id: input.id },
        data: { status: 'inactive' },
      });
    }),

  // Hard delete (apenas admin)
  hardDelete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Remover fotos do storage
      await deleteAllVehiclePhotos(input.id);

      // Remover do banco
      return ctx.prisma.vehicle.delete({
        where: { id: input.id },
      });
    }),

  // Listar todos os veículos (apenas admin)
  listAll: adminProcedure
    .input(
      z.object({
        status: z.enum(['active', 'inactive', 'all']).default('active'),
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = input.status === 'all' ? {} : { status: input.status };

      const vehicles = await ctx.prisma.vehicle.findMany({
        where,
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (vehicles.length > input.limit) {
        const nextItem = vehicles.pop();
        nextCursor = nextItem!.id;
      }

      return {
        vehicles,
        nextCursor,
      };
    }),
});

