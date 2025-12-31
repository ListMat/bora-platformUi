import { NextResponse } from "next/server";
import { prisma } from "@bora/db";

export async function GET() {
    const bundles = await prisma.bundle.findMany({
        orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(bundles);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const bundle = await prisma.bundle.create({
            data: {
                name: body.name,
                description: body.description,
                totalLessons: Number(body.totalLessons),
                price: body.price,
                discount: body.discount || 0,
                expiryDays: body.expiryDays ? Number(body.expiryDays) : null,
                isActive: body.isActive ?? true,
                featured: body.featured ?? false,
            }
        });

        return NextResponse.json(bundle);
    } catch (error: any) {
        console.error("Erro ao criar pacote:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
