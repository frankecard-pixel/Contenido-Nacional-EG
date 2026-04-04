import React from 'react';
import { Link } from 'react-router-dom';
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
  if (!selectedOpp) {
    return (
      <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden pt-20 justify-center items-center">
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No hay oportunidad seleccionada</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden pt-20">
      <aside className="w-72 flex-none border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a2233] hidden lg:flex flex-col">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="font-black text-slate-900 dark:text-white flex items-center gap-2 text-xs uppercase tracking-widest">
            <span className="material-symbols-outlined text-primary text-xl">filter_list</span> Filtros
          </h2>
          <button className="text-[10px] text-primary font-black uppercase hover:underline">Limpiar</button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</h3>
            <div className="space-y-3">
              {['Abierto', 'Evaluación', 'Adjudicado'].map(status => (
                <label key={status} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" defaultChecked={status === 'Abierto'} className="rounded border-slate-300 text-primary focus:ring-primary size-4" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">{status}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoría</h3>
            <div className="space-y-3">
              {categories.slice(1, 6).map(cat => (
                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={activeCategory === cat} onChange={() => setActiveCategory(activeCategory === cat ? 'all' : cat)} className="rounded border-slate-300 text-primary focus:ring-primary size-4" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-primary transition-colors">{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 flex items-center gap-2 uppercase tracking-widest">
              <span className="material-symbols-outlined text-yellow-500 fill-current text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> Solo Guardados
            </span>
            <input type="checkbox" className="sr-only peer" checked={showSavedOnly} onChange={() => setShowSavedOnly(!showSavedOnly)} />
            <div className="w-10 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:bg-primary after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
          </label>
        </div>
      </aside>

      <section className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark relative">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#1a2233]/80 backdrop-blur-md sticky top-0 z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Explorador</h2>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">{filteredOpps.length} activas compatibles</p>
          </div>
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input type="text" placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-primary" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
          {filteredOpps.map((opp) => (
            <div key={opp.id} onClick={() => setSelectedOppId(opp.id)} className={`group relative bg-white dark:bg-[#1a2233] rounded-[2rem] p-6 border-2 transition-all cursor-pointer ${selectedOppId === opp.id ? 'border-primary ring-4 ring-primary/5' : 'border-transparent hover:border-slate-200 shadow-sm'}`}>
              <div className="flex justify-between items-start gap-6">
                <div className="flex items-start gap-6">
                  <div className="size-16 rounded-2xl bg-white p-2 border border-slate-100 shadow-sm shrink-0 flex items-center justify-center">
                    <img src={getOperatorLogo(opp.petroleraId)} alt="Operator" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-green-100 text-green-700 text-[9px] font-black uppercase px-3 py-1 rounded-lg tracking-widest">{opp.status}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cierre: {opp.deadline}</span>
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">{getTranslatedText(opp.title)}</h3>
                    <div className="flex flex-wrap gap-3 mt-4">
                      <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">{opp.location}</span>
                      <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">Contenido Nacional</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-2 text-primary font-black text-xl tracking-tighter"><span>92%</span><div className="size-6 rounded-full border-2 border-primary border-t-transparent animate-spin"></div></div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Compatibilidad</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="w-[450px] flex-none border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1a2233] flex flex-col hidden xl:flex z-20 shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="p-8 border-b border-slate-100 relative">
          <div className="size-20 rounded-2xl bg-white p-3 border border-slate-100 shadow-sm mb-6"><img src={getOperatorLogo(selectedOpp.petroleraId)} className="w-full h-full object-contain" /></div>
          <h2 className="text-2xl font-black uppercase tracking-tight">{getTranslatedText(selectedOpp.title)}</h2>
          <div className="flex items-center gap-3 mt-4 text-[11px] font-black uppercase tracking-widest text-primary">ID: {selectedOpp.id.toUpperCase()}</div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
          <div className="bg-blue-50 dark:bg-primary/10 rounded-3xl p-6 border border-blue-100">
            <h4 className="font-black text-primary text-xs uppercase tracking-widest mb-3">Análisis Legal</h4>
            <p className="text-xs font-bold text-slate-600 leading-relaxed uppercase">Su empresa cumple con los requisitos del Reglamento 2014 para esta licitación.</p>
          </div>
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest">Alcance</h3>
            <p className="text-sm font-medium text-slate-600 leading-relaxed">{getTranslatedText(selectedOpp.description)}</p>
          </div>
          <Link 
            to={`/apply/${selectedOpp.id}`} 
            className="w-full bg-primary text-white font-black py-5 rounded-2xl shadow-xl uppercase text-xs tracking-widest active:scale-95 text-center flex items-center justify-center"
          >
            Postular a la Licitación
          </Link>
        </div>
      </aside>
    </div>
  );
};

export default OpportunitiesDashboardView;
