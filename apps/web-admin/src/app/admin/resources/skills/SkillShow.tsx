import { Show } from "@/components/show";
import { SimpleShowLayout } from "@/components/simple-show-layout";
import { TextField } from "@/components/text-field";
import { NumberField } from "@/components/number-field";
import { DateField } from "@/components/date-field";
import { BooleanField } from "@/components/boolean-field";
import { BadgeField } from "@/components/badge-field";
import { ReferenceManyField } from "@/components/reference-many-field";
import { DataTable } from "@/components/data-table";

export const SkillShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="name" label="Nome" />
        <TextField source="description" label="Descrição" />

        <div className="grid grid-cols-2 gap-4">
          <BadgeField source="category" label="Categoria" />
          <NumberField source="weight" label="Peso" />
          <NumberField source="order" label="Ordem" />
          <BooleanField source="isActive" label="Ativo" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DateField source="createdAt" label="Criado em" />
          <DateField source="updatedAt" label="Atualizado em" />
        </div>

        <ReferenceManyField
          reference="skillEvaluations"
          target="skillId"
          label="Avaliações"
        >
          <DataTable>
            <DataTable.Column source="rating" label="Nota">
              <NumberField source="rating" />
            </DataTable.Column>
            <DataTable.Column source="comment" label="Comentário">
              <TextField source="comment" />
            </DataTable.Column>
            <DataTable.Column source="student.name" label="Aluno">
              <TextField source="student.name" />
            </DataTable.Column>
            <DataTable.Column source="instructor.name" label="Instrutor">
              <TextField source="instructor.name" />
            </DataTable.Column>
            <DataTable.Column source="createdAt" label="Data">
              <DateField source="createdAt" />
            </DataTable.Column>
          </DataTable>
        </ReferenceManyField>
      </SimpleShowLayout>
    </Show>
  );
};

