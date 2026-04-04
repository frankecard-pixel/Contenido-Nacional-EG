import React from 'react';
import { Link } from 'react-router-dom';

interface CommunityProjectsProps {
  projects: any[];
  getTranslatedText: (obj: any) => string;
}

const CommunityProjects: React.FC<CommunityProjectsProps> = ({ projects, getTranslatedText }) => {
  return (
    <section className="mb-32">
      <h2 className="text-3xl font-black text-slate-900 mb-16 tracking-tighter">Proyectos en Ejecución y Finalizados</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {projects.map(p => (
          <div key={p.id} className="bg-slate-50 rounded-[3.5rem] overflow-hidden border border-slate-100 group flex flex-col shadow-sm hover:shadow-2xl transition-all">
            <div className="h-72 overflow-hidden relative">
              <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={getTranslatedText(p.title)} />
              <div className="absolute top-6 left-6 flex space-x-2">
                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${p.status === 'active' ? 'bg-orange-500 text-white' : 'bg-emerald-600 text-white'}`}>
                  {p.status === 'active' ? 'EN CURSO' : 'COMPLETADO'}
                </span>
              </div>
            </div>
            
            <div className="p-12 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{getTranslatedText(p.title)}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-900 tracking-tighter">${p.budget.toLocaleString()}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Inversión</p>
                </div>
              </div>

              {/* Barra de Progreso Técnica */}
              <div className="mb-10">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Progreso de Obra</span>
                  <span className="text-[10px] font-black text-blue-600">{p.progress}%</span>
                </div>
                <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${p.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} 
                    style={{ width: `${p.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-10 p-6 bg-white rounded-3xl border border-slate-100">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Financiado por</p>
                  <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{p.investor}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Fecha Entrega</p>
                  <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{p.endDate}</p>
                </div>
              </div>

              <div className="mt-auto">
                <Link to={`/project/${p.id}`} className="w-full bg-slate-900 text-white py-4 rounded-2xl flex items-center justify-center font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all">
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
