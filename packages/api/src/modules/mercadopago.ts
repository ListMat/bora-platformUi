import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
    options: {
        timeout: 5000,
    },
});

const payment = new Payment(client);
const preference = new Preference(client);

export interface CreatePaymentParams {
    lessonId: string;
    studentEmail: string;
    studentName: string;
    instructorName: string;
    amount: number;
    description: string;
}

export interface PaymentResponse {
    id: string;
    status: string;
    qrCode?: string;
    qrCodeBase64?: string;
    ticketUrl?: string;
    externalResourceUrl?: string;
}

/**
 * Cria um pagamento Pix via Mercado Pago
 */
export async function createPixPayment(params: CreatePaymentParams): Promise<PaymentResponse> {
    try {
        const paymentData = {
            transaction_amount: params.amount,
            description: params.description,
            payment_method_id: 'pix',
            payer: {
                email: params.studentEmail,
                first_name: params.studentName,
            },
            metadata: {
                lesson_id: params.lessonId,
                instructor_name: params.instructorName,
            },
            notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
        };

        const response = await payment.create({ body: paymentData });

        return {
            id: response.id?.toString() || '',
            status: response.status || 'pending',
            qrCode: response.point_of_interaction?.transaction_data?.qr_code,
            qrCodeBase64: response.point_of_interaction?.transaction_data?.qr_code_base64,
            ticketUrl: response.point_of_interaction?.transaction_data?.ticket_url,
            externalResourceUrl: response.external_resource_url,
        };
    } catch (error) {
        console.error('Erro ao criar pagamento Pix:', error);
        throw new Error('Falha ao gerar pagamento Pix');
    }
}

/**
 * Cria uma preferência de pagamento (checkout)
 * Útil para pagamentos com cartão
 */
export async function createPaymentPreference(params: CreatePaymentParams) {
    try {
        const preferenceData = {
            items: [
                {
                    id: params.lessonId,
                    title: params.description,
                    quantity: 1,
                    unit_price: params.amount,
                },
            ],
            payer: {
                email: params.studentEmail,
                name: params.studentName,
            },
            back_urls: {
                success: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
                failure: `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`,
                pending: `${process.env.NEXT_PUBLIC_APP_URL}/payment/pending`,
            },
            auto_return: 'approved' as const,
            notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
            metadata: {
                lesson_id: params.lessonId,
                instructor_name: params.instructorName,
            },
        };

        const response = await preference.create({ body: preferenceData });

        return {
            id: response.id,
            initPoint: response.init_point,
            sandboxInitPoint: response.sandbox_init_point,
        };
    } catch (error) {
        console.error('Erro ao criar preferência de pagamento:', error);
        throw new Error('Falha ao criar preferência de pagamento');
    }
}

/**
 * Consulta status de um pagamento
 */
export async function getPaymentStatus(paymentId: string) {
    try {
        const response = await payment.get({ id: paymentId });

        return {
            id: response.id?.toString() || '',
            status: response.status,
            statusDetail: response.status_detail,
            amount: response.transaction_amount,
            dateApproved: response.date_approved,
            dateCreated: response.date_created,
        };
    } catch (error) {
        console.error('Erro ao consultar pagamento:', error);
        throw new Error('Falha ao consultar pagamento');
    }
}

/**
 * Processa webhook do Mercado Pago
 */
export async function processWebhook(data: any) {
    const { type, action, data: webhookData } = data;

    // Pagamento aprovado
    if (type === 'payment' && action === 'payment.created') {
        const paymentId = webhookData.id;
        const paymentInfo = await getPaymentStatus(paymentId);

        return {
            type: 'payment',
            paymentId,
            status: paymentInfo.status,
            lessonId: webhookData.metadata?.lesson_id,
        };
    }

    return null;
}

/**
 * Calcula split de pagamento
 * Plataforma fica com 10%, instrutor com 90%
 */
export function calculateSplit(amount: number, platformFee: number = 0.10) {
    const platformAmount = amount * platformFee;
    const instructorAmount = amount - platformAmount;

    return {
        total: amount,
        platformAmount: Math.round(platformAmount * 100) / 100,
        instructorAmount: Math.round(instructorAmount * 100) / 100,
        platformFee,
    };
}

/**
 * Formata valor para exibição
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

export { client, payment, preference };
