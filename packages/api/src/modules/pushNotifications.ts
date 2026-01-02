import { Prisma } from "@bora/db";

/**
 * Módulo de Notificações Push usando Expo Push Notifications
 * 
 * Este módulo gerencia o envio de notificações push para usuários
 * usando o serviço Expo Push Notifications.
 */

export interface PushNotificationPayload {
    userId: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    sound?: 'default' | null;
    badge?: number;
    priority?: 'default' | 'normal' | 'high';
}

/**
 * Envia uma notificação push para um usuário específico
 */
export async function sendPushNotification({
    userId,
    title,
    body,
    data = {},
    sound = 'default',
    badge,
    priority = 'high',
}: PushNotificationPayload): Promise<void> {
    try {
        // Buscar push token do usuário
        const { PrismaClient } = await import("@bora/db");
        const prisma = new PrismaClient();

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                pushToken: true,
            },
        });

        await prisma.$disconnect();

        if (!user) {
            console.warn(`[Push] User not found: ${userId}`);
            return;
        }

        if (!user.pushToken) {
            console.log(`[Push] No push token for user ${userId} (${user.name})`);
            return;
        }

        // Enviar notificação via Expo Push Notifications
        const message = {
            to: user.pushToken,
            sound,
            title,
            body,
            data,
            priority,
            ...(badge !== undefined && { badge }),
        };

        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const result = await response.json();

        if (result.data?.status === 'error') {
            console.error(`[Push] Error sending notification to ${userId}:`, result.data);
            throw new Error(result.data.message);
        }

        console.log(`[Push] Notification sent successfully to ${user.name}`);
    } catch (error) {
        console.error('[Push] Error sending push notification:', error);
        // Não lançar erro para não quebrar o fluxo principal
    }
}

/**
 * Envia notificação de nova solicitação de aula para o instrutor
 */
export async function notifyInstructorNewRequest({
    instructorUserId,
    studentName,
    lessonId,
    scheduledAt,
}: {
    instructorUserId: string;
    studentName: string;
    lessonId: string;
    scheduledAt: Date;
}): Promise<void> {
    const dateStr = new Date(scheduledAt).toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });

    const timeStr = new Date(scheduledAt).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    await sendPushNotification({
        userId: instructorUserId,
        title: "Nova solicitação de aula! 🚗",
        body: `${studentName} quer agendar uma aula para ${dateStr} às ${timeStr}`,
        data: {
            type: 'lesson_request',
            lessonId,
            screen: 'lessonChat',
            params: { lessonId },
        },
        priority: 'high',
        sound: 'default',
    });
}

/**
 * Envia notificação de aula aceita para o aluno
 */
export async function notifyStudentLessonAccepted({
    studentUserId,
    instructorName,
    lessonId,
    scheduledAt,
}: {
    studentUserId: string;
    instructorName: string;
    lessonId: string;
    scheduledAt: Date;
}): Promise<void> {
    const dateStr = new Date(scheduledAt).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    const timeStr = new Date(scheduledAt).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    await sendPushNotification({
        userId: studentUserId,
        title: "Aula confirmada! ✅",
        body: `${instructorName} aceitou sua solicitação. ${dateStr} às ${timeStr}. Te espero lá!`,
        data: {
            type: 'lesson_accepted',
            lessonId,
            screen: 'lessonChat',
            params: { lessonId },
        },
        priority: 'high',
        sound: 'default',
    });
}

/**
 * Envia notificação de aula recusada para o aluno
 */
export async function notifyStudentLessonRejected({
    studentUserId,
    instructorName,
    lessonId,
    reason,
}: {
    studentUserId: string;
    instructorName: string;
    lessonId: string;
    reason?: string;
}): Promise<void> {
    const body = reason
        ? `${instructorName} não pode no momento. Motivo: ${reason}`
        : `${instructorName} não pode no momento. Que tal tentar outro horário?`;

    await sendPushNotification({
        userId: studentUserId,
        title: "Solicitação recusada",
        body,
        data: {
            type: 'lesson_rejected',
            lessonId,
            screen: 'home',
        },
        priority: 'high',
        sound: 'default',
    });
}

/**
 * Envia notificação de solicitação expirada para o aluno
 */
export async function notifyStudentLessonExpired({
    studentUserId,
    lessonId,
}: {
    studentUserId: string;
    lessonId: string;
}): Promise<void> {
    await sendPushNotification({
        userId: studentUserId,
        title: "Solicitação expirada ⏰",
        body: "O instrutor não respondeu a tempo. Tente outro instrutor perto de você.",
        data: {
            type: 'lesson_expired',
            lessonId,
            screen: 'home',
        },
        priority: 'normal',
        sound: 'default',
    });
}

/**
 * Envia notificação de aula reagendada
 */
export async function notifyLessonRescheduled({
    userId,
    userName,
    lessonId,
    newScheduledAt,
}: {
    userId: string;
    userName: string;
    lessonId: string;
    newScheduledAt: Date;
}): Promise<void> {
    const dateStr = new Date(newScheduledAt).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
    });

    const timeStr = new Date(newScheduledAt).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    await sendPushNotification({
        userId,
        title: "Aula reagendada 📅",
        body: `${userName} reagendou a aula para ${dateStr} às ${timeStr}`,
        data: {
            type: 'lesson_rescheduled',
            lessonId,
            screen: 'lessonChat',
            params: { lessonId },
        },
        priority: 'high',
        sound: 'default',
    });
}

/**
 * Envia notificação de lembrete de aula (1 hora antes)
 */
export async function notifyLessonReminder({
    userId,
    lessonId,
    scheduledAt,
    otherPersonName,
}: {
    userId: string;
    lessonId: string;
    scheduledAt: Date;
    otherPersonName: string;
}): Promise<void> {
    const timeStr = new Date(scheduledAt).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    await sendPushNotification({
        userId,
        title: "Lembrete de aula 🔔",
        body: `Sua aula com ${otherPersonName} é às ${timeStr}. Não se atrase!`,
        data: {
            type: 'lesson_reminder',
            lessonId,
            screen: 'lessonChat',
            params: { lessonId },
        },
        priority: 'high',
        sound: 'default',
    });
}
