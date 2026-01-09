import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding admin user...');

    try {
        // Verificar se admin já existe
        const existingAdmin = await prisma.user.findUnique({
            where: { email: 'admin@bora.com' },
        });

        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            console.log('📧 Email:', existingAdmin.email);
            console.log('👤 Name:', existingAdmin.name);
            console.log('🔑 Role:', existingAdmin.role);
            return;
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Criar usuário admin (sem notificationPreferences se der erro)
        const admin = await prisma.user.create({
            data: {
                email: 'admin@bora.com',
                name: 'Admin Bora',
                password: hashedPassword,
                role: 'ADMIN',
                emailVerified: new Date(),
            },
        });

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email:', admin.email);
        console.log('🔑 Password: admin123');
        console.log('👤 Name:', admin.name);
        console.log('🎯 Role:', admin.role);
        console.log('\n🚀 You can now login at http://localhost:3002/auth/login');
    } catch (error: any) {
        if (error.code === 'P2002') {
            console.log('✅ Admin user already exists (unique constraint)');
        } else {
            console.error('❌ Error details:', error.message);
            throw error;
        }
    }
}

main()
    .catch((e) => {
        console.error('❌ Error seeding admin:', e.message);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
