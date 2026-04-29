"use client";

// CafeMap is always imported with `next/dynamic` + `ssr: false` from the
// coffee page. That means this file only ever runs in the browser, so the
// top-level `import L from "leaflet"` is safe — no window-is-not-defined errors.

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Cafe } from "@/lib/queries";

type CafePin = Pick<Cafe, "_id" | "name" | "slug" | "city" | "rating" | "latitude" | "longitude">;

// ─── Tile layer ───────────────────────────────────────────────────────────────
// CartoDB Voyager: clean, minimal, editorial — no API key needed.
const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// ─── Custom SVG pin ───────────────────────────────────────────────────────────
function makePinIcon() {
  return L.divIcon({
    // Teardrop shape in roast brown with a cream centre dot
    html: `<svg width="26" height="34" viewBox="0 0 26 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 0C5.82 0 0 5.82 0 13c0 8.667 13 21 13 21S26 21.667 26 13C26 5.82 20.18 0 13 0z" fill="#9B7B5C"/>
      <circle cx="13" cy="13" r="5" fill="#F9F6F0"/>
    </svg>`,
    className: "",      // suppress Leaflet's default white box
    iconSize: [26, 34],
    iconAnchor: [13, 34],  // tip of the teardrop
    popupAnchor: [0, -36], // open popup above the pin
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CafeMap({ cafes }: { cafes: CafePin[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Guard: container must exist and map must not already be initialised
    if (!containerRef.current || mapRef.current) return;

    // Only plot cafés that have both coordinates
    const pins = cafes.filter(
      (c): c is CafePin & { latitude: number; longitude: number } =>
        c.latitude != null && c.longitude != null
    );
    if (pins.length === 0) return;

    // ── Initialise map ──────────────────────────────────────────────────────
    const map = L.map(containerRef.current, {
      scrollWheelZoom: false, // don't hijack page scroll
      zoomControl: true,
    });

    L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: 19 }).addTo(map);

    const icon = makePinIcon();

    // ── Add markers ─────────────────────────────────────────────────────────
    pins.forEach((cafe) => {
      const filled = "★".repeat(cafe.rating);
      const empty  = "☆".repeat(5 - cafe.rating);

      const popup = L.popup({ className: "fwf-popup", maxWidth: 220 }).setContent(`
        <div class="fwf-popup-inner">
          <p class="fwf-popup-city">${cafe.city}</p>
          <a href="/coffee/${cafe.slug.current}" class="fwf-popup-name">${cafe.name}</a>
          <p class="fwf-popup-stars" aria-label="${cafe.rating} out of 5">${filled}${empty}</p>
          <a href="/coffee/${cafe.slug.current}" class="fwf-popup-cta">Read review →</a>
        </div>
      `);

      L.marker([cafe.latitude, cafe.longitude], { icon })
        .bindPopup(popup)
        .addTo(map);
    });

    // ── Fit viewport to all pins ─────────────────────────────────────────────
    if (pins.length === 1) {
      map.setView([pins[0].latitude, pins[0].longitude], 14);
    } else {
      const bounds = L.latLngBounds(pins.map((c) => [c.latitude, c.longitude]));
      map.fitBounds(bounds, { padding: [48, 48] });
    }

    mapRef.current = map;

    // ── Cleanup on unmount ───────────────────────────────────────────────────
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [cafes]);

  return (
    <>
      {/* ── Custom styles ─────────────────────────────────────────────────── */}
      {/* Scoped to .fwf-popup so we never clash with Leaflet's global CSS    */}
      <style>{`
        /* Popup shell */
        .fwf-popup .leaflet-popup-content-wrapper {
          background: #F9F6F0;
          border: 1px solid #E8DDD0;
          border-radius: 2px;
          box-shadow: 0 6px 24px rgba(42, 31, 20, 0.10);
          padding: 0;
        }
        .fwf-popup .leaflet-popup-content {
          margin: 0;
          line-height: 1;
        }
        .fwf-popup .leaflet-popup-tip-container {
          margin-top: -1px;
        }
        .fwf-popup .leaflet-popup-tip {
          background: #F9F6F0;
          box-shadow: none;
        }
        .fwf-popup .leaflet-popup-close-button {
          color: #A8A29E !important;
          font-size: 18px !important;
          top: 8px !important;
          right: 10px !important;
        }
        .fwf-popup .leaflet-popup-close-button:hover {
          color: #2A1F14 !important;
        }

        /* Popup content */
        .fwf-popup-inner {
          padding: 16px 18px 14px;
          font-family: var(--font-inter, system-ui, sans-serif);
        }
        .fwf-popup-city {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9B7B5C;
          margin: 0 0 5px;
        }
        .fwf-popup-name {
          display: block;
          font-family: var(--font-playfair, Georgia, serif);
          font-size: 17px;
          color: #2A1F14;
          text-decoration: none;
          line-height: 1.25;
          margin-bottom: 6px;
        }
        .fwf-popup-name:hover { color: #9B7B5C; }
        .fwf-popup-stars {
          font-size: 12px;
          color: #9B7B5C;
          letter-spacing: 0.05em;
          margin: 0 0 12px;
        }
        .fwf-popup-cta {
          font-size: 11px;
          color: #2A1F14;
          text-decoration: none;
          border-bottom: 1px solid currentColor;
          padding-bottom: 1px;
        }
        .fwf-popup-cta:hover { color: #9B7B5C; }

        /* Zoom controls */
        .leaflet-control-zoom {
          border: 1px solid #E8DDD0 !important;
          box-shadow: none !important;
        }
        .leaflet-control-zoom a {
          background: #F9F6F0 !important;
          color: #5C4A35 !important;
          border-bottom-color: #E8DDD0 !important;
        }
        .leaflet-control-zoom a:hover {
          background: #EDE8DF !important;
        }
      `}</style>

      {/* ── Map container ─────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="w-full rounded-sm overflow-hidden"
        style={{ height: 420 }}
        aria-label="Map of visited coffee shops"
      />
    </>
  );
}
