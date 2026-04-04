
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getOpportunities, getSocialProjects } from '../services/supabaseApi';
import { OpportunityExt, SocialProject, User } from '../types';

interface PetroleraDashboardOverviewProps {
  user: User;
}

const PetroleraDashboardOverview: React.FC<PetroleraDashboardOverviewProps> = ({ user }) => {
  const { t } = useTranslation();
  const [opportunities, setOpportunities] = useState<OpportunityExt[]>([]);
  const [socialProjects, setSocialProjects] = useState<SocialProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [oppsData, projectsData] = await Promise.all([
          getOpportunities(),
          getSocialProjects()
        ]);
        setOpportunities(oppsData as any);
        setSocialProjects(projectsData as any);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const socialInvestmentData = [
    { name: 'Educación', val: 450000 },
    { name: 'Salud', val: 300000 },
    { name: 'Agua', val: 200000 },
    { name: 'Infra', val: 150000 }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="rounded-[2.5rem] bg-slate-900 p-10 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10">
            <h1 className="text-3xl font-black uppercase tracking-tighter">Portal de Operadora</h1>
            <p className="text-slate-400 font-medium mt-2 uppercase text-xs tracking-widest">{user.name} • {user.role === 'petrolera' ? 'Operadora Petrolera' : user.role}</p>
         </div>
         <div className="absolute right-0 top-0 p-10 opacity-10">
            <span className="material-symbols-outlined text-[100px]">oil_barrel</span>
         </div>
      </div>

      {/* Main KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Licitaciones Abiertas", val: opportunities.filter(o => o.status === 'published').length.toString(), icon: "campaign", color: "text-blue-600" },
          { label: "Propuestas Recibidas", val: "124", icon: "group", color: "text-indigo-600" },
          { label: "Cumplimiento Local", val: "92%", icon: "verified", color: "text-emerald-600" },
          { label: "Proyectos RSC", val: socialProjects.length.toString(), icon: "volunteer_activism", color: "text-rose-600" }
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
             <div className={`p-3 w-fit rounded-xl bg-slate-50 dark:bg-slate-900 ${kpi.color} mb-6`}>
               <span className="material-symbols-outlined">{kpi.icon}</span>
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
             <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{kpi.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Social Investment Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-sm border border-slate-100 dark:border-slate-700">
           <h3 className="text-xl font-black uppercase tracking-tight mb-10">Inversión Social Obligatoria (RSC)</h3>
           <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%" minWidth={0}>
               <BarChart data={socialInvestmentData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                  <YAxis hide />
                  <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)'}} />
                  <Bar dataKey="val" fill="#2563eb" radius={[10, 10, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Tenders Overview */}
        <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-sm border border-slate-100 dark:border-slate-700">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase tracking-tight">Últimas Licitaciones</h3>
              <button className="text-primary text-[10px] font-black uppercase hover:underline">Gestionar todas</button>
           </div>
           <div className="space-y-6">
              {opportunities.length > 0 ? (
                opportunities.slice(0, 3).map(opp => (
                  <div key={opp.id} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:border-primary transition-all">
                     <div>
                        <p className="text-[10px] font-black text-primary uppercase mb-1">{opp.category}</p>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{opp.title.es}</h4>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cierre: {new Date(opp.deadline).toLocaleDateString()}</p>
                        <span className="text-[9px] font-black bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase tracking-widest mt-2 inline-block">12 Aplicaciones</span>
                     </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">No hay licitaciones registradas</div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default PetroleraDashboardOverview;
