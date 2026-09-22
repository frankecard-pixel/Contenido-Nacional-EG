import React from 'react';
import { Link } from 'react-router-dom';

interface CommunityProjectsProps {
  projects: any[];
  getTranslatedText: (obj: any) => string;
}

const CommunityProjects: React.FC<CommunityProjectsProps> = ({ projects, getTranslatedText }) => {
  return (
    <section className="mb-32">
      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-10 md:mb-16 tracking-tight uppercase">
        Proyectos en Ejecución y Finalizados
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {projects.map(p => (
          <div key={p.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 group flex flex-col shadow-sm hover:shadow-2xl transition-all">
            <div className="h-64 sm:h-72 overflow-hidden relative">
              <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={getTranslatedText(p.title)} />
              <div className="absolute top-6 left-6 flex space-x-2">
                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${p.status === 'active' ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'}`}>
                  {p.status === 'active' ? 'EN CURSO' : 'COMPLETADO'}
                </span>
              </div>
            </div>
            
            <div className="p-6 sm:p-10 md:p-12 flex-1 flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-3">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {getTranslatedText(p.title)}
                  </h3>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest">
                    {p.location}
                  </p>
                </div>
                <div className="sm:text-right shrink-0">
                  <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    ${p.budget.toLocaleString()}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest">
                    Inversión
                  </p>
                </div>
              </div>

              {/* Barra de Progreso Técnica */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">Progreso de Obra</span>
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400">{p.progress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${p.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                    style={{ width: `${p.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8 p-5 bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-1">Financiado por</p>
                  <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{p.investor}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 dark:text-slate-400 uppercase tracking-widest mb-1">Fecha Entrega</p>
                  <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">{p.endDate}</p>
                </div>
              </div>

              <div className="mt-auto">
                <Link to={`/project/${p.id}`} className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl flex items-center justify-center font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 dark:hover:bg-blue-500 transition-all">
                  Ver Ficha Técnica Completa
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CommunityProjects;
