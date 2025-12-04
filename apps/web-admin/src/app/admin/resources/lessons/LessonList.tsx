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

export const LessonList = () => {
  return (
    <List
      filters={[<SearchInput source="address" alwaysOn key="search" />]}
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
          <BadgeField source="status" />
        </DataTable.Column>
        <DataTable.Column source="address" label="Endereço">
          <TextField source="address" />
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

