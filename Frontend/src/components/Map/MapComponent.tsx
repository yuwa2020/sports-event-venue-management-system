import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  markerPosition?: {
    lat: number;
    lng: number;
  };
}

const MapComponent: React.FC<MapProps> = ({ center, zoom = 15, markerPosition }) => {
  const mapStyles = {
    height: '300px',
    width: '100%',
    borderRadius: '8px',
    zIndex: 1
  };

  return (
    <MapContainer 
      center={[center.lat, center.lng] as L.LatLngExpression} 
      zoom={zoom} 
      style={mapStyles}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markerPosition && (
        <Marker position={[markerPosition.lat, markerPosition.lng] as L.LatLngExpression}>
          <Popup>
            Location
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent; 