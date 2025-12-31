import { z } from "zod";
import { router, adminProcedure } from "../trpc";
import { LessonStatus, InstructorStatus } from "@bora/db";

export const adminRouter = router({
  // Métricas do dashboard
  metrics: adminProcedure.query(async ({ ctx }) => {
    // Total de usuários
    const totalUsers = await ctx.prisma.user.count();
    
    // Total de alunos
    const totalStudents = await ctx.prisma.student.count();
    
    // Total de instrutores
    const totalInstructors = await ctx.prisma.instructor.count();
    
    // Instrutores ativos
    const activeInstructors = await ctx.prisma.instructor.count({
      where: { status: InstructorStatus.ACTIVE },
    });
    
    // Instrutores pendentes de aprovação
    const pendingInstructors = await ctx.prisma.instructor.count({
      where: { status: InstructorStatus.PENDING },
    });
    
    // Total de aulas
    const totalLessons = await ctx.prisma.lesson.count();
    
    // Aulas ativas (agendadas ou em andamento)
    const activeLessons = await ctx.prisma.lesson.count({
      where: {
        status: {
          in: [LessonStatus.SCHEDULED, LessonStatus.ACTIVE],
        },
      },
    });
    
    // Aulas finalizadas
    const completedLessons = await ctx.prisma.lesson.count({
      where: { status: LessonStatus.FINISHED },
    });
    
    // Total de pagamentos
    const totalPayments = await ctx.prisma.payment.count();
    
    // Receita total (soma de todos os pagamentos confirmados)
    const revenueData = await ctx.prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "PAID" },
    });
    const totalRevenue = revenueData._sum.amount || 0;
    
    // Receita do mês atual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyRevenueData = await ctx.prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: "PAID",
        createdAt: { gte: startOfMonth },
      },
    });
    const monthlyRevenue = monthlyRevenueData._sum.amount || 0;
    
    // Emergências (SOS)
    const totalEmergencies = await ctx.prisma.activityLog.count({
      where: { action: "EMERGENCY_SOS" },
    });
    
    // Emergências não resolvidas
    const unresolvedEmergencies = await ctx.prisma.activityLog.count({
      where: {
        action: "EMERGENCY_SOS",
        metadata: {
          path: ["resolved"],
          equals: null,
        },
      },
    });
    
    // Total de veículos cadastrados
    const totalVehicles = await ctx.prisma.vehicle.count();
    
    // Veículos ativos
    const activeVehicles = await ctx.prisma.vehicle.count({
      where: { status: "ACTIVE" },
    });
    
    // Crescimento de usuários (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsersLast30Days = await ctx.prisma.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });
    
    // Taxa de conversão (alunos que fizeram pelo menos 1 aula)
    const studentsWithLessons = await ctx.prisma.student.count({
      where: {
        lessons: {
          some: {},
        },
      },
    });
    const conversionRate = totalStudents > 0 
      ? Math.round((studentsWithLessons / totalStudents) * 100) 
      : 0;
    
    // Avaliação média geral
    const ratingsData = await ctx.prisma.rating.aggregate({
      _avg: { rating: true },
    });
    const averageRating = ratingsData._avg.rating || 0;
    
    return {
      users: {
        total: totalUsers,
        students: totalStudents,
        instructors: totalInstructors,
        newLast30Days: newUsersLast30Days,
      },
      instructors: {
        total: totalInstructors,
        active: activeInstructors,
        pending: pendingInstructors,
      },
      lessons: {
        total: totalLessons,
        active: activeLessons,
        completed: completedLessons,
      },
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue,
      },
      payments: {
        total: totalPayments,
      },
      emergencies: {
        total: totalEmergencies,
        unresolved: unresolvedEmergencies,
      },
      vehicles: {
        total: totalVehicles,
        active: activeVehicles,
      },
      metrics: {
        conversionRate,
        averageRating: Math.round(averageRating * 10) / 10,
      },
    };
  }),
  
  // Gráfico de aulas por dia (últimos 30 dias)
  lessonsChart: adminProcedure.query(async ({ ctx }) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const lessons = await ctx.prisma.lesson.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: "asc" },
    });
    
    // Agrupar por dia
    const dailyData: Record<string, { scheduled: number; completed: number; cancelled: number }> = {};
    
    lessons.forEach((lesson) => {
      const date = lesson.createdAt.toISOString().split("T")[0];
      if (!dailyData[date]) {
        dailyData[date] = { scheduled: 0, completed: 0, cancelled: 0 };
      }
      
      if (lesson.status === LessonStatus.SCHEDULED || lesson.status === LessonStatus.ACTIVE) {
        dailyData[date].scheduled++;
      } else if (lesson.status === LessonStatus.FINISHED) {
        dailyData[date].completed++;
      } else if (lesson.status === LessonStatus.CANCELLED) {
        dailyData[date].cancelled++;
      }
    });
    
    return Object.entries(dailyData).map(([date, data]) => ({
      date,
      ...data,
    }));
  }),
  
  // Gráfico de receita por mês (últimos 12 meses)
  revenueChart: adminProcedure.query(async ({ ctx }) => {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    
    const payments = await ctx.prisma.payment.findMany({
      where: {
        status: "PAID",
        createdAt: { gte: twelveMonthsAgo },
      },
      select: {
        createdAt: true,
        amount: true,
      },
      orderBy: { createdAt: "asc" },
    });
    
    // Agrupar por mês
    const monthlyData: Record<string, number> = {};
    
    payments.forEach((payment) => {
      const month = payment.createdAt.toISOString().substring(0, 7); // YYYY-MM
      monthlyData[month] = (monthlyData[month] || 0) + payment.amount;
    });
    
    return Object.entries(monthlyData).map(([month, revenue]) => ({
      month,
      revenue,
    }));
  }),
  
  // Atividades recentes
  recentActivity: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const activities = await ctx.prisma.activityLog.findMany({
        take: input.limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      
      return activities;
    }),
});

