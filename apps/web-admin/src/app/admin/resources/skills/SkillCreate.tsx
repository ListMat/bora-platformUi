import { Create } from "@/components/create";
import { SimpleForm } from "@/components/simple-form";
import { TextInput } from "@/components/text-input";
import { NumberInput } from "@/components/number-input";
import { BooleanInput } from "@/components/boolean-input";
import { SelectInput } from "@/components/select-input";
import { required } from "../../validators";

const categoryOptions = [
  { id: "BASIC", name: "Básico" },
  { id: "INTERMEDIATE", name: "Intermediário" },
  { id: "ADVANCED", name: "Avançado" },
];

export const SkillCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="name" label="Nome" validate={[required()]} />
        <TextInput source="description" label="Descrição" />

        <div className="grid grid-cols-2 gap-4">
          <SelectInput
            source="category"
            label="Categoria"
            choices={categoryOptions}
            validate={[required()]}
          />
          <NumberInput source="weight" label="Peso" min={1} validate={[required()]} />
          <NumberInput source="order" label="Ordem" min={0} validate={[required()]} />
          <BooleanInput source="isActive" label="Ativo" />
        </div>
      </SimpleForm>
    </Create>
  );
};

