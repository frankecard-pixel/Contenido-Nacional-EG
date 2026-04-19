
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type: 'company' | 'training' | 'project' | 'hub';
}

interface InteractiveMapProps {
  points: MapPoint[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ points, center = [2.5, 9.0], zoom = 7, height = "500px" }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  // Inicialización única del mapa
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const validCenter = (Array.isArray(center) && center.length === 2 && typeof center[0] === 'number' && typeof center[1] === 'number' && !isNaN(center[0]) && !isNaN(center[1])) 
        ? center 
        : [2.5, 9.0] as [number, number];

      mapInstance.current = L.map(mapRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView(validCenter, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance.current);

      markersLayer.current = L.layerGroup().addTo(mapInstance.current);
    }

    // Cleanup al desmontar
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Actualización de marcadores sin destruir el mapa
  useEffect(() => {
    if (mapInstance.current && markersLayer.current) {
      markersLayer.current.clearLayers();

      const icons: any = {
        company: L.divIcon({ className: 'custom-div-icon', html: "<div style='background-color:#1e40af; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);'></div>" }),
        training: L.divIcon({ className: 'custom-div-icon', html: "<div style='background-color:#059669; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);'></div>" }),
        project: L.divIcon({ className: 'custom-div-icon', html: "<div style='background-color:#d97706; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);'></div>" }),
        hub: L.divIcon({ className: 'custom-div-icon', html: "<div style='background-color:#dc2626; width:24px; height:24px; border-radius:50%; border:4px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);'></div>" }),
      };

      points.forEach(point => {
        if (typeof point.lat !== 'number' || typeof point.lng !== 'number' || isNaN(point.lat) || isNaN(point.lng)) {
          console.warn(`InteractiveMap: Skipping point with invalid coordinates`, point);
          return;
        }
        L.marker([point.lat, point.lng], { icon: icons[point.type] || icons.company })
          .addTo(markersLayer.current!)
          .bindPopup(`
            <div class="p-2">
              <p class="font-black text-slate-900 uppercase text-[10px] tracking-widest">${point.type}</p>
              <h4 class="font-bold text-sm mt-1">${point.title}</h4>
            </div>
          `);
      });
    }
  }, [points]);

  return (
    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white relative group">
      <div ref={mapRef} style={{ height }} className="w-full z-0" />
      <div className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-100 shadow-xl pointer-events-none">
         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Leyenda</p>
         <div className="space-y-2">
            <div className="flex items-center space-x-2">
               <div className="w-3 h-3 rounded-full bg-blue-700"></div>
               <span className="text-[10px] font-bold text-slate-700">Empresas</span>
            </div>
            <div className="flex items-center space-x-2">
               <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
               <span className="text-[10px] font-bold text-slate-700">Formación</span>
            </div>
            <div className="flex items-center space-x-2">
               <div className="w-3 h-3 rounded-full bg-amber-600"></div>
               <span className="text-[10px] font-bold text-slate-700">Social</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
