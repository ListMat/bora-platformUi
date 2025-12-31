import { NextResponse } from "next/server";
import { prisma } from "@bora/db";
import { hash } from "bcryptjs";

export async function GET() {
    const instructors = await prisma.instructor.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    });

    const data = instructors.map((i) => ({
        id: i.id,
        userId: i.userId,
        name: i.user.name,
        email: i.user.email,
        phone: i.user.phone,
        cpf: i.cpf,
        cnhNumber: i.cnhNumber,
        credentialNumber: i.credentialNumber,
        status: i.status,
        isAvailable: i.isAvailable,
        createdAt: i.createdAt,
    }));

    return NextResponse.json(data);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, cpf, cnhNumber, credentialNumber, status = "ACTIVE" } = body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "Usuário já existe" }, { status: 400 });
        }

        const hashedPassword = await hash("123456", 10);

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    phone,
                    password: hashedPassword,
                    role: "INSTRUCTOR",
                }
            });

            // Garantir CPF limpo se necessário, ou confiar no input
            const instructor = await tx.instructor.create({
                data: {
                    userId: user.id,
                    cpf,
                    cnhNumber,
                    credentialNumber,
                    status: status as any, // "ACTIVE" | "PENDING_VERIFICATION"
                    isAvailable: true,
                }
            });

            return { ...instructor, name: user.name, email: user.email };
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Erro ao criar instrutor:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
