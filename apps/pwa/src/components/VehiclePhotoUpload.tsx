'use client';

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Progress } from "@/components/ui/progress";
import { VehiclePhoto } from '@/lib/validations/onboarding';
import { Upload, X, Star, ImageIcon } from 'lucide-react';

interface VehiclePhotoUploadProps {
    photos: VehiclePhoto[];
    onChange: (photos: VehiclePhoto[]) => void;
    maxPhotos?: number;
}

export default function VehiclePhotoUpload({
    photos,
    onChange,
    maxPhotos = 5,
}: VehiclePhotoUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);

    // Simular upload (substituir por upload real)
    const uploadPhoto = async (file: File): Promise<string> => {
        return new Promise((resolve) => {
            // Simular progresso
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setUploadProgress(progress);

                if (progress >= 100) {
                    clearInterval(interval);
                    resolve(URL.createObjectURL(file));
                }
            }, 100);
        });
    };

    // Comprimir e validar imagem
    const processImage = async (file: File): Promise<File> => {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('Arquivo deve ser uma imagem'));
                return;
            }
            if (file.size > 20 * 1024 * 1024) {
                reject(new Error('Imagem deve ter no máximo 20MB'));
                return;
            }
            const img = new Image();
            const reader = new FileReader();
            reader.onload = (e) => { img.src = e.target?.result as string; };
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d')!;
                let width = img.width;
                let height = img.height;
                const maxWidth = 1920;
                const maxHeight = 1080;
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = width * ratio;
                    height = height * ratio;
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const compressedFile = new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() });
                        resolve(compressedFile);
                    } else {
                        reject(new Error('Erro ao processar imagem'));
                    }
                }, 'image/jpeg', 0.85);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFiles = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        if (photos.length >= maxPhotos) {
            alert(`Máximo de ${maxPhotos} fotos`);
            return;
        }

        setUploading(true);
        setUploadProgress(0);

        try {
            const newPhotos: VehiclePhoto[] = [];
            for (let i = 0; i < files.length && photos.length + newPhotos.length < maxPhotos; i++) {
                const file = files[i];
                const processedFile = await processImage(file);
                const url = await uploadPhoto(processedFile);
                newPhotos.push({
                    url,
                    type: i === 0 ? 'main' : 'other',
                    order: photos.length + newPhotos.length,
                });
            }
            onChange([...photos, ...newPhotos]);
        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            alert(error instanceof Error ? error.message : 'Erro ao fazer upload');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    }, [photos, onChange, maxPhotos]);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]);

    const removePhoto = (index: number) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        onChange(newPhotos.map((photo, i) => ({ ...photo, order: i })));
    };

    const setAsMain = (index: number) => {
        const newPhotos = photos.map((photo, i) => ({
            ...photo,
            type: i === index ? 'main' : 'other',
        } as VehiclePhoto));
        onChange(newPhotos);
    };

    return (
        <div className="space-y-6">
            <div
                className={`
                    relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
                    ${dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-primary'}
                    ${photos.length >= maxPhotos ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => {
                    if (photos.length < maxPhotos) document.getElementById('photo-upload')?.click();
                }}
            >
                <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                    disabled={photos.length >= maxPhotos}
                />

                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>

                    <div>
                        <p className="font-medium mb-1">Clique ou arraste fotos aqui</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG até 5MB • Max {maxPhotos} fotos</p>
                    </div>

                    <Chip variant="outline" size="sm">
                        {photos.length}/{maxPhotos} fotos
                    </Chip>
                </div>

                {uploading && (
                    <div className="mt-4 space-y-2">
                        <Progress value={uploadProgress} className="h-2" />
                        <p className="text-sm text-muted-foreground">Fazendo upload... {uploadProgress}%</p>
                    </div>
                )}
            </div>

            {photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.map((photo, index) => (
                        <Card key={index} className="relative group overflow-hidden">
                            <div className="aspect-video bg-muted relative">
                                <img
                                    src={photo.url}
                                    alt={`Foto ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    {photo.type !== 'main' && (
                                        <Button size="icon" variant="secondary" onClick={(e) => { e.stopPropagation(); setAsMain(index); }}>
                                            <Star className="h-4 w-4" />
                                        </Button>
                                    )}
                                    <Button size="icon" variant="destructive" onClick={(e) => { e.stopPropagation(); removePhoto(index); }}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                {photo.type === 'main' && (
                                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                                        Principal
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
