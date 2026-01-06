import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

export const authRouter = createTRPCRouter({
    register: publicProcedure
        .input(z.any())
        .mutation(async ({ ctx, input }) => {
            try {
                console.log('📝 [AUTH] Payload recebido:', JSON.stringify(input, null, 2));

                const { email, password, name, role } = input;

                if (!email || !password || !name || !role) {
                    throw new Error("Campos obrigatórios faltando");
                }

                // Verificar se email já existe
                const exists = await ctx.prisma.user.findUnique({
                    where: { email: input.email },
                });

                if (exists) {
                    console.log('❌ [AUTH] Email já existe:', input.email);
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: "Este email já está cadastrado.",
                    });
                }

                console.log('✅ [AUTH] Email disponível, hasheando senha...');

                // Hash da senha
                const hashedPassword = await bcrypt.hash(input.password, 10);

                console.log('✅ [AUTH] Senha hasheada, criando usuário...');

                // Criar usuário
                const user = await ctx.prisma.user.create({
                    data: {
                        name: input.name,
                        email: input.email,
                        password: hashedPassword,
                        role: input.role,
                        emailVerified: new Date(),
                    },
                });

                console.log('✅ [AUTH] Usuário criado com sucesso:', user.email);

                return {
                    success: true,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role,
                    },
                };
            } catch (error: any) {
                console.error('❌ [AUTH] Erro ao registrar:', error.message);

                if (error instanceof TRPCError) {
                    throw error;
                }

                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: error.message || "Erro ao criar conta",
                });
            }
        }),
});
