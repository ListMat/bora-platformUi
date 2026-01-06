import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar .env explicitamente
dotenv.config({ path: path.join(__dirname, '.env') });

const url = process.env.DIRECT_URL;
console.log('Usando URL:', url ? 'DIRECT_URL encontrada' : 'Fallback para DATABASE_URL');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: url
        }
    }
});

async function main() {
    console.log('🛠️ Corrigindo perfis de alunos faltando...');

    const usersWithoutProfile = await prisma.user.findMany({
        where: {
            role: 'STUDENT',
            student: {
                is: null
            }
        }
    });

    console.log(`Encontrados ${usersWithoutProfile.length} alunos sem perfil.`);

    for (const user of usersWithoutProfile) {
        if (user.email === 'admin@bora.com') continue; // Pular admin se ele tiver role trocada errada

        console.log(`Criando perfil para: ${user.name} (${user.email})...`);

        await prisma.student.create({
            data: {
                userId: user.id,
                points: 0,
                level: 1,
                walletBalance: 0,
                cpf: null,
            }
        });
    }

    console.log('✅ Correção concluída!');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
