import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // ========================================
  // 1. CRIAR ADMIN
  // ========================================
  console.log('👤 Criando usuário Admin...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bora.com' },
    update: {},
    create: {
      email: 'admin@bora.com',
      name: 'Admin Bora',
      password: adminPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });
  console.log('✅ Admin criado:', admin.email);

  // ========================================
  // 2. CRIAR INSTRUTORES
  // ========================================
  console.log('\n🚗 Criando instrutores...');

  const instructorsData = [
    {
      email: 'joao.silva@bora.com',
      name: 'João Silva',
      cpf: '12345678900',
      phone: '(11) 99999-1111',
      cnhNumber: 'ABC123456',
      credentialNumber: 'CRED001',
      cep: '01310-100',
      street: 'Av. Paulista',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.5505,
      longitude: -46.6333,
      basePrice: 100,
      vehicle: {
        brand: 'Volkswagen',
        model: 'Gol',
        year: 2022,
        color: 'Branco',
        transmission: 'MANUAL' as const,
      },
    },
    {
      email: 'maria.santos@bora.com',
      name: 'Maria Santos',
      cpf: '98765432100',
      phone: '(11) 99999-2222',
      cnhNumber: 'DEF789012',
      credentialNumber: 'CRED002',
      cep: '04538-133',
      street: 'Av. Brigadeiro Faria Lima',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.5781,
      longitude: -46.6892,
      basePrice: 120,
      vehicle: {
        brand: 'Chevrolet',
        model: 'Onix',
        year: 2023,
        color: 'Prata',
        transmission: 'AUTOMATICO' as const,
      },
    },
    {
      email: 'carlos.oliveira@bora.com',
      name: 'Carlos Oliveira',
      cpf: '45678912300',
      phone: '(11) 99999-3333',
      cnhNumber: 'GHI345678',
      credentialNumber: 'CRED003',
      cep: '05407-002',
      street: 'Av. Rebouças',
      neighborhood: 'Pinheiros',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.5629,
      longitude: -46.6825,
      basePrice: 90,
      vehicle: {
        brand: 'Fiat',
        model: 'Argo',
        year: 2021,
        color: 'Vermelho',
        transmission: 'MANUAL' as const,
      },
    },
  ];

  for (const data of instructorsData) {
    const password = await bcrypt.hash('instrutor123', 10);
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        email: data.email,
        name: data.name,
        password,
        role: 'INSTRUCTOR',
        emailVerified: new Date(),
      },
    });

    const instructor = await prisma.instructor.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        cpf: data.cpf,
        phone: data.phone,
        cnhNumber: data.cnhNumber,
        credentialNumber: data.credentialNumber,
        cep: data.cep,
        street: data.street,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        latitude: data.latitude,
        longitude: data.longitude,
        basePrice: data.basePrice,
        status: 'ACTIVE',
        isAvailable: true,
        isOnline: true,
        averageRating: 4.8,
        totalLessons: Math.floor(Math.random() * 50) + 10,
      },
    });

    // Criar veículo
    await prisma.vehicle.create({
      data: {
        userId: user.id,
        brand: data.vehicle.brand,
        model: data.vehicle.model,
        year: data.vehicle.year,
        color: data.vehicle.color,
        plateLastFour: String(Math.floor(Math.random() * 9999)).padStart(4, '0'),
        category: 'HATCH',
        transmission: data.vehicle.transmission,
        fuel: 'FLEX',
        hasDualPedal: true,
        status: 'active',
      },
    });

    // Criar disponibilidade (Seg a Sex, 8h às 18h)
    const daysOfWeek = [1, 2, 3, 4, 5];
    for (const day of daysOfWeek) {
      await prisma.instructorAvailability.create({
        data: {
          instructorId: instructor.id,
          dayOfWeek: day,
          startTime: '08:00',
          endTime: '18:00',
        },
      });
    }

    console.log(`✅ Instrutor criado: ${data.name} (${data.email})`);
  }

  // ========================================
  // 3. CRIAR ALUNOS
  // ========================================
  console.log('\n🎓 Criando alunos...');

  const studentsData = [
    {
      email: 'ana.costa@bora.com',
      name: 'Ana Costa',
      cpf: '11122233344',
      phone: '(11) 98888-1111',
      cep: '01310-100',
      city: 'São Paulo',
      state: 'SP',
    },
    {
      email: 'pedro.alves@bora.com',
      name: 'Pedro Alves',
      cpf: '55566677788',
      phone: '(11) 98888-2222',
      cep: '04538-133',
      city: 'São Paulo',
      state: 'SP',
    },
  ];

  for (const data of studentsData) {
    const password = await bcrypt.hash('aluno123', 10);
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        email: data.email,
        name: data.name,
        password,
        role: 'STUDENT',
        emailVerified: new Date(),
      },
    });

    await prisma.student.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        cpf: data.cpf,
        phone: data.phone,
        cep: data.cep,
        city: data.city,
        state: data.state,
      },
    });

    console.log(`✅ Aluno criado: ${data.name} (${data.email})`);
  }

  // ========================================
  // RESUMO
  // ========================================
  console.log('\n🎉 Seed completo!\n');
  console.log('📝 CREDENCIAIS DE TESTE:\n');
  console.log('┌─────────────────────────────────────────────┐');
  console.log('│ ADMIN                                       │');
  console.log('│ Email: admin@bora.com                       │');
  console.log('│ Senha: admin123                             │');
  console.log('├─────────────────────────────────────────────┤');
  console.log('│ INSTRUTORES                                 │');
  console.log('│ Email: joao.silva@bora.com                  │');
  console.log('│ Email: maria.santos@bora.com                │');
  console.log('│ Email: carlos.oliveira@bora.com             │');
  console.log('│ Senha: instrutor123 (todos)                 │');
  console.log('├─────────────────────────────────────────────┤');
  console.log('│ ALUNOS                                      │');
  console.log('│ Email: ana.costa@bora.com                   │');
  console.log('│ Email: pedro.alves@bora.com                 │');
  console.log('│ Senha: aluno123 (todos)                     │');
  console.log('└─────────────────────────────────────────────┘\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
