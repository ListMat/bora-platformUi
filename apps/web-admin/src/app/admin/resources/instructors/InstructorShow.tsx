import { Show } from "@/components/show";
import { SimpleShowLayout } from "@/components/simple-show-layout";
import { TextField } from "@/components/text-field";
import { EmailField } from "@/components/email-field";
import { DateField } from "@/components/date-field";
import { NumberField } from "@/components/number-field";
import { BadgeField } from "@/components/badge-field";
import { ImageField } from "@/components/image-field";
import { ReferenceManyField } from "@/components/reference-many-field";
import { DataTable } from "@/components/data-table";

export const InstructorShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" label="ID" />
        <TextField source="name" label="Nome" />
        <EmailField source="email" label="E-mail" />
        <TextField source="phone" label="Telefone" />
        <BadgeField source="status" label="Status" />
        <DateField source="createdAt" label="Data de Cadastro" />

        <ReferenceManyField
          reference="vehicles"
          target="userId"
          label="Veículos"
        >
          <DataTable>
            <DataTable.Column source="photoUrl" label="Foto">
              <ImageField source="photoUrl" />
            </DataTable.Column>
            <DataTable.Column source="brand" label="Marca">
              <TextField source="brand" />
            </DataTable.Column>
            <DataTable.Column source="model" label="Modelo">
              <TextField source="model" />
            </DataTable.Column>
            <DataTable.Column source="year" label="Ano">
              <TextField source="year" />
            </DataTable.Column>
            <DataTable.Column source="category" label="Categoria">
              <TextField source="category" />
            </DataTable.Column>
            <DataTable.Column source="hasDualPedal" label="Duplo-pedal">
              <BadgeField source="hasDualPedal" />
            </DataTable.Column>
            <DataTable.Column source="status" label="Status">
              <BadgeField source="status" />
            </DataTable.Column>
          </DataTable>
        </ReferenceManyField>

        <ReferenceManyField
          reference="ratings"
          target="instructorId"
          label="Avaliações Recebidas"
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
            <DataTable.Column source="createdAt" label="Data">
              <DateField source="createdAt" />
            </DataTable.Column>
          </DataTable>
        </ReferenceManyField>

        <ReferenceManyField
          reference="lessons"
          target="instructorId"
          label="Aulas"
        >
          <DataTable>
            <DataTable.Column source="id" label="ID" />
            <DataTable.Column source="scheduledAt" label="Data/Hora">
              <DateField source="scheduledAt" showTime />
            </DataTable.Column>
            <DataTable.Column source="status" label="Status">
              <TextField source="status" />
            </DataTable.Column>
            <DataTable.Column source="address" label="Endereço">
              <TextField source="address" />
            </DataTable.Column>
          </DataTable>
        </ReferenceManyField>
      </SimpleShowLayout>
    </Show>
  );
};

