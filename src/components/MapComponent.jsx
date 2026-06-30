import React from "react";
import { Layers, LocateFixed, MapPin, Minus, Plus } from "lucide-react";
import "./MapComponent.css";

const markerClassMap = {
  IN_STOCK: "marker-green",
  LOW_STOCK: "marker-orange",
  OUT_OF_STOCK: "marker-red",
};

function getMarkerClass(pharmacy) {
  if (pharmacy.isStale) return "marker-gray";
  return markerClassMap[pharmacy.availabilityStatus] || "marker-red";
}

export default function MapComponent({ pharmacies, selectedPharmacy, onSelectPharmacy }) {
  return (
    <section className="map-component" aria-label="خريطة الصيدليات">
      <div className="map-tabs">
        <button type="button" className="tab-button active">
          خريطة
          <Layers size={17} />
        </button>
        <button type="button" className="tab-button">
          قائمة
        </button>
      </div>

      <div className="google-map-box">
        <iframe
          title="Google Map Gaza"
          src="https://www.google.com/maps?q=Gaza%20City%20Palestine&hl=ar&z=13&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

        <div className="zoom-controls" aria-hidden="true">
          <button type="button"><Plus size={18} /></button>
          <button type="button"><Minus size={18} /></button>
        </div>

        {pharmacies.map((pharmacy) => {
          const isSelected = selectedPharmacy?.id === pharmacy.id;

          return (
            <button
              type="button"
              key={pharmacy.id}
              className={`map-marker ${getMarkerClass(pharmacy)} ${isSelected ? "active" : ""}`}
              style={{ left: `${pharmacy.mapPosition.x}%`, top: `${pharmacy.mapPosition.y}%` }}
              onClick={() => onSelectPharmacy(pharmacy)}
              aria-label={`عرض ${pharmacy.pharmacyName} على الخريطة`}
            >
              <MapPin size={38} fill="currentColor" />
              <span>{pharmacy.neighborhood}</span>
            </button>
          );
        })}

        <button type="button" className="my-location-btn">
          موقعي
          <LocateFixed size={17} />
        </button>
      </div>
    </section>
  );
}
