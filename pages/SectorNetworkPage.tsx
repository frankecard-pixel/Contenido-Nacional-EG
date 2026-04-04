
import React from 'react';
import { useTranslation } from 'react-i18next';

const SectorNetworkPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Red Social del Sector</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic max-w-2xl">
            Conecta con otras empresas, operadoras y profesionales del sector de hidrocarburos en Guinea Ecuatorial.
          </p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95">
          <span className="material-symbols-outlined text-xl">post_add</span>
          Nueva Publicación
        </button>
      </div>

      {/* Feed & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Sidebar - Navigation & Trends */}
        <div className="hidden lg:block lg:col-span-3 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm">
            <h3 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest mb-6">Explorar</h3>
            <nav className="space-y-2">
              {['Para ti', 'Siguiendo', 'Empresas Locales', 'Operadoras', 'Servicios'].map((item, i) => (
                <button key={item} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-primary text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-600'}`}>
                  <span className="material-symbols-outlined text-xl">{['home', 'group', 'business', 'oil_barrel', 'settings'][i]}</span>
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm">
            <h3 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest mb-6">Tendencias</h3>
            <div className="space-y-6">
              {[
                { tag: '#ContenidoNacional', posts: '1.2k' },
                { tag: '#RíoMuni', posts: '850' },
                { tag: '#Gepetrol2024', posts: '640' },
                { tag: '#Sostenibilidad', posts: '420' }
              ].map(trend => (
                <div key={trend.tag} className="group cursor-pointer">
                  <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors">{trend.tag}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{trend.posts} publicaciones</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-6 space-y-8">
          {/* Create Post */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm">
            <div className="flex gap-4">
              <div className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 font-black">U</div>
              <div className="flex-1">
                <textarea 
                  placeholder="¿Qué está pasando en el sector?"
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl p-4 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all resize-none"
                  rows={2}
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex gap-2">
                    <button className="p-2 text-slate-400 hover:text-primary transition-all"><span className="material-symbols-outlined">image</span></button>
                    <button className="p-2 text-slate-400 hover:text-primary transition-all"><span className="material-symbols-outlined">attachment</span></button>
                    <button className="p-2 text-slate-400 hover:text-primary transition-all"><span className="material-symbols-outlined">location_on</span></button>
                  </div>
                  <button className="px-6 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Publicar</button>
                </div>
              </div>
            </div>
          </div>

          {/* Post 1 */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="size-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black">MM</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Ministerio de Hidrocarburos y Desarrollo Minero</h4>
                  <span className="material-symbols-outlined text-primary text-base">verified</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hace 2 horas • Comunicado Oficial</p>
              </div>
              <button className="text-slate-300 hover:text-slate-600"><span className="material-symbols-outlined">more_horiz</span></button>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              Se anuncia la apertura de la nueva ronda de licitaciones para bloques offshore en la cuenca del Río Muni. Invitamos a todas las operadoras interesadas a revisar los términos de referencia en el portal.
            </p>
            <div className="rounded-3xl overflow-hidden mb-6 border border-slate-100 dark:border-slate-700">
              <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop" className="w-full h-64 object-cover" alt="Offshore" referrerPolicy="no-referrer" />
            </div>
            <div className="flex items-center gap-6 pt-6 border-t border-slate-50 dark:border-slate-700">
              <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all">
                <span className="material-symbols-outlined text-xl">thumb_up</span>
                <span className="text-[10px] font-black uppercase tracking-widest">24 Me gusta</span>
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all">
                <span className="material-symbols-outlined text-xl">chat_bubble</span>
                <span className="text-[10px] font-black uppercase tracking-widest">8 Comentarios</span>
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all ml-auto">
                <span className="material-symbols-outlined text-xl">share</span>
              </button>
            </div>
          </div>

          {/* Post 2 */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="size-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black">GE</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Gepetrol</h4>
                  <span className="material-symbols-outlined text-primary text-base">verified</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hace 5 horas • Actualización Corporativa</p>
              </div>
              <button className="text-slate-300 hover:text-slate-600"><span className="material-symbols-outlined">more_horiz</span></button>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
              Orgullosos de anunciar que hemos superado las metas de producción del primer trimestre. Gracias a todo el equipo por su dedicación y compromiso con el desarrollo nacional.
            </p>
            <div className="flex items-center gap-6 pt-6 border-t border-slate-50 dark:border-slate-700">
              <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all">
                <span className="material-symbols-outlined text-xl">thumb_up</span>
                <span className="text-[10px] font-black uppercase tracking-widest">56 Me gusta</span>
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all">
                <span className="material-symbols-outlined text-xl">chat_bubble</span>
                <span className="text-[10px] font-black uppercase tracking-widest">12 Comentarios</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Suggestions & Events */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm">
            <h3 className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest mb-6">Empresas Destacadas</h3>
            <div className="space-y-6">
              {['ExxonMobil', 'Noble Energy', 'Trident Energy', 'Marathon Oil'].map(company => (
                <div key={company} className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 font-black text-[10px]">{company.substring(0, 2)}</div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{company}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Operadora Petrolera</p>
                  </div>
                  <button className="text-primary text-[8px] font-black uppercase tracking-widest hover:underline">Seguir</button>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 text-[9px] font-black uppercase tracking-widest text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all">Ver todas las empresas</button>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-500/20">
            <h3 className="font-black text-xs uppercase tracking-widest mb-4">Próximos Eventos</h3>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <p className="text-[8px] font-black uppercase tracking-widest text-blue-200 mb-1">15 ABRIL, 2024</p>
                <p className="text-[10px] font-black uppercase tracking-tight">Foro de Contenido Nacional Malabo</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <p className="text-[8px] font-black uppercase tracking-widest text-blue-200 mb-1">22 ABRIL, 2024</p>
                <p className="text-[10px] font-black uppercase tracking-tight">Webinar: Nuevas Normativas MMH</p>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all">Ver Calendario</button>
          </div>
        </div>
      </div>

      <footer className="text-center py-10 opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">Ministerio de Hidrocarburos y Desarrollo Minero • República de Guinea Ecuatorial</p>
      </footer>
    </div>
  );
};

export default SectorNetworkPage;
