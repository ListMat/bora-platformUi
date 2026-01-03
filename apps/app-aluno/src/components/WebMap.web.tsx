import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { View, StyleSheet } from 'react-native';
import L from 'leaflet';

// Fix para ícones do leaflet no webpack/next/expo
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

const customIcon = L.icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});

// Estilos globais para o mapa
const mapStyles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0, // Importante para não ficar sobre o header
    },
});

interface WebMapProps {
    userLocation: { latitude: number; longitude: number } | null;
    instructors: any[];
    onMarkerPress: (id: string) => void;
    selectedInstructorId: string | null;
}

export default function WebMap({ userLocation, instructors, onMarkerPress, selectedInstructorId }: WebMapProps) {
    // Coordenadas padrão (Brasília)
    const centerPosition = userLocation
        ? [userLocation.latitude, userLocation.longitude] as [number, number]
        : [-15.7942, -47.8822] as [number, number];

    // Verificar window para SSR
    if (typeof window === 'undefined') return null;

    return (
        <View style={mapStyles.container}>
            <style dangerouslySetInnerHTML={{
                __html: `
            .leaflet-container {
                width: 100%;
                height: 100%;
                z-index: 0;
            }
            .leaflet-bottom {
                z-index: 0;
            }
        `}} />
            <MapContainer
                center={centerPosition}
                zoom={14}
                scrollWheelZoom={true}
                style={{ width: '100%', height: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Marcador do Usuário */}
                {userLocation && (
                    <Marker
                        position={[userLocation.latitude, userLocation.longitude]}
                        icon={customIcon}
                    >
                        <Popup>
                            Você está aqui
                        </Popup>
                    </Marker>
                )}

                {/* Marcadores dos Instrutores */}
                {instructors.map((instructor) => {
                    if (!instructor.latitude || !instructor.longitude) return null;

                    return (
                        <Marker
                            key={instructor.id}
                            position={[instructor.latitude, instructor.longitude]}
                            icon={customIcon}
                            eventHandlers={{
                                click: () => onMarkerPress(instructor.id),
                            }}
                        >
                            <Popup>
                                <div style={{ minWidth: '150px' }}>
                                    <strong>{instructor.user.name}</strong><br />
                                    R$ {instructor.basePrice}/h <br />
                                    ⭐ {instructor.averageRating?.toFixed(1) || "0.0"}
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </View>
    );
}
