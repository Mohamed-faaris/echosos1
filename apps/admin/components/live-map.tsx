"use client";

import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Incident = {
  _id: string;
  latitude: number;
  longitude: number;
  detected_at: string;
  beacon_id: string;
};

export default function LiveMap({ incidents }: { incidents: Incident[] }) {
  const valid = incidents.filter((incident) =>
    Number.isFinite(incident.latitude) &&
    Number.isFinite(incident.longitude) &&
    Math.abs(incident.latitude) <= 90 &&
    Math.abs(incident.longitude) <= 180
  );

  return (
    <div className="h-[360px] w-full overflow-hidden rounded-b-2xl">
      <MapContainer center={valid.length ? [valid[0].latitude, valid[0].longitude] : [20, 0]} zoom={valid.length ? 12 : 2} scrollWheelZoom className="h-full w-full">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {valid.map((incident) => (
          <CircleMarker key={incident._id} center={[incident.latitude, incident.longitude]} radius={9} pathOptions={{ color: "#f04452", fillColor: "#f04452", fillOpacity: 0.9 }}>
            <Popup>
              <strong>Active SOS</strong><br />
              Beacon: {incident.beacon_id}<br />
              Detected: {incident.detected_at}
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
