// PAW TRACK — Community zone map & sighting pins (Leaflet + OpenStreetMap)

import { useEffect, useMemo, useRef, useState } from 'react';
import { MapPin, Info, Layers } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { StatusBadge } from '../common/StatusBadge.jsx';

const BENGALURU_CENTER = [12.9716, 77.5946];
const PAW_SVG =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="4" r="2"></circle><circle cx="18" cy="8" r="2"></circle><circle cx="20" cy="16" r="2"></circle><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"></path></svg>';

const esc = (value) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  );

const pinColorFor = (animal) => {
  if (['Critical Attention', 'Under Treatment'].includes(animal.health_status)) return '#DC2626';
  if (animal.vaccination_status === 'Overdue') return '#E8A64A';
  return '#174D37';
};

export function MapLocationsModule({ animals, onSelectAnimal, notify }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [activePin, setActivePin] = useState(animals[0] || null);
  const [tilesReady, setTilesReady] = useState(false);

  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const markerLayerRef = useRef(null);

  const visibleAnimals = useMemo(
    () =>
      animals.filter((a) => {
        if (statusFilter === 'All') return true;
        if (statusFilter === 'Healthy') return a.health_status === 'Healthy';
        if (statusFilter === 'Medical')
          return ['Critical Attention', 'Under Treatment'].includes(a.health_status);
        if (statusFilter === 'Overdue') return a.vaccination_status === 'Overdue';
        if (statusFilter === 'Adoption') return a.adoption_status === 'Available for Adoption';
        return true;
      }),
    [animals, statusFilter]
  );

  // Create the live map once
  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return;

    const map = L.map(mapNodeRef.current, {
      center: BENGALURU_CENTER,
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true
    });

    const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    });
    tiles.on('load', () => setTilesReady(true));
    tiles.addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    // Container is sized by layout, so re-measure once painted
    const invalidate = () => map.invalidateSize();
    const raf = requestAnimationFrame(invalidate);
    const timer = setTimeout(invalidate, 250);
    // Safety net: never leave the overlay covering the map if tiles are blocked/slow
    const readyFallback = setTimeout(() => setTilesReady(true), 4000);
    window.addEventListener('resize', invalidate);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      clearTimeout(readyFallback);
      window.removeEventListener('resize', invalidate);
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, []);

  // Re-draw markers whenever the filter or selection changes
  useEffect(() => {
    const map = mapRef.current;
    const layer = markerLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    visibleAnimals.forEach((a) => {
      if (typeof a.lat !== 'number' || typeof a.lng !== 'number') return;
      const isActive = activePin?.id === a.id;
      const color = pinColorFor(a);

      const icon = L.divIcon({
        className: '',
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        html: `<div style="transform:translate(-50%,-50%);display:flex;align-items:center;gap:6px;padding:6px 10px;border-radius:16px;background:${color};color:#fff;border:2px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.22);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:10px;font-weight:800;white-space:nowrap;${
          isActive ? 'outline:4px solid rgba(23,77,55,.3);scale:1.12;' : ''
        }">${PAW_SVG}<span>${esc(a.name)}</span></div>`
      });

      const marker = L.marker([a.lat, a.lng], {
        icon,
        title: `${a.name} · ${a.location_name}`
      });
      marker.on('click', () => setActivePin(a));
      marker.addTo(layer);
    });
  }, [visibleAnimals, activePin]);

  // Frame the visible sightings, but only when the filtered set itself changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const latLngs = visibleAnimals
      .filter((a) => typeof a.lat === 'number' && typeof a.lng === 'number')
      .map((a) => [a.lat, a.lng]);

    if (latLngs.length > 1) {
      map.fitBounds(latLngs, { padding: [60, 60], maxZoom: 14 });
    } else if (latLngs.length === 1) {
      map.setView(latLngs[0], 14);
    }
  }, [visibleAnimals]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-5 border border-[#A5B99A]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-[#26332B]">
            Community Zone Map & Last Recorded Sightings
          </h2>
          <p className="text-xs text-[#5C6B62] flex items-center gap-1.5 mt-0.5">
            <Info className="w-3.5 h-3.5 text-[#174D37]" />
            Displays verified last-recorded check-in locations (not continuous GPS collar telemetry).
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: 'All', label: 'All Markers' },
            { id: 'Healthy', label: 'Healthy' },
            { id: 'Medical', label: 'Medical Care' },
            { id: 'Overdue', label: 'Vax Overdue' },
            { id: 'Adoption', label: 'Adoptable' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === f.id
                  ? 'bg-[#174D37] text-white'
                  : 'bg-[#FAF8F1] text-[#26332B] border border-[#A5B99A]/40'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* LIVE MAP CANVAS — OpenStreetMap tiles */}
        <div className="lg:col-span-8 bg-[#E8EFE5] rounded-3xl border-2 border-[#A5B99A]/50 relative h-[460px] overflow-hidden shadow-inner">
          <div ref={mapNodeRef} className="w-full h-full" />

          {!tilesReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#E8EFE5] pointer-events-none">
              <div className="flex items-center gap-2 text-xs font-bold text-[#5C6B62]">
                <Layers className="w-4 h-4 text-[#174D37] animate-pulse" />
                Loading live OpenStreetMap tiles…
              </div>
            </div>
          )}

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 z-[800] bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-[#A5B99A]/50 text-[11px] font-bold space-y-1.5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#174D37]" /> Healthy / Verified
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#E8A64A]" /> Vaccination Overdue
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#DC2626]" /> Medical Attention Required
            </div>
            <div className="pt-1 mt-1 border-t border-[#A5B99A]/40 text-[10px] text-[#5C6B62]">
              {visibleAnimals.length} of {animals.length} markers shown
            </div>
          </div>
        </div>

        {/* SELECTED PIN INSPECTOR */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#A5B99A]/40 shadow-sm flex flex-col justify-between">
          {activePin ? (
            <div className="space-y-4">
              <img
                src={activePin.photos[0]}
                alt={activePin.name}
                className="w-full h-44 rounded-2xl object-cover"
              />
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-[#174D37]">
                    {activePin.animal_code}
                  </span>
                  <StatusBadge value={activePin.health_status} />
                </div>
                <h3 className="text-xl font-extrabold text-[#26332B] mt-1">{activePin.name}</h3>
                <p className="text-xs text-[#5C6B62] flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E8A64A]" />
                  {activePin.location_name}
                </p>
                <p className="text-[11px] font-mono text-[#5C6B62] mt-1">
                  Last Recorded GPS: {activePin.lat}° N, {activePin.lng}° E
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <StatusBadge value={activePin.vaccination_status} />
                <StatusBadge value={activePin.behaviour_status} />
              </div>

              <button
                onClick={() => onSelectAnimal(activePin.id)}
                className="w-full py-3 rounded-xl bg-[#174D37] text-white text-xs font-bold hover:bg-[#226B4D]"
              >
                Inspect Complete Digital Profile
              </button>
            </div>
          ) : (
            <p className="text-sm text-[#5C6B62]">Click any map marker to inspect animal details.</p>
          )}
        </div>
      </div>
    </div>
  );
}
