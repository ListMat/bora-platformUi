import { Show } from "@/components/show";
import { SimpleShowLayout } from "@/components/simple-show-layout";
import { TextField } from "@/components/text-field";
import { NumberField } from "@/components/number-field";
import { DateField } from "@/components/date-field";
import { BooleanField } from "@/components/boolean-field";
import { BadgeField } from "@/components/badge-field";
import { ReferenceManyField } from "@/components/reference-many-field";
import { DataTable } from "@/components/data-table";

export const BundleShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="name" label="Nome" />
        <TextField source="description" label="Descrição" />

        <div className="grid grid-cols-2 gap-4">
          <NumberField source="totalLessons" label="Total de Aulas" />
          <NumberField source="price" label="Preço" options={{ style: 'currency', currency: 'BRL' }} />
          <NumberField source="discount" label="Desconto (%)" />
          <NumberField source="expiryDays" label="Validade (dias)" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <BooleanField source="isActive" label="Ativo" />
          <BooleanField source="featured" label="Destaque" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DateField source="createdAt" label="Criado em" />
          <DateField source="updatedAt" label="Atualizado em" />
        </div>

        <ReferenceManyField
          reference="bundlePurchases"
          target="bundleId"
          label="Compras"
        >
          <DataTable>
            <DataTable.Column source="student.name" label="Aluno">
              <TextField source="student.name" />
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
            <DataTable.Column source="paymentStatus" label="Status Pagamento">
              <BadgeField source="paymentStatus" />
            </DataTable.Column>
            <DataTable.Column source="createdAt" label="Data da Compra">
              <DateField source="createdAt" />
            </DataTable.Column>
          </DataTable>
        </ReferenceManyField>
      </SimpleShowLayout>
    </Show>
  );
};

