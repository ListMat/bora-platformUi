/**
 * Módulo de Mensagens Automáticas do Sistema
 * 
 * Envia mensagens automáticas durante o ciclo de vida da aula:
 * - Aula iniciada
 * - Faltam 5 minutos
 * - Aula finalizada
 * - Aluno está próximo (tracking)
 */

import { PrismaClient } from "@bora/db";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const prisma = new PrismaClient();

interface SystemMessagePayload {
    lessonId: string;
    content: string;
    type: "LESSON_STARTED" | "LESSON_ENDING" | "LESSON_FINISHED" | "STUDENT_NEARBY" | "INSTRUCTOR_NEARBY";
}

/**
 * Envia uma mensagem automática do sistema no chat da aula
 */
export async function sendSystemMessage({
    lessonId,
    content,
    type,
}: SystemMessagePayload): Promise<void> {
    try {
        // Criar mensagem do sistema
        await prisma.chatMessage.create({
            data: {
                lessonId,
                content,
                isSystemMessage: true,
                metadata: { type },
            },
        });

        console.log(`[System Message] Sent to lesson ${lessonId}: ${type}`);
    } catch (error) {
        console.error("[System Message] Error sending message:", error);
    }
}

/**
 * Envia mensagem quando a aula é iniciada
 */
export async function notifyLessonStarted(lessonId: string): Promise<void> {
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { scheduledAt: true },
    });

    if (!lesson) return;

    const duration = 60; // Duração padrão: 60 minutos

    await sendSystemMessage({
        lessonId,
        content: `🚗 Aula iniciada – ${duration} min restantes`,
        type: "LESSON_STARTED",
    });

    // Agendar mensagem de "faltam 5 min"
    const fiveMinutesBeforeEnd = (duration - 5) * 60 * 1000; // ms

    setTimeout(async () => {
        await notifyLessonEnding(lessonId);
    }, fiveMinutesBeforeEnd);
}

/**
 * Envia mensagem quando faltam 5 minutos para o fim
 */
export async function notifyLessonEnding(lessonId: string): Promise<void> {
    // Verificar se a aula ainda está ativa
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: { status: true },
    });

    if (lesson?.status !== "ACTIVE") return;

    await sendSystemMessage({
        lessonId,
        content: "⏰ Faltam 5 min – preparando recibo",
        type: "LESSON_ENDING",
    });
}

/**
 * Envia mensagem quando a aula é finalizada
 */
export async function notifyLessonFinished(lessonId: string): Promise<void> {
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
            instructor: {
                select: {
                    user: { select: { name: true } },
                },
            },
        },
    });

    if (!lesson) return;

    const instructorName = lesson.instructor.user.name || "Instrutor";

    await sendSystemMessage({
        lessonId,
        content: `✅ Aula finalizada. ${instructorName} irá gerar o Pix para receber o pagamento.`,
        type: "LESSON_FINISHED",
    });
}

/**
 * Envia mensagem quando o aluno está próximo (< 500m)
 */
export async function notifyStudentNearby(
    lessonId: string,
    distanceInMeters: number
): Promise<void> {
    const minutes = Math.ceil(distanceInMeters / 80); // Assumindo 80m/min caminhando

    await sendSystemMessage({
        lessonId,
        content: `📍 Aluno está a ${minutes} min de distância`,
        type: "STUDENT_NEARBY",
    });
}

/**
 * Envia mensagem quando o instrutor está próximo (< 500m)
 */
export async function notifyInstructorNearby(
    lessonId: string,
    distanceInMeters: number
): Promise<void> {
    const minutes = Math.ceil(distanceInMeters / 80); // Assumindo 80m/min caminhando

    await sendSystemMessage({
        lessonId,
        content: `📍 Instrutor está a ${minutes} min de distância`,
        type: "INSTRUCTOR_NEARBY",
    });
}

/**
 * Formata data/hora para exibição
 */
function formatDateTime(date: Date): string {
    return format(date, "EEEE, d 'de' MMMM 'às' HH:mm", { locale: ptBR });
}
