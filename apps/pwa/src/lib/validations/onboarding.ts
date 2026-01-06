import { z } from 'zod';

// ============================================
// SCHEMAS DE VALIDAÇÃO - ONBOARDING INSTRUTOR
// ============================================

// Step 1: Horários
export const timeSlotSchema = z.object({
    dayOfWeek: z.number().min(0).max(6), // 0 = Domingo, 6 = Sábado
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)'),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:MM)'),
});

export const scheduleSchema = z.object({
    weeklyHours: z.array(timeSlotSchema)
        .min(2, 'Selecione pelo menos 1 hora (2 slots de 30min)') // ALTERADO DE 20 PARA 2
        .max(96, 'Máximo de 48 horas por semana'),
}).refine(
    (data) => {
        // Validar que não há sobreposição de horários
        const slots = data.weeklyHours;
        for (let i = 0; i < slots.length; i++) {
            for (let j = i + 1; j < slots.length; j++) {
                if (slots[i].dayOfWeek === slots[j].dayOfWeek) {
                    const start1 = slots[i].startTime;
                    const end1 = slots[i].endTime;
                    const start2 = slots[j].startTime;
                    const end2 = slots[j].endTime;

                    if (start1 < end2 && start2 < end1) {
                        return false; // Sobreposição detectada
                    }
                }
            }
        }
        return true;
    },
    { message: 'Horários não podem se sobrepor' }
);

// Step 2: Localidade
export const addressSchema = z.object({
    cep: z.string()
        .length(8, 'CEP deve ter 8 dígitos')
        .regex(/^\d{8}$/, 'CEP deve conter apenas números'),
    street: z.string().min(3, 'Rua deve ter pelo menos 3 caracteres'),
    neighborhood: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres'),
    city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
    state: z.string()
        .length(2, 'Estado deve ter 2 caracteres')
        .regex(/^[A-Z]{2}$/, 'Estado deve ser em maiúsculas (ex: SP)'),
    number: z.string().optional(),
    complement: z.string().optional(),
});

// Step 3: Preço
export const pricingSchema = z.object({
    pricePerHour: z.number()
        .min(50, 'Preço mínimo: R$ 50/hora')
        .max(500, 'Preço máximo: R$ 500/hora'),
}).refine(
    (data) => {
        // Validar que o preço é múltiplo de 5
        return data.pricePerHour % 5 === 0;
    },
    { message: 'Preço deve ser múltiplo de R$ 5' }
);

// Step 4: Veículo (dados + fotos)
export const vehiclePhotoSchema = z.object({
    url: z.string().url('URL inválida'),
    type: z.enum(['main', 'interior', 'exterior', 'dual_pedal', 'other']),
    order: z.number().min(0).max(4),
});

export const vehicleDataSchema = z.object({
    model: z.string().min(2, "Modelo do carro é obrigatório"),
    year: z.coerce.number().min(2000).max(new Date().getFullYear() + 1),
    color: z.string().min(2, "Cor é obrigatória"),
    plate: z.string().min(7).max(8, "Placa inválida"),
    transmission: z.enum(['manual', 'automatic']),
    hasDualPedals: z.boolean().default(true),
});

// Step 5: Confirmação (Schema completo)
export const firstPlanSchema = z.object({
    // Horários
    weeklyHours: z.array(timeSlotSchema).min(20),

    // Localidade
    cep: z.string().length(8),
    street: z.string().min(3).optional(),
    neighborhood: z.string().min(2).optional(),
    city: z.string().min(2),
    state: z.string().length(2),

    // Preço
    pricePerHour: z.number().min(50).max(500),

    // Veículo (Criação)
    vehicle: vehicleDataSchema,
    photos: z.array(vehiclePhotoSchema).min(1).max(5),
});

// ============================================
// TYPES (inferidos dos schemas)
// ============================================

export type TimeSlot = z.infer<typeof timeSlotSchema>;
export type Schedule = z.infer<typeof scheduleSchema>;
export type Address = z.infer<typeof addressSchema>;
export type Pricing = z.infer<typeof pricingSchema>;
export type VehiclePhoto = z.infer<typeof vehiclePhotoSchema>;
export type Vehicle = z.infer<typeof vehicleDataSchema>;
export type FirstPlan = z.infer<typeof firstPlanSchema>;

// ============================================
// HELPERS DE VALIDAÇÃO
// ============================================

/**
 * Valida se um horário está dentro do horário comercial (6h-22h)
 */
export function isCommercialHours(time: string): boolean {
    const [hours] = time.split(':').map(Number);
    return hours >= 6 && hours < 22;
}

/**
 * Calcula total de horas selecionadas
 */
export function calculateTotalHours(slots: TimeSlot[]): number {
    return slots.length * 0.5; // Cada slot = 30min = 0.5h
}

/**
 * Valida CEP via ViaCEP
 */
export async function validateCEP(cep: string): Promise<{
    valid: boolean;
    data?: {
        street: string;
        neighborhood: string;
        city: string;
        state: string;
    };
    error?: string;
}> {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) {
            return { valid: false, error: 'CEP não encontrado' };
        }

        return {
            valid: true,
            data: {
                street: data.logradouro,
                neighborhood: data.bairro,
                city: data.localidade,
                state: data.uf,
            },
        };
    } catch (error) {
        return { valid: false, error: 'Erro ao validar CEP' };
    }
}

/**
 * Calcula comissão e valor líquido do instrutor
 */
export function calculateEarnings(pricePerHour: number): {
    commission: number;
    instructorPay: number;
    commissionRate: number;
} {
    const commissionRate = 0.15; // 15%
    const commission = pricePerHour * commissionRate;
    const instructorPay = pricePerHour - commission;

    return {
        commission,
        instructorPay,
        commissionRate,
    };
}

/**
 * Formata preço para exibição
 */
export function formatPrice(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}

/**
 * Formata CEP para exibição (00000-000)
 */
export function formatCEP(cep: string): string {
    return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

/**
 * Formata horário para exibição
 */
export function formatTime(time: string): string {
    return time;
}

/**
 * Converte dia da semana (número) para nome
 */
export function getDayName(dayOfWeek: number): string {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[dayOfWeek];
}

/**
 * Converte dia da semana (número) para abreviação
 */
export function getDayAbbr(dayOfWeek: number): string {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[dayOfWeek];
}
