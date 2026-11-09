
"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function createPinIcon(isSelected) {
  const color = isSelected ? "#0D9488" : "#334155";
  const size = isSelected ? 38 : 30;

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" stroke="white" stroke-width="1"
        d="M12 0C7.6 0 4 3.6 4 8c0 6 8 16 8 16s8-10 8-16c0-4.4-3.6-8-8-8z" />
      <circle cx="12" cy="8" r="3.2" fill="white" />
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

// ইউজারের বর্তমান লোকেশনের জন্য আলাদা পিন — নীল ডট, FindForm-এর বাটনের সাথে ম্যাচ করে
const userLocationIcon = L.divIcon({
  html: `
    <div style="width:22px;height:22px;border-radius:50%;background:rgba(99,147,242,0.3);display:flex;align-items:center;justify-content:center;">
      <div style="width:11px;height:11px;border-radius:50%;background:#6393F2;border:2px solid white;"></div>
    </div>
  `,
  className: "",
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

function InvalidateSizeOnMount() {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

function FitBounds({ properties }) {
  const map = useMap();

  useEffect(() => {
    if (!properties || properties.length === 0) return;

    if (properties.length === 1) {
      map.setView([properties[0].lat, properties[0].lng], 14);
      return;
    }

    const bounds = L.latLngBounds(properties.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [properties, map]);

  return null;
}

function FlyToSelected({ properties, selectedId }) {
  const map = useMap();

  useEffect(() => {
    const selected = properties.find((p) => p.id === selectedId);
    if (!selected) return;
    map.flyTo([selected.lat, selected.lng], Math.max(map.getZoom(), 13), {
      duration: 0.8,
    });
  }, [selectedId, properties, map]);

  return null;
}

// flyToLocation বদলালে ম্যাপ smoothly ইউজারের কারেন্ট লোকেশনে fly করবে
function FlyToUserLocation({ location }) {
  const map = useMap();

  useEffect(() => {
    if (!location) return;
    map.flyTo([location.lat, location.lng], 14, { duration: 1 });
  }, [location, map]);

  return null;
}

export default function PropertyMap({ properties, selectedId, onSelect, flyToLocation }) {
  const list = properties?.filter((p) => p.lat && p.lng) ?? [];
  const initialCenter = list[0] ? [list[0].lat, list[0].lng] : [23.8103, 90.4125];
  const mapRef = useRef(null);

  if (list.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        No property match
      </div>
    );
  }

  return (
    <MapContainer
      center={initialCenter}
      zoom={12}
      scrollWheelZoom
      className="min-h-[426px] w-full rounded-xl"
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds properties={list} />
      <FlyToSelected properties={list} selectedId={selectedId} />
      <FlyToUserLocation location={flyToLocation} />
      <InvalidateSizeOnMount />

      {list.map((property) => (
        <Marker
          key={property.id}
          position={[property.lat, property.lng]}
          icon={createPinIcon(property.id === selectedId)}
          eventHandlers={{
            click: () => onSelect?.(property.id),
          }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{property.name}</p>
              <p className="text-slate-500">{property.location}</p>
              <p className="mt-1 font-bold text-teal-700">
                ${property.price.toLocaleString()}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}

      {flyToLocation && (
        <Marker position={[flyToLocation.lat, flyToLocation.lng]} icon={userLocationIcon}>
          <Popup>আপনার লোকেশন</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}