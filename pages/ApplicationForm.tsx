
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getOpportunityById, createApplication } from '../services/supabaseApi';
import { OpportunityExt } from '../types';

const ApplicationForm: React.FC = () => {
  const { opportunityId } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [opp, setOpp] = useState<OpportunityExt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!opportunityId) return;
      try {
        const data = await getOpportunityById(opportunityId);
        setOpp(data as any);
      } catch (error) {
        console.error("Error fetching opportunity:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunity();
  }, [opportunityId]);

  const getTranslatedText = (obj: any) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[i18n.language as any] || obj.es || '';
  };

  const steps = [
    { id: 1, label: 'Datos Empresa', icon: '1' },
    { id: 2, label: 'Cuestionario', icon: '2' },
    { id: 3, label: 'Documentos', icon: '3' },
    { id: 4, label: 'Firma', icon: '4' }
  ];

  const handleNext = async () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    else {
      // Logic for final submission
      try {
        // Mocking company ID for now, should come from auth
        const mockCompanyId = '00000000-0000-0000-0000-000000000000'; 
        await createApplication({
          opportunityId: opportunityId,
          companyId: mockCompanyId,
          status: 'under_review',
          step: 4
        });
        alert("Aplicación enviada con éxito.");
        navigate('/dashboard/company/applications');
      } catch (error) {
        console.error("Error submitting application:", error);
        alert("Hubo un error al enviar la aplicación.");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!opp) return <div className="p-20 text-center font-black">Licitación no encontrada.</div>;

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pt-0 pb-20 animate-in fade-in duration-700">
      <main className="max-w-[1280px] mx-auto px-6 lg:px-10">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-10">
          <Link to="/" className="hover:text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-base">home</span> Inicio
          </Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link to="/opportunities" className="hover:text-primary">Licitaciones</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Aplicación {opp.ref || opp.id.toUpperCase()}</span>
        </nav>

        {/* Page Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              Solicitud de Aplicación
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium italic">
              Complete el expediente digital para postular a la oportunidad de negocio.
            </p>
          </div>
          <button className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm transition-all">
            <span className="material-symbols-outlined text-xl">save</span>
            Guardar Borrador
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Steps Nav */}
            <nav className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="flex overflow-x-auto custom-scrollbar">
                {steps.map((step) => (
                  <button 
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex-1 flex items-center justify-center gap-4 px-8 py-6 border-b-4 transition-all min-w-[180px] ${
                      currentStep === step.id 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-transparent text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <span className={`flex items-center justify-center size-8 rounded-full text-xs font-black transition-all ${
                      currentStep === step.id ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                    }`}>
                      {step.icon}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{step.label}</span>
                  </button>
                ))}
              </div>
            </nav>

            {/* Form Content */}
            <div className="bg-white dark:bg-slate-800 rounded-[3.5rem] border border-slate-100 dark:border-slate-700 shadow-sm p-10 lg:p-14">
              
              {currentStep === 1 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="pb-8 border-b border-slate-50 dark:border-slate-700">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">1. Verificación de Datos de la Empresa</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Información recuperada del Registro Oficial de Contenido Nacional.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Razón Social</label>
                      <input readOnly value="Bioko Engineering Corp" className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-slate-400 cursor-not-allowed" />
                      <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="material-symbols-outlined text-xs">verified</span> Dato Verificado por el MMH
                      </p>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">NIF (Número de Identificación)</label>
                      <input readOnly value="GE-123456" className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-slate-400 cursor-not-allowed" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Representante Legal <span className="text-red-500">*</span></label>
                      <input type="text" defaultValue="Juan Manuel Obiang" className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Cargo <span className="text-red-500">*</span></label>
                      <input type="text" defaultValue="Director General" className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Dirección de Notificación <span className="text-red-500">*</span></label>
                    <textarea rows={3} className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-3xl p-6 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all resize-none" defaultValue="Malabo II, Edificio Abayak, Planta 4. Bioko Norte, Guinea Ecuatorial." />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="pb-8 border-b border-slate-50 dark:border-slate-700">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">2. Cuestionario de Capacidad</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Preguntas específicas del operador para calificar su propuesta técnica.</p>
                  </div>

                  <div className="space-y-8">
                    {[
                      "¿Cuenta con personal nacional certificado en soldadura submarina?",
                      "¿Dispone de embarcaciones con bandera nacional para este proyecto?",
                      "¿Cuál es el porcentaje de subcontratación previsto a otras PYMES locales?"
                    ].map((q, i) => (
                      <div key={i} className="space-y-4">
                        <p className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight">{i + 1}. {q}</p>
                        <div className="flex gap-6">
                           <label className="flex items-center gap-3 cursor-pointer">
                              <input type="radio" name={`q-${i}`} className="size-5 text-primary border-slate-200 focus:ring-primary/20" />
                              <span className="text-xs font-bold uppercase tracking-widest">Sí</span>
                           </label>
                           <label className="flex items-center gap-3 cursor-pointer">
                              <input type="radio" name={`q-${i}`} className="size-5 text-primary border-slate-200 focus:ring-primary/20" />
                              <span className="text-xs font-bold uppercase tracking-widest">No</span>
                           </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="pb-8 border-b border-slate-50 dark:border-slate-700">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">3. Documentación Específica</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Adjunte los anexos técnicos requeridos para esta licitación.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="p-8 border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center gap-6 group cursor-pointer hover:border-primary/20 hover:bg-blue-50/30 transition-all">
                       <div className="size-20 rounded-3xl bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-4xl">upload_file</span>
                       </div>
                       <div className="text-center">
                          <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Propuesta Técnica y Comercial</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Formato PDF (Máx 20MB)</p>
                       </div>
                       <button className="bg-primary text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20">Seleccionar Archivo</button>
                    </div>

                    <div className="p-8 rounded-[2rem] border border-emerald-100 bg-emerald-50/30 dark:bg-emerald-900/10 flex items-center justify-between group">
                       <div className="flex items-center gap-6">
                          <div className="size-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                            <span className="material-symbols-outlined text-2xl">check_circle</span>
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Certificado de Contenido Nacional</p>
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Cargado Automáticamente (Vigente)</p>
                          </div>
                       </div>
                       <button className="p-3 text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                          <span className="material-symbols-outlined">delete</span>
                       </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="pb-8 border-b border-slate-50 dark:border-slate-700">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">4. Declaración Jurada y Firma</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Confirmación final de la veracidad de los datos aportados.</p>
                  </div>

                  <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white space-y-8 shadow-2xl">
                     <p className="text-sm leading-relaxed font-medium uppercase tracking-tight opacity-80">
                        Yo, Juan Manuel Obiang, en representación de Bioko Engineering Corp, declaro bajo juramento que toda la información suministrada es veraz y que cumplimos con los porcentajes de contenido nacional establecidos en el Reglamento 2014 para la ejecución de este proyecto.
                     </p>
                     <div className="flex items-center gap-4">
                        <input type="checkbox" id="legal" className="size-6 rounded bg-white/10 border-white/20 text-primary focus:ring-primary/20" />
                        <label htmlFor="legal" className="text-xs font-black uppercase tracking-widest cursor-pointer">Acepto los términos y condiciones del Ministerio de Hidrocarburos y Desarrollo Minero</label>
                     </div>
                  </div>

                  <div className="p-10 border-2 border-slate-100 dark:border-slate-700 rounded-[2.5rem] text-center">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Área de Firma Digital Certificada</p>
                     <div className="h-40 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 mb-6">
                        <span className="text-slate-300 font-black uppercase tracking-[0.5em] text-xs">Juan Manuel Obiang — [HASH-F293A]</span>
                     </div>
                     <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Solicitar nuevo PIN de firma SMS</button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-16 flex items-center justify-between pt-10 border-t border-slate-50 dark:border-slate-700">
                <button 
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="px-10 py-4 bg-slate-50 dark:bg-slate-900 text-slate-400 disabled:opacity-20 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all"
                >
                  Anterior
                </button>
                <button 
                  onClick={handleNext}
                  className="px-12 py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-3"
                >
                  {currentStep === 4 ? 'Enviar Aplicación' : 'Siguiente Paso'}
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Opportunity Context */}
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden sticky top-24">
              <div className="h-40 relative">
                <img src={opp.image || "https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=1000&auto=format&fit=crop"} className="w-full h-full object-cover" alt="Project" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest mb-2 inline-block">Ref: {opp.ref || opp.id.toUpperCase()}</span>
                  <h4 className="text-white font-black text-lg uppercase tracking-tight leading-tight">{getTranslatedText(opp.title)}</h4>
                </div>
              </div>
              <div className="p-8 space-y-6">
                 <div className="space-y-4">
                    {[
                      { icon: 'calendar_month', label: 'Cierre', val: opp.deadline },
                      { icon: 'location_on', label: 'Ubicación', val: opp.location },
                      { icon: 'business', label: 'Operador', val: 'ExxonMobil GE' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-slate-400 text-xl">{item.icon}</span>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                          <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{item.val}</p>
                        </div>
                      </div>
                    ))}
                 </div>
                 <div className="bg-blue-50 dark:bg-primary/10 rounded-2xl p-4 border border-blue-100 dark:border-primary/20">
                    <p className="text-[9px] font-black text-blue-700 dark:text-blue-400 leading-relaxed uppercase tracking-tight">
                      Asegúrese de cargar toda la documentación requerida. Las aplicaciones incompletas son descartadas por el sistema automáticamente.
                    </p>
                 </div>
                 <div className="pt-4 border-t border-slate-50 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progreso</span>
                      <span className="text-[10px] font-black text-primary uppercase">{currentStep * 25}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                       <div className="bg-primary h-full transition-all duration-700" style={{ width: `${currentStep * 25}%` }}></div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Support Widget */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
               <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">¿Problemas Técnicos?</h4>
               <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed uppercase tracking-tight mb-6">Si encuentra errores al cargar archivos o firmar digitalmente, contacte con soporte técnico.</p>
               <button className="text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:underline">
                  Contactar Soporte <span className="material-symbols-outlined text-base">open_in_new</span>
               </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ApplicationForm;
