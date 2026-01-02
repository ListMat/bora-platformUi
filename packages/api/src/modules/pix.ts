/**
 * Módulo de Geração de Pix
 * 
 * Gera QR Code e código Pix para pagamento de aulas
 * Integração com Mercado Pago ou Stripe (simulado para MVP)
 */

import { PrismaClient } from "@bora/db";
import QRCode from "qrcode";

const prisma = new PrismaClient();

interface PixPayload {
    lessonId: string;
    amount: number;
    instructorId: string;
    description: string;
}

interface PixResponse {
    qrCode: string; // Base64 da imagem do QR Code
    pixCode: string; // Código Pix copia e cola
    expiresAt: Date;
}

/**
 * Gera Pix para pagamento de aula
 */
export async function generatePixForLesson({
    lessonId,
    amount,
    instructorId,
    description,
}: PixPayload): Promise<PixResponse> {
    try {
        // Buscar dados do instrutor
        const instructor = await prisma.instructor.findUnique({
            where: { id: instructorId },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!instructor) {
            throw new Error("Instructor not found");
        }

        // Gerar código Pix (formato EMV)
        // Em produção, usar API do Mercado Pago ou Stripe
        const pixCode = generatePixEMVCode({
            recipientName: instructor.user.name || "Instrutor",
            recipientKey: instructor.user.email || "", // Usar chave Pix real
            amount,
            description,
            transactionId: lessonId,
        });

        // Gerar QR Code
        const qrCodeBase64 = await QRCode.toDataURL(pixCode, {
            errorCorrectionLevel: "M",
            type: "image/png",
            width: 300,
            margin: 1,
        });

        // Salvar no banco (opcional)
        await prisma.lesson.update({
            where: { id: lessonId },
            data: {
                pixCode,
                pixQrCode: qrCodeBase64,
                pixGeneratedAt: new Date(),
                pixExpiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
            },
        });

        console.log(`[Pix] Generated for lesson ${lessonId}: R$ ${amount}`);

        return {
            qrCode: qrCodeBase64,
            pixCode,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        };
    } catch (error) {
        console.error("[Pix] Error generating Pix:", error);
        throw error;
    }
}

/**
 * Gera código Pix no formato EMV (BR Code)
 * 
 * Formato simplificado para MVP
 * Em produção, usar biblioteca oficial ou API do banco
 */
function generatePixEMVCode({
    recipientName,
    recipientKey,
    amount,
    description,
    transactionId,
}: {
    recipientName: string;
    recipientKey: string;
    amount: number;
    description: string;
    transactionId: string;
}): string {
    // Formato EMV simplificado
    // Em produção, usar biblioteca como 'pix-utils' ou API do banco

    const payload = {
        version: "01",
        merchantAccountInfo: recipientKey,
        merchantCategoryCode: "0000",
        transactionCurrency: "986", // BRL
        transactionAmount: amount.toFixed(2),
        countryCode: "BR",
        merchantName: recipientName.substring(0, 25),
        merchantCity: "BRASILIA",
        additionalData: {
            txid: transactionId,
        },
    };

    // Gerar string EMV (simplificado)
    const emvString = `00020126${recipientKey.length.toString().padStart(2, "0")}${recipientKey}52040000530398654${payload.transactionAmount.length.toString().padStart(2, "0")}${payload.transactionAmount}5802BR59${payload.merchantName.length.toString().padStart(2, "0")}${payload.merchantName}6008BRASILIA62${transactionId.length.toString().padStart(2, "0")}${transactionId}6304`;

    // Calcular CRC16 (simplificado - em produção usar biblioteca)
    const crc = calculateCRC16(emvString);

    return `${emvString}${crc}`;
}

/**
 * Calcula CRC16 para código Pix
 * Implementação simplificada
 */
function calculateCRC16(str: string): string {
    // Implementação simplificada
    // Em produção, usar biblioteca de CRC16 CCITT
    let crc = 0xFFFF;

    for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc = crc << 1;
            }
        }
    }

    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Verifica status do pagamento Pix
 * Em produção, usar webhook do banco/gateway
 */
export async function checkPixPaymentStatus(lessonId: string): Promise<{
    paid: boolean;
    paidAt?: Date;
}> {
    const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        select: {
            pixPaidAt: true,
        },
    });

    return {
        paid: !!lesson?.pixPaidAt,
        paidAt: lesson?.pixPaidAt || undefined,
    };
}

/**
 * Confirma pagamento Pix (manual ou via webhook)
 */
export async function confirmPixPayment(lessonId: string): Promise<void> {
    await prisma.lesson.update({
        where: { id: lessonId },
        data: {
            pixPaidAt: new Date(),
            paymentStatus: "PAID",
        },
    });

    console.log(`[Pix] Payment confirmed for lesson ${lessonId}`);
}
