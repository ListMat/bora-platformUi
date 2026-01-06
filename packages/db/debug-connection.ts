
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🔄 Testando conexão com o banco de dados...");

    try {
        // Verificar se DIRECT_URL está acessível
        console.log("ℹ️ NODE_ENV:", process.env.NODE_ENV);
        console.log("ℹ️ DIRECT_URL definida?", !!process.env.DIRECT_URL);

        // Buscar instrutores
        const instructors = await prisma.instructor.findMany({
            select: {
                id: true,
                status: true,
                isOnline: true,
                user: {
                    select: { name: true }
                }
            }
        });

        console.log(`✅ Sucesso! Encontrados ${instructors.length} instrutores.`);

        if (instructors.length === 0) {
            console.log("⚠️ Nenhum instrutor no banco. Verifique se o Seed rodou.");
        } else {
            console.table(instructors.map(i => ({
                Name: i.user.name,
                Status: i.status,
                Online: i.isOnline ? 'SIM' : 'NÃO',
                ID: i.id.substring(0, 8) + '...'
            })));

            // Verificar quantos seriam retornados pela query do app
            const active = instructors.filter(i => (i.status === 'ACTIVE' || i.status === 'VERIFIED') && i.isOnline);
            console.log(`\n🔎 Instrutores visíveis para o aluno (ACTIVE + Online): ${active.length}`);
        }

    } catch (error) {
        console.error("❌ Erro fatal de conexão:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
