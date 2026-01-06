import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const authRouter = router({
    // Registrar novo usuário
    register: publicProcedure
        .input(
            z.object({
                email: z.string().email(),
                password: z.string().min(6),
                name: z.string().min(2),
                role: z.enum(['STUDENT', 'INSTRUCTOR']),
            })
        )
        .mutation(async ({ input }) => {
            // Verificar se email já existe
            const existingUser = await prisma.user.findUnique({
                where: { email: input.email },
            });

            if (existingUser) {
                throw new Error("Email já cadastrado");
            }

            // Hash da senha
            const hashedPassword = await bcrypt.hash(input.password, 10);

            // Criar usuário
            const user = await prisma.user.create({
                data: {
                    email: input.email,
                    password: hashedPassword,
                    name: input.name,
                    role: input.role,
                    emailVerified: new Date(), // Auto-verificar por enquanto
                },
            });

            return {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                },
            };
        }),

    // Solicitar reset de senha
    requestPasswordReset: publicProcedure
        .input(
            z.object({
                email: z.string().email(),
            })
        )
        .mutation(async ({ input }) => {
            const user = await prisma.user.findUnique({
                where: { email: input.email },
            });

            if (!user) {
                // Por segurança, não revelar se o email existe
                return { success: true };
            }

            // Gerar token único
            const resetToken = crypto.randomBytes(32).toString("hex");
            const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

            // Salvar token no banco
            await prisma.verificationToken.create({
                data: {
                    identifier: input.email,
                    token: resetToken,
                    expires: resetTokenExpiry,
                },
            });

            // TODO: Enviar email com o link
            // Por enquanto, vamos apenas logar o link
            const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
            console.log('🔑 Link de reset de senha:', resetLink);
            console.log('📧 Email:', input.email);

            // Em produção, você deve usar um serviço de email como:
            // - Resend (https://resend.com)
            // - SendGrid
            // - AWS SES
            // - Nodemailer

            return { success: true };
        }),

    // Resetar senha
    resetPassword: publicProcedure
        .input(
            z.object({
                token: z.string(),
                password: z.string().min(6),
            })
        )
        .mutation(async ({ input }) => {
            // Buscar token
            const verificationToken = await prisma.verificationToken.findUnique({
                where: { token: input.token },
            });

            if (!verificationToken) {
                throw new Error("Token inválido ou expirado");
            }

            // Verificar se expirou
            if (verificationToken.expires < new Date()) {
                await prisma.verificationToken.delete({
                    where: { token: input.token },
                });
                throw new Error("Token expirado");
            }

            // Buscar usuário
            const user = await prisma.user.findUnique({
                where: { email: verificationToken.identifier },
            });

            if (!user) {
                throw new Error("Usuário não encontrado");
            }

            // Hash da nova senha
            const hashedPassword = await bcrypt.hash(input.password, 10);

            // Atualizar senha
            await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword },
            });

            // Deletar token usado
            await prisma.verificationToken.delete({
                where: { token: input.token },
            });

            return { success: true };
        }),
});
