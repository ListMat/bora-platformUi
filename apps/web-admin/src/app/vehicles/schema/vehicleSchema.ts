import { z } from "zod";

const PLATE_REGEX = /^[A-Z0-9]{4}$/; // 4 últimos caracteres

export const vehicleSchema = z.object({
  // Step 1 - Dados básicos
  brand: z.string().min(1, "Marca obrigatória"),
  model: z.string().min(1, "Modelo obrigatório"),
  year: z.number().int().min(1980, "Ano mínimo é 1980").max(2026, "Ano máximo é 2026"),
  color: z.string().min(1, "Cor obrigatória"),
  plateLastFour: z.string().regex(PLATE_REGEX, "Formato inválido (ex: 1D23)"),
  photoBase64: z.string().min(1, "Foto obrigatória"),
  
  // Step 2 - Especificações
  category: z.enum(["HATCH", "SEDAN", "SUV", "PICKUP", "SPORTIVO", "COMPACTO", "ELETRICO"], {
    required_error: "Categoria obrigatória",
  }),
  transmission: z.enum(["MANUAL", "AUTOMATICO", "CVT", "SEMI_AUTOMATICO"], {
    required_error: "Câmbio obrigatório",
  }),
  fuel: z.enum(["GASOLINA", "ETANOL", "FLEX", "DIESEL", "ELETRICO", "HIBRIDO"], {
    required_error: "Combustível obrigatório",
  }),
  engine: z.string().min(1, "Motor obrigatório"),
  horsePower: z.number().int().positive("Potência deve ser positiva").optional(),
  
  // Step 3 - Segurança & Acessórios
  hasDualPedal: z.boolean(),
  pedalPhotoBase64: z.string().optional(),
  acceptStudentCar: z.boolean().default(false),
  safetyFeatures: z.array(z.string()).default([]),
  comfortFeatures: z.array(z.string()).default([]),
}).refine(
  (data) => !data.hasDualPedal || data.pedalPhotoBase64,
  { 
    message: "Foto do pedal obrigatória quando duplo-pedal está marcado", 
    path: ["pedalPhotoBase64"] 
  }
);

export type VehicleFormData = z.infer<typeof vehicleSchema>;

