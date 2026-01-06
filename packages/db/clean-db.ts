
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("⚠️  ATENÇÃO: Iniciando limpeza completa do banco de dados...");

    try {
        // 1. Logs e Chats
        console.log("🗑️  Removendo ChatMessages...");
        await prisma.chatMessage.deleteMany({});
        console.log("🗑️  Removendo ActivityLogs...");
        await prisma.activityLog.deleteMany({});

        // 2. Avaliações e Skills
        console.log("🗑️  Removendo SkillEvaluations...");
        await prisma.skillEvaluation.deleteMany({});
        console.log("🗑️  Removendo Skills...");
        await prisma.skill.deleteMany({});
        console.log("🗑️  Removendo Ratings...");
        await prisma.rating.deleteMany({});

        // 3. Pagamentos e Disputas
        console.log("🗑️  Removendo Cancelamentos...");
        await prisma.cancellationPolicy.deleteMany({});
        console.log("🗑️  Removendo PaymentSplits...");
        await prisma.paymentSplit.deleteMany({});
        console.log("🗑️  Removendo Disputas...");
        await prisma.dispute.deleteMany({});
        console.log("🗑️  Removendo BundlePayments...");
        await prisma.bundlePayment.deleteMany({});
        console.log("🗑️  Removendo BundlePurchases...");
        await prisma.bundlePurchase.deleteMany({});
        console.log("🗑️  Removendo Payments...");
        await prisma.payment.deleteMany({});

        // 4. Aulas e Agendamentos
        console.log("🗑️  Removendo Lessons...");
        await prisma.lesson.deleteMany({});

        // 5. Ofertas e Planos
        console.log("🗑️  Removendo Plans...");
        await prisma.plan.deleteMany({});
        console.log("🗑️  Removendo Bundles...");
        await prisma.bundle.deleteMany({});
        console.log("🗑️  Removendo InstructorAvailability...");
        await prisma.instructorAvailability.deleteMany({});
        console.log("🗑️  Removendo Referrals...");
        await prisma.referral.deleteMany({});

        // 6. Perfis e Veículos
        console.log("🗑️  Removendo Veículos...");
        await prisma.vehicle.deleteMany({});

        console.log("🗑️  Removendo Perfis de Instrutor...");
        await prisma.instructor.deleteMany({});

        console.log("🗑️  Removendo Perfis de Aluno...");
        await prisma.student.deleteMany({});

        // 7. Auth e Usuários
        console.log("🗑️  Removendo Sessões e Contas...");
        await prisma.session.deleteMany({});
        await prisma.account.deleteMany({});
        await prisma.verificationToken.deleteMany({});

        console.log("🗑️  Removendo Usuários...");
        await prisma.user.deleteMany({});

        console.log("✅ Banco de dados limpo com sucesso!");

    } catch (error) {
        console.error("❌ Erro ao limpar banco:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
