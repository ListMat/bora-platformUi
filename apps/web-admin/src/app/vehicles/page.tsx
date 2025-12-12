"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { VehicleForm } from "./components/VehicleForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const transmissionLabels: Record<string, string> = {
  MANUAL: "Manual",
  AUTOMATICO: "Automático",
  CVT: "CVT",
  SEMI_AUTOMATICO: "Semi-automático",
};

const categoryLabels: Record<string, string> = {
  HATCH: "Hatch",
  SEDAN: "Sedan",
  SUV: "SUV",
  PICKUP: "Pick-up",
  SPORTIVO: "Sportivo",
  COMPACTO: "Compacto",
  ELETRICO: "Elétrico",
};

export default function VehiclesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const utils = trpc.useUtils();
  const { data: vehicles, isLoading } = trpc.vehicle.myVehicles.useQuery();
  
  const deleteMutation = trpc.vehicle.delete.useMutation({
    onSuccess: () => {
      toast.success("Veículo removido com sucesso");
      utils.vehicle.myVehicles.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao remover veículo");
    },
  });

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    utils.vehicle.myVehicles.invalidate();
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync({ id });
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Veículos</h1>
          <p className="text-muted-foreground">
            Gerencie os veículos cadastrados para aulas
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Veículo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Veículo</DialogTitle>
              <DialogDescription>
                Preencha as informações do seu veículo para começar a dar aulas
              </DialogDescription>
            </DialogHeader>
            <VehicleForm onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && vehicles?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Nenhum veículo cadastrado</h3>
              <p className="text-muted-foreground text-sm">
                Cadastre seu primeiro veículo para começar a dar aulas
              </p>
              <Button onClick={() => setIsFormOpen(true)} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Veículo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vehicle Grid */}
      {!isLoading && vehicles && vehicles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={vehicle.photoUrl}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="aspect-video w-full object-cover"
                />
                <Badge className="absolute top-2 left-2">
                  {categoryLabels[vehicle.category]}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">
                  {vehicle.brand} {vehicle.model}
                </CardTitle>
                <CardDescription>
                  {vehicle.year} • {vehicle.color}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Câmbio:</span>
                    <p className="font-medium">{transmissionLabels[vehicle.transmission]}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Motor:</span>
                    <p className="font-medium">{vehicle.engine}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={vehicle.hasDualPedal ? "default" : "secondary"} className="text-xs">
                    {vehicle.hasDualPedal ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Duplo-pedal
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3 mr-1" />
                        Sem duplo-pedal
                      </>
                    )}
                  </Badge>
                  
                  {vehicle.acceptStudentCar && (
                    <Badge variant="outline" className="text-xs">
                      Aceita carro do aluno
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remover
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remover veículo?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação marcará o veículo como inativo. Você não poderá mais usá-lo para aulas.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(vehicle.id)}
                          disabled={deleteMutation.isLoading}
                        >
                          {deleteMutation.isLoading ? "Removendo..." : "Remover"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

