"use client";

import { useEffect, useRef } from "react";

function dealerPinIcon(L, selected) {
  const color = selected ? "#c41e24" : "#ed1c24";
  const size = selected ? 28 : 24;
  return L.divIcon({
    className: "avalon-dealer-pin",
    html: `<span style="
      display:block;width:${size}px;height:${size}px;
      background:${color};border:2px solid #fff;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.25);
    "></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

/**
 * OpenStreetMap dealer locator (Leaflet). Pins use lat/lng from dealer records.
 */
export default function DealerMap({
  dealers,
  selectedId,
  onSelectDealer,
  className = "",
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let map;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !containerRef.current) return;

      const withCoords = dealers.filter((d) => d.lat != null && d.lng != null);
      const center =
        withCoords.length > 0
          ? [
              withCoords.reduce((s, d) => s + d.lat, 0) / withCoords.length,
              withCoords.reduce((s, d) => s + d.lng, 0) / withCoords.length,
            ]
          : [12.5, 78.5];

      map = L.map(containerRef.current, {
        center,
        zoom: 7,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersRef.current = {};
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- map init once
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = () => {
      if (cancelled || !mapRef.current) return;

      import("leaflet").then(({ default: L }) => {
        if (cancelled || !mapRef.current) return;
        const map = mapRef.current;
        const withCoords = dealers.filter((d) => d.lat != null && d.lng != null);
        syncMarkers(L, map, withCoords, selectedId, markersRef, onSelectDealer);

        if (withCoords.length === 0) return;

        if (selectedId) {
          const dealer = withCoords.find((d) => d.id === selectedId);
          if (dealer) {
            map.setView([dealer.lat, dealer.lng], Math.max(map.getZoom(), 12), {
              animate: true,
            });
            markersRef.current[selectedId]?.openPopup();
            return;
          }
        }

        if (withCoords.length > 1) {
          const bounds = L.latLngBounds(withCoords.map((d) => [d.lat, d.lng]));
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 });
        } else {
          map.setView([withCoords[0].lat, withCoords[0].lng], 12);
        }
      });
    };

    run();
    const t = window.setTimeout(run, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [dealers, selectedId, onSelectDealer]);

  return (
    <div
      ref={containerRef}
      className={`z-0 h-full min-h-[280px] w-full bg-[#e8ecef] ${className}`}
      aria-label="Map showing Avalon dealer locations"
    />
  );
}

function syncMarkers(L, map, dealers, selectedId, markersRef, onSelectDealer) {
  Object.values(markersRef.current).forEach((m) => m.remove());
  markersRef.current = {};

  dealers.forEach((dealer) => {
    const marker = L.marker([dealer.lat, dealer.lng], {
      icon: dealerPinIcon(L, dealer.id === selectedId),
    }).addTo(map);

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dealer.address)}`;
    marker.bindPopup(
      `<div style="min-width:200px;font-family:system-ui,sans-serif;font-size:13px;line-height:1.4">
        <strong style="display:block;margin-bottom:4px;color:#111">${dealer.name}</strong>
        <span style="color:#555">${dealer.address}</span>
        <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-top:8px;color:#ed1c24;font-weight:600;text-decoration:none">View Details &rarr;</a>
      </div>`,
    );

    marker.on("click", () => onSelectDealer?.(dealer.id));
    markersRef.current[dealer.id] = marker;
  });
}
