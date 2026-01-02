import { List } from "@/components/list";
import { DataTable } from "@/components/data-table";
import { TextField } from "@/components/text-field";
import { DateField } from "@/components/date-field";
import { ReferenceField } from "@/components/reference-field";
import { BadgeField } from "@/components/badge-field";
import { EditButton } from "@/components/edit-button";
import { ShowButton } from "@/components/show-button";
import { DeleteButton } from "@/components/delete-button";
import { CreateButton } from "@/components/create-button";
import { SearchInput } from "@/components/search-input";
import { ExportButton } from "@/components/export-button";
import { SelectInput } from "@/components/select-input";
import { NumberField } from "@/components/number-field";
import { BooleanField } from "@/components/boolean-field";

export const LessonList = () => {
  return (
    <List
      filters={[
        <SearchInput source="address" alwaysOn key="search" />,
        <SelectInput
          source="status"
          label="Status"
          choices={[
            { id: "PENDING", name: "Pendente" },
            { id: "SCHEDULED", name: "Agendada" },
            { id: "ACTIVE", name: "Ativa" },
            { id: "FINISHED", name: "Finalizada" },
            { id: "CANCELLED", name: "Cancelada" },
            { id: "EXPIRED", name: "Expirada" },
          ]}
          key="status"
        />,
        <SelectInput
          source="paymentMethod"
          label="Forma de Pagamento"
          choices={[
            { id: "PIX", name: "Pix" },
            { id: "DINHEIRO", name: "Dinheiro" },
            { id: "DEBITO", name: "Débito" },
            { id: "CREDITO", name: "Crédito" },
          ]}
          key="paymentMethod"
        />,
      ]}
      actions={
        <>
          <CreateButton />
          <ExportButton />
        </>
      }
    >
      <DataTable>
        <DataTable.Column source="id" label="ID" />

        <DataTable.Column source="studentId" label="Aluno">
          <ReferenceField source="studentId" reference="students">
            <TextField source="name" />
          </ReferenceField>
        </DataTable.Column>

        <DataTable.Column source="instructorId" label="Instrutor">
          <ReferenceField source="instructorId" reference="instructors">
            <TextField source="name" />
          </ReferenceField>
        </DataTable.Column>

        <DataTable.Column source="scheduledAt" label="Data/Hora">
          <DateField source="scheduledAt" showTime />
        </DataTable.Column>

        <DataTable.Column source="status" label="Status">
          <BadgeField
            source="status"
            colors={{
              PENDING: "yellow",
              SCHEDULED: "blue",
              ACTIVE: "green",
              FINISHED: "gray",
              CANCELLED: "red",
              EXPIRED: "orange",
            }}
          />
        </DataTable.Column>

        <DataTable.Column source="lessonType" label="Tipo de Aula">
          <TextField source="lessonType" />
        </DataTable.Column>

        <DataTable.Column source="paymentMethod" label="Pagamento">
          <BadgeField
            source="paymentMethod"
            colors={{
              PIX: "green",
              DINHEIRO: "gray",
              DEBITO: "blue",
              CREDITO: "purple",
            }}
          />
        </DataTable.Column>

        <DataTable.Column source="price" label="Valor">
          <NumberField
            source="price"
            options={{
              style: "currency",
              currency: "BRL",
            }}
          />
        </DataTable.Column>

        <DataTable.Column source="installments" label="Parcelas">
          <TextField source="installments" />
        </DataTable.Column>

        <DataTable.Column source="useOwnVehicle" label="Carro Próprio">
          <BooleanField source="useOwnVehicle" />
        </DataTable.Column>

        <DataTable.Column label="Ações">
          <div className="flex gap-2">
            <ShowButton />
            <EditButton />
            <DeleteButton />
          </div>
        </DataTable.Column>
      </DataTable>
    </List>
  );
};

