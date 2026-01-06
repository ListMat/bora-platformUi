import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const userId = "cmk1nni7h0000tsv4w2maxe3h"; // ID capturado dos logs anteriores
    console.log(`Verificando usuário ${userId}...`);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user) {
        console.log("❌ Usuário AINDA EXISTE no banco de dados.");
        console.log(user);
    } else {
        console.log("✅ Usuário NÃO ENCONTRADO (Deletado com sucesso).");
    }

    const instructor = await prisma.instructor.findUnique({ where: { userId } });
    console.log("Instructor status:", instructor ? "❌ Ainda existe" : "✅ Deletado");

    const vehicle = await prisma.vehicle.findFirst({ where: { userId } });
    console.log("Vehicle status:", vehicle ? "❌ Ainda existe" : "✅ Deletado");
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
