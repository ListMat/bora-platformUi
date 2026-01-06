import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    try {
        await prisma.user.delete({
            where: { email: session.user.email },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao excluir conta:", error);
        return NextResponse.json({ error: 'Erro ao excluir conta' }, { status: 500 });
    }
}
