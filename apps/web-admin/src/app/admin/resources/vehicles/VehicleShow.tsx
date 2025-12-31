import { Show } from "@/components/show";
import { SimpleShowLayout } from "@/components/simple-show-layout";
import { TextField } from "@/components/text-field";
import { DateField } from "@/components/date-field";
import { ImageField } from "@/components/image-field";
import { BooleanField } from "@/components/boolean-field";
import { ArrayField } from "@/components/array-field";
import { ChipField } from "@/components/chip-field";

export const VehicleShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <ImageField source="photoUrl" label="Foto Principal" />
        
        <div className="grid grid-cols-2 gap-4">
          <TextField source="brand" label="Marca" />
          <TextField source="model" label="Modelo" />
          <TextField source="year" label="Ano" />
          <TextField source="color" label="Cor" />
          <TextField source="plateLastFour" label="Placa (últimos 4 dígitos)" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextField source="category" label="Categoria" />
          <TextField source="transmission" label="Transmissão" />
          <TextField source="fuel" label="Combustível" />
          <TextField source="engine" label="Motor" />
          <TextField source="horsePower" label="Potência (cv)" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <BooleanField source="hasDualPedal" label="Duplo-pedal" />
          <BooleanField source="acceptStudentCar" label="Aceita carro do aluno" />
          <TextField source="status" label="Status" />
        </div>

        <ImageField source="pedalPhotoUrl" label="Foto do Pedal" />

        <ArrayField source="safetyFeatures" label="Recursos de Segurança">
          <ChipField source="." />
        </ArrayField>

        <ArrayField source="comfortFeatures" label="Recursos de Conforto">
          <ChipField source="." />
        </ArrayField>

        <div className="grid grid-cols-2 gap-4">
          <TextField source="user.name" label="Proprietário" />
          <TextField source="user.email" label="E-mail do Proprietário" />
          <TextField source="user.role" label="Tipo de Usuário" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <DateField source="createdAt" label="Data de Cadastro" />
          <DateField source="updatedAt" label="Última Atualização" />
        </div>
      </SimpleShowLayout>
    </Show>
  );
};

