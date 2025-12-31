import { NextResponse } from "next/server";
import { prisma } from "@bora/db";
import { hash } from "bcryptjs";

export async function GET() {
    const students = await prisma.student.findMany({
        include: { user: true },
        orderBy: { createdAt: 'desc' }
    });

    const data = students.map((s) => ({
        id: s.id,
        userId: s.userId,
        name: s.user.name,
        email: s.user.email,
        phone: s.user.phone,
        cpf: s.cpf,
        dateOfBirth: s.dateOfBirth,
        address: s.address,
        city: s.city,
        state: s.state,
        zipCode: s.zipCode,
        createdAt: s.createdAt,
    }));

    // Adicionar Header Content-Range para React Admin (opcional se usarmos formato { data, total })
    // O formato { data: [], total: N } é aceito por alguns dataProviders ou requer adaptação.
    // Vou retornar JSON simples e adaptar o dataProvider.
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, cpf, dateOfBirth, address, city, state, zipCode } = body;

        // Verificar se email já existe
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
                    role: "STUDENT",
                }
            });

            const student = await tx.student.create({
                data: {
                    userId: user.id,
                    cpf,
                    dateOfBirth: new Date(dateOfBirth),
                    address,
                    city,
                    state,
                    zipCode,
                }
            });

            return { ...student, name: user.name, email: user.email };
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Erro ao criar aluno:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
