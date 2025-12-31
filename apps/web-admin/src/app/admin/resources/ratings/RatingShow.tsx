import { Show } from "@/components/show";
import { SimpleShowLayout } from "@/components/simple-show-layout";
import { TextField } from "@/components/text-field";
import { DateField } from "@/components/date-field";
import { NumberField } from "@/components/number-field";

export const RatingShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <div className="grid grid-cols-2 gap-4">
          <NumberField source="rating" label="Nota (1-5)" />
          <DateField source="createdAt" label="Data da Avaliação" />
        </div>

        <TextField source="comment" label="Comentário" />

        <div className="grid grid-cols-2 gap-4">
          <TextField source="student.name" label="Aluno" />
          <TextField source="instructor.name" label="Instrutor" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField source="lesson.id" label="ID da Aula" />
          <DateField source="lesson.scheduledAt" label="Data da Aula" showTime />
        </div>
      </SimpleShowLayout>
    </Show>
  );
};

