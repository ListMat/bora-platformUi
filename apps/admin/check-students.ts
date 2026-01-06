import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasourceUrl: process.env.DIRECT_URL || process.env.DATABASE_URL
});

async function main() {
    console.log('🔍 Diagnosticando Usuários e Alunos...');

    // 1. Verificar últimos usuários criados
    const users = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            student: true,
            instructor: true
        }
    });

    console.log(`\n📋 Últimos 5 usuários cadastrados:`);
    users.forEach(u => {
        console.log(`- [${u.role}] ${u.name} (${u.email})`);
        console.log(`  ID: ${u.id}`);
        console.log(`  Tem perfil Student? ${u.student ? '✅ SIM' : '❌ NÃO'}`);
        console.log(`  Tem perfil Instructor? ${u.instructor ? '✅ SIM' : '❌ NÃO'}`);
        console.log('---');
    });

    // 2. Contar totais
    const totalUsers = await prisma.user.count();
    const totalStudents = await prisma.student.count();

    console.log(`\n📊 Totais:`);
    console.log(`- Usuários: ${totalUsers}`);
    console.log(`- Perfis de Aluno: ${totalStudents}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
