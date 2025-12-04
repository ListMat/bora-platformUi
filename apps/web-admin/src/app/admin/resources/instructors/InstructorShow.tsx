import { Show } from "@/components/show";
import { SimpleShowLayout } from "@/components/simple-show-layout";
import { TextField } from "@/components/text-field";
import { EmailField } from "@/components/email-field";
import { DateField } from "@/components/date-field";
import { BadgeField } from "@/components/badge-field";
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

