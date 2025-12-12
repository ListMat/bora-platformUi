import { useState } from "react";
import { brandModels } from "../utils/vehicleOptions";

export function useBrandsAndModels() {
  const [brands] = useState(Object.keys(brandModels).sort());
  const [models, setModels] = useState<string[]>([]);
  
  const loadModels = (brand: string) => {
    const brandModelsData = brandModels[brand] || [];
    setModels(brandModelsData.sort());
  };
  
  return { brands, models, loadModels };
}

