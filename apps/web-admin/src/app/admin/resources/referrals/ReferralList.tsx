import { List } from "@/components/list";
import { DataTable } from "@/components/data-table";
import { TextField } from "@/components/text-field";
import { DateField } from "@/components/date-field";
import { NumberField } from "@/components/number-field";
import { BooleanField } from "@/components/boolean-field";
import { ShowButton } from "@/components/show-button";
import { SearchInput } from "@/components/search-input";
import { ExportButton } from "@/components/export-button";

export const ReferralList = () => {
  return (
    <List
      filters={[<SearchInput source="referrer.name" alwaysOn key="search" />]}
      actions={
        <>
          <ExportButton />
        </>
      }
    >
      <DataTable>
        <DataTable.Column source="id" label="ID" />
        <DataTable.Column source="referrer.name" label="Quem Indicou">
          <TextField source="referrer.name" />
        </DataTable.Column>
        <DataTable.Column source="referred.name" label="Quem Foi Indicado">
          <TextField source="referred.name" />
        </DataTable.Column>
        <DataTable.Column source="rewardAmount" label="Recompensa">
          <NumberField source="rewardAmount" options={{ style: 'currency', currency: 'BRL' }} />
        </DataTable.Column>
        <DataTable.Column source="rewardPaid" label="Pago">
          <BooleanField source="rewardPaid" />
        </DataTable.Column>
        <DataTable.Column source="createdAt" label="Data">
          <DateField source="createdAt" />
        </DataTable.Column>
        <DataTable.Column label="Ações">
          <ShowButton />
        </DataTable.Column>
      </DataTable>
    </List>
  );
};

