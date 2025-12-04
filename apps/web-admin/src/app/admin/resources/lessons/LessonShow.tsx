import { Show } from "@/components/show";
import { SimpleShowLayout } from "@/components/simple-show-layout";
import { TextField } from "@/components/text-field";
import { DateField } from "@/components/date-field";
import { ReferenceField } from "@/components/reference-field";
import { BadgeField } from "@/components/badge-field";

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

        <DateField source="scheduledAt" label="Data e Hora" showTime />
        <BadgeField source="status" label="Status" />
        <TextField source="address" label="Endereço" />
      </SimpleShowLayout>
    </Show>
  );
};

