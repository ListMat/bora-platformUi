'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { formatPrice } from '@/lib/validations/onboarding';
import { MapPin as MapPinIcon } from 'lucide-react';

interface Instructor {
    id: string;
    latitude: number | null;
    longitude: number | null;
    basePrice: number;
    averageRating: number;
    totalLessons: number;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
    city: string | null;
    state: string | null;
    distance?: number;
}

interface InstructorMapProps {
    instructors: Instructor[];
    center?: { lat: number; lng: number };
    zoom?: number;
    className?: string;
}

export default function InstructorMap({
    instructors,
    center = { lat: -23.5505, lng: -46.6333 },
    zoom = 12,
    className = "w-full h-[600px]"
}: InstructorMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);

    // Estado para verificar se token existe
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        if (token) {
            setHasToken(true);
            mapboxgl.accessToken = token;
        }
    }, []);

    // Inicializar Mapa
    useEffect(() => {
        if (!hasToken || !mapContainer.current || map.current) return;

        try {
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mateusdk/cmk1sbjvv004t01s55ibo8m01',
                center: [center.lng, center.lat],
                zoom: zoom,
            });

            map.current.addControl(new mapboxgl.NavigationControl(), 'top-left');
            map.current.addControl(new mapboxgl.GeolocateControl({
                positionOptions: { enableHighAccuracy: true },
                trackUserLocation: true,
                showUserHeading: true
            }), 'top-left');

        } catch (error) {
            console.error('Erro ao inicializar Mapbox:', error);
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [hasToken, center.lng, center.lat, zoom]);

    // Atualizar Marcadores
    useEffect(() => {
        if (!map.current || !hasToken) return;

        // Limpar marcadores antigos
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        instructors.forEach(instructor => {
            if (!instructor.latitude || !instructor.longitude) return;

            // Criar Elemento DOM Customizado
            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.style.cursor = 'pointer';

            // HTML Interno do Marcador (Avatar + Preço)
            const avatarUrl = instructor.user.image || '';
            const initials = instructor.user.name?.slice(0, 2).toUpperCase() || 'IN';
            const price = formatPrice(Number(instructor.basePrice));

            el.innerHTML = `
                <div style="position: relative; display: flex; flex-direction: column; align-items: center; transition: transform 0.2s;">
                    <div style="background-color: white; color: black; padding: 2px 6px; border-radius: 8px; font-size: 10px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2); margin-bottom: 2px; white-space: nowrap;">
                        ${price}
                    </div>
                    <div style="width: 36px; height: 36px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2); overflow: hidden; background: #006FEE; display: flex; align-items: center; justify-content: center;">
                        ${avatarUrl ? `<img src="${avatarUrl}" style="width: 100%; height: 100%; object-fit: cover;" />` : `<span style="color: white; font-size: 10px; font-weight: bold;">${initials}</span>`}
                    </div>
                    <div style="width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid white; margin-top: -2px;"></div>
                </div>
            `;

            // Hover effects via JS events no elemento
            el.addEventListener('mouseenter', () => {
                el.style.zIndex = '100';
                el.style.transform = 'scale(1.1)';
            });
            el.addEventListener('mouseleave', () => {
                el.style.zIndex = 'auto';
                el.style.transform = 'scale(1)';
            });

            // Criar Popup
            const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
                .setHTML(`
                    <div style="padding: 0; min-width: 200px; font-family: ui-sans-serif, system-ui, sans-serif;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                             <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: #eee;">
                                ${avatarUrl ? `<img src="${avatarUrl}" style="width: 100%; height: 100%; object-fit: cover;" />` : ''}
                             </div>
                             <div>
                                <h3 style="font-weight: bold; font-size: 14px; margin: 0;">${instructor.user.name}</h3>
                                <div style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: #666;">
                                    <span>★ ${Number(instructor.averageRating || 5).toFixed(1)}</span>
                                    <span>(${instructor.totalLessons} aulas)</span>
                                </div>
                             </div>
                        </div>
                        <div style="border-top: 1px solid #eee; padding-top: 8px; display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-weight: bold; color: #006FEE;">${price}/h</span>
                            <a href="/instructors/${instructor.id}" style="background: black; color: white; text-decoration: none; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 500;">Ver Perfil</a>
                        </div>
                    </div>
                `);

            // Adicionar ao mapa
            const marker = new mapboxgl.Marker(el)
                .setLngLat([instructor.longitude, instructor.latitude])
                .setPopup(popup)
                .addTo(map.current!);

            markersRef.current.push(marker);
        });

    }, [instructors, hasToken]);

    if (!hasToken) {
        return (
            <div className={`${className} flex items-center justify-center bg-muted rounded-lg border`}>
                <div className="text-center p-6 max-w-sm">
                    <MapPinIcon className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">
                        Configure <code>NEXT_PUBLIC_MAPBOX_TOKEN</code> no .env
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${className} relative rounded-lg overflow-hidden border`}>
            {/* Map Container */}
            <div ref={mapContainer} className="w-full h-full" />
        </div>
    );
}
