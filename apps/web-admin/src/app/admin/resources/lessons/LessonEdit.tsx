import { Edit } from "@/components/edit";
import { SimpleForm } from "@/components/simple-form";
import { TextInput } from "@/components/text-input";
import { DateTimeInput } from "@/components/date-time-input";
import { ReferenceInput } from "@/components/reference-input";
import { SelectInput } from "@/components/select-input";
import { required } from "../../validators";

export const LessonEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <ReferenceInput source="studentId" reference="students">
          <SelectInput
            optionText="name"
            label="Aluno"
            validate={[required()]}
          />
        </ReferenceInput>

        <ReferenceInput source="instructorId" reference="instructors">
          <SelectInput
            optionText="name"
            label="Instrutor"
            validate={[required()]}
          />
        </ReferenceInput>

        <DateTimeInput
          source="scheduledAt"
          label="Data e Hora"
          validate={[required()]}
        />

        <SelectInput
          source="status"
          label="Status"
          choices={[
            { id: "SCHEDULED", name: "Agendada" },
            { id: "COMPLETED", name: "Concluída" },
            { id: "CANCELLED", name: "Cancelada" },
          ]}
          validate={[required()]}
        />

        <TextInput source="address" label="Endereço" validate={[required()]} />
      </SimpleForm>
    </Edit>
  );
};

