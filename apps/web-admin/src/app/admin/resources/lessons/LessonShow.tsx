import { Show } from "@/components/show";
import { SimpleShowLayout } from "@/components/simple-show-layout";
import { TextField } from "@/components/text-field";
import { DateField } from "@/components/date-field";
import { ReferenceField } from "@/components/reference-field";
import { BadgeField } from "@/components/badge-field";
import { NumberField } from "@/components/number-field";
import { BooleanField } from "@/components/boolean-field";

export const LessonShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" label="ID" />

        <ReferenceField source="studentId" reference="students" label="Aluno">
          <TextField source="name" />
        </ReferenceField>

        <ReferenceField source="instructorId" reference="instructors" label="Instrutor">
          <TextField source="name" />
        </ReferenceField>

        <DateField source="scheduledAt" label="Data e Hora Agendada" showTime />
        <DateField source="startedAt" label="Início" showTime />
        <DateField source="endedAt" label="Fim" showTime />

        <BadgeField
          source="status"
          label="Status"
          colors={{
            PENDING: "yellow",
            SCHEDULED: "blue",
            ACTIVE: "green",
            FINISHED: "gray",
            CANCELLED: "red",
            EXPIRED: "orange",
          }}
        />

        {/* Novos campos do fluxo de solicitação */}
        <TextField source="lessonType" label="Tipo de Aula" />

        <ReferenceField source="vehicleId" reference="vehicles" label="Veículo">
          <TextField source="model" />
        </ReferenceField>

        <BooleanField source="useOwnVehicle" label="Usa Carro Próprio" />

        <ReferenceField source="planId" reference="plans" label="Plano">
          <TextField source="name" />
        </ReferenceField>

        <BadgeField
          source="paymentMethod"
          label="Forma de Pagamento"
          colors={{
            PIX: "green",
            DINHEIRO: "gray",
            DEBITO: "blue",
            CREDITO: "purple",
          }}
        />

        <NumberField
          source="price"
          label="Valor"
          options={{
            style: "currency",
            currency: "BRL",
          }}
        />

        <TextField source="installments" label="Número de Parcelas" />

        {/* Campos de localização */}
        <TextField source="pickupAddress" label="Endereço de Coleta" />
        <NumberField source="pickupLatitude" label="Latitude" />
        <NumberField source="pickupLongitude" label="Longitude" />

        {/* Campos de gravação e recibo */}
        <BooleanField source="recordingConsent" label="Consentimento de Gravação" />
        <TextField source="recordingUrl" label="URL da Gravação" />
        <TextField source="receiptUrl" label="URL do Recibo" />

        {/* Notas */}
        <TextField source="instructorNotes" label="Notas do Instrutor" />
        <TextField source="studentNotes" label="Notas do Aluno" />

        {/* Timestamps */}
        <DateField source="createdAt" label="Criado em" showTime />
        <DateField source="updatedAt" label="Atualizado em" showTime />
      </SimpleShowLayout>
    </Show>
  );
};

