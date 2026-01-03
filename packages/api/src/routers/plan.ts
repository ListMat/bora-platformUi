import { z } from "zod";
import { router, protectedProcedure, instructorProcedure } from "../trpc";

export const planRouter = router({
  // Listar planos disponíveis
  // Agora suporta filtrar por instrutor!
  list: protectedProcedure
    .input(z.object({ instructorId: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {

      // Se instructorId fornecido, busca planos desse instrutor
      const where = input?.instructorId
        ? { instructorId: input.instructorId, isActive: true }
        : { instructorId: null, isActive: true };

      const plans = await ctx.prisma.plan.findMany({
        where,
        orderBy: { price: 'asc' }
      });

      // BACKWARDS COMPATIBILITY / FALLBACK
      // Se não encontrou planos para o instrutor, retorna mocks padrão
      // Isso garante que o app do aluno não fique vazio enquanto o instrutor não cadastra
      if (plans.length === 0 && input?.instructorId) {
        // Buscar preço base do instrutor para calcular valores reais? 
        // Por enquanto, retorna valores fixos de exemplo
        return [
          {
            id: "mock_1",
            name: "Aula Avulsa",
            lessons: 1,
            price: 80,
            discount: 0,
            originalPrice: 80
          },
          {
            id: "mock_5",
            name: "Pacote Iniciante",
            lessons: 5,
            price: 380,
            discount: 5,
            originalPrice: 400
          },
          {
            id: "mock_10",
            name: "Pacote Completo",
            lessons: 10,
            price: 720,
            discount: 10,
            originalPrice: 800
          },
        ];
      }

      // Mapear para adicionar originalPrice calculado se tiver desconto
      return plans.map(p => {
        const price = Number(p.price);
        let originalPrice = price;
        if (p.discount > 0) {
          // Se preço é 90 e desc é 10%, original era 100. 
          // 90 = X * 0.9 => X = 90 / 0.9
          originalPrice = price / ((100 - p.discount) / 100);
        }
        return {
          ...p,
          price: price,
          originalPrice: Math.round(originalPrice)
        };
      });
    }),

  // Listar planos do PRÓPRIO instrutor (para a tela de gestão)
  myPlans: instructorProcedure
    .query(async ({ ctx }) => {
      const instructor = await ctx.prisma.instructor.findUnique({
        where: { userId: ctx.user.id }
      });
      if (!instructor) return [];

      return ctx.prisma.plan.findMany({
        where: { instructorId: instructor.id },
        orderBy: { createdAt: 'desc' }
      });
    }),

  // Criar plano
  create: instructorProcedure
    .input(z.object({
      name: z.string(),
      lessons: z.number().int().min(1),
      price: z.number().min(1),
      discount: z.number().int().min(0).max(100).default(0),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const instructor = await ctx.prisma.instructor.findUnique({
        where: { userId: ctx.user.id }
      });

      if (!instructor) throw new Error("Perfil de instrutor não encontrado");

      return ctx.prisma.plan.create({
        data: {
          ...input,
          instructorId: instructor.id,
          isActive: true
        }
      });
    }),

  // Toggle status (Ativar/Desativar)
  toggleActivity: instructorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const plan = await ctx.prisma.plan.findUnique({ where: { id: input.id } });
      if (!plan) throw new Error("Plano não encontrado");

      const instructor = await ctx.prisma.instructor.findUnique({ where: { userId: ctx.user.id } });
      if (plan.instructorId !== instructor?.id) throw new Error("Não autorizado");

      return ctx.prisma.plan.update({
        where: { id: input.id },
        data: { isActive: !plan.isActive }
      });
    }),

  // Deletar plano
  delete: instructorProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const plan = await ctx.prisma.plan.findUnique({ where: { id: input.id } });
      if (!plan) throw new Error("Plano não encontrado");

      const instructor = await ctx.prisma.instructor.findUnique({ where: { userId: ctx.user.id } });
      if (plan.instructorId !== instructor?.id) throw new Error("Não autorizado");

      return ctx.prisma.plan.delete({
        where: { id: input.id }
      });
    }),
});
