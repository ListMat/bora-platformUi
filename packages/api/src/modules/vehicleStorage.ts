import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing Supabase credentials. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const BUCKET_NAME = "vehicle-photos";

/**
 * Faz upload de uma foto de veículo para o Supabase Storage
 * @param vehicleId ID do veículo
 * @param photoBuffer Buffer da foto
 * @param filename Nome do arquivo
 * @param photoType Tipo da foto ('main' | 'pedal')
 * @returns URL pública da foto
 */
export async function uploadVehiclePhoto(
  vehicleId: string,
  photoBuffer: Buffer,
  filename: string,
  photoType: 'main' | 'pedal'
): Promise<string> {
  const path = `${vehicleId}/${photoType}/${filename}`;

  // Validar tamanho do arquivo (max 5MB)
  const maxSize = 5 * 1024 * 1024;
  if (photoBuffer.length > maxSize) {
    throw new Error("Photo size exceeds 5MB limit");
  }

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, photoBuffer, {
      contentType: filename.endsWith('.png') ? 'image/png' : 'image/jpeg',
      upsert: true,
    });

  if (error) {
    console.error("Error uploading vehicle photo:", error);
    throw new Error(`Failed to upload vehicle photo: ${error.message}`);
  }

  // Gerar URL pública
  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);

  return publicUrlData.publicUrl;
}

/**
 * Remove uma foto de veículo do Supabase Storage
 * @param vehicleId ID do veículo
 * @param photoType Tipo da foto ('main' | 'pedal')
 */
export async function deleteVehiclePhoto(
  vehicleId: string,
  photoType: 'main' | 'pedal'
): Promise<void> {
  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(`${vehicleId}/${photoType}`);

  if (listError) {
    console.error("Error listing vehicle photos:", listError);
    throw new Error(`Failed to list vehicle photos: ${listError.message}`);
  }

  if (files && files.length > 0) {
    const paths = files.map(file => `${vehicleId}/${photoType}/${file.name}`);
    const { error: deleteError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove(paths);

    if (deleteError) {
      console.error("Error deleting vehicle photos:", deleteError);
      throw new Error(`Failed to delete vehicle photos: ${deleteError.message}`);
    }
  }
}

/**
 * Remove todas as fotos de um veículo
 * @param vehicleId ID do veículo
 */
export async function deleteAllVehiclePhotos(vehicleId: string): Promise<void> {
  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET_NAME)
    .list(vehicleId, { limit: 100 });

  if (listError) {
    console.error("Error listing vehicle photos:", listError);
    return; // Não falhar se não houver fotos
  }

  if (files && files.length > 0) {
    const paths = files.map(file => `${vehicleId}/${file.name}`);
    await supabase.storage.from(BUCKET_NAME).remove(paths);
  }
}

/**
 * Converte base64 para Buffer
 * @param base64String String base64 com ou sem data URI
 * @returns Buffer da imagem
 */
export function base64ToBuffer(base64String: string): Buffer {
  // Remove o data URI prefix se existir (data:image/jpeg;base64,...)
  const base64Data = base64String.includes(',') 
    ? base64String.split(',')[1] 
    : base64String;
  
  return Buffer.from(base64Data, 'base64');
}

/**
 * Gera um filename único para a foto
 * @param vehicleId ID do veículo
 * @param extension Extensão do arquivo (.jpg ou .png)
 * @returns Nome do arquivo
 */
export function generatePhotoFilename(vehicleId: string, extension: string = 'jpg'): string {
  const timestamp = Date.now();
  return `${vehicleId}-${timestamp}.${extension}`;
}

