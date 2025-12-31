import { Create } from "@/components/create";
import { SimpleForm } from "@/components/simple-form";
import { TextInput } from "@/components/text-input";
import { NumberInput } from "@/components/number-input";
import { BooleanInput } from "@/components/boolean-input";
import { required } from "../../validators";

export const BundleCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="name" label="Nome" validate={[required()]} />
        <TextInput source="description" label="Descrição" />

        <div className="grid grid-cols-2 gap-4">
          <NumberInput source="totalLessons" label="Total de Aulas" validate={[required()]} />
          <NumberInput source="price" label="Preço" step={0.01} min={0} validate={[required()]} />
          <NumberInput source="discount" label="Desconto (%)" min={0} max={100} />
          <NumberInput source="expiryDays" label="Validade (dias)" min={1} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <BooleanInput source="isActive" label="Ativo" />
          <BooleanInput source="featured" label="Destaque" />
        </div>
      </SimpleForm>
    </Create>
  );
};

