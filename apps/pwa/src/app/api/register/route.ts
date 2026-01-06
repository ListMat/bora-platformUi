
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["STUDENT", "INSTRUCTOR"]),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("📝 [API/REGISTER] Recebido:", body);

        // Validar dados
        const result = registerSchema.safeParse(body);
        if (!result.success) {
            console.error("❌ [API/REGISTER] Erro de validação:", result.error);
            return NextResponse.json(
                { error: "Dados inválidos", details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { email, password, name, role } = result.data;

        // Verificar se usuário existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log("❌ [API/REGISTER] Email já existe:", email);
            return NextResponse.json(
                { error: "Este email já está cadastrado" },
                { status: 409 }
            );
        }

        // Criar usuário
        console.log("✅ [API/REGISTER] Criando usuário...");
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                emailVerified: new Date(),
            },
        });

        console.log("✅ [API/REGISTER] Sucesso:", user.id);

        return NextResponse.json({
            success: true,
            user: { id: user.id, email: user.email, name: user.name }
        });

    } catch (error: any) {
        console.error("❌ [API/REGISTER] Erro interno:", error);
        return NextResponse.json(
            { error: "Erro interno no servidor", details: error.message },
            { status: 500 }
        );
    }
}
