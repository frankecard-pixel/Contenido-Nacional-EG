import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, Move, ZoomIn, ZoomOut, Maximize2, Compass, CheckCircle2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface TourScenario {
  id: string;
  title: string;
  location: string;
  description: string;
  imageUrl: string;
  hotspots: { x: number; y: number; label: string; details: string }[];
}

const SCENARIOS: TourScenario[] = [
  {
    id: 'school_annobon',
    title: 'Planta de Energía Solar - Annobón',
    location: 'San Antonio de Palea, Annobón',
    description: 'Instalación fotovoltaica con almacenamiento en baterías para abastecer a 5 centros educativos y de salud.',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop',
    hotspots: [
      { x: 30, y: 50, label: 'Inversores Inteligentes', details: 'Sistemas SMA que optimizan la inyección a la microrred.' },
      { x: 65, y: 45, label: 'Banco de Baterías Litio', details: 'Capacidad de respaldo de 48 horas para emergencias.' },
      { x: 50, y: 30, label: 'Paneles Monocristalinos', details: 'Rendimiento del 22% bajo condiciones de alta radiación tropical.' }
    ]
  },
  {
    id: 'health_cogo',
    title: 'Centro de Salud de Cogo',
    location: 'Cogo, Litoral',
    description: 'Ampliación técnica financiada mediante Fondos de Responsabilidad Social Corporativa de Noble Energy.',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
    hotspots: [
      { x: 25, y: 60, label: 'Área de Urgencias', details: 'Equipamiento de monitorización de constantes vitales de última generación.' },
      { x: 55, y: 40, label: 'Climatización Solar', details: 'Aire acondicionado y refrigeración de vacunas alimentado 100% por energía limpia.' }
    ]
  },
  {
    id: 'water_rebola',
    title: 'Estación Potabilizadora Rebola',
    location: 'Rebola, Bioko Norte',
    description: 'Planta de filtración y distribución de agua potable beneficiando a más de 3,500 habitantes.',
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=2070&auto=format&fit=crop',
    hotspots: [
      { x: 40, y: 55, label: 'Filtros de Gravedad Avanzados', details: 'Etapa de retención de sedimentos y purificación biológica.' },
      { x: 75, y: 65, label: 'Estación de Bombeo', details: 'Bombas de alta eficiencia que garantizan el caudal constante al municipio.' }
    ]
  }
];

