import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
    console.log('🔌 Testando conexão com Supabase...\n');

    try {
        // Teste 1: Conectar ao banco
        await prisma.$connect();
        console.log('✅ Conexão estabelecida com sucesso!');

        // Teste 2: Contar usuários
        const userCount = await prisma.user.count();
        console.log(`✅ Usuários no banco: ${userCount}`);

        // Teste 3: Contar instrutores
        const instructorCount = await prisma.instructor.count();
        console.log(`✅ Instrutores no banco: ${instructorCount}`);

        // Teste 4: Contar alunos
        const studentCount = await prisma.student.count();
        console.log(`✅ Alunos no banco: ${studentCount}`);

        // Teste 5: Listar primeiros usuários
        if (userCount > 0) {
            console.log('\n📋 Primeiros usuários:');
            const users = await prisma.user.findMany({
                take: 5,
                select: {
                    email: true,
                    name: true,
                    role: true,
                },
            });
            users.forEach((user, i) => {
                console.log(`  ${i + 1}. ${user.name} (${user.email}) - ${user.role}`);
            });
        }

        console.log('\n🎉 Todos os testes passaram!');
        console.log('✅ Banco de dados está funcionando corretamente.\n');
    } catch (error) {
        console.error('\n❌ Erro na conexão:', error);
        console.log('\n💡 Dicas:');
        console.log('  1. Verifique se o DATABASE_URL está correto no .env');
        console.log('  2. Verifique se a senha está correta');
        console.log('  3. Execute "pnpm prisma db push" para criar as tabelas');
        console.log('  4. Verifique se o Supabase está online\n');
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
