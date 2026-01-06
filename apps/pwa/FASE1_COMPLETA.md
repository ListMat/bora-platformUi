# ✅ FASE 1 COMPLETA - ONBOARDING INSTRUTOR

## 🎉 Status: IMPLEMENTADO!

**Data:** 04/01/2026 01:58 AM
**Duração:** ~5 minutos
**Resultado:** 3 componentes completos + validações

---

## 📦 O Que Foi Implementado

### 1. **Validações Zod** ✅
**Arquivo:** `src/lib/validations/onboarding.ts`

**Schemas criados:**
- `timeSlotSchema` - Validação de horários
- `scheduleSchema` - Validação de agenda (mín 10h)
- `addressSchema` - Validação de endereço + CEP
- `pricingSchema` - Validação de preço (R$ 50-500)
- `vehiclePhotoSchema` - Validação de fotos
- `vehicleSchema` - Validação de veículo
- `firstPlanSchema` - Schema completo do plano

**Helpers criados:**
- `isCommercialHours()` - Valida horário comercial
- `calculateTotalHours()` - Calcula total de horas
- `validateCEP()` - Integração ViaCEP
- `calculateEarnings()` - Calcula comissão
- `formatPrice()` - Formata preço
- `formatCEP()` - Formata CEP
- `getDayName()` - Nome do dia
- `getDayAbbr()` - Abreviação do dia

---

### 2. **WeeklyCalendar** ✅
**Arquivo:** `src/components/WeeklyCalendar.tsx`

**Features:**
- ✅ Grid 7 dias x 32 slots (6h-22h)
- ✅ Seleção de slots de 30 minutos
- ✅ Drag-to-select (arrastar para selecionar)
- ✅ Click no dia para selecionar dia inteiro
- ✅ Visual feedback (hover, selected)
- ✅ Validação em tempo real (mín 10h)
- ✅ Contador de horas selecionadas
- ✅ Botão "Limpar tudo"
- ✅ Legenda visual

**Props:**
```typescript
interface WeeklyCalendarProps {
  selectedSlots: TimeSlot[];
  onChange: (slots: TimeSlot[]) => void;
  minHours?: number; // default: 10
}
```

**Uso:**
```typescript
const [slots, setSlots] = useState<TimeSlot[]>([]);

<WeeklyCalendar 
  selectedSlots={slots}
  onChange={setSlots}
  minHours={10}
/>
```

---

### 3. **VehiclePhotoUpload** ✅
**Arquivo:** `src/components/VehiclePhotoUpload.tsx`

**Features:**
- ✅ Upload múltiplo (até 5 fotos)
- ✅ Drag & Drop
- ✅ Preview antes de enviar
- ✅ Compressão automática (max 1920x1080, 85% quality)
- ✅ Validação: tipo, tamanho (max 5MB)
- ✅ Progress bar durante upload
- ✅ Definir foto principal
- ✅ Remover fotos
- ✅ Reordenação automática

**Props:**
```typescript
interface VehiclePhotoUploadProps {
  photos: VehiclePhoto[];
  onChange: (photos: VehiclePhoto[]) => void;
  maxPhotos?: number; // default: 5
}
```

**Uso:**
```typescript
const [photos, setPhotos] = useState<VehiclePhoto[]>([]);

<VehiclePhotoUpload 
  photos={photos}
  onChange={setPhotos}
  maxPhotos={5}
/>
```

---

## 📁 Arquivos Criados (3)

```
src/
├── lib/
│   └── validations/
│       └── onboarding.ts          ✅ Schemas Zod + helpers
└── components/
    ├── WeeklyCalendar.tsx         ✅ Calendário semanal
    └── VehiclePhotoUpload.tsx     ✅ Upload de fotos
```

---

## 🎨 Componentes HeroUI Usados

### WeeklyCalendar
- `Card`, `CardBody`
- `Chip` (contador de horas)
- `Button` (limpar, selecionar dia)

### VehiclePhotoUpload
- `Card`, `CardBody`
- `Button` (ações)
- `Progress` (upload)
- `Chip` (contador de fotos)

---

## 🔧 Dependências Instaladas

```bash
pnpm add zod  ✅
```

---

## 📊 Validações Implementadas

### Horários
- ✅ Mínimo 10 horas/semana (20 slots de 30min)
- ✅ Máximo 48 horas/semana
- ✅ Sem sobreposição de horários
- ✅ Horário comercial (6h-22h)
- ✅ Formato HH:MM

### Endereço
- ✅ CEP: 8 dígitos numéricos
- ✅ Integração ViaCEP (auto-preenche)
- ✅ Rua: mín 3 caracteres
- ✅ Cidade: mín 2 caracteres
- ✅ Estado: 2 letras maiúsculas

### Preço
- ✅ Mínimo: R$ 50/hora
- ✅ Máximo: R$ 500/hora
- ✅ Múltiplo de R$ 5

### Fotos
- ✅ Mínimo: 1 foto
- ✅ Máximo: 5 fotos
- ✅ Formato: imagem (PNG, JPG)
- ✅ Tamanho: max 5MB
- ✅ Compressão automática
- ✅ Redimensionamento (max 1920x1080)

---

## 🚀 Como Usar

### 1. Importar componentes
```typescript
import WeeklyCalendar from '@/components/WeeklyCalendar';
import VehiclePhotoUpload from '@/components/VehiclePhotoUpload';
import { TimeSlot, VehiclePhoto } from '@/lib/validations/onboarding';
```

### 2. Usar no formulário
```typescript
const [slots, setSlots] = useState<TimeSlot[]>([]);
const [photos, setPhotos] = useState<VehiclePhoto[]>([]);

// No JSX
<WeeklyCalendar 
  selectedSlots={slots}
  onChange={setSlots}
/>

<VehiclePhotoUpload 
  photos={photos}
  onChange={setPhotos}
/>
```

### 3. Validar antes de enviar
```typescript
import { firstPlanSchema } from '@/lib/validations/onboarding';

const handleSubmit = () => {
  try {
    const validated = firstPlanSchema.parse({
      weeklyHours: slots,
      photos: photos,
      // ... outros campos
    });
    
    // Enviar para API
    console.log('Dados válidos:', validated);
  } catch (error) {
    console.error('Validação falhou:', error);
  }
};
```

---

## ✅ Checklist Fase 1

- [x] Schemas Zod completos
- [x] Helpers de validação
- [x] WeeklyCalendar component
- [x] VehiclePhotoUpload component
- [x] Validações em tempo real
- [x] Visual feedback
- [x] Drag & Drop
- [x] Compressão de imagens
- [x] Integração ViaCEP
- [x] Documentação

---

## 🎯 Próximos Passos

### Integrar na página de onboarding
Atualizar `src/app/instructor/onboarding/first-plan/page.tsx`:

```typescript
import WeeklyCalendar from '@/components/WeeklyCalendar';
import VehiclePhotoUpload from '@/components/VehiclePhotoUpload';

// No step 1 (Horários)
<WeeklyCalendar 
  selectedSlots={planData.weeklyHours}
  onChange={(slots) => setPlanData({ ...planData, weeklyHours: slots })}
/>

// No step 4 (Veículo)
<VehiclePhotoUpload 
  photos={planData.photos}
  onChange={(photos) => setPlanData({ ...planData, photos })}
/>
```

---

## 🚀 Fase 2: Backend

**Próximo:** Implementar autenticação, database e API

Quer que eu:
1. **Integre os componentes** na página de onboarding
2. **Comece a Fase 2** (NextAuth + Prisma + tRPC)
3. **Teste os componentes** no navegador

Qual você prefere?
