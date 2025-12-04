import { List } from "@/components/list";
import { DataTable } from "@/components/data-table";
import { TextField } from "@/components/text-field";
import { EmailField } from "@/components/email-field";
import { DateField } from "@/components/date-field";
import { BadgeField } from "@/components/badge-field";
import { EditButton } from "@/components/edit-button";
import { ShowButton } from "@/components/show-button";
import { DeleteButton } from "@/components/delete-button";
import { CreateButton } from "@/components/create-button";
import { SearchInput } from "@/components/search-input";
import { ExportButton } from "@/components/export-button";

export const InstructorList = () => {
  return (
    <List
      filters={[<SearchInput source="name" alwaysOn key="search" />]}
      actions={
        <>
          <CreateButton />
          <ExportButton />
        </>
      }
    >
      <DataTable>
        <DataTable.Column source="id" label="ID" />
        <DataTable.Column source="name" label="Nome">
          <TextField source="name" />
        </DataTable.Column>
        <DataTable.Column source="email" label="E-mail">
          <EmailField source="email" />
        </DataTable.Column>
        <DataTable.Column source="phone" label="Telefone">
          <TextField source="phone" />
        </DataTable.Column>
        <DataTable.Column source="status" label="Status">
          <BadgeField source="status" />
        </DataTable.Column>
        <DataTable.Column source="createdAt" label="Cadastro">
          <DateField source="createdAt" />
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

