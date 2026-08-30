import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Lock, 
  ShieldCheck, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Info,
  SlidersHorizontal,
  Briefcase
} from 'lucide-react';
import { OpportunityExt } from '../../../types';
import PublicBanner from '../../public/PublicBanner';
import MinisterialCertification from '../../public/MinisterialCertification';

interface OpportunitiesPublicViewProps {
  filteredOpps: OpportunityExt[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory?: string;
  setActiveCategory: (category: string) => void;
  getTranslatedText: (obj: any) => string;
  onRequireAuth: () => void;
}

const CATEGORIES_LIST = [
  'all',
  'Mantenimiento',
  'Logística',
  'Ingeniería',
  'Catering',
  'Seguridad',
  'Suministros',
  'Tecnología'
];

const OpportunitiesPublicView: React.FC<OpportunitiesPublicViewProps> = ({
  filteredOpps,
  searchQuery,
  setSearchQuery,
  activeCategory = 'all',
  setActiveCategory,
  getTranslatedText,
  onRequireAuth
}) => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-32 animate-in fade-in duration-700">
      <PublicBanner 
        title="Oportunidades de Licitación" 
        subtitle="Convocatorias públicas y licitaciones oficiales del sector hidrocarburos y minería de Guinea Ecuatorial."
        category="Licitaciones"
        image="https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop"
        pageKey="opportunities"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-30 -mt-12 sm:-mt-16 mb-10">
        <MinisterialCertification />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Institucional de Advertencia de Acceso Restringido */}
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-blue-950 text-white border border-blue-800/80 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="size-11 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
              <Lock className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300">
                  Portal Público de Consulta
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-200 text-[9px] font-black uppercase">
                  MMIE Oficial
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 leading-relaxed">
                El acceso a las <strong className="text-white">Fichas Técnicas Oficiales</strong>, pliegos de condiciones y postulación directa está reservado a empresas registradas en el <strong>RUGE</strong>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Link
              to="/login"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-all text-center"
            >
              Identificarse
            </Link>
            <Link
              to="/register"
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-black uppercase tracking-wider transition-all text-center"
            >
              Registrarse
            </Link>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros Responsivos */}
        <div className="mb-10 rounded-3xl bg-white dark:bg-[#1a2332] p-5 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Input de Búsqueda */}
            <div className="md:col-span-8 relative">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Buscar por palabra clave o referencia
              </label>
              <div className="relative">
                <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-3.5 pl-11 pr-4 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder="Ej: Mantenimiento de turbinas, Suministro offshore..."
                />
              </div>
            </div>

            {/* Selector Rápido */}
            <div className="md:col-span-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Ordenar Resultados
              </label>
              <div className="relative">
                <select className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 py-3.5 px-4 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer">
                  <option value="recent">Más recientes primero</option>
                  <option value="deadline">Próximos a cerrar</option>
                  <option value="budget_desc">Mayor presupuesto</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Píldoras de Categorías */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <SlidersHorizontal className="size-3.5" />
                Filtrar por Categoría:
              </span>
              {(searchQuery || activeCategory !== 'all') && (
                <button 
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} 
                  className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-wider"
                >
                  Restablecer Filtros
                </button>
              )}
            </div>

            <div className="flex overflow-x-auto no-scrollbar scroll-smooth gap-2 pb-1 sm:pb-0 flex-nowrap sm:flex-wrap">
              {CATEGORIES_LIST.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(isActive ? 'all' : cat)}
                    className={`px-3.5 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all shrink-0 whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat === 'all' ? 'Todas las Categorías' : cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Encabezado de Resultados */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Licitaciones Disponibles ({filteredOpps.length})
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
            Actualizado en tiempo real &bull; Guinea Ecuatorial
          </span>
        </div>

        {/* Grid de Oportunidades Públicas Responsivo */}
        {filteredOpps.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Briefcase className="size-12 text-slate-400 mx-auto mb-3" />
            <h4 className="text-base font-black uppercase text-slate-800 dark:text-slate-200 mb-1">
              No se encontraron licitaciones
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pruebe a cambiar el término de búsqueda o la categoría seleccionada.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredOpps.map((opp) => (
              <div 
                key={opp.id} 
                className="group flex flex-col overflow-hidden rounded-3xl bg-white dark:bg-[#1a2332] border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Cabecera con Imagen */}
                {opp.image ? (
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-950">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10 opacity-80"></div>
                    <img 
                      src={opp.image} 
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      alt={getTranslatedText(opp.title)} 
                    />
                    <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                      <span className={`inline-flex items-center rounded-lg px-3 py-1 text-[9px] font-black uppercase text-white backdrop-blur-md tracking-wider ${
                        opp.tag === 'urgente' ? 'bg-red-600/90' : opp.tag === 'nuevo' ? 'bg-blue-600/90' : 'bg-emerald-600/90'
                      }`}>
                        {opp.tag?.toUpperCase() || 'ABIERTO'}
                      </span>
                      <span className="inline-flex items-center rounded-lg px-3 py-1 text-[9px] font-black uppercase text-white bg-slate-900/80 backdrop-blur-md tracking-wider">
                        {opp.category}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-20">
                      <h4 className="text-lg font-black text-white leading-snug tracking-tight uppercase line-clamp-2">
                        {getTranslatedText(opp.title)}
                      </h4>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 border-b-4 border-blue-600 bg-slate-50 dark:bg-slate-800/50">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 block">{opp.category}</span>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight line-clamp-2">
                      {getTranslatedText(opp.title)}
                    </h4>
                  </div>
                )}

                {/* Cuerpo de la Tarjeta */}
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      <MapPin className="size-4 text-blue-600 shrink-0" />
                      <span className="uppercase tracking-wide">{opp.location}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400">
                      <Calendar className="size-4 shrink-0" />
                      <span className="uppercase tracking-wide">Cierre: {opp.deadline}</span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 pt-2">
                      {getTranslatedText(opp.description)}
                    </p>
                  </div>
                  
                  {/* Footer de la Tarjeta con Botón de Ficha Técnica */}
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">
                        {opp.ref || opp.id.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
                        <ShieldCheck className="size-3" />
                        RUGE Homologado
                      </span>
                    </div>

                    <Link 
                      to={`/opportunity/${opp.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 text-xs font-black transition-all uppercase tracking-wider shadow-md shadow-blue-600/20 active:scale-95 shrink-0"
                    >
                      <span>Ver Ficha Técnica</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Paginación Pública Limpia */}
        <div className="mt-16 flex items-center justify-center gap-2">
          <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
            <ChevronLeft className="size-4" />
          </button>
          {[1, 2, 3].map((page) => (
            <button 
              key={page} 
              className={`size-10 flex items-center justify-center rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
                page === 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesPublicView;
