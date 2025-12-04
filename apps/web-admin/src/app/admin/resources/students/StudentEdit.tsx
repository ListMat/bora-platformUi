import { Edit } from "@/components/edit";
import { SimpleForm } from "@/components/simple-form";
import { TextInput } from "@/components/text-input";
import { required } from "../../validators";

export const StudentEdit = () => {
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
      </SimpleForm>
    </Edit>
  );
};

