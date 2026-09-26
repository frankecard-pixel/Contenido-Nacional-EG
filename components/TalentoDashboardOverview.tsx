import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  getJobOffers,
  getJobApplications,
  getCandidateProfile,
  getCertifications,
} from "../services/supabaseApi";
import { JobOffer, User } from "../types";
import AdBanner from "./AdBanner";

interface TalentoDashboardOverviewProps {
  user: User;
}

const TalentoDashboardOverview: React.FC<TalentoDashboardOverviewProps> = ({
  user,
}) => {
  const { t } = useTranslation();
  const [jobOffers, setJobOffers] = useState<JobOffer[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsData, appsData, profileData, certsData] = await Promise.all([
          getJobOffers(),
          getJobApplications(user.id),
          getCandidateProfile(user.id),
          getCertifications(user.id),
        ]);
        setJobOffers(jobsData as any);
        setApplications(appsData as any);
        setProfile(profileData);
        setCertifications(certsData);
      } catch (error) {
        console.error("Error fetching talent dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  const calculateProfileScore = () => {
    let score = 20; // Base score
    if (user?.avatar_url) score += 10;
    if (user?.bio) score += 10;
    if (user?.phone) score += 10;
    if (user?.cv_url) score += 10;
    if (profile?.experience?.length > 0) score += 15;
    if (profile?.education?.length > 0) score += 15;
    if (profile?.skills?.length > 0) score += 10;
    return Math.min(score, 100);
  };

  const sortedApplications = [...applications].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const profileScore = calculateProfileScore();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-6 md:space-y-10 animate-in fade-in duration-700">
      {/* Profile Welcome */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <div className="size-24 md:size-32 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-4xl md:text-5xl font-black shadow-2xl relative shrink-0 overflow-hidden">
          {user.avatar_url || user.avatar ? (
            <img src={user.avatar_url || user.avatar} className="w-full h-full object-cover" alt="Profile" referrerPolicy="no-referrer" />
          ) : (
            user.name?.substring(0, 2).toUpperCase() || "??"
          )}
          <div
            className={`absolute -bottom-2 -right-2 size-8 ${user.isOnline ? "bg-green-500" : "bg-slate-400"} rounded-full border-4 border-white dark:border-slate-800`}
          ></div>
        </div>
        <div className="flex-1 text-center md:text-left w-full">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 mb-2">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter break-words text-center md:text-left">
              {user.name}
            </h1>
            {(user as any).verification_status === 'verified' && (
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest border border-emerald-100 inline-block flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">verified</span>
                Candidato Verificado
              </span>
            )}
            {(user as any).verification_status !== 'verified' && (
              <span className="bg-slate-50 text-slate-500 text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest border border-slate-100 inline-block">
                Perfil en Revisión
              </span>
            )}
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic mb-4 md:mb-6 uppercase text-xs md:text-sm tracking-tight break-all">
            {user.role === "persona" ? "Talento Nacional" : user.role} •{" "}
            {user.email}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 mt-2">
            {profile?.skills?.length > 0 ? (
              profile.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-200/60 dark:border-blue-800/60 shadow-2xs inline-flex items-center gap-1.5 shrink-0"
                >
                  <span className="size-1.5 rounded-full bg-blue-500 dark:bg-blue-400 shrink-0"></span>
                  <span>{skill}</span>
                </span>
              ))
            ) : (
              <span className="text-[10px] text-slate-400 font-medium italic">
                Sin habilidades registradas
              </span>
            )}
          </div>
        </div>
        <div className="w-full md:w-64 space-y-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Fortaleza Perfil
            </span>
            <span className="text-[10px] font-black text-primary">
              {profileScore}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000"
              style={{ width: `${profileScore}%` }}
            ></div>
          </div>
          <Link 
            to="/dashboard/persona/profile"
            className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 text-center block"
          >
            Mejorar Perfil
          </Link>
        </div>
      </div>

      {/* Interactive KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        {[
          { label: "Nacionalización", val: "Elegible", trend: "Talento Ecuatoguineano", icon: "shield_person", color: "text-amber-600", bg: "bg-amber-50", to: "/dashboard/nacionalizacion" },
          { label: "Candidaturas", val: applications.length.toString(), trend: "Procesos activos", icon: "work", color: "text-blue-600", bg: "bg-blue-50", to: "/dashboard/persona/jobs" },
          { label: "Certificaciones", val: certifications.length.toString(), trend: `${certifications.filter(c => c.verification_status === 'verified').length} validadas`, icon: "verified", color: "text-emerald-600", bg: "bg-emerald-50", to: "/dashboard/persona/certificates" },
          { label: "Fortaleza CV", val: `${profileScore}%`, trend: "Completitud", icon: "badge", color: "text-purple-600", bg: "bg-purple-50", to: "/dashboard/persona/profile" },
          { label: "Mensajes", val: "Bandeja", trend: "Comunicaciones", icon: "mail", color: "text-amber-600", bg: "bg-amber-50", to: "/dashboard/persona/messages" }
        ].map((metric, i) => (
          <Link key={i} to={metric.to} className="bg-white dark:bg-slate-800 p-4 sm:p-6 md:p-8 rounded-[1.25rem] sm:rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-primary/40 transition-all group flex flex-col justify-between cursor-pointer active:scale-[0.98]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 sm:p-3 ${metric.bg} dark:bg-opacity-10 rounded-xl sm:rounded-2xl ${metric.color} w-fit group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-lg sm:text-2xl">{metric.icon}</span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</span>
              </div>
              <span className="material-symbols-outlined text-xs text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all hidden sm:inline-block">arrow_forward</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-3">
              <span className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{metric.val}</span>
              <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-slate-400">
                {metric.trend}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Ad Banner */}
      <AdBanner type="main" />

      {/* Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
        {/* Applications Tracking */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-slate-50 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-lg font-black uppercase tracking-tight">
              Mis Candidaturas Activas
            </h3>
            <Link to="/dashboard/persona/jobs" className="bg-primary/10 hover:bg-primary hover:text-white text-primary text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest transition-all">
              {applications.length} Procesos • Ver Todos
            </Link>
          </div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700">
            {sortedApplications.length > 0 ? (
              sortedApplications.slice(0, 3).map((app, i) => (
                <Link
                  key={i}
                  to="/dashboard/persona/jobs"
                  className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all group gap-4 block"
                >
                  <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
                    <div className="size-10 md:size-12 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center font-black text-primary text-xs md:text-sm shadow-inner uppercase group-hover:scale-110 transition-transform">
                      {app.job?.company?.name?.substring(0, 2) || "AP"}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs md:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                        {app.job?.title?.es ||
                          app.job?.title?.en ||
                          "Candidatura"}
                      </h4>
                      <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                        {app.job?.company?.name || "Empresa"} •{" "}
                        {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full uppercase tracking-widest border border-emerald-100 self-start sm:self-auto shrink-0">
                    {app.status === 'submitted' || app.status === 'pending' ? 'En Revisión' : 
                     app.status === 'under_review' ? 'En Evaluación' : 
                     app.status === 'accepted' || app.status === 'hired' ? 'Aceptado' : 'Postulado'}
                  </span>
                </Link>
              ))
            ) : (
              <div className="p-8 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                No hay candidaturas activas
              </div>
            )}
          </div>
        </div>

        {/* Training and Certificates */}
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[3rem] p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-700 space-y-6 md:space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black uppercase tracking-tight">
              Certificaciones
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-emerald-500">
                SCORE: {certifications.filter(c => c.verification_status === 'verified').length * 10}/100
              </span>
            </div>
          </div>
          <div className="space-y-6">
            {certifications.length > 0 ? (
              certifications.slice(0, 3).map((cert, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest truncate max-w-[150px]">
                      {cert.title}
                    </p>
                    <div className="flex items-center gap-2">
                      {cert.verification_status === 'verified' ? (
                        <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Validado</span>
                      ) : (
                        <span className="bg-amber-50 text-amber-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase">Pendiente</span>
                      )}
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full ${cert.verification_status === 'verified' ? "bg-emerald-500" : "bg-amber-400"} rounded-full`}
                      style={{ width: `${cert.progress || (cert.verification_status === 'verified' ? 100 : 40)}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[10px] text-slate-400 font-medium italic uppercase tracking-widest text-center py-4">
                No hay certificaciones validadas
              </p>
            )}
          </div>
          
          {/* Mock Comments Section for visualization */}
          <div className="pt-6 border-t border-slate-50 dark:border-slate-700">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Últimos Comentarios</h4>
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                <div className="flex justify-between mb-1">
                  <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase">Recursos Humanos - IOC</span>
                  <span className="text-[9px] font-black text-primary">SCORE: 9/10</span>
                </div>
                <p className="text-[9px] text-slate-500 italic">"Excelente perfil técnico con certificaciones internacionales validadas."</p>
              </div>
            </div>
          </div>

          <Link to="/dashboard/persona/certificates" className="w-full py-4 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-primary hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-center inline-block">
            Gestionar Credenciales
          </Link>
        </div>
      </div>

      {/* Recommended Jobs */}
      <section className="space-y-8">
        <h3 className="text-xl font-black uppercase tracking-tight">
          Oportunidades de Empleo Sugeridas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobOffers.length > 0 ? (
            jobOffers.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="size-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                    🏢
                  </div>
                  <span className="text-[8px] font-black text-primary border border-primary px-3 py-1 rounded-full uppercase tracking-widest">
                    Contenido Nacional
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors">
                  {job.title.es}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                  {job.location} •{" "}
                  {new Date(job.posted_at).toLocaleDateString()}
                </p>
                <div className="mt-8 flex gap-3">
                  <Link
                    to={`/job/${job.id}`}
                    className="flex-1 bg-slate-900 text-white py-3 rounded-xl text-[9px] font-black text-center uppercase tracking-widest hover:bg-blue-600 transition-all"
                  >
                    Ver Detalle
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full p-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest border border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem]">
              No hay ofertas de empleo sugeridas en este momento
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TalentoDashboardOverview;
