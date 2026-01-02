import { z } from "zod";
import { router, protectedProcedure, studentProcedure } from "../trpc";
import { validateCPF } from "../utils/validators";
import { addPoints, POINTS_CONFIG } from "../modules/gamification";

// Função para validar idade mínima (18 anos)
function validateAge(dateOfBirth: Date): boolean {
  const today = new Date();
  const age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    return age - 1 >= 18;
  }

  return age >= 18;
}

// Função para validar CEP (formato brasileiro)
function validateCEP(cep: string): boolean {
  const cleanCEP = cep.replace(/\D/g, "");
  return cleanCEP.length === 8;
}

export const studentRouter = router({
  // Criar perfil de estudante
  create: protectedProcedure
    .input(
      z.object({
        cpf: z
          .string()
          .min(11, "CPF deve ter 11 dígitos")
          .max(14, "CPF inválido")
          .refine((cpf) => validateCPF(cpf), "CPF inválido"),
        dateOfBirth: z
          .date()
          .refine(
            (date) => date < new Date(),
            "Data de nascimento deve ser no passado"
          )
          .refine((date) => validateAge(date), "Você deve ter pelo menos 18 anos"),
        address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
        city: z.string().min(2, "Cidade é obrigatória"),
        state: z
          .string()
          .length(2, "Estado deve ter 2 caracteres (ex: SP)")
          .toUpperCase(),
        zipCode: z
          .string()
          .refine((cep) => validateCEP(cep), "CEP inválido"),
        referralCode: z.string().length(6).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:create:entry', message: 'Student create mutation called', data: { email: ctx.session.user.email, cpfLength: input.cpf.length, hasDateOfBirth: !!input.dateOfBirth }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
      // #endregion
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
      });

      if (!user) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:create:error', message: 'User not found', data: { email: ctx.session.user.email }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
        // #endregion
        throw new Error("User not found");
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:create:before-checks', message: 'Before checking existing student', data: { userId: user.id, userRole: user.role }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
      // #endregion
      // Verificar se já existe um perfil de estudante
      const existingStudent = await ctx.prisma.student.findUnique({
        where: { userId: user.id },
      });

      if (existingStudent) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:create:error', message: 'Student profile already exists', data: { userId: user.id }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
        // #endregion
        throw new Error("Student profile already exists");
      }

      // Verificar se CPF já está em uso
      const cleanCPF = input.cpf.replace(/\D/g, "");
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:create:cpf-check', message: 'Checking CPF uniqueness', data: { cleanCPF, cleanCPFLength: cleanCPF.length }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
      // #endregion
      const cpfInUse = await ctx.prisma.student.findUnique({
        where: { cpf: cleanCPF },
      });

      if (cpfInUse) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:create:error', message: 'CPF already in use', data: { cleanCPF }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'D' }) }).catch(() => { });
        // #endregion
        throw new Error("CPF já está em uso");
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:create:before-create', message: 'Before creating student profile', data: { userId: user.id, dateOfBirth: input.dateOfBirth.toISOString(), addressLength: input.address.length }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
      // #endregion
      // Criar perfil de estudante
      const student = await ctx.prisma.student.create({
        data: {
          userId: user.id,
          cpf: cleanCPF,
          dateOfBirth: input.dateOfBirth,
          address: input.address,
          city: input.city,
          state: input.state,
          zipCode: input.zipCode.replace(/\D/g, ""),
        },
      });

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:create:after-create', message: 'Student profile created', data: { studentId: student.id, userId: user.id }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
      // #endregion
      // Atualizar role do usuário
      await ctx.prisma.user.update({
        where: { id: user.id },
        data: { role: "STUDENT" },
      });
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:create:after-role-update', message: 'User role updated to STUDENT', data: { userId: user.id }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
      // #endregion

      // Aplicar código de indicação se fornecido (usando a lógica do userRouter)
      if (input.referralCode) {
        try {
          const existingReferral = await ctx.prisma.referral.findFirst({
            where: { referredId: user.id },
          });

          if (!existingReferral) {
            const referral = await ctx.prisma.referral.findUnique({
              where: { code: input.referralCode },
            });

            if (referral && referral.referrerId !== user.id) {
              await ctx.prisma.referral.update({
                where: { code: input.referralCode },
                data: { referredId: user.id },
              });

              // Dar pontos ao referrer
              await addPoints(
                referral.referrerId,
                POINTS_CONFIG.REFERRAL_SIGNUP,
                "Indicação aceita"
              );

              // Verificar medalhas
              const { awardMedal, MEDALS } = await import("../modules/gamification");
              const referrerReferrals = await ctx.prisma.referral.count({
                where: { referrerId: referral.referrerId, referredId: { not: null } },
              });

              if (referrerReferrals === 1) {
                await awardMedal(referral.referrerId, MEDALS.FIRST_REFERRAL.id);
              } else if (referrerReferrals === 5) {
                await awardMedal(referral.referrerId, MEDALS.FIVE_REFERRALS.id);
              }
            }
          }
        } catch (error) {
          // Ignorar erros de referral code
          console.error("Error applying referral code:", error);
        }
      }

      // Dar pontos por completar cadastro
      await addPoints(user.id, POINTS_CONFIG.PROFILE_COMPLETE, "Perfil completo");
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:create:success', message: 'Student profile creation completed', data: { studentId: student.id, userId: user.id }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'C' }) }).catch(() => { });
      // #endregion

      return student;
    }),

  // Obter perfil do estudante (retorna null se não existir)
  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
      include: {
        student: true,
      },
    });

    return user?.student || null;
  }),

  // Atualizar perfil do estudante
  update: studentProcedure
    .input(
      z.object({
        address: z.string().min(5).optional(),
        city: z.string().min(2).optional(),
        state: z.string().length(2).toUpperCase().optional(),
        zipCode: z
          .string()
          .refine((cep) => !cep || validateCEP(cep), "CEP inválido")
          .optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:update:entry', message: 'Student update mutation called', data: { email: ctx.session.user.email, hasAddress: !!input.address, hasCity: !!input.city, hasState: !!input.state, hasZipCode: !!input.zipCode, hasPhone: !!input.phone }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
      // #endregion
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        include: { student: true },
      });

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:update:user-check', message: 'User lookup result', data: { hasUser: !!user, hasStudent: !!user?.student, userRole: user?.role }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
      // #endregion
      if (!user?.student) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:update:error', message: 'Student profile not found', data: { userId: user?.id, userRole: user?.role }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
        // #endregion
        throw new Error("Student profile not found");
      }

      const updateData: any = {};

      if (input.address) updateData.address = input.address;
      if (input.city) updateData.city = input.city;
      if (input.state) updateData.state = input.state;
      if (input.zipCode) updateData.zipCode = input.zipCode.replace(/\D/g, "");

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:update:before-update', message: 'Before updating student', data: { studentId: user.student.id, updateData }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
      // #endregion
      const student = await ctx.prisma.student.update({
        where: { id: user.student.id },
        data: updateData,
      });

      if (input.phone !== undefined) {
        await ctx.prisma.user.update({
          where: { id: user.id },
          data: { phone: input.phone },
        });
      }

      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:update:success', message: 'Student update completed', data: { studentId: student.id }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'A' }) }).catch(() => { });
      // #endregion
      return student;
    }),

  // Verificar se perfil está completo
  checkCompleteness: protectedProcedure.query(async ({ ctx }) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:checkCompleteness:entry', message: 'Check completeness called', data: { email: ctx.session.user.email }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' }) }).catch(() => { });
    // #endregion
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
      include: { student: true },
    });

    if (!user) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:checkCompleteness:no-user', message: 'User not found', data: { email: ctx.session.user.email }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' }) }).catch(() => { });
      // #endregion
      return { isComplete: false, missingFields: [] };
    }

    if (!user.student) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:checkCompleteness:no-student', message: 'No student profile found', data: { userId: user.id, userRole: user.role }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' }) }).catch(() => { });
      // #endregion
      return {
        isComplete: false,
        missingFields: ["cpf", "dateOfBirth", "address", "city", "state", "zipCode"],
      };
    }

    const missingFields: string[] = [];

    if (!user.student.cpf) missingFields.push("cpf");
    if (!user.student.dateOfBirth) missingFields.push("dateOfBirth");
    if (!user.student.address) missingFields.push("address");
    if (!user.student.city) missingFields.push("city");
    if (!user.student.state) missingFields.push("state");
    if (!user.student.zipCode) missingFields.push("zipCode");
    if (!user.phone) missingFields.push("phone");

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/005159fb-805d-4670-9445-24b2105055a1', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'student.ts:checkCompleteness:result', message: 'Completeness check result', data: { isComplete: missingFields.length === 0, missingFields, missingCount: missingFields.length }, timestamp: Date.now(), sessionId: 'debug-session', runId: 'run1', hypothesisId: 'B' }) }).catch(() => { });
    // #endregion
    return {
      isComplete: missingFields.length === 0,
      missingFields,
    };
  }),

  // Obter veículo do aluno
  getVehicle: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
      include: {
        student: true,
        vehicles: {
          where: {
            status: "active",
          },
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!user?.student || !user.vehicles || user.vehicles.length === 0) {
      return null;
    }

    const vehicle = user.vehicles[0];

    return {
      id: vehicle.id,
      model: vehicle.model,
      brand: vehicle.brand,
      photo: vehicle.photoUrl,
      transmission: vehicle.transmission,
      plateLast4: vehicle.plateLastFour,
    };
  }),
});

