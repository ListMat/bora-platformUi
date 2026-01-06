import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testAuth() {
    console.log('🔍 Testando autenticação...\n');

    try {
        // Buscar usuário instrutor
        const user = await prisma.user.findUnique({
            where: { email: 'joao.silva@bora.com' }
        });

        if (!user) {
            console.log('❌ Usuário não encontrado!');
            return;
        }

        console.log('✅ Usuário encontrado:', user.email);
        console.log('   Role:', user.role);
        console.log('   Tem senha:', !!user.password);

        if (user.password) {
            // Testar senha
            const isValid = await bcrypt.compare('instrutor123', user.password);
            console.log('   Senha válida:', isValid ? '✅ SIM' : '❌ NÃO');

            if (!isValid) {
                console.log('\n🔧 Atualizando senha...');
                const newHash = await bcrypt.hash('instrutor123', 10);
                await prisma.user.update({
                    where: { id: user.id },
                    data: { password: newHash }
                });
                console.log('✅ Senha atualizada!');
            }
        } else {
            console.log('\n🔧 Criando senha...');
            const newHash = await bcrypt.hash('instrutor123', 10);
            await prisma.user.update({
                where: { id: user.id },
                data: { password: newHash }
            });
            console.log('✅ Senha criada!');
        }

        console.log('\n✅ Teste completo!');
    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testAuth();
