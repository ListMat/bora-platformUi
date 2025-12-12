"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { vehicleSchema, type VehicleFormData } from "../schema/vehicleSchema";
import { useBrandsAndModels } from "../hooks/useBrandsAndModels";
import {
  categories,
  transmissions,
  fuels,
  colors,
  engines,
  safetyOptions,
  comfortOptions,
} from "../utils/vehicleOptions";
import { UploadArea } from "./UploadArea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface VehicleFormProps {
  onSuccess?: () => void;
}

export function VehicleForm({ onSuccess }: VehicleFormProps) {
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const { brands, models, loadModels } = useBrandsAndModels();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      safetyFeatures: [],
      comfortFeatures: [],
      hasDualPedal: session?.user?.role === "INSTRUCTOR",
      acceptStudentCar: false,
    },
  });

  const createVehicleMutation = trpc.vehicle.create.useMutation({
    onSuccess: () => {
      toast.success("Veículo cadastrado com sucesso!");
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao cadastrar veículo");
    },
  });

  const watchBrand = watch("brand");
  const watchHasDualPedal = watch("hasDualPedal");
  const watchSafetyFeatures = watch("safetyFeatures") || [];
  const watchComfortFeatures = watch("comfortFeatures") || [];
  const watchPhotoBase64 = watch("photoBase64");
  const watchPedalPhotoBase64 = watch("pedalPhotoBase64");

  const userRole = session?.user?.role || "STUDENT";
  const isInstructor = userRole === "INSTRUCTOR";

  const onSubmit = async (data: VehicleFormData) => {
    await createVehicleMutation.mutateAsync(data);
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const toggleSafetyFeature = (feature: string) => {
    const current = watchSafetyFeatures;
    if (current.includes(feature)) {
      setValue("safetyFeatures", current.filter(f => f !== feature));
    } else {
      setValue("safetyFeatures", [...current, feature]);
    }
  };

  const toggleComfortFeature = (feature: string) => {
    const current = watchComfortFeatures;
    if (current.includes(feature)) {
      setValue("comfortFeatures", current.filter(f => f !== feature));
    } else {
      setValue("comfortFeatures", [...current, feature]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Veículo</CardTitle>
          <CardDescription>
            Preencha as informações do seu veículo em 3 etapas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stepper */}
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold
                    ${currentStep === step ? 'border-primary bg-primary text-primary-foreground' : ''}
                    ${currentStep > step ? 'border-primary bg-primary text-primary-foreground' : 'border-muted'}
                  `}
                >
                  {currentStep > step ? <Check className="h-5 w-5" /> : step}
                </div>
                {step < 3 && (
                  <div className={`mx-2 h-0.5 w-16 ${currentStep > step ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>

          <Separator />

          {/* Step 1: Dados Básicos */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dados Básicos</h3>
              
              <div>
                <Label htmlFor="photoBase64">Foto do Veículo *</Label>
                <UploadArea
                  label="Foto frontal ou lateral do veículo"
                  preview={watchPhotoBase64}
                  onUpload={(base64) => setValue("photoBase64", base64)}
                  error={errors.photoBase64?.message}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="brand">Marca *</Label>
                  <Select
                    value={watchBrand}
                    onValueChange={(value) => {
                      setValue("brand", value);
                      setValue("model", "");
                      loadModels(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ex: Toyota" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.brand && (
                    <p className="text-sm text-destructive mt-1">{errors.brand.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="model">Modelo *</Label>
                  <Select
                    value={watch("model")}
                    onValueChange={(value) => setValue("model", value)}
                    disabled={!watchBrand}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ex: Corolla" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.model && (
                    <p className="text-sm text-destructive mt-1">{errors.model.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Ano *</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 2020"
                    {...register("year", { valueAsNumber: true })}
                  />
                  {errors.year && (
                    <p className="text-sm text-destructive mt-1">{errors.year.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="color">Cor *</Label>
                  <Select
                    value={watch("color")}
                    onValueChange={(value) => setValue("color", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a cor" />
                    </SelectTrigger>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.color && (
                    <p className="text-sm text-destructive mt-1">{errors.color.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="plateLastFour">4 Últimos Dígitos da Placa *</Label>
                <Input
                  placeholder="Ex: 1D23"
                  maxLength={4}
                  {...register("plateLastFour")}
                  onChange={(e) => setValue("plateLastFour", e.target.value.toUpperCase())}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Digite os 4 últimos caracteres (letras e números)
                </p>
                {errors.plateLastFour && (
                  <p className="text-sm text-destructive mt-1">{errors.plateLastFour.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Especificações */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Especificações Técnicas</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={watch("category")}
                    onValueChange={(value: any) => setValue("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="transmission">Câmbio *</Label>
                  <Select
                    value={watch("transmission")}
                    onValueChange={(value: any) => setValue("transmission", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o câmbio" />
                    </SelectTrigger>
                    <SelectContent>
                      {transmissions.map((trans) => (
                        <SelectItem key={trans.value} value={trans.value}>
                          {trans.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.transmission && (
                    <p className="text-sm text-destructive mt-1">{errors.transmission.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fuel">Combustível *</Label>
                  <Select
                    value={watch("fuel")}
                    onValueChange={(value: any) => setValue("fuel", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o combustível" />
                    </SelectTrigger>
                    <SelectContent>
                      {fuels.map((fuel) => (
                        <SelectItem key={fuel.value} value={fuel.value}>
                          {fuel.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.fuel && (
                    <p className="text-sm text-destructive mt-1">{errors.fuel.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="engine">Motor *</Label>
                  <Select
                    value={watch("engine")}
                    onValueChange={(value) => setValue("engine", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ex: 2.0" />
                    </SelectTrigger>
                    <SelectContent>
                      {engines.map((engine) => (
                        <SelectItem key={engine} value={engine}>
                          {engine}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.engine && (
                    <p className="text-sm text-destructive mt-1">{errors.engine.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="horsePower">Potência (cv) - Opcional</Label>
                <Input
                  type="number"
                  placeholder="Ex: 140"
                  {...register("horsePower", { valueAsNumber: true })}
                />
                {errors.horsePower && (
                  <p className="text-sm text-destructive mt-1">{errors.horsePower.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Segurança & Acessórios */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Segurança & Acessórios</h3>

              {/* Duplo-pedal */}
              <div className="space-y-4 border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="hasDualPedal">Duplo-pedal instalado</Label>
                    <p className="text-sm text-muted-foreground">
                      {isInstructor 
                        ? "Obrigatório para aulas regulares. Kit homologado pelo Detran."
                        : "Marque apenas se já possui o kit homologado"}
                    </p>
                  </div>
                  <Switch
                    checked={watchHasDualPedal}
                    onCheckedChange={(checked) => setValue("hasDualPedal", checked)}
                    disabled={isInstructor} // Obrigatório para instrutor
                  />
                </div>

                {watchHasDualPedal && (
                  <div>
                    <Label>Foto do Pedal {isInstructor && "*"}</Label>
                    <UploadArea
                      label="Foto do duplo-pedal instalado"
                      preview={watchPedalPhotoBase64}
                      onUpload={(base64) => setValue("pedalPhotoBase64", base64)}
                      error={errors.pedalPhotoBase64?.message}
                    />
                  </div>
                )}
              </div>

              {/* Aceita carro do aluno (só para instrutor) */}
              {isInstructor && (
                <div className="flex items-center justify-between border rounded-lg p-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="acceptStudentCar">Aceito ministrar aula no carro do aluno</Label>
                    <p className="text-sm text-muted-foreground">
                      Economize 15% - veja regulamento
                    </p>
                  </div>
                  <Switch
                    checked={watch("acceptStudentCar")}
                    onCheckedChange={(checked) => setValue("acceptStudentCar", checked)}
                  />
                </div>
              )}

              {/* Segurança */}
              <div className="space-y-3">
                <Label>Itens de Segurança</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {safetyOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        checked={watchSafetyFeatures.includes(option)}
                        onCheckedChange={() => toggleSafetyFeature(option)}
                      />
                      <label className="text-sm">{option}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conforto */}
              <div className="space-y-3">
                <Label>Itens de Conforto</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {comfortOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        checked={watchComfortFeatures.includes(option)}
                        onCheckedChange={() => toggleComfortFeature(option)}
                      />
                      <label className="text-sm">{option}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 1 || isSubmitting}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>

            {currentStep < 3 ? (
              <Button type="button" onClick={handleNext}>
                Próximo
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Cadastrando..." : "Cadastrar Veículo"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </form>
  );
}

