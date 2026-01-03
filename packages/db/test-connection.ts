import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testConnection() {
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║     🔍 TESTE DE CONEXÃO SUPABASE - BORA PLATFORM          ║");
    console.log("╚════════════════════════════════════════════════════════════╝\n");

    try {
        // 1. Testa conexão
        console.log("1️⃣  Testando conexão...");
        await prisma.$connect();
        console.log("   ✅ Conexão estabelecida com sucesso!\n");

        // 2. Testa query
        console.log("2️⃣  Executando query de teste...");
        const result = await prisma.$queryRaw`SELECT 1 as test`;
        console.log("   ✅ Query executada com sucesso!\n");

        // 3. Estatísticas do banco
        console.log("3️⃣  Estatísticas do banco de dados:");
        const userCount = await prisma.user.count();
        const studentCount = await prisma.student.count();
        const instructorCount = await prisma.instructor.count();
        const vehicleCount = await prisma.vehicle.count();

        console.log(`   👥 Total de usuários: ${userCount}`);
        console.log(`   🎓 Total de estudantes: ${studentCount}`);
        console.log(`   🚗 Total de instrutores: ${instructorCount}`);
        console.log(`   🚙 Total de veículos: ${vehicleCount}\n`);

        // 4. Usuários de teste
        console.log("4️⃣  Usuários de teste cadastrados:");
        const testUsers = await prisma.user.findMany({
            where: {
                OR: [
                    { email: { contains: 'teste' } },
                    { email: { contains: 'aluno' } },
                    { email: { contains: 'instrutor' } }
                ]
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (testUsers.length > 0) {
            testUsers.forEach(user => {
                const roleEmoji = user.role === 'STUDENT' ? '🎓' : user.role === 'INSTRUCTOR' ? '🚗' : '👤';
                console.log(`   ${roleEmoji} ${user.name}`);
                console.log(`      Email: ${user.email}`);
                console.log(`      Role: ${user.role}`);
                console.log(`      ID: ${user.id}\n`);
            });
        } else {
            console.log("   ⚠️  Nenhum usuário de teste encontrado\n");
        }

        // 5. Status final
        console.log("╔════════════════════════════════════════════════════════════╗");
        console.log("║              🎉 SUPABASE FUNCIONANDO PERFEITAMENTE!       ║");
        console.log("╚════════════════════════════════════════════════════════════╝");

    } catch (error: any) {
        console.log("\n╔════════════════════════════════════════════════════════════╗");
        console.log("║                  ❌ ERRO DE CONEXÃO                        ║");
        console.log("╚════════════════════════════════════════════════════════════╝\n");
        console.error("Detalhes do erro:");
        console.error(error.message);
        if (error.code) console.error(`Código: ${error.code}`);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
