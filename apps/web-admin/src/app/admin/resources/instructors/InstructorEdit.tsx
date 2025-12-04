import { Edit } from "@/components/edit";
import { SimpleForm } from "@/components/simple-form";
import { TextInput } from "@/components/text-input";
import { SelectInput } from "@/components/select-input";
import { required } from "../../validators";

export const InstructorEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="name" label="Nome" validate={[required()]} />
        <TextInput
          source="email"
          label="E-mail"
          type="email"
          validate={[required()]}
        />
        <TextInput source="phone" label="Telefone" validate={[required()]} />
        <SelectInput
          source="status"
          label="Status"
          choices={[
            { id: "PENDING", name: "Pendente" },
            { id: "APPROVED", name: "Aprovado" },
            { id: "REJECTED", name: "Rejeitado" },
          ]}
          validate={[required()]}
        />
      </SimpleForm>
    </Edit>
  );
};

