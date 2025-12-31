import { List } from "@/components/list";
import { DataTable } from "@/components/data-table";
import { TextField } from "@/components/text-field";
import { DateField } from "@/components/date-field";
import { BooleanField } from "@/components/boolean-field";
import { BadgeField } from "@/components/badge-field";
import { ShowButton } from "@/components/show-button";
import { SearchInput } from "@/components/search-input";
import { ExportButton } from "@/components/export-button";

export const ChatMessageList = () => {
  return (
    <List
      filters={[<SearchInput source="content" alwaysOn key="search" />]}
      actions={
        <>
          <ExportButton />
        </>
      }
    >
      <DataTable>
        <DataTable.Column source="id" label="ID" />
        <DataTable.Column source="lesson.id" label="Aula">
          <TextField source="lesson.id" />
        </DataTable.Column>
        <DataTable.Column source="sender.name" label="Remetente">
          <TextField source="sender.name" />
        </DataTable.Column>
        <DataTable.Column source="content" label="Conteúdo">
          <TextField source="content" />
        </DataTable.Column>
        <DataTable.Column source="messageType" label="Tipo">
          <BadgeField source="messageType" />
        </DataTable.Column>
        <DataTable.Column source="isRead" label="Lida">
          <BooleanField source="isRead" />
        </DataTable.Column>
        <DataTable.Column source="createdAt" label="Data">
          <DateField source="createdAt" showTime />
        </DataTable.Column>
        <DataTable.Column label="Ações">
          <ShowButton />
        </DataTable.Column>
      </DataTable>
    </List>
  );
};

