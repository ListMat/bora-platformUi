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

export const BundleList = () => {
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
        <DataTable.Column source="totalLessons" label="Aulas">
          <NumberField source="totalLessons" />
        </DataTable.Column>
        <DataTable.Column source="price" label="Preço">
          <NumberField source="price" options={{ style: 'currency', currency: 'BRL' }} />
        </DataTable.Column>
        <DataTable.Column source="discount" label="Desconto (%)">
          <NumberField source="discount" />
        </DataTable.Column>
        <DataTable.Column source="expiryDays" label="Validade (dias)">
          <NumberField source="expiryDays" />
        </DataTable.Column>
        <DataTable.Column source="featured" label="Destaque">
          <BooleanField source="featured" />
        </DataTable.Column>
        <DataTable.Column source="isActive" label="Ativo">
          <BadgeField source="isActive" />
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

