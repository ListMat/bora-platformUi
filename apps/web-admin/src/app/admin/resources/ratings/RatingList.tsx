import { List } from "@/components/list";
import { DataTable } from "@/components/data-table";
import { TextField } from "@/components/text-field";
import { DateField } from "@/components/date-field";
import { NumberField } from "@/components/number-field";
import { ShowButton } from "@/components/show-button";
import { SearchInput } from "@/components/search-input";
import { ExportButton } from "@/components/export-button";

export const RatingList = () => {
  return (
    <List
      filters={[<SearchInput source="rater.name" alwaysOn key="search" />]}
      actions={
        <>
          <ExportButton />
        </>
      }
    >
      <DataTable>
        <DataTable.Column source="id" label="ID" />
        <DataTable.Column source="student.name" label="Aluno">
          <TextField source="student.name" />
        </DataTable.Column>
        <DataTable.Column source="instructor.name" label="Instrutor">
          <TextField source="instructor.name" />
        </DataTable.Column>
        <DataTable.Column source="rating" label="Nota">
          <NumberField source="rating" />
        </DataTable.Column>
        <DataTable.Column source="comment" label="Comentário">
          <TextField source="comment" />
        </DataTable.Column>
        <DataTable.Column source="lesson.scheduledAt" label="Data da Aula">
          <DateField source="lesson.scheduledAt" />
        </DataTable.Column>
        <DataTable.Column source="createdAt" label="Data da Avaliação">
          <DateField source="createdAt" />
        </DataTable.Column>
        <DataTable.Column label="Ações">
          <ShowButton />
        </DataTable.Column>
      </DataTable>
    </List>
  );
};

