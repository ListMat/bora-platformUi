import { Show } from "@/components/show";
import { SimpleShowLayout } from "@/components/simple-show-layout";
import { TextField } from "@/components/text-field";
import { DateField } from "@/components/date-field";
import { NumberField } from "@/components/number-field";
import { BooleanField } from "@/components/boolean-field";

export const ReferralShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <div className="grid grid-cols-2 gap-4">
          <TextField source="referrer.name" label="Quem Indicou" />
          <TextField source="referrer.email" label="E-mail de Quem Indicou" />
          <TextField source="referred.name" label="Quem Foi Indicado" />
          <TextField source="referred.email" label="E-mail de Quem Foi Indicado" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <NumberField source="rewardAmount" label="Valor da Recompensa" options={{ style: 'currency', currency: 'BRL' }} />
          <BooleanField source="rewardPaid" label="Recompensa Paga" />
        </div>

        <DateField source="createdAt" label="Data da Indicação" />
      </SimpleShowLayout>
    </Show>
  );
};

