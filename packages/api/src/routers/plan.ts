import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const planRouter = router({
  // Listar planos disponíveis
  list: protectedProcedure.query(async ({ ctx }) => {
    // Planos fixos para MVP
    const plans = [
      {
        id: "1",
        name: "1 aula",
        lessons: 1,
        price: 79,
        discount: 0,
        originalPrice: 79,
      },
      {
        id: "5",
        name: "5 aulas",
        lessons: 5,
        price: 355,
        discount: 10,
        originalPrice: 395,
      },
      {
        id: "10",
        name: "10 aulas",
        lessons: 10,
        price: 672,
        discount: 15,
        originalPrice: 790,
      },
    ];

    return plans;
  }),

  // Obter detalhes de um plano
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const plans = [
        {
          id: "1",
          name: "1 aula",
          lessons: 1,
          price: 79,
          discount: 0,
          originalPrice: 79,
        },
        {
          id: "5",
          name: "5 aulas",
          lessons: 5,
          price: 355,
          discount: 10,
          originalPrice: 395,
        },
        {
          id: "10",
          name: "10 aulas",
          lessons: 10,
          price: 672,
          discount: 15,
          originalPrice: 790,
        },
      ];

      const plan = plans.find((p) => p.id === input.id);
      if (!plan) {
        throw new Error("Plan not found");
      }

      return plan;
    }),
});

