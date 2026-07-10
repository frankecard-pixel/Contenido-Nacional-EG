import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Search } from 'lucide-react';

interface LocationPickerProps {
  lat?: number;
  lng?: number;
  address: string;
  onChange: (data: { lat: number; lng: number; address: string; city: string }) => void;
}

const CITIES = [
  { name: 'Malabo', label: 'Malabo (Bioko Norte)', coords: [3.75, 8.78] as [number, number] },
  { name: 'Bata', label: 'Bata (Litoral)', coords: [1.86, 9.76] as [number, number] },
  { name: 'Luba', label: 'Luba (Bioko Sur)', coords: [3.45, 8.57] as [number, number] },
  { name: 'Ciudad de la Paz', label: 'Ciudad de la Paz (Wele-Nzas)', coords: [1.58, 10.82] as [number, number] },
  { name: 'Mongomo', label: 'Mongomo (Wele-Nzas)', coords: [1.63, 11.31] as [number, number] },
  { name: 'Ebebiyin', label: 'Ebebiyin (Kié-Ntem)', coords: [2.15, 11.33] as [number, number] },
  { name: 'Evinayong', label: 'Evinayong (Centro Sur)', coords: [1.44, 10.55] as [number, number] },
  { name: 'Annobón', label: 'Annobón', coords: [-1.43, 5.63] as [number, number] },
];

export const LocationPicker: React.FC<LocationPickerProps> = ({
  lat = 3.75,
  lng = 8.78,
  address,
  onChange,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markerInstance = useRef<L.Marker | null>(null);
  const [selectedCity, setSelectedCity] = useState('Malabo');
  const [streetAddress, setStreetAddress] = useState('');

  // Sync city selection and update coordinates/address
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    setSelectedCity(cityName);
    const city = CITIES.find(c => c.name === cityName);
    if (city) {
      const [newLat, newLng] = city.coords;
      const completeAddress = streetAddress 
        ? `${streetAddress}, ${city.label}` 
        : city.label;
      
      onChange({ lat: newLat, lng: newLng, address: completeAddress, city: cityName });
      
      if (mapInstance.current) {
        mapInstance.current.flyTo(city.coords, 13);
        if (markerInstance.current) {
          markerInstance.current.setLatLng(city.coords);
        }
      }
    }
  };

  // Sync street address text box changes
  const handleStreetAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setStreetAddress(val);
    const city = CITIES.find(c => c.name === selectedCity);
    const suffix = city ? city.label : selectedCity;
    const completeAddress = val ? `${val}, ${suffix}` : suffix;
    
    onChange({ lat, lng, address: completeAddress, city: selectedCity });
  };

  // Initialize Map
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView([lat, lng], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(mapInstance.current);

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: "<div style='background-color:#1e40af; width:24px; height:24px; border-radius:50%; border:4px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); display:flex; align-items:center; justify-content:center;'><div style='background-color:#ffffff; width:6px; height:6px; border-radius:50%;'></div></div>"
      });

      markerInstance.current = L.marker([lat, lng], {
        icon: customIcon,
        draggable: true
      }).addTo(mapInstance.current);

      // Listen to marker drag events
      markerInstance.current.on('dragend', () => {
        if (markerInstance.current) {
          const position = markerInstance.current.getLatLng();
          const city = CITIES.find(c => c.name === selectedCity);
          const suffix = city ? city.label : selectedCity;
          const completeAddress = streetAddress ? `${streetAddress}, ${suffix}` : suffix;
          onChange({
            lat: Number(position.lat.toFixed(6)),
            lng: Number(position.lng.toFixed(6)),
            address: completeAddress,
            city: selectedCity
          });
        }
      });

      // Listen to map click events to place pin
      mapInstance.current.on('click', (e: L.LeafletMouseEvent) => {
        if (markerInstance.current) {
          markerInstance.current.setLatLng(e.latlng);
          const city = CITIES.find(c => c.name === selectedCity);
          const suffix = city ? city.label : selectedCity;
          const completeAddress = streetAddress ? `${streetAddress}, ${suffix}` : suffix;
          onChange({
            lat: Number(e.latlng.lat.toFixed(6)),
            lng: Number(e.latlng.lng.toFixed(6)),
            address: completeAddress,
            city: selectedCity
          });
        }
      });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Sede Principal (Ciudad / Provincia)</label>
          <div className="relative group">
            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <select
              value={selectedCity}
              onChange={handleCityChange}
              className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white appearance-none outline-none"
            >
              {CITIES.map(c => (
                <option key={c.name} value={c.name}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Dirección de la Sede (Calle, Edificio, Oficina)</label>
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              value={streetAddress}
              onChange={handleStreetAddressChange}
              required
              placeholder="Calle de la Independencia, Edif. Ministerial"
              className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center px-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Geolocalización Sede (Mapa Interactivo)</label>
          <span className="text-[9px] font-bold text-slate-400 uppercase">
            Lat: {lat} • Lng: {lng}
          </span>
        </div>
        <div className="border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm relative">
          <div ref={mapRef} className="w-full h-64 z-0" />
          <div className="absolute bottom-4 left-4 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-xl text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider pointer-events-none shadow-md">
            📍 Arrastre el pin o haga clic para ajustar la ubicación
          </div>
        </div>
      </div>
    </div>
  );
};
