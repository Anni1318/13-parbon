'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Props {
  lat: number;
  lng: number;
  name: string;
}

export default function LeafletMiniMap({ lat, lng, name }: Props) {
  const safeLat = typeof lat === 'number' && !isNaN(lat) && lat !== 0 ? lat : 22.5726;
  const safeLng = typeof lng === 'number' && !isNaN(lng) && lng !== 0 ? lng : 88.3639;

  return (
    <MapContainer
      center={[safeLat, safeLng]}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[safeLat, safeLng]} icon={icon}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  );
}
