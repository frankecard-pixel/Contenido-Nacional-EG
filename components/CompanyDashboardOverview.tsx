
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getOpportunities, getApplicationsByCompany } from '../services/supabaseApi';
import { ApplicationExt, OpportunityExt, Company } from '../types';
import AdBanner from './AdBanner';
import CommodityWidget from './dashboard/CommodityWidget';

interface CompanyDashboardOverviewProps {
  company: Company;
}

const CompanyDashboardOverview: React.FC<CompanyDashboardOverviewProps> = ({ company }) => {
  const { t, i18n } = useTranslation();
  const [myApplications, setMyApplications] = useState<ApplicationExt[]>([]);
  const [recommendedOpps, setRecommendedOpps] = useState<OpportunityExt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsData, oppsData] = await Promise.all([
          getApplicationsByCompany(company.id),
          getOpportunities()
        ]);
        
        setMyApplications(appsData as any);
        
        // Recomendadas (basado en sectores)
        const recommended = (oppsData as any).filter((opp: OpportunityExt) => 
          company.sector?.some(s => opp.category?.includes(s))
        ).slice(0, 2);
        
        setRecommendedOpps(recommended.length > 0 ? recommended : (oppsData as any).slice(0, 2));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (company?.id) {
      fetchData();
    }
  }, [company]);

  const getTranslatedText = (obj: any) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[i18n.language as any] || obj.es || '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-10 space-y-6 md:space-y-10 animate-in fade-in duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase break-words">
            Bienvenido, {company.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Aquí está el resumen de su actividad y cumplimiento en el sector de hidrocarburos.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-4 md:mt-0">
          <button className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-all shadow-sm">
            <span className="material-symbols-outlined text-lg mr-2">download</span>
            Reporte Mensual
          </button>
          <button className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-primary border border-transparent rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95">
            <span className="material-symbols-outlined text-lg mr-2">edit</span>
            Editar Perfil
          </button>
        </div>
      </div>

      {/* Top Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Profile Completeness (Large) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-primary to-blue-700 rounded-[2rem] md:rounded-[2.5rem] p-6 lg:p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform group-hover:scale-110 duration-700"></div>
          <div className="relative z-10 flex flex-col sm:flex-row gap-8 lg:gap-10 items-center">
            <div 
              className="rounded-full border-8 border-white/20 flex flex-shrink-0 items-center justify-center relative shadow-inner bg-white/5 transition-all duration-300 w-24 h-24 sm:w-32 sm:h-32"
            >
              <svg className="size-full -rotate-90 transform" viewBox="0 0 36 36">
                <path className="text-white/20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-white drop-shadow-lg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray="75, 100" strokeLinecap="round" strokeWidth="3" />
              </svg>
              <span className="absolute text-3xl font-black tracking-tighter">75%</span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-2xl font-black mb-3 uppercase tracking-tight">Perfil de Empresa casi completo</h3>
              <p className="text-blue-100 text-sm mb-8 max-w-md font-medium leading-relaxed uppercase tracking-wide">
                Para acceder a licitaciones de Nivel 1, necesita completar su documentación fiscal y actualizar sus certificaciones ISO.
              </p>
              <button className="bg-white text-primary text-[10px] font-black uppercase tracking-[0.2em] px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-all inline-flex items-center shadow-lg">
                Completar ahora
                <span className="material-symbols-outlined text-base ml-2">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Urgent Compliance Alert */}
        <div className="bg-white dark:bg-slate-800 border-l-8 border-amber-500 rounded-[2rem] md:rounded-[2.5rem] p-6 lg:p-10 shadow-sm flex flex-col justify-between border border-slate-100 dark:border-slate-700">
          <div>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500 font-black uppercase tracking-widest text-xs">
                <span className="material-symbols-outlined text-2xl">warning</span>
                <h3>Acción Requerida</h3>
              </div>
              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest">Urgente</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed font-medium uppercase tracking-tight">
              Su <strong>Certificado de Solvencia Fiscal</strong> vence en 5 días. La renovación es necesaria para mantener su estatus activo.
            </p>
          </div>
          <button className="w-full py-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
            Subir Documento
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: "Aplicaciones", val: "12", trend: "+2 este mes", icon: "send", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Ganados", val: "2", trend: "Total histórico", icon: "trophy", color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Oportunidades", val: "8", trend: "3 nuevas", icon: "visibility", color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Cumplimiento", val: "A-", trend: "Score General", icon: "verified", color: "text-teal-600", bg: "bg-teal-50" }
        ].map((metric, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all group">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 ${metric.bg} dark:bg-opacity-10 rounded-2xl ${metric.color}`}>
                <span className="material-symbols-outlined text-2xl">{metric.icon}</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{metric.val}</span>
              <span className={`text-[9px] font-black uppercase tracking-widest ${metric.trend.includes('+') ? 'text-green-600 bg-green-50 px-2 py-1 rounded-lg' : 'text-slate-400'}`}>
                {metric.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Commodity Widget */}
      <div>
        <CommodityWidget />
      </div>

      {/* Ad Banner */}
      <AdBanner 
        type="main"
        title="Equipos de Perforación de Última Generación"
        description="Descubra nuestra nueva línea de equipos diseñados para maximizar la eficiencia en plataformas offshore."
        sponsor="Global Ads (Anunciante)"
        imageUrl="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"
        link="https://example.com"
      />

      {/* Main Dashboard Split */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-10">
        {/* Left Column (2/3) */}
        <div className="xl:col-span-2 space-y-6 md:space-y-10">
          {/* Recommended Opportunities */}
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3 uppercase tracking-tighter">
                <span className="material-symbols-outlined text-primary text-2xl">recommend</span>
                Oportunidades Recomendadas
              </h2>
              <Link to="../opportunities" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Ver todas</Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {recommendedOpps.map(opp => (
                <div key={opp.id} className="p-6 md:p-8 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all group">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 md:gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[9px] px-3 py-1 rounded-lg font-black uppercase tracking-widest">Licitación</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ref: {opp.id.toUpperCase()}</span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors uppercase tracking-tight leading-tight">
                        {getTranslatedText(opp.title)}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-tight">
                        {opp.petroleraId === 'u-4' ? 'Marathon Oil' : 'Operadora Local'} • {opp.location}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-5">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-[9px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                          <span className="material-symbols-outlined text-base mr-2">calendar_month</span>
                          Cierre: {opp.deadline}
                        </span>
                        <span className="inline-flex items-center px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-900/20 text-[9px] font-black text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30 uppercase tracking-widest">
                          <span className="material-symbols-outlined text-base mr-2">auto_awesome</span>
                          95% Coincidencia
                        </span>
                      </div>
                    </div>
                    <button className="shrink-0 w-full sm:w-auto mt-4 sm:mt-0 rounded-2xl border border-slate-200 dark:border-slate-700 p-3 text-slate-400 hover:text-primary hover:border-primary transition-all flex justify-center items-center">
                      <span className="material-symbols-outlined">bookmark</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Applications Table */}
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700">
              <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Estado de Aplicaciones</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700/50 text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Proyecto</th>
                    <th className="px-8 py-5">Empresa</th>
                    <th className="px-8 py-5 text-center">Fecha Envío</th>
                    <th className="px-8 py-5">Estado</th>
                    <th className="px-8 py-5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {myApplications.length > 0 ? myApplications.map(app => {
                    const projectName = (app as any).opportunity?.title?.es || app.projectName || 'Proyecto';
                    const companyName = (app as any).company?.name || 'Noble Energy';
                    
                    return (
                    <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="px-8 py-6 font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">
                        {projectName}
                      </td>
                      <td className="px-8 py-6 text-[11px] font-bold text-slate-500 uppercase">{companyName}</td>
                      <td className="px-8 py-6 text-center text-[10px] font-bold text-slate-400">
                        {new Date(app.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          app.status === 'under_review' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                        }`}>
                          <span className={`size-2 rounded-full ${app.status === 'under_review' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                          {app.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  )}) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-black uppercase tracking-widest text-xs">
                        No hay aplicaciones activas en este momento.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="flex flex-col gap-6 md:gap-8 xl:col-span-1">
          {/* Messages Widget */}
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-fit overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Mensajes</h2>
              <span className="bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">1 Nuevo</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              <div className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all cursor-pointer bg-blue-50/30 dark:bg-primary/5 border-l-4 border-primary">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-black text-[11px] text-slate-900 dark:text-white uppercase tracking-tight">Ministerio de Hidrocarburos y Desarrollo Minero</span>
                  <span className="text-[10px] font-bold text-slate-400">2h</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 font-medium leading-relaxed uppercase tracking-tight">
                  Por favor actualice su anexo técnico sobre capacidades logísticas antes del viernes.
                </p>
              </div>
              <div className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-all cursor-pointer border-l-4 border-transparent opacity-60">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-black text-[11px] text-slate-700 dark:text-slate-200 uppercase tracking-tight">Soporte Técnico</span>
                  <span className="text-[10px] font-bold text-slate-400">Ayer</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-medium uppercase tracking-tight">
                  Su ticket #4592 ha sido resuelto. Confirme si puede acceder a la sección de...
                </p>
              </div>
            </div>
            <div className="p-6 bg-slate-50 dark:bg-slate-700/30 text-center">
              <Link to="../messages" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Ir a bandeja de entrada</Link>
            </div>
          </div>

          {/* Documentation Status */}
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 space-y-6 md:space-y-8">
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Estado Documental</h2>
            <div className="space-y-6">
              {[
                { label: "Registro Mercantil", status: "ok", expiry: "Vigente" },
                { label: "Seguro Social (INSESO)", status: "ok", expiry: "Vigente" },
                { label: "Solvencia Fiscal", status: "warn", expiry: "Expira pronto" },
                { label: "Certificado ISO 9001", status: "none", expiry: "Faltante" }
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <span className={`material-symbols-outlined text-2xl ${
                      doc.status === 'ok' ? 'text-green-500' : doc.status === 'warn' ? 'text-amber-500' : 'text-slate-300'
                    }`}>
                      {doc.status === 'ok' ? 'check_circle' : doc.status === 'warn' ? 'error' : 'radio_button_unchecked'}
                    </span>
                    <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{doc.label}</span>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${
                    doc.status === 'warn' ? 'text-amber-600' : 'text-slate-400'
                  }`}>{doc.expiry}</span>
                </div>
              ))}
            </div>
            <button className="w-full py-4 flex items-center justify-center gap-3 text-[10px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-[0.2em] border-2 border-slate-100 dark:border-slate-700 rounded-2xl hover:bg-slate-50 transition-all">
              <span className="material-symbols-outlined text-xl">upload_file</span>
              Gestionar Documentos
            </button>
          </div>

          {/* Support Widget */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/10 rounded-2xl text-yellow-400 shadow-inner">
                  <span className="material-symbols-outlined text-2xl">help</span>
                </div>
                <h3 className="font-black text-xl tracking-tight uppercase">¿Necesita Ayuda?</h3>
              </div>
              <p className="text-sm text-slate-300 mb-8 font-medium leading-relaxed uppercase tracking-tight">
                Contacte con la mesa de ayuda del Ministerio de Hidrocarburos y Desarrollo Minero para soporte técnico o legal sobre el portal.
              </p>
              <button className="text-[10px] font-black text-white bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-4 rounded-xl w-full transition-all uppercase tracking-[0.2em]">
                Contactar Soporte
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 blur-[60px] rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboardOverview;
