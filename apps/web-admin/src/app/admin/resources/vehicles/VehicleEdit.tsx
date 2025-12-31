import { Edit } from "@/components/edit";
import { SimpleForm } from "@/components/simple-form";
import { TextInput } from "@/components/text-input";
import { NumberInput } from "@/components/number-input";
import { SelectInput } from "@/components/select-input";
import { BooleanInput } from "@/components/boolean-input";
import { required } from "../../validators";

const vehicleCategories = [
  { id: "HATCH", name: "Hatch" },
  { id: "SEDAN", name: "Sedan" },
  { id: "SUV", name: "SUV" },
  { id: "PICKUP", name: "Pickup" },
  { id: "SPORTIVO", name: "Esportivo" },
  { id: "COMPACTO", name: "Compacto" },
  { id: "ELETRICO", name: "Elétrico" },
  { id: "MOTO", name: "Moto" },
];

const transmissionTypes = [
  { id: "MANUAL", name: "Manual" },
  { id: "AUTOMATICO", name: "Automático" },
  { id: "CVT", name: "CVT" },
  { id: "SEMI_AUTOMATICO", name: "Semi-automático" },
];

const fuelTypes = [
  { id: "GASOLINA", name: "Gasolina" },
  { id: "ETANOL", name: "Etanol" },
  { id: "FLEX", name: "Flex" },
  { id: "DIESEL", name: "Diesel" },
  { id: "ELETRICO", name: "Elétrico" },
  { id: "HIBRIDO", name: "Híbrido" },
];

const statusOptions = [
  { id: "active", name: "Ativo" },
  { id: "inactive", name: "Inativo" },
];

export const VehicleEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <div className="grid grid-cols-2 gap-4">
          <TextInput source="brand" label="Marca" validate={[required()]} />
          <TextInput source="model" label="Modelo" validate={[required()]} />
          <NumberInput source="year" label="Ano" validate={[required()]} />
          <TextInput source="color" label="Cor" validate={[required()]} />
          <TextInput source="plateLastFour" label="Placa (últimos 4 dígitos)" validate={[required()]} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectInput
            source="category"
            label="Categoria"
            choices={vehicleCategories}
            validate={[required()]}
          />
          <SelectInput
            source="transmission"
            label="Transmissão"
            choices={transmissionTypes}
            validate={[required()]}
          />
          <SelectInput
            source="fuel"
            label="Combustível"
            choices={fuelTypes}
            validate={[required()]}
          />
          <TextInput source="engine" label="Motor" validate={[required()]} />
          <NumberInput source="horsePower" label="Potência (cv)" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <BooleanInput source="hasDualPedal" label="Duplo-pedal" />
          <BooleanInput source="acceptStudentCar" label="Aceita carro do aluno" />
          <SelectInput
            source="status"
            label="Status"
            choices={statusOptions}
            validate={[required()]}
          />
        </div>
      </SimpleForm>
    </Edit>
  );
};

