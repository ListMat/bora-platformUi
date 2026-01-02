import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../trpc";
import { UserRole } from "@bora/db";
import { getGamificationInfo } from "../modules/gamification";
import {
  uploadProfilePhoto,
  base64ToBuffer,
  generatePhotoFilename,
} from "../modules/profilePhotoStorage";

export const userRouter = router({
  // Obter usuário atual
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session!.user.email! },
      include: {
        student: true,
        instructor: true,
      },
    });
    return user;
  }),

  // Obter informações de gamificação
  gamification: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session!.user.email! },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return await getGamificationInfo(user.id);
  }),

  // Listar todos os usuários (admin)
  list: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().optional(),
        role: z.nativeEnum(UserRole).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const users = await ctx.prisma.user.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: input.role ? { role: input.role } : undefined,
        orderBy: { createdAt: "desc" },
        include: {
          student: true,
          instructor: true,
        },
      });

      let nextCursor: typeof input.cursor | undefined = undefined;
      if (users.length > input.limit) {
        const nextItem = users.pop();
        nextCursor = nextItem!.id;
      }

      return {
        users,
        nextCursor,
      };
    }),

  // Atualizar perfil
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).max(100).optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.update({
        where: { email: ctx.session.user.email! },
        data: input,
      });
      return user;
    }),

  // Upload de foto de perfil
  uploadProfilePhoto: protectedProcedure
    .input(
      z.object({
        photoBase64: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Converter base64 para buffer
      const photoBuffer = base64ToBuffer(input.photoBase64);

      // Detectar extensão da imagem
      const extension = input.photoBase64.includes("image/png")
        ? "png"
        : input.photoBase64.includes("image/webp")
          ? "webp"
          : "jpg";

      // Gerar filename único
      const filename = generatePhotoFilename(user.id, extension);

      // Upload para Supabase
      const photoUrl = await uploadProfilePhoto(user.id, photoBuffer, filename);

      // Atualizar URL da foto no banco
      const updatedUser = await ctx.prisma.user.update({
        where: { id: user.id },
        data: { image: photoUrl },
      });

      return {
        photoUrl: updatedUser.image,
      };
    }),

  // Banir/desbanir usuário (admin)
  toggleBan: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        banned: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Implementação depende de como você quer implementar ban
      // Por enquanto, apenas um log
      await ctx.prisma.activityLog.create({
        data: {
          userId: ctx.session.user.email!,
          action: input.banned ? "BAN_USER" : "UNBAN_USER",
          resource: input.userId,
          metadata: { banned: input.banned },
        },
      });
      return { success: true };
    }),

  // Deletar dados (LGPD/GDPR)
  deleteMyData: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Log da ação
    await ctx.prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "DELETE_USER_DATA",
        resource: "USER",
      },
    });

    // Deletar usuário (cascade deletará tudo relacionado)
    await ctx.prisma.user.delete({
      where: { id: user.id },
    });

    return { success: true };
  }),

  // Criar código de indicação (referral)
  createReferralCode: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
      include: { student: true },
    });

    if (!user?.student) {
      throw new Error("Only students can create referral codes");
    }

    // Gerar código único (6 caracteres alfanuméricos)
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    await ctx.prisma.referral.create({
      data: {
        code,
        referrerId: user.id,
      },
    });

    return { code };
  }),

  // Listar indicações do usuário
  myReferrals: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const referrals = await ctx.prisma.referral.findMany({
      where: { referrerId: user.id },
      include: {
        referred: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return referrals;
  }),

  // Aplicar código de indicação
  applyReferralCode: protectedProcedure
    .input(
      z.object({
        code: z.string().length(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Verificar se já usou algum código
      const existingReferral = await ctx.prisma.referral.findFirst({
        where: { referredId: user.id },
      });

      if (existingReferral) {
        throw new Error("You have already used a referral code");
      }

      // Buscar código
      const referral = await ctx.prisma.referral.findUnique({
        where: { code: input.code },
      });

      if (!referral) {
        throw new Error("Invalid referral code");
      }

      if (referral.referrerId === user.id) {
        throw new Error("You cannot use your own referral code");
      }

      // Aplicar código
      await ctx.prisma.referral.update({
        where: { code: input.code },
        data: { referredId: user.id },
      });

      // Dar pontos ao referrer
      const { addPoints, POINTS_CONFIG, awardMedal, MEDALS } = await import("../modules/gamification");
      await addPoints(referral.referrerId, POINTS_CONFIG.REFERRAL_SIGNUP, "Indicação aceita");

      // Verificar medalha de primeira indicação
      const referrerReferrals = await ctx.prisma.referral.count({
        where: { referrerId: referral.referrerId, referredId: { not: null } },
      });

      if (referrerReferrals === 1) {
        await awardMedal(referral.referrerId, MEDALS.FIRST_REFERRAL.id);
      } else if (referrerReferrals === 5) {
        await awardMedal(referral.referrerId, MEDALS.FIVE_REFERRALS.id);
      }

      return { success: true };
    }),

  // Atualizar push token (Expo Push Notifications)
  updatePushToken: protectedProcedure
    .input(
      z.object({
        pushToken: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const updatedUser = await ctx.prisma.user.update({
        where: { id: user.id },
        data: { pushToken: input.pushToken },
      });

      console.log(`[Push Token] Updated for user ${user.name}: ${input.pushToken}`);

      return { success: true, pushToken: updatedUser.pushToken };
    }),
});

