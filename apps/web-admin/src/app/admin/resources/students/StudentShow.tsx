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

export const StudentShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" label="ID" />
        <TextField source="name" label="Nome" />
        <EmailField source="email" label="E-mail" />
        <TextField source="phone" label="Telefone" />
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
            <DataTable.Column source="status" label="Status">
              <BadgeField source="status" />
            </DataTable.Column>
          </DataTable>
        </ReferenceManyField>

        <ReferenceManyField
          reference="bundlePurchases"
          target="studentId"
          label="Pacotes Comprados"
        >
          <DataTable>
            <DataTable.Column source="bundle.name" label="Pacote">
              <TextField source="bundle.name" />
            </DataTable.Column>
            <DataTable.Column source="totalCredits" label="Créditos Totais">
              <NumberField source="totalCredits" />
            </DataTable.Column>
            <DataTable.Column source="usedCredits" label="Usados">
              <NumberField source="usedCredits" />
            </DataTable.Column>
            <DataTable.Column source="remainingCredits" label="Restantes">
              <NumberField source="remainingCredits" />
            </DataTable.Column>
            <DataTable.Column source="paymentStatus" label="Status">
              <BadgeField source="paymentStatus" />
            </DataTable.Column>
          </DataTable>
        </ReferenceManyField>

        <ReferenceManyField
          reference="lessons"
          target="studentId"
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

