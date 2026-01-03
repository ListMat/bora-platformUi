import { z } from "zod";
import { router, protectedProcedure, instructorProcedure, adminProcedure, publicProcedure } from "../trpc";
import { InstructorStatus } from "@bora/db";
import { validateCPF, validateCNH } from "../utils/validators";
import {
  uploadInstructorDocument,
  base64ToBuffer,
  generateDocumentFilename,
} from "../modules/instructorDocumentStorage";
import {
  createConnectAccount,
  createConnectOnboardingLink,
  checkConnectAccountStatus,
} from "../modules/stripeConnect";

export const instructorRouter = router({
  // Detalhes do instrutor por ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const instructor = await ctx.prisma.instructor.findUnique({
        where: { id: input.id },
        include: {
          user: { select: { id: true, name: true, image: true } },
          vehicles: { where: { status: "active" }, take: 1 },
        },
      });
      if (!instructor) throw new Error("Instrutor não encontrado");
      return instructor;
    }),

  // Buscar instrutores próximos
  nearby: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        radius: z.number().default(10), // km
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      // Buscar instrutores ativos com localização
      const instructors = await ctx.prisma.instructor.findMany({
        where: {
          status: InstructorStatus.ACTIVE,
          isAvailable: true,
          latitude: { not: null },
          longitude: { not: null },
        },
        include: {
          user: true,
          vehicles: {
            where: {
              status: "active",
            },
            take: 1,
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      // Calcular distância usando fórmula Haversine
      const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Raio da Terra em km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      // Filtrar e ordenar por distância
      const instructorsWithDistance = instructors
        .map(instructor => ({
          ...instructor,
          distance: calculateDistance(
            input.latitude,
            input.longitude,
            instructor.latitude!,
            instructor.longitude!
          ),
        }))
        .filter(instructor => instructor.distance <= input.radius)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, input.limit);

      return instructorsWithDistance;
    }),

  // Listar instrutores disponíveis
  list: publicProcedure
    .input(
      z.object({
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const instructors = await ctx.prisma.instructor.findMany({
        where: {
          status: InstructorStatus.ACTIVE,
          isAvailable: true,
        },
        take: input.limit,
        orderBy: { averageRating: "desc" },
        include: {
          user: true,
        },
      });

      return instructors;
    }),

  // Obter detalhes de instrutor
  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const instructor = await ctx.prisma.instructor.findUnique({
        where: { id: input.id },
        include: {
          user: true,
          availability: true,
          ratings: {
            take: 10,
            orderBy: { createdAt: "desc" },
            include: {
              student: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      return instructor;
    }),

  // Criar perfil de instrutor
  create: protectedProcedure
    .input(
      z.object({
        cpf: z
          .string()
          .min(11, "CPF deve ter 11 dígitos")
          .max(14, "CPF inválido")
          .refine((cpf) => validateCPF(cpf), "CPF inválido"),
        cnhNumber: z
          .string()
          .min(11, "CNH deve ter 11 dígitos")
          .max(11, "CNH inválida")
          .refine((cnh) => validateCNH(cnh), "CNH inválida"),
        credentialNumber: z
          .string()
          .min(1, "Número da credencial é obrigatório"),
        credentialExpiry: z
          .date()
          .refine(
            (date) => date > new Date(),
            "Credencial não pode estar vencida"
          ),
        city: z.string().min(1, "Cidade é obrigatória"),
        state: z
          .string()
          .length(2, "Estado deve ter 2 caracteres (ex: SP)")
          .toUpperCase(),
        basePrice: z
          .number()
          .positive("Preço deve ser positivo")
          .min(50, "Preço mínimo é R$ 50,00")
          .max(1000, "Preço máximo é R$ 1.000,00"),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Verificar se já existe um perfil de instrutor
      const existingInstructor = await ctx.prisma.instructor.findUnique({
        where: { userId: user.id },
      });

      if (existingInstructor) {
        throw new Error("Instructor profile already exists");
      }

      // Verificar se CPF já está em uso
      const cpfInUse = await ctx.prisma.instructor.findUnique({
        where: { cpf: input.cpf.replace(/\D/g, "") },
      });

      if (cpfInUse) {
        throw new Error("CPF já está em uso");
      }

      // Verificar se CNH já está em uso
      const cnhInUse = await ctx.prisma.instructor.findUnique({
        where: { cnhNumber: input.cnhNumber.replace(/\D/g, "") },
      });

      if (cnhInUse) {
        throw new Error("CNH já está em uso");
      }

      // Limpar formatação do CPF e CNH
      const cleanCPF = input.cpf.replace(/\D/g, "");
      const cleanCNH = input.cnhNumber.replace(/\D/g, "");

      const instructor = await ctx.prisma.instructor.create({
        data: {
          userId: user.id,
          cpf: cleanCPF,
          cnhNumber: cleanCNH,
          credentialNumber: input.credentialNumber,
          credentialExpiry: input.credentialExpiry,
          city: input.city,
          state: input.state,
          basePrice: input.basePrice,
          status: InstructorStatus.PENDING_VERIFICATION,
        },
      });

      // Atualizar telefone do usuário se fornecido
      if (input.phone) {
        await ctx.prisma.user.update({
          where: { id: user.id },
          data: { phone: input.phone },
        });
      }

      // Atualizar role do usuário
      await ctx.prisma.user.update({
        where: { id: user.id },
        data: { role: "INSTRUCTOR" },
      });

      return instructor;
    }),

  // Upload de documento (CNH ou Credencial)
  uploadDocument: instructorProcedure
    .input(
      z.object({
        documentType: z.enum(["cnh", "credential"]),
        documentBase64: z.string().min(1, "Documento é obrigatório"),
        filename: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        include: { instructor: true },
      });

      if (!user?.instructor) {
        throw new Error("Instructor profile not found");
      }

      // Converter base64 para buffer
      const documentBuffer = base64ToBuffer(input.documentBase64);

      // Gerar filename se não fornecido
      const extension = input.documentBase64.startsWith("data:application/pdf")
        ? "pdf"
        : input.documentBase64.startsWith("data:image/png")
          ? "png"
          : "jpg";

      const filename =
        input.filename ||
        generateDocumentFilename(
          user.instructor.id,
          input.documentType,
          extension
        );

      // Fazer upload do documento
      const documentUrl = await uploadInstructorDocument(
        user.instructor.id,
        documentBuffer,
        filename,
        input.documentType
      );

      // Atualizar o campo correspondente no banco
      const updateData =
        input.documentType === "cnh"
          ? { cnhDocument: documentUrl }
          : { credentialDoc: documentUrl };

      const instructor = await ctx.prisma.instructor.update({
        where: { id: user.instructor.id },
        data: updateData,
      });

      return { documentUrl, instructor };
    }),

  // Atualizar perfil do instrutor
  update: instructorProcedure
    .input(
      z.object({
        city: z.string().min(1).optional(),
        state: z.string().length(2).toUpperCase().optional(),
        basePrice: z
          .number()
          .positive()
          .min(50)
          .max(1000)
          .optional(),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        include: { instructor: true },
      });

      if (!user?.instructor) {
        throw new Error("Instructor profile not found");
      }

      const updateData: any = {};

      if (input.city) updateData.city = input.city;
      if (input.state) updateData.state = input.state;
      if (input.basePrice !== undefined) updateData.basePrice = input.basePrice;

      const instructor = await ctx.prisma.instructor.update({
        where: { id: user.instructor.id },
        data: updateData,
      });

      if (input.phone !== undefined) {
        await ctx.prisma.user.update({
          where: { id: user.id },
          data: { phone: input.phone },
        });
      }

      return instructor;
    }),

  // Atualizar disponibilidade
  updateAvailability: instructorProcedure
    .input(
      z.object({
        isAvailable: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        include: { instructor: true },
      });

      if (!user?.instructor) {
        throw new Error("Instructor profile not found");
      }

      const instructor = await ctx.prisma.instructor.update({
        where: { id: user.instructor.id },
        data: {
          isAvailable: input.isAvailable,
        },
      });

      return instructor;
    }),

  // Atualizar localização
  updateLocation: instructorProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        include: { instructor: true },
      });

      if (!user?.instructor) {
        throw new Error("Instructor profile not found");
      }

      const instructor = await ctx.prisma.instructor.update({
        where: { id: user.instructor.id },
        data: {
          latitude: input.latitude,
          longitude: input.longitude,
        },
      });

      return instructor;
    }),

  // Aprovar instrutor (admin)
  approve: adminProcedure
    .input(
      z.object({
        instructorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const instructor = await ctx.prisma.instructor.update({
        where: { id: input.instructorId },
        data: {
          status: InstructorStatus.ACTIVE,
        },
      });

      return instructor;
    }),

  // Suspender instrutor (admin)
  suspend: adminProcedure
    .input(
      z.object({
        instructorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const instructor = await ctx.prisma.instructor.update({
        where: { id: input.instructorId },
        data: {
          status: InstructorStatus.SUSPENDED,
          isAvailable: false,
        },
      });

      return instructor;
    }),

  // Buscar horários disponíveis do instrutor
  slots: protectedProcedure
    .input(
      z.object({
        instructorId: z.string(),
        date: z.date(), // Data para buscar slots
      })
    )
    .query(async ({ ctx, input }) => {
      // Criar cópias da data para não modificar o original
      const dateStart = new Date(input.date);
      dateStart.setHours(0, 0, 0, 0);
      const dateEnd = new Date(input.date);
      dateEnd.setHours(23, 59, 59, 999);

      const instructor = await ctx.prisma.instructor.findUnique({
        where: { id: input.instructorId },
        include: {
          availability: true,
          lessons: {
            where: {
              scheduledAt: {
                gte: dateStart,
                lt: dateEnd,
              },
              status: {
                in: ["SCHEDULED", "ACTIVE"],
              },
            },
          },
        },
      });

      if (!instructor) {
        throw new Error("Instructor not found");
      }

      // Gerar slots de 30 em 30 minutos das 8h às 20h
      const slots: { time: string; available: boolean }[] = [];
      const dayOfWeek = input.date.getDay(); // 0 = domingo, 6 = sábado

      // Verificar disponibilidade do instrutor para esse dia
      const dayAvailability = instructor.availability.find(
        (av) => av.dayOfWeek === dayOfWeek
      );

      if (!dayAvailability) {
        return []; // Instrutor não disponível nesse dia
      }

      // Gerar slots de 30 em 30 minutos
      for (let hour = 8; hour < 20; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
          const [startHour, startMinute] = dayAvailability.startTime.split(":").map(Number);
          const [endHour, endMinute] = dayAvailability.endTime.split(":").map(Number);

          // Verificar se o slot está dentro do horário de disponibilidade
          const slotTime = hour * 60 + minute;
          const startTime = startHour * 60 + startMinute;
          const endTime = endHour * 60 + endMinute;

          if (slotTime >= startTime && slotTime < endTime) {
            // Verificar se há aula agendada nesse horário
            const slotDateTime = new Date(input.date);
            slotDateTime.setHours(hour, minute, 0, 0);

            const hasLesson = instructor.lessons.some((lesson) => {
              const lessonTime = new Date(lesson.scheduledAt);
              return (
                lessonTime.getHours() === hour &&
                lessonTime.getMinutes() === minute
              );
            });

            // Verificar se é pelo menos 2 horas no futuro
            const now = new Date();
            const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

            slots.push({
              time: timeString,
              available: !hasLesson && slotDateTime >= twoHoursFromNow,
            });
          }
        }
      }

      return slots;
    }),

  // Buscar veículos do instrutor
  vehicles: protectedProcedure
    .input(
      z.object({
        instructorId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const instructor = await ctx.prisma.instructor.findUnique({
        where: { id: input.instructorId },
        include: {
          user: {
            include: {
              vehicles: {
                where: {
                  status: "active",
                },
              },
            },
          },
        },
      });

      if (!instructor) {
        throw new Error("Instructor not found");
      }

      return instructor.user.vehicles;
    }),

  // Criar conta Stripe Connect
  createStripeAccount: instructorProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
      include: { instructor: true },
    });

    if (!user?.instructor) {
      throw new Error("Instructor profile not found");
    }

    const account = await createConnectAccount(user.instructor.id);
    return { accountId: account.id };
  }),

  // Obter link de onboarding do Stripe Connect
  getStripeOnboardingLink: instructorProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
      include: { instructor: true },
    });

    if (!user?.instructor) {
      throw new Error("Instructor profile not found");
    }

    const url = await createConnectOnboardingLink(user.instructor.id);
    return { url };
  }),

  // Verificar status da conta Stripe Connect
  checkStripeStatus: instructorProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
      include: { instructor: true },
    });

    if (!user?.instructor) {
      throw new Error("Instructor profile not found");
    }

    const status = await checkConnectAccountStatus(user.instructor.id);
    return status;
  }),

  // Obter perfil do instrutor logado
  getMyProfile: instructorProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
      include: {
        instructor: {
          include: {
            user: true,
            ratings: {
              take: 10,
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    if (!user?.instructor) {
      throw new Error("Instructor profile not found");
    }

    // Calcular média de avaliações
    const totalRatings = user.instructor.ratings.length;
    const averageRating =
      totalRatings > 0
        ? user.instructor.ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
        : 0;

    return {
      ...user.instructor,
      user: user,
      averageRating,
      totalLessons: totalRatings,
    };
  }),

  // Ganhos mensais do instrutor
  monthlyEarnings: instructorProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
      include: { instructor: true },
    });

    if (!user?.instructor) {
      throw new Error("Instructor profile not found");
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const lessons = await ctx.prisma.lesson.findMany({
      where: {
        instructorId: user.instructor.id,
        status: "COMPLETED",
        createdAt: {
          gte: startOfMonth,
        },
        payment: {
          status: "COMPLETED",
        },
      },
      include: {
        payment: true,
      },
    });

    const totalEarnings = lessons.reduce((sum, lesson) => {
      return sum + Number(lesson.payment?.amount || 0);
    }, 0);

    return totalEarnings;
  }),

  // Aceitar aulas (disponibilidade) - Nova versão com múltiplos dias, horários e tipos
  acceptLessons: instructorProcedure
    .input(
      z.object({
        dates: z.array(z.string()), // Array de datas ISO string
        timeSlots: z.array(
          z.object({
            start: z.string(), // HH:mm format
            end: z.string(), // HH:mm format
          })
        ),
        lessonTypes: z.array(z.string()), // Array de tipos de aula
        vehicleId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        include: { instructor: true },
      });

      if (!user?.instructor) {
        throw new Error("Instructor profile not found");
      }

      // Validar que o veículo pertence ao instrutor
      const vehicle = await ctx.prisma.vehicle.findFirst({
        where: {
          id: input.vehicleId,
          userId: user.id,
        },
      });

      if (!vehicle) {
        throw new Error("Vehicle not found or does not belong to instructor");
      }

      // Atualizar disponibilidade do instrutor
      await ctx.prisma.instructor.update({
        where: { id: user.instructor.id },
        data: {
          isAvailable: true,
        },
      });

      // Limpar disponibilidades antigas (opcional - pode manter histórico)
      // await ctx.prisma.instructorAvailability.deleteMany({
      //   where: { instructorId: user.instructor.id },
      // });

      // Criar registros de disponibilidade para cada combinação de dia + horário
      const now = new Date();
      const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

      let availabilityCount = 0;

      for (const dateStr of input.dates) {
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);

        // Verificar se a data é pelo menos 2 horas no futuro
        if (date < twoHoursFromNow) {
          continue; // Pular datas muito próximas
        }

        const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado

        for (const timeSlot of input.timeSlots) {
          // Criar registro de disponibilidade
          // Usando o modelo existente InstructorAvailability
          // Armazenamos o dia da semana e os horários
          const existing = await ctx.prisma.instructorAvailability.findFirst({
            where: {
              instructorId: user.instructor.id,
              dayOfWeek: dayOfWeek,
              startTime: timeSlot.start,
              endTime: timeSlot.end,
            },
          });

          if (!existing) {
            await ctx.prisma.instructorAvailability.create({
              data: {
                instructorId: user.instructor.id,
                dayOfWeek: dayOfWeek,
                startTime: timeSlot.start,
                endTime: timeSlot.end,
              },
            });
            availabilityCount++;
          }
        }
      }

      // Armazenar tipos de aula oferecidos (pode ser em um campo JSON ou tabela separada)
      // Por enquanto, vamos armazenar como metadata no instructor
      // TODO: Criar tabela LessonType se necessário para tipos customizados

      return {
        success: true,
        availabilityCount,
        dates: input.dates.length,
        timeSlots: input.timeSlots.length,
        lessonTypes: input.lessonTypes.length,
      };
    }),

  // Saldo do instrutor
  balance: instructorProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
      include: { instructor: true },
    });

    if (!user?.instructor) {
      throw new Error("Instructor profile not found");
    }

    // Calcular saldo disponível (pagamentos completos)
    const completedPayments = await ctx.prisma.payment.findMany({
      where: {
        lesson: {
          instructorId: user.instructor.id,
        },
        status: "COMPLETED",
      },
    });

    const totalEarnings = completedPayments.reduce((sum, payment) => {
      return sum + Number(payment.amount || 0);
    }, 0);

    // Calcular saques realizados
    const withdrawals = await ctx.prisma.payment.findMany({
      where: {
        lesson: {
          instructorId: user.instructor.id,
        },
        method: "WITHDRAWAL",
        status: "COMPLETED",
      },
    });

    const totalWithdrawals = withdrawals.reduce((sum, payment) => {
      return sum + Number(payment.amount || 0);
    }, 0);

    const available = totalEarnings - totalWithdrawals;

    return {
      available: Math.max(0, available),
      pending: 0, // Pagamentos pendentes
      total: totalEarnings,
    };
  }),

  // Transações do instrutor
  transactions: instructorProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email! },
      include: { instructor: true },
    });

    if (!user?.instructor) {
      throw new Error("Instructor profile not found");
    }

    // Buscar pagamentos e saques
    const payments = await ctx.prisma.payment.findMany({
      where: {
        lesson: {
          instructorId: user.instructor.id,
        },
      },
      include: {
        lesson: {
          include: {
            student: {
              include: {
                user: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return payments.map((payment) => ({
      id: payment.id,
      type: payment.method === "WITHDRAWAL" ? "DEBIT" : "CREDIT",
      amount: payment.amount,
      description:
        payment.method === "WITHDRAWAL"
          ? "Saque Pix"
          : `Aula com ${payment.lesson.student.user.name}`,
      status: payment.status,
      createdAt: payment.createdAt,
    }));
  }),

  // Solicitar saque Pix
  withdraw: instructorProcedure
    .input(
      z.object({
        amount: z.number().positive(),
        pixKey: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email! },
        include: { instructor: true },
      });

      if (!user?.instructor) {
        throw new Error("Instructor profile not found");
      }

      // Verificar saldo disponível
      const balance = await ctx.prisma.payment.findMany({
        where: {
          lesson: {
            instructorId: user.instructor.id,
          },
          status: "COMPLETED",
        },
      });

      const totalEarnings = balance.reduce((sum, payment) => {
        return sum + Number(payment.amount || 0);
      }, 0);

      if (input.amount > totalEarnings) {
        throw new Error("Saldo insuficiente");
      }

      // Criar registro de saque
      // TODO: Integrar com gateway de pagamento para processar saque
      const withdrawal = await ctx.prisma.payment.create({
        data: {
          lessonId: "", // Não está associado a uma aula
          amount: input.amount,
          method: "WITHDRAWAL",
          status: "PENDING",
        },
      });

      return withdrawal;
    }),
});

