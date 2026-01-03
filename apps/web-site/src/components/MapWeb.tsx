'use client';

import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

// Declaração de tipo para window.google
declare global {
    interface Window {
        google: typeof google;
    }
}

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const defaultCenter = {
    lat: -15.7801,
    lng: -47.9292,
};

// Estilo customizado estilo Airbnb
const mapStyles = [
    {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#e0e0e0' }],
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#c9e6f2' }],
    },
];

const options = {
    disableDefaultUI: true,
    gestureHandling: 'greedy',
    styles: mapStyles,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
};

interface Instructor {
    id: string;
    name: string;
    photo: string;
    rating: number;
    price: number;
    lat: number;
    lng: number;
    vehicle?: string;
}

interface MapWebProps {
    instructors: Instructor[];
    onMarkerClick: (instructor: Instructor) => void;
    selectedInstructor: Instructor | null;
}

export default function MapWeb({ instructors, onMarkerClick, selectedInstructor }: MapWebProps) {
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [center, setCenter] = useState(defaultCenter);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    // Pegar localização do usuário
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCenter({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.warn('Geolocation error:', error);
                }
            );
        }
    }, []);

    // Auto-fit bounds quando instrutores mudarem
    useEffect(() => {
        if (map && instructors.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            instructors.forEach((instructor) => {
                bounds.extend({ lat: instructor.lat, lng: instructor.lng });
            });
            map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
        }
    }, [map, instructors]);

    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, []);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    return (
        <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={14}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={options}
            >
                {instructors.map((instructor) => {
                    // Verificar se google maps está carregado
                    if (typeof window === 'undefined' || !window.google) {
                        return null;
                    }

                    return (
                        <Marker
                            key={instructor.id}
                            position={{ lat: instructor.lat, lng: instructor.lng }}
                            onClick={() => onMarkerClick(instructor)}
                            onMouseOver={() => setHoveredId(instructor.id)}
                            onMouseOut={() => setHoveredId(null)}
                            icon={{
                                url: instructor.photo,
                                scaledSize: new window.google.maps.Size(50, 50),
                                anchor: new window.google.maps.Point(25, 25),
                            }}
                        >
                            {(hoveredId === instructor.id || selectedInstructor?.id === instructor.id) && (
                                <InfoWindow
                                    position={{ lat: instructor.lat, lng: instructor.lng }}
                                    onCloseClick={() => setHoveredId(null)}
                                >
                                    <div className="p-2 min-w-[150px]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Image
                                                src={instructor.photo}
                                                alt={instructor.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                                suppressHydrationWarning
                                            />
                                            <div>
                                                <p className="font-semibold text-sm">{instructor.name}</p>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-yellow-500">⭐</span>
                                                    <span className="text-xs font-medium">{instructor.rating.toFixed(1)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-lg font-bold text-blue-600">
                                            R$ {instructor.price.toFixed(2)}/h
                                        </p>
                                        {instructor.vehicle && (
                                            <p className="text-xs text-gray-600 mt-1">{instructor.vehicle}</p>
                                        )}
                                    </div>
                                </InfoWindow>
                            )}
                        </Marker>
                    );
                })}
            </GoogleMap>
        </LoadScript>
    );
}
