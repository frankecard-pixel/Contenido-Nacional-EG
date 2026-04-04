
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getJobOffers, getApplications } from '../services/supabaseApi';
import { JobOffer, Application, User } from '../types';
import AdBanner from './AdBanner';

interface TalentoDashboardOverviewProps {
  user: User;
}

const TalentoDashboardOverview: React.FC<TalentoDashboardOverviewProps> = ({ user }) => {
  const { t } = useTranslation();
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, appsData] = await Promise.all([
          getJobOffers(),
          getApplications(user.id)
        ]);
        setJobOffers(jobsData as any);
        setApplications(appsData as any);
      } catch (error) {
        console.error("Error fetching talent dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-10 animate-in fade-in duration-700">
      {/* Profile Welcome */}
      <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center gap-10">
         <div className="size-32 rounded-[2rem] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl relative shrink-0">
            {user.name.substring(0, 2).toUpperCase()}
            <div className={`absolute -bottom-2 -right-2 size-8 ${user.isOnline ? 'bg-green-500' : 'bg-slate-400'} rounded-full border-4 border-white dark:border-slate-800`}></div>
         </div>
         <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
               <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{user.name}</h1>
               <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest border border-blue-100">Candidato Verificado</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic mb-6 uppercase text-sm tracking-tight">{user.role === 'persona' ? 'Talento Nacional' : user.role} • {user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
               {['Mecánica', 'Soldadura Submarina', 'Francés Técnico'].map(skill => (
                 <span key={skill} className="px-4 py-2 bg-slate-50 dark:bg-slate-900 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700">{skill}</span>
               ))}
            </div>
         </div>
         <div className="w-full md:w-64 space-y-4">
            <div className="flex justify-between items-center mb-1">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fortaleza Perfil</span>
               <span className="text-[10px] font-black text-primary">85%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner">
               <div className="h-full bg-primary rounded-full" style={{ width: '85%' }}></div>
            </div>
            <button className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">Mejorar Perfil</button>
         </div>
      </div>

      {/* Ad Banner */}
      <AdBanner 
        type="main"
        title="Programa de Certificación HSE"
        description="Mejore su perfil profesional con nuestras certificaciones internacionales en seguridad industrial."
        sponsor="Instituto de Hidrocarburos"
        imageUrl="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800&auto=format&fit=crop"
        link="https://example.com"
      />

      {/* Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Applications Tracking */}
         <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
               <h3 className="text-lg font-black uppercase tracking-tight">Mis Candidaturas Activas</h3>
               <span className="bg-primary/10 text-primary text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{applications.length} Procesos</span>
            </div>
            <div className="divide-y divide-slate-50 dark:divide-slate-700">
               {applications.length > 0 ? (
                 applications.slice(0, 3).map((app, i) => (
                   <div key={i} className="p-8 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all group">
                      <div className="flex items-center gap-6">
                         <div className="size-12 rounded-2xl bg-blue-50 flex items-center justify-center font-black text-primary text-sm shadow-inner uppercase">{(app.company as any)?.name?.substring(0, 2) || 'AP'}</div>
                         <div>
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{(app.opportunity as any)?.title?.es || 'Candidatura'}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{(app.company as any)?.name || 'Empresa'} • {new Date(app.submitted_at).toLocaleDateString()}</p>
                         </div>
                      </div>
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full uppercase tracking-widest border border-emerald-100">{app.status}</span>
                   </div>
                 ))
               ) : (
                 <div className="p-8 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">No hay candidaturas activas</div>
               )}
            </div>
         </div>

         {/* Training and Certificates */}
         <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700 space-y-8">
            <h3 className="text-lg font-black uppercase tracking-tight">Capacitación</h3>
            <div className="space-y-6">
               {[
                 { title: 'Certificación Soldadura ISO', prog: 100, ok: true },
                 { title: 'Gestión HSE Nivel Pro', prog: 45, ok: false }
               ].map((cert, i) => (
                 <div key={i} className="space-y-3">
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{cert.title}</p>
                       {cert.ok && <span className="material-symbols-outlined text-emerald-500 text-lg">verified</span>}
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner">
                       <div className={`h-full ${cert.ok ? 'bg-emerald-500' : 'bg-primary'} rounded-full`} style={{ width: `${cert.prog}%` }}></div>
                    </div>
                 </div>
               ))}
            </div>
            <button className="w-full py-4 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-primary hover:bg-slate-50 transition-all">Ver todos los certificados</button>
         </div>
      </div>

      {/* Recommended Jobs */}
      <section className="space-y-8">
         <h3 className="text-xl font-black uppercase tracking-tight">Oportunidades de Empleo Sugeridas</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobOffers.length > 0 ? (
              jobOffers.slice(0, 3).map(job => (
                <div key={job.id} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all group">
                   <div className="flex justify-between items-start mb-6">
                      <div className="size-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl">🏢</div>
                      <span className="text-[8px] font-black text-primary border border-primary px-3 py-1 rounded-full uppercase tracking-widest">Contenido Nacional</span>
                   </div>
                   <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors">{job.title.es}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{job.location} • {new Date(job.posted_at).toLocaleDateString()}</p>
                   <div className="mt-8 flex gap-3">
                      <Link to={`/job/${job.id}`} className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-[9px] font-black text-center uppercase tracking-widest hover:bg-blue-600 transition-all">Ver Detalle</Link>
                   </div>
                </div>
              ))
            ) : (
              <div className="col-span-full p-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest border border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem]">No hay ofertas de empleo sugeridas en este momento</div>
            )}
         </div>
      </section>
    </div>
  );
};

export default TalentoDashboardOverview;
