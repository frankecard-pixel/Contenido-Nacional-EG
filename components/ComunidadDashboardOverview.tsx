
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSocialProjects } from '../services/supabaseApi';
import { SocialProject, User } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface ComunidadDashboardOverviewProps {
  user: User;
}

const ComunidadDashboardOverview: React.FC<ComunidadDashboardOverviewProps> = ({ user }) => {
  const { t } = useTranslation();
  const [socialProjects, setSocialProjects] = useState<SocialProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsData = await getSocialProjects();
        setSocialProjects(projectsData as any);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const impactData = [
    { name: 'Educación', value: 400, color: '#135bec' },
    { name: 'Salud', value: 300, color: '#10b981' },
    { name: 'Infraestructura', value: 200, color: '#f59e0b' },
    { name: 'Empleo Local', value: 100, color: '#ef4444' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 space-y-10 animate-in fade-in duration-700">
      <div className="rounded-[3rem] bg-emerald-600 p-12 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 block opacity-80">Gestión de Impacto Social</span>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Bienvenido, {user.name}</h1>
            <p className="text-emerald-100 font-medium mt-4 max-w-xl italic">Supervise el desarrollo sostenible y asegure que la riqueza del sector hidrocarburos llegue a cada ciudadano.</p>
         </div>
         <span className="material-symbols-outlined absolute right-[-20px] top-[-20px] text-[200px] opacity-10">diversity_3</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Proyectos Activos", val: socialProjects.length.toString(), icon: "potted_plant", color: "text-emerald-600" },
          { label: "Población Impactada", val: "15.4k", icon: "groups", color: "text-blue-600" },
          { label: "Inversión Validada", val: "$2.4M", icon: "payments", color: "text-amber-600" },
          { label: "Alertas Comunitarias", val: "3", icon: "campaign", color: "text-rose-600" }
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
             <div className={`p-3 w-fit rounded-xl bg-slate-50 dark:bg-slate-900 ${kpi.color} mb-6`}>
               <span className="material-symbols-outlined">{kpi.icon}</span>
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
             <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
           <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-black uppercase tracking-tight">Obras en curso por sector</h3>
              <button className="text-primary text-[10px] font-black uppercase hover:underline">Ver mapa de proyectos</button>
           </div>
           <div className="p-10 space-y-8">
              {socialProjects.length > 0 ? (
                socialProjects.map(p => (
                  <div key={p.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-700 group hover:border-emerald-500 transition-all">
                     <div className="flex items-center gap-6">
                        <div className="size-14 rounded-2xl overflow-hidden shadow-inner bg-slate-100 flex items-center justify-center">
                           {p.image ? <img src={p.image} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-slate-400">image</span>}
                        </div>
                        <div>
                           <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{p.title.es}</h4>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{p.location} • {p.investor}</p>
                        </div>
                     </div>
                     <div className="mt-4 md:mt-0 flex items-center gap-6">
                        <div className="text-right">
                           <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Progreso {p.progress}%</p>
                           <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                              <div className="h-full bg-emerald-500" style={{ width: `${p.progress}%` }}></div>
                           </div>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">visibility</span></button>
                     </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest border border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem]">No hay proyectos sociales registrados</div>
              )}
           </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-sm border border-slate-100 dark:border-slate-700">
              <h3 className="text-lg font-black uppercase tracking-tight mb-8">Distribución de Impacto</h3>
              <div className="h-[250px]">
                 <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <PieChart>
                       <Pie data={impactData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {impactData.map((entry, index) => (
                             <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                       <Tooltip />
                    </PieChart>
                 </ResponsiveContainer>
              </div>
              <div className="space-y-3 mt-4">
                 {impactData.map(d => (
                    <div key={d.name} className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                       <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                          <span className="text-slate-500">{d.name}</span>
                       </div>
                       <span className="text-slate-900 dark:text-white">{d.value} beneficiarios</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <h3 className="text-lg font-black uppercase tracking-tight mb-6">Peticiones Ciudadanas</h3>
              <div className="space-y-6">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-black text-amber-500 uppercase mb-2">Urgente • San Antonio de Pale</p>
                    <p className="text-xs font-medium leading-relaxed italic">"Solicitamos revisión de la potabilizadora instalada el mes pasado."</p>
                 </div>
                 <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/40">Atender Solicitudes</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ComunidadDashboardOverview;
