import React from 'react';
import { Link } from 'react-router-dom';
import { OpportunityExt } from '../../../types';
import PublicBanner from '../../public/PublicBanner';
import MinisterialCertification from '../../public/MinisterialCertification';

interface OpportunitiesPublicViewProps {
  filteredOpps: OpportunityExt[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setActiveCategory: (category: string) => void;
  getTranslatedText: (obj: any) => string;
  onRequireAuth: () => void;
}

const OpportunitiesPublicView: React.FC<OpportunitiesPublicViewProps> = ({
  filteredOpps,
  searchQuery,
  setSearchQuery,
  setActiveCategory,
  getTranslatedText,
  onRequireAuth
}) => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-32 animate-in fade-in duration-700">
      <PublicBanner 
        title="Oportunidades Públicas" 
        subtitle="Explore y postule a las licitaciones oficiales y proyectos de contenido nacional."
        category="Licitaciones"
        image="https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop"
      />
      <div className="max-w-[var(--layout-max-width)] mx-auto px-10 relative z-50 -mt-16 mb-12">
        <MinisterialCertification />
      </div>
      <div className="max-w-[var(--layout-max-width)] mx-auto px-10 mt-20">
        {/* Filtros Públicos */}
        <div className="mb-12 rounded-[3.5rem] bg-white dark:bg-[#1a2332] p-10 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex gap-8 overflow-x-auto pb-4 custom-scrollbar whitespace-nowrap">
            <div className="min-w-[300px] flex-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Buscar oportunidad</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border-none bg-slate-50 dark:bg-slate-800 py-5 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 dark:text-white"
                  placeholder="Ej: Mantenimiento de plataformas..."
                />
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              </div>
            </div>
            <div className="min-w-[200px]">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Fecha límite</label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full rounded-2xl border-none bg-slate-50 dark:bg-slate-800 py-5 pl-14 pr-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all text-slate-900 dark:text-white"
                />
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">calendar_today</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex items-center gap-4 border-t border-slate-50 dark:border-slate-800 pt-8 overflow-x-auto pb-4 custom-scrollbar whitespace-nowrap">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2 shrink-0">Filtrar:</span>
            {['Categoría', 'Ubicación', 'Tipo de Servicio'].map(btn => (
              <button key={btn} className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-all shrink-0">
                <span>{btn}</span>
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </button>
            ))}
            <button onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} className="ml-auto text-[10px] font-black text-primary hover:underline uppercase tracking-widest shrink-0 pl-4">Limpiar filtros</button>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-10 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Mostrando {filteredOpps.length} oportunidades</h3>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ordenar:</span>
            <select className="bg-transparent text-xs font-black text-slate-900 dark:text-white border-none focus:ring-0 cursor-pointer uppercase tracking-widest">
              <option>Más recientes</option>
              <option>Fecha de cierre</option>
            </select>
          </div>
        </div>

        {/* Grid de Oportunidades Públicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredOpps.map((opp, idx) => (
            <div key={opp.id} className="group flex flex-col overflow-hidden rounded-[2.5rem] bg-white dark:bg-[#1a2332] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2">
              {/* Estilo A: Con Imagen (si existe en el mock) */}
              {opp.image ? (
                <div className="relative h-60 w-full overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10 opacity-80"></div>
                  <img src={opp.image} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Background" />
                  <div className="absolute top-6 left-6 z-20">
                    <span className={`inline-flex items-center rounded-xl px-4 py-1.5 text-[9px] font-black uppercase text-white backdrop-blur-md tracking-widest ${
                      opp.tag === 'urgente' ? 'bg-red-600/90' : opp.tag === 'nuevo' ? 'bg-blue-600/90' : 'bg-emerald-600/90'
                    }`}>
                      {opp.tag?.toUpperCase() || 'ABIERTO'}
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">{opp.category}</p>
                    <h3 className="text-2xl font-black text-white leading-tight tracking-tight uppercase">{getTranslatedText(opp.title)}</h3>
                  </div>
                </div>
              ) : (
                /* Estilo B: Estilo Limpio (Sin Imagen) */
                <div className="p-8 border-b-8 border-primary bg-slate-50 dark:bg-slate-800/50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">{opp.category}</span>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tight">{getTranslatedText(opp.title)}</h3>
                    </div>
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 shrink-0">
                      <span className="material-symbols-outlined text-2xl">work</span>
                    </span>
                  </div>
                </div>
              )}

              <div className="flex flex-1 flex-col p-8 lg:p-10">
                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-xl">location_on</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{opp.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-xl">calendar_month</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Cierre: {opp.deadline}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 mt-4">
                    {getTranslatedText(opp.description)}
                  </p>
                </div>
                
                <div className="mt-auto pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ref: {opp.ref || opp.id.toUpperCase()}</span>
                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Marathon Oil</span>
                  </div>
                  <button onClick={onRequireAuth} className="rounded-2xl bg-primary/10 px-8 py-3.5 text-[10px] font-black text-primary hover:bg-primary hover:text-white transition-all uppercase tracking-widest shadow-xl shadow-primary/5">
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación Pública */}
        <div className="mt-20 flex items-center justify-center gap-3">
          <button className="size-12 flex items-center justify-center rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          {[1, 2, 3, '...', 12].map((page, i) => (
            <button 
              key={i} 
              className={`size-12 flex items-center justify-center rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                page === 1 ? 'bg-primary text-white shadow-xl shadow-primary/30' : 'text-slate-400 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="size-12 flex items-center justify-center rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpportunitiesPublicView;