const PanoramicTourViewer: React.FC = () => {
  const { t } = useTranslation();
  const [activeIdx, setActiveIdx] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Percentage pan position
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedHotspot, setSelectedHotspot] = useState<any | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentScenario = SCENARIOS[activeIdx];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    // Adjust speed based on zoom level
    const speed = 0.15 / zoom;

    setPosition((prev) => {
      // Keep x panning seamless or clamped. We clamp x and y to 0-100 for standard immersive feel
      const nextX = Math.max(10, Math.min(90, prev.x - deltaX * speed));
      const nextY = Math.max(10, Math.min(90, prev.y - deltaY * speed));
      return { x: nextX, y: nextY };
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - dragStart.x;
    const deltaY = e.touches[0].clientY - dragStart.y;
    const speed = 0.15 / zoom;

    setPosition((prev) => {
      const nextX = Math.max(10, Math.min(90, prev.x - deltaX * speed));
      const nextY = Math.max(10, Math.min(90, prev.y - deltaY * speed));
      return { x: nextX, y: nextY };
    });

    setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const resetViewer = () => {
    setPosition({ x: 50, y: 50 });
    setZoom(1);
    setSelectedHotspot(null);
    toast.success('Orientación de cámara restablecida.');
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoom((prev) => {
      if (direction === 'in') return Math.min(2.5, prev + 0.25);
      return Math.max(1, prev - 0.25);
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 lg:p-8 shadow-xl relative overflow-hidden text-white" id="tour-360-section">
      {/* Immersive Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
            <Compass size={12} className="animate-spin duration-3000" /> Immersive Tour 360° Oficial
          </span>
          <h3 className="text-xl font-black tracking-tight font-sans text-white uppercase">
            Auditoría de Obras en 360° Real Virtual
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1">
            Visualización interactiva en tiempo real y geolocalizada de proyectos sociales finalizados bajo la Ley de Contenido Nacional.
          </p>
        </div>
        
        {/* Scenario Switcher Tabs */}
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => {
                setActiveIdx(idx);
                setPosition({ x: 50, y: 50 });
                setZoom(1);
                setSelectedHotspot(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeIdx === idx
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50'
              }`}
            >
              {sc.title.split(' - ')[1] || sc.title}
            </button>
          ))}
        </div>
      </div>

      {/* Panoramic Viewer Window */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Live Stage Canvas */}
        <div className="lg:col-span-3 relative h-[380px] sm:h-[450px] bg-black rounded-2xl overflow-hidden border border-slate-800 group select-none cursor-grab active:cursor-grabbing">
          {/* Panoramic Image Container */}
          <div 
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="absolute inset-0 w-full h-full overflow-hidden transition-all duration-100 ease-out"
            style={{
              backgroundImage: `url(${currentScenario.imageUrl})`,
              backgroundSize: `${zoom * 180}% auto`,
              backgroundPosition: `${position.x}% ${position.y}%`,
              filter: 'brightness(1.05) contrast(1.02)'
            }}
          >
            {/* Interactive Hotspots overlay */}
            {currentScenario.hotspots.map((hs, i) => {
              // Convert absolute relative coordinates on background to current viewport position
              // We simulate positioning based on current panning
              const leftPos = hs.x;
              const topPos = hs.y;

              return (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedHotspot(hs);
                  }}
                  className="absolute p-2 bg-blue-600 hover:bg-emerald-500 rounded-full border-2 border-white text-white flex items-center justify-center shadow-lg hover:scale-125 transition-all group/pin animate-pulse"
                  style={{
                    left: `${leftPos}%`,
                    top: `${topPos}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  title={hs.label}
                >
                  <MapPin size={16} />
                  <span className="absolute left-full ml-2 bg-slate-900/90 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded border border-slate-700 pointer-events-none opacity-0 group-hover/pin:opacity-100 whitespace-nowrap transition-all duration-200">
                    {hs.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Compass Rose overlay */}
          <div className="absolute top-4 left-4 p-2 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center gap-2 pointer-events-none backdrop-blur-sm">
            <Compass className="text-blue-500 animate-spin" style={{ animationDuration: '8s' }} size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">Vista Activa</span>
          </div>

          {/* Controls Panel overlay */}
          <div className="absolute bottom-4 right-4 flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1.5 backdrop-blur-sm gap-1">
            <button 
              onClick={() => handleZoom('in')}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
              title="Acercar Zoom"
            >
              <ZoomIn size={16} />
            </button>
            <button 
              onClick={() => handleZoom('out')}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
              title="Alejar Zoom"
            >
              <ZoomOut size={16} />
            </button>
            <button 
              onClick={resetViewer}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
              title="Restablecer Cámara"
            >
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Drag Instruction Banner */}
          <div className="absolute bottom-4 left-4 bg-slate-950/70 border border-slate-800/80 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 pointer-events-none flex items-center gap-1.5 backdrop-blur-sm">
            <Move size={12} className="animate-bounce" />
            <span>Arrastre con el mouse para rotar vista</span>
          </div>
        </div>

        {/* Tech Specifications and Metadata Panel */}
        <div className="flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Ficha del Entorno 360°</h4>
            <h3 className="text-base font-black text-white leading-tight uppercase mb-3 font-sans">
              {currentScenario.title}
            </h3>
            <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] font-bold uppercase mb-4">
              <MapPin size={12} className="text-emerald-500" />
              <span>{currentScenario.location}</span>
            </div>
            
            <p className="text-xs text-slate-300 font-semibold leading-relaxed mb-6">
              {currentScenario.description}
            </p>

            {/* Hotspot details card */}
            {selectedHotspot ? (
              <div className="p-4 bg-blue-950/20 border border-blue-500/20 rounded-xl animate-in slide-in-from-bottom duration-300">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-blue-500/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Punto de Interés
                  </span>
                  <button 
                    onClick={() => setSelectedHotspot(null)}
                    className="text-[9px] font-black uppercase text-slate-500 hover:text-white"
                  >
                    cerrar
                  </button>
                </div>
                <h5 className="text-xs font-black text-white mb-1 uppercase">{selectedHotspot.label}</h5>
                <p className="text-[11px] text-slate-300 font-medium leading-normal">{selectedHotspot.details}</p>
              </div>
            ) : (
              <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl text-center">
                <Compass className="mx-auto text-slate-500 mb-2" size={24} />
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Inspección de Obra</p>
                <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                  Haga clic sobre los puntos azules dentro del visor para inspeccionar especificaciones de ingeniería.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Estado: Validado 100%</span>
            <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md uppercase">
              ENTREGADO
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanoramicTourViewer;
