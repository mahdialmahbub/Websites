// components/PropertyMap.jsx
"use client";

import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // <-- এটা মিসিং ছিল, এজন্য ম্যাপ দেখাচ্ছিল না

// কাস্টম পিন আইকন — leaflet-এর ডিফল্ট মার্কার ইমেজ bundler-এ প্রায়ই ভাঙে,
// তাই SVG দিয়ে নিজেরাই একটা পিন বানাচ্ছি (সিলেক্টেড হলে রঙ বদলাবে)
function createPinIcon(isSelected) {
  const color = isSelected ? "#0D9488" : "#334155"; // teal-600 vs slate-700
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
    className: "", // ডিফল্ট leaflet ক্লাস বাদ (নাহলে সাদা বক্স দেখাবে)
    iconSize: [size, size],
    iconAnchor: [size / 2, size], // পিনের ডগা ঠিক কো-অর্ডিনেটে বসবে
    popupAnchor: [0, -size],
  });
}

// mount হওয়ার পর container-এর আসল সাইজ ধরে Leaflet-কে রিক্যালকুলেট করতে বাধ্য করা
// (dynamic/ssr:false লোডে কখনো কখনো Leaflet 0x0 সাইজ ধরে ফেলে)
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

// সব প্রপার্টি ভিউতে আনার জন্য bounds ফিট করা (properties বদলালে রি-রান হবে)
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

// সিলেক্টেড প্রপার্টি বদলালে ম্যাপ smoothly সেই মার্কারে fly করবে
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

export default function PropertyMap({ properties, selectedId, onSelect }) {
  const list = properties?.filter((p) => p.lat && p.lng) ?? [];
  // প্রথমবার map center/zoom (bounds fit হয়ে গেলে এটা আর ম্যাটার করে না)
  const initialCenter = list[0] ? [list[0].lat, list[0].lng] : [23.8103, 90.4125]; // Dhaka fallback
  const mapRef = useRef(null);

  if (list.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        ম্যাপে দেখানোর মতো কোনো প্রপার্টি নেই
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
    </MapContainer>
  );
}
