import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Plus, Search, Filter, Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import { getSocialProjects } from '../../services/supabaseApi';
import { SocialProjectExt } from '../../types';

const CSRProjectManagement: React.FC = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<SocialProjectExt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getSocialProjects();
        setProjects(data as any[]);
      } catch (error) {
        console.error("Error fetching social projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const stats = useMemo(() => {
    const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
    const totalBeneficiaries = projects.reduce((acc, p) => {
      const match = (p.beneficiaries || '').match(/\d+/);
      return acc + (match ? parseInt(match[0]) : 0);
    }, 0);
    return {
      totalBudget,
      totalBeneficiaries,
      activeCount: projects.filter(p => p.status === 'active' || p.status === 'in-progress').length,
    };
  }, [projects]);

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Inversión Social (RSC)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Seguimiento y reporte de proyectos de responsabilidad social corporativa.
          </p>
        </div>
        <button className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-rose-600/20 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Proyecto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 p-3 rounded-2xl">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inversión Total</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">${stats.totalBudget.toLocaleString()}</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full" style={{ width: '75%' }}></div>
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase mt-3 tracking-widest">75% del presupuesto anual ejecutado</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 p-3 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Beneficiarios</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.totalBeneficiaries.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">+15% respecto al año anterior</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 p-3 rounded-2xl">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proyectos Activos</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.activeCount}</p>
            </div>
          </div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Distribuidos en el territorio nacional</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.length === 0 ? (
            <div className="col-span-full p-12 text-center opacity-50 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-sm font-black uppercase tracking-widest">No hay proyectos sociales registrados</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-slate-100 dark:bg-slate-900 text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest text-slate-500">{project.category}</span>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    project.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                    project.status === 'active' || project.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {project.status === 'completed' ? 'Completado' : project.status === 'active' || project.status === 'in-progress' ? 'En Ejecución' : 'Pendiente'}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-4 tracking-tight">{project.title.es}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Presupuesto</p>
                      <p className="text-xs font-black text-slate-900 dark:text-white">${(project.budget || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Impacto</p>
                      <p className="text-xs font-black text-slate-900 dark:text-white">{project.beneficiaries}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Progreso</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
                  <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Ver detalles</button>
                  <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white">Subir Reporte</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CSRProjectManagement;
