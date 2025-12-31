import { List } from "@/components/list";
import { DataTable } from "@/components/data-table";
import { TextField } from "@/components/text-field";
import { NumberField } from "@/components/number-field";
import { DateField } from "@/components/date-field";
import { BooleanField } from "@/components/boolean-field";
import { BadgeField } from "@/components/badge-field";
import { EditButton } from "@/components/edit-button";
import { ShowButton } from "@/components/show-button";
import { DeleteButton } from "@/components/delete-button";
import { CreateButton } from "@/components/create-button";
import { SearchInput } from "@/components/search-input";
import { ExportButton } from "@/components/export-button";

export const SkillList = () => {
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
        <DataTable.Column source="name" label="Nome">
          <TextField source="name" />
        </DataTable.Column>
        <DataTable.Column source="description" label="Descrição">
          <TextField source="description" />
        </DataTable.Column>
        <DataTable.Column source="category" label="Categoria">
          <BadgeField source="category" />
        </DataTable.Column>
        <DataTable.Column source="weight" label="Peso">
          <NumberField source="weight" />
        </DataTable.Column>
        <DataTable.Column source="order" label="Ordem">
          <NumberField source="order" />
        </DataTable.Column>
        <DataTable.Column source="isActive" label="Ativo">
          <BooleanField source="isActive" />
        </DataTable.Column>
        <DataTable.Column source="createdAt" label="Criado em">
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

