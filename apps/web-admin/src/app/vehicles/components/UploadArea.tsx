"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Camera, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadAreaProps {
  onUpload: (base64: string) => void;
  preview?: string;
  label: string;
  error?: string;
}

export function UploadArea({ onUpload, preview, label, error }: UploadAreaProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // Validar tamanho (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Foto muito pesada. Máximo 5MB.");
      return;
    }

    // Converter para base64
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onUpload(result);
    };
    reader.onerror = () => {
      alert("Erro ao ler arquivo. Tente novamente.");
    };
    reader.readAsDataURL(file);
  }, [onUpload]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpload("");
  };
  
  return (
    <div className="w-full">
      <Card 
        {...getRootProps()} 
        className={`
          cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}
          ${error ? 'border-destructive' : ''}
        `}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="aspect-video w-full object-cover rounded-md" 
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
            <Camera className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">
              {isDragActive ? "Solte a foto aqui..." : "Clique ou arraste uma foto"}
            </p>
            <p className="text-xs text-muted-foreground">
              JPG ou PNG • Máx 5MB
            </p>
          </div>
        )}
      </Card>
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}

