import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  MapPin, 
  Calendar, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  X, 
  Star, 
  ShieldCheck, 
  Briefcase,
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { OpportunityExt } from '../../../types';

interface OpportunitiesDashboardViewProps {
  filteredOpps: OpportunityExt[];
  selectedOpp: OpportunityExt;
  selectedOppId: string | null;
  setSelectedOppId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  showSavedOnly: boolean;
  setShowSavedOnly: (show: boolean) => void;
  categories: string[];
  getOperatorLogo: (id: string) => string;
  getTranslatedText: (obj: any) => string;
}

const OpportunitiesDashboardView: React.FC<OpportunitiesDashboardViewProps> = ({
  filteredOpps,
  selectedOpp,
  selectedOppId,
  setSelectedOppId,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  showSavedOnly,
  setShowSavedOnly,
  categories,
  getOperatorLogo,
  getTranslatedText
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GQ', { 
      style: 'currency', 
      currency: 'XAF',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const handleSelectOpp = (id: string) => {
    setSelectedOppId(id);
    setMobileDetailOpen(true);
  };

  if (!selectedOpp && filteredOpps.length > 0) {
    setSelectedOppId(filteredOpps[0].id);
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-slate-50 dark:bg-slate-950 flex flex-col pt-16 lg:pt-20">
      {/* Barra Superior del Explorador de Licitaciones */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-4 sticky top-16 lg:top-20 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider">
                Panel Homologado
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Explorador de Licitaciones
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              {filteredOpps.length} licitaciones oficiales activas compatibles con su RUGE
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Input de Búsqueda */}
            <div className="relative flex-1 md:w-72">
              <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar por título o ref..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400" 
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Botón Filtros en Móvil/Tablet */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0"
            >
              <Filter className="size-4 text-blue-600" />
              <span>Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Contenedor Principal: Filtros + Lista + Detalle */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex gap-6">
        {/* 1. Barra Lateral de Filtros (Desktop) */}
        <aside className="w-64 flex-none hidden lg:flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <Filter className="size-4 text-blue-600" />
                Filtros Activos
              </h3>
              {(activeCategory !== 'all' || showSavedOnly) && (
                <button 
                  onClick={() => { setActiveCategory('all'); setShowSavedOnly(false); }}
                  className="text-[10px] font-bold text-blue-600 hover:underline uppercase"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Categorías */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                Categorías Técnicas
              </label>
              <div className="space-y-1.5">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(isActive && cat !== 'all' ? 'all' : cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="truncate">{cat === 'all' ? 'Todas las Categorías' : cat}</span>
                      {isActive && <CheckCircle2 className="size-3.5 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toggle Favoritos */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Star className={`size-4 ${showSavedOnly ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
                  Solo Guardadas
                </span>
                <input 
                  type="checkbox" 
                  checked={showSavedOnly} 
                  onChange={(e) => setShowSavedOnly(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600 relative"></div>
              </label>
            </div>
          </div>

          {/* Banner de Homologación */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-md border border-blue-800">
            <div className="flex items-center gap-2 text-yellow-400 text-[10px] font-black uppercase tracking-wider mb-2">
              <ShieldCheck className="size-4" />
              RUGE Verificado
            </div>
            <h4 className="text-xs font-black uppercase mb-1">Perfil Listo para Postular</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              Su certificado de Contenido Nacional está vigente para el ejercicio 2026.
            </p>
          </div>
        </aside>

        {/* 2. Lista Central de Licitaciones */}
        <section className="flex-1 min-w-0 space-y-4">
          {filteredOpps.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Briefcase className="size-12 text-slate-400 mx-auto mb-3" />
              <h4 className="text-sm font-black uppercase text-slate-800 dark:text-slate-200 mb-1">
                No se encontraron licitaciones
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pruebe a restablecer los filtros o el término de búsqueda.
              </p>
            </div>
          ) : (
            filteredOpps.map((opp) => {
              const isSelected = selectedOpp?.id === opp.id;
              return (
                <div
                  key={opp.id}
                  onClick={() => handleSelectOpp(opp.id)}
                  className={`p-5 sm:p-6 rounded-3xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="size-12 sm:size-14 rounded-2xl bg-white dark:bg-slate-800 p-2 border border-slate-100 dark:border-slate-700 shrink-0 flex items-center justify-center shadow-xs">
                        <img 
                          src={getOperatorLogo(opp.petroleraId)} 
                          alt="Operator" 
                          className="w-full h-full object-contain" 
                        />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-black uppercase tracking-wider">
                            {opp.status || 'Publicado'}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-bold uppercase">
                            {opp.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 uppercase ml-auto sm:ml-0">
                            {opp.ref || opp.id.toUpperCase()}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight leading-snug">
                          {getTranslatedText(opp.title)}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-blue-600" />
                            {opp.location}
                          </span>
                          <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                            <Calendar className="size-3.5" />
                            Cierre: {opp.deadline}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Badge de Compatibilidad y Botón Detalle */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 shrink-0">
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="text-xs font-black text-blue-600 dark:text-blue-400">94% Compatible</div>
                          <div className="text-[9px] text-slate-400 uppercase font-bold">Norma CN 2014</div>
                        </div>
                        <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-black">
                          94
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-blue-600 sm:hidden">Ver Ficha</span>
                        <ChevronRight className="size-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {/* 3. Panel de Detalle Rápido (Desktop XL) */}
        {selectedOpp && (
          <aside className="w-80 xl:w-96 flex-none hidden xl:flex flex-col gap-6 sticky top-40 h-fit">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <div className="flex items-start gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="size-14 rounded-2xl bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700 shrink-0 flex items-center justify-center">
                  <img src={getOperatorLogo(selectedOpp.petroleraId)} className="w-full h-full object-contain" alt="Operator" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                    {selectedOpp.ref || selectedOpp.id.toUpperCase()}
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight leading-snug">
                    {getTranslatedText(selectedOpp.title)}
                  </h3>
                </div>
              </div>

              {/* Tarjeta de Análisis Legal */}
              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-xs font-black uppercase mb-1">
                  <ShieldCheck className="size-4" />
                  Homologación Aprobada
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  Su empresa cumple con los requisitos del Decreto 1/2020 para participar en esta licitación oficial.
                </p>
              </div>

              {/* Datos Clave */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-bold uppercase">Presupuesto Ref.:</span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {selectedOpp.budget ? formatCurrency(selectedOpp.budget) : 'Confidencial'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-bold uppercase">Ubicación:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedOpp.location}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 font-bold uppercase">Fecha de Cierre:</span>
                  <span className="font-black text-red-600 dark:text-red-400">{selectedOpp.deadline}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-400 font-bold uppercase">Mano de Obra Local:</span>
                  <span className="font-black text-blue-600 dark:text-blue-400">Mínimo 80%</span>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="space-y-3 pt-2">
                <Link
                  to={`/opportunity/${selectedOpp.id}`}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all text-center flex items-center justify-center gap-2"
                >
                  <FileText className="size-4" />
                  <span>Ver Ficha Técnica Completa</span>
                </Link>

                <Link
                  to={`/apply/${selectedOpp.id}`}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all text-center flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Postular a la Licitación</span>
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* 4. Modal / Drawer para Detalle en Pantallas Móviles y Tablets */}
      {mobileDetailOpen && selectedOpp && (
        <div className="xl:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                {selectedOpp.ref || selectedOpp.id.toUpperCase()}
              </span>
              <button
                onClick={() => setMobileDetailOpen(false)}
                className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {getTranslatedText(selectedOpp.title)}
              </h3>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900">
                <div className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase mb-1">
                  Compatibilidad RUGE: 94%
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  Cumple con los requisitos de homologación y cuotas de contenido nacional.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 uppercase font-bold">Ubicación:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedOpp.location}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400 uppercase font-bold">Fecha Límite:</span>
                  <span className="font-black text-red-600">{selectedOpp.deadline}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 uppercase font-bold">Presupuesto:</span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {selectedOpp.budget ? formatCurrency(selectedOpp.budget) : 'Confidencial'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {getTranslatedText(selectedOpp.description)}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Link
                  to={`/opportunity/${selectedOpp.id}`}
                  className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider text-center"
                >
                  Ficha Técnica
                </Link>

                <Link
                  to={`/apply/${selectedOpp.id}`}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider text-center shadow-lg shadow-blue-600/30"
                >
                  Postular Ahora
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal de Filtros en Móvil */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full rounded-t-3xl max-h-[80vh] overflow-y-auto p-6 shadow-2xl border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-300 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Filtros de Licitación
              </h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"
              >
                <X className="size-4" />
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                Categorías Técnicas
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(isActive && cat !== 'all' ? 'all' : cat)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {cat === 'all' ? 'Todas' : cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-blue-600 text-white font-black py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30"
              >
                Aplicar Filtros ({filteredOpps.length} Licitaciones)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunitiesDashboardView;
