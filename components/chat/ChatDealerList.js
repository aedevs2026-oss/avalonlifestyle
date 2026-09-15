"use client";

import { MapPin, Phone } from "lucide-react";
import Link from "next/link";

export default function ChatDealerList({ dealers }) {
  if (!dealers?.length) return null;

  return (
    <ul className="aa-dealer-list">
      {dealers.map((d) => (
        <li key={d.id} className="aa-dealer-card">
          <div className="aa-dealer-card-main">
            <h4>{d.name}</h4>
            <p className="aa-dealer-loc">
              <MapPin size={14} />
              {d.city}
              {d.pincode ? ` · ${d.pincode}` : ""}
            </p>
            <p className="aa-dealer-addr">{d.address}</p>
            <span className="aa-dealer-tag">Mattresses</span>
          </div>
          <div className="aa-dealer-actions">
            {d.phone ? (
              <a href={`tel:${d.phone}`} className="aa-icon-btn" aria-label="Call dealer">
                <Phone size={18} />
              </a>
            ) : null}
            {d.mapsUrl ? (
              <a href={d.mapsUrl} target="_blank" rel="noopener noreferrer" className="aa-icon-btn" aria-label="Directions">
                <MapPin size={18} />
              </a>
            ) : (
              <Link href="/find-a-dealer" className="aa-icon-btn" aria-label="Find dealer">
                <MapPin size={18} />
              </Link>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
