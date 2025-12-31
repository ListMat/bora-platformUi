import { List } from "@/components/list";
import { DataTable } from "@/components/data-table";
import { TextField } from "@/components/text-field";
import { DateField } from "@/components/date-field";
import { BadgeField } from "@/components/badge-field";
import { ImageField } from "@/components/image-field";
import { EditButton } from "@/components/edit-button";
import { ShowButton } from "@/components/show-button";
import { DeleteButton } from "@/components/delete-button";
import { SearchInput } from "@/components/search-input";
import { ExportButton } from "@/components/export-button";

export const VehicleList = () => {
  return (
    <List
      filters={[<SearchInput source="brand" alwaysOn key="search" />]}
      actions={
        <>
          <ExportButton />
        </>
      }
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
        <DataTable.Column source="transmission" label="Transmissão">
          <TextField source="transmission" />
        </DataTable.Column>
        <DataTable.Column source="user.name" label="Proprietário">
          <TextField source="user.name" />
        </DataTable.Column>
        <DataTable.Column source="user.role" label="Tipo">
          <BadgeField source="user.role" />
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

