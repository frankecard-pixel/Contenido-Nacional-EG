import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Share2, 
  Printer, 
  MapPin, 
  DollarSign, 
  ShieldCheck, 
  Award, 
  Briefcase, 
  Layers, 
  Users, 
  Scale, 
  FileCheck, 
  FileSpreadsheet, 
  ChevronRight, 
  Info,
  Check
} from 'lucide-react';

interface OpportunityDetailContentProps {
  opp: any;
  getTranslatedText: (obj: any) => string;
}

const OpportunityDetailContent: React.FC<OpportunityDetailContentProps> = ({ opp, getTranslatedText }) => {
  const [activeTab, setActiveTab] = useState<'sow' | 'national_content' | 'submission' | 'timeline' | 'documents'>('sow');
  const [copied, setCopied] = useState(false);
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GQ', { 
      style: 'currency', 
      currency: 'XAF',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDoc = (docName: string) => {
    setDownloadingDoc(docName);
    setTimeout(() => {
      setDownloadingDoc(null);
      // Simulate file download
      const element = document.createElement("a");
      const file = new Blob([`Documento Oficial: ${docName}\nLicitación Ref: ${opp.ref || opp.id}\nMinisterio de Hidrocarburos, Minas y Electricidad - Guinea Ecuatorial`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${docName.replace(/\s+/g, '_')}_${opp.ref || opp.id}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 800);
  };

  // Standardize SOW content
  const scopeItems = opp.scopeOfWork 
    ? opp.scopeOfWork.split('\n').filter(Boolean)
    : [
        '1. Ejecución de los trabajos técnicos bajo estrictas normas de seguridad industrial y gestión ambiental (HSE).',
        '2. Despliegue de personal técnico calificado con certificación nacional e internacional.',
        '3. Suministro de materiales, herramientas y repuestos certificados conforme a los estándares de la industria.',
        '4. Elaboración y entrega de reportes periódicos de avance físico y financiero con auditoría de Contenido Nacional.',
        '5. Plan de contingencia, gestión de riesgos operacionales y aseguramiento de calidad (QA/QC).'
      ];

  const requirementsList = opp.requirements && opp.requirements.length > 0
    ? opp.requirements
    : [
        'Certificado de Registro en el Portal de Contenido Nacional (MMIE)',
        'Mínimo 80% de Personal Ecuatoguineano en Cuadrilla Técnica',
        'Certificación de Calidad ISO 9001:2015 e ISO 45001',
        'Solvencia Fiscal y Póliza de Responsabilidad Civil emitida localmente'
      ];

  return (
    <div className="space-y-10 print:space-y-6 text-slate-800 dark:text-slate-200">
      {/* 1. Barra Superior de Acciones de la Ficha Técnica */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-slate-900 text-white rounded-2xl shadow-md print:hidden">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <FileText className="size-5" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
              Ficha Técnica Oficial Homologada
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-200">
              Expediente: <span className="font-mono text-white">{opp.ref || `LIC-${opp.id.toUpperCase()}`}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-all border border-slate-700"
            title="Copiar enlace oficial"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                <span className="text-emerald-400 text-[11px]">¡Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="size-3.5 text-slate-400" />
                <span className="text-[11px] sm:text-xs">Compartir</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-all border border-slate-700"
            title="Imprimir o guardar como PDF"
          >
            <Printer className="size-3.5 text-slate-400" />
            <span className="text-[11px] sm:text-xs">Imprimir</span>
          </button>

          <Link
            to={`/apply/${opp.id}`}
            className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 active:scale-95"
          >
            <span>Postular Ahora</span>
            <ChevronRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Encabezado Institucional Oficial de la Ficha Técnica */}
      <div className="border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 p-4 sm:p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6 border-b border-slate-200 dark:border-slate-800 pb-5 sm:pb-6 mb-5 sm:mb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 text-[10px] font-black uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                <ShieldCheck className="size-3.5 text-blue-600 dark:text-blue-400" />
                Licitación Oficial MMIE
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                Convocatoria Abierta
              </span>
              {opp.tag && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-200 dark:border-amber-800">
                  Prioridad: {opp.tag}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-snug">
              {getTranslatedText(opp.title)}
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5 text-blue-600 shrink-0" />
                {opp.location}
              </span>
              <span>&bull;</span>
              <span>Categoría: {opp.category}</span>
            </p>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 p-3.5 sm:p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shrink-0">
            <div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block">Fecha Límite</span>
              <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-black text-xs sm:text-sm">
                <Clock className="size-3.5 shrink-0" />
                <span>{opp.deadline}</span>
              </div>
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase">23:59 GMT+1</span>
          </div>
        </div>

        {/* Resumen Matriz Clave */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Presupuesto Ref.</span>
            <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
              {opp.budget ? formatCurrency(opp.budget) : 'Confidencial'}
            </div>
            <span className="text-[9px] font-semibold text-slate-400">Fondo Estimado XAF</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Mano de Obra Local</span>
            <div className="text-sm sm:text-base font-black text-blue-600 dark:text-blue-400">
              Min. 80%
            </div>
            <span className="text-[9px] font-semibold text-slate-400">Ley 2014 Art. 41</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Régimen Legal</span>
            <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              RUGE / MMIE
            </div>
            <span className="text-[9px] font-semibold text-slate-400">Decreto 1/2020</span>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 shadow-xs">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Modalidad</span>
            <div className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400">
              Licitación Pública
            </div>
            <span className="text-[9px] font-semibold text-slate-400">Concurso Homologado</span>
          </div>
        </div>
      </div>

      {/* 3. Navegación por Pestañas de la Ficha Técnica */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex overflow-x-auto gap-1.5 sm:gap-2 pb-px no-scrollbar print:hidden">
        {[
          { id: 'sow', label: '1. Objeto y Alcance', icon: Layers },
          { id: 'national_content', label: '2. Contenido Nacional', icon: Award },
          { id: 'submission', label: '3. Sobres de Oferta', icon: Scale },
          { id: 'timeline', label: '4. Cronograma Oficial', icon: Calendar },
          { id: 'documents', label: '5. Pliegos y Anexos', icon: FileCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 sm:px-5 py-3 text-[11px] sm:text-xs font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 rounded-t-xl'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300'
              }`}
            >
              <Icon className={`size-3.5 sm:size-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Contenido de las Pestañas Técnicas */}
      <div className="space-y-8">
        {/* PESTAÑA 1: OBJETO Y ALCANCE (SOW) */}
        {(activeTab === 'sow' || typeof window === 'undefined') && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
                <Briefcase className="size-5 text-blue-600" />
                Descripción General del Servicio
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base font-medium">
                {getTranslatedText(opp.description)}
              </p>

              {opp.project?.name && (
                <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Proyecto Convocante</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase">{opp.project.name}</span>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-[10px] font-black uppercase">Homologado</span>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
                <Layers className="size-5 text-blue-600" />
                Alcance Detallado de Trabajos y Entregables (Scope of Work)
              </h3>
              <div className="space-y-3.5">
                {scopeItems.map((item: string, idx: number) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 group hover:border-blue-200 dark:hover:border-blue-900 transition-colors"
                  >
                    <div className="size-6 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black shrink-0 text-xs mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item.replace(/^\d+\.\s*/, '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
                <ShieldCheck className="size-5 text-emerald-600" />
                Normas Técnicas y Estándares Internacionales Aplicables
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-black text-slate-900 dark:text-white uppercase mb-1">ISO 9001:2015</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Sistema de Gestión de Calidad en Ejecución de Servicios Técnicos.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-black text-slate-900 dark:text-white uppercase mb-1">ISO 45001:2018 / HSE</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Seguridad y Salud en el Trabajo en Operaciones Industriales Offshore/Onshore.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                  <div className="text-xs font-black text-slate-900 dark:text-white uppercase mb-1">API / OPITO / ASME</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">Certificaciones internacionales para personal operativo y ensayos de campo.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: CONTENIDO NACIONAL & REQUISITOS */}
        {activeTab === 'national_content' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="size-6 text-yellow-400" />
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-yellow-400">
                    Marco Legal Obligatorio de Contenido Nacional
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-4">
                  Criterios de Homologación y Cuotas de Empleo Local
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
                  En conformidad con la Ley de Contenido Nacional de la República de Guinea Ecuatorial y las directivas del Ministerio de Hidrocarburos, Minas y Electricidad, todo contratista debe garantizar la prioridad absoluta a la mano de obra, bienes y servicios locales.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
                <Users className="size-5 text-blue-600" />
                Requisitos Obligatorios para la Empresa Oferente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requirementsList.map((req: string, i: number) => (
                  <div 
                    key={i} 
                    className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 group hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:border-blue-200 transition-all"
                  >
                    <div className="size-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black shrink-0 text-sm shadow-md shadow-blue-600/20 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide block leading-snug">
                        {req}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold mt-1 block">
                        Exigido para apertura de sobre técnico
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-center">
                <div className="text-3xl font-black text-blue-700 dark:text-blue-400 mb-1">80%</div>
                <div className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-2">Cuota de Personal Nacional</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  En cuadrillas técnicas y operativas asignadas directamente al proyecto.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-center">
                <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mb-1">60%</div>
                <div className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-2">Gasto en Proveedores Locales</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Subcontratación y suministros adquiridos a empresas registradas en RUGE.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900 text-center">
                <div className="text-3xl font-black text-purple-700 dark:text-purple-400 mb-1">100%</div>
                <div className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-2">Transferencia Tecnológica</div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Programa formal de capacitación técnica y certificación para egresados UNGE.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 3: ESTRUCTURA DE OFERTAS (SOBRES) */}
        {activeTab === 'submission' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-2.5">
                <Scale className="size-5 text-blue-600" />
                Procedimiento de Presentación de Ofertas (Sistema de Tres Sobres)
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                Las ofertas deben cargarse digitalmente a través del portal RUGE o presentarse en soporte cerrado en la Mesa de Contrataciones del MMIE.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sobre A */}
                <div className="border border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/20 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="inline-block px-3 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider mb-3">
                      Sobre A: Técnico
                    </div>
                    <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white mb-3">Memoria Técnica & HSE</h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 font-medium">
                      <li className="flex items-start gap-2">• <span>Metodología de ejecución y cronograma detallado (Gantt).</span></li>
                      <li className="flex items-start gap-2">• <span>Organigrama y CVs certificados del personal clave.</span></li>
                      <li className="flex items-start gap-2">• <span>Plan de Seguridad, Salud y Medio Ambiente (HSE Plan).</span></li>
                      <li className="flex items-start gap-2">• <span>Certificaciones de equipos, herramientas y calibración.</span></li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-blue-200/60 dark:border-blue-900/60 text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase">
                    Ponderación: 40% de la Nota Final
                  </div>
                </div>

                {/* Sobre B */}
                <div className="border border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/20 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="inline-block px-3 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider mb-3">
                      Sobre B: Económico
                    </div>
                    <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white mb-3">Oferta Financiera en XAF</h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 font-medium">
                      <li className="flex items-start gap-2">• <span>Cuadro de Precios Unitarios debidamente firmado.</span></li>
                      <li className="flex items-start gap-2">• <span>Desglose de costes directos, indirectos e impuestos.</span></li>
                      <li className="flex items-start gap-2">• <span>Garantía de mantenimiento de oferta (fianza bancaria local).</span></li>
                      <li className="flex items-start gap-2">• <span>Moneda obligatoria: Francos CFA BEAC (XAF).</span></li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-emerald-200/60 dark:border-emerald-900/60 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                    Ponderación: 35% de la Nota Final
                  </div>
                </div>

                {/* Sobre C */}
                <div className="border border-purple-200 dark:border-purple-900 bg-purple-50/30 dark:bg-purple-950/20 rounded-2xl p-6 flex flex-col justify-between">
                  <div>
                    <div className="inline-block px-3 py-1 rounded-lg bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider mb-3">
                      Sobre C: Legal & CN
                    </div>
                    <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white mb-3">Contenido Nacional & RUGE</h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 font-medium">
                      <li className="flex items-start gap-2">• <span>Certificado Oficial de RUGE emitido por el MMIE.</span></li>
                      <li className="flex items-start gap-2">• <span>Plan de Contenido Nacional y compromisos de empleo.</span></li>
                      <li className="flex items-start gap-2">• <span>Solvencia fiscal tributaria y certificado INSESO al día.</span></li>
                      <li className="flex items-start gap-2">• <span>Poderes notariales del representante legal de la empresa.</span></li>
                    </ul>
                  </div>
                  <div className="mt-6 pt-4 border-t border-purple-200/60 dark:border-purple-900/60 text-[10px] font-bold text-purple-700 dark:text-purple-400 uppercase">
                    Ponderación: 25% de la Nota Final
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 4: CRONOGRAMA OFICIAL */}
        {activeTab === 'timeline' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white mb-6 flex items-center gap-2.5">
                <Calendar className="size-5 text-blue-600" />
                Cronograma y Fases del Proceso de Licitación
              </h3>

              <div className="relative pl-6 sm:pl-8 space-y-8 border-l-2 border-blue-200 dark:border-blue-900">
                {[
                  { phase: 'Fase 1', title: 'Publicación Oficial de Bases y Pliegos', date: '01 Septiembre 2026', status: 'completed', desc: 'Disponibilidad de pliegos y apertura del periodo de consultas.' },
                  { phase: 'Fase 2', title: 'Sesión de Aclaraciones y Visita Técnica', date: '18 Septiembre 2026', status: 'completed', desc: 'Reunión técnica con empresas participantes en el Complejo Punta Europa.' },
                  { phase: 'Fase 3', title: 'Cierre de Recepción de Ofertas', date: opp.deadline || '15 Octubre 2026', status: 'current', desc: 'Límite improrrogable a las 23:59 GMT+1 en el Portal de Contenido Nacional.' },
                  { phase: 'Fase 4', title: 'Apertura de Sobres y Evaluación Técnica', date: '22 Octubre 2026', status: 'upcoming', desc: 'Comisión Mixta MMIE - Operadora evalúa cumplimiento de Contenido Nacional y requisitos.' },
                  { phase: 'Fase 5', title: 'Adjudicación y Firma de Contrato', date: '10 Noviembre 2026', status: 'upcoming', desc: 'Resolución Ministerial de adjudicación y registro del contrato oficial.' },
                ].map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[31px] sm:-left-[39px] top-1 size-5 sm:size-6 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center ${
                      step.status === 'completed' 
                        ? 'bg-emerald-500' 
                        : step.status === 'current' 
                        ? 'bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-950' 
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}></div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">{step.phase} &bull; {step.date}</span>
                        {step.status === 'current' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[9px] font-black uppercase">
                            Fase Activa
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-black uppercase text-slate-900 dark:text-white">{step.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 5: PLIEGOS Y ANEXOS */}
        {activeTab === 'documents' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-2.5">
                <FileCheck className="size-5 text-blue-600" />
                Documentos Oficiales del Pliego de Licitación
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
                Descargue los pliegos de prescripciones técnicas, modelos de declaración de contenido nacional y cuadros de precios unitarios.
              </p>

              <div className="space-y-4">
                {[
                  { name: 'Pliego de Prescripciones Técnicas Particulares (PPT)', type: 'PDF', size: '2.4 MB', icon: FileText, desc: 'Especificaciones técnicas, tolerancias, normas API/ISO y entregables.' },
                  { name: 'Cuadro de Precios Unitarios y Partidas (BoQ)', type: 'XLSX', size: '850 KB', icon: FileSpreadsheet, desc: 'Plantilla oficial obligatoria para la elaboración de la oferta económica.' },
                  { name: 'Modelo de Declaración Jurada de Contenido Nacional', type: 'PDF', size: '620 KB', icon: FileText, desc: 'Formulario oficial de compromiso de porcentaje de mano de obra y compras locales.' },
                  { name: 'Manual de Procedimiento de Seguridad y HSE del Complejo', type: 'PDF', size: '3.1 MB', icon: ShieldCheck, desc: 'Protocolos de acceso, permisos de trabajo (PTW) y prevención de riesgos.' },
                ].map((doc, idx) => {
                  const DocIcon = doc.icon;
                  const isDownloading = downloadingDoc === doc.name;
                  return (
                    <div 
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 group hover:border-blue-200 dark:hover:border-blue-900 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="size-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <DocIcon className="size-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{doc.name}</h4>
                            <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[9px] font-black uppercase">{doc.type}</span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{doc.desc}</p>
                          <span className="text-[10px] text-slate-400 font-bold block mt-1">Tamaño: {doc.size}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownloadDoc(doc.name)}
                        disabled={isDownloading}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-black uppercase tracking-wider transition-all shrink-0 shadow-sm disabled:opacity-50"
                      >
                        {isDownloading ? (
                          <>
                            <div className="size-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            <span>Descargando...</span>
                          </>
                        ) : (
                          <>
                            <Download className="size-3.5" />
                            <span>Descargar</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Bloque Inferior de Postulación y Soporte Técnico */}
      <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 print:hidden">
        <div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mesa de Aclaraciones y Soporte RUGE</div>
          <div className="text-sm font-bold text-slate-700 dark:text-slate-300 mt-1">
            Email: <span className="text-blue-600">soporte.licitaciones@mmie.gob.gq</span> &bull; Tel: +240 333 444 555
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <button 
            onClick={() => setActiveTab('documents')}
            className="flex-1 sm:flex-none px-6 py-4 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl font-black uppercase tracking-widest text-xs text-slate-700 dark:text-slate-200 transition-all text-center"
          >
            Ver Todos los Pliegos
          </button>
          
          <Link 
            to={`/apply/${opp.id}`} 
            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-600/30 transition-all active:scale-95 text-center flex items-center justify-center gap-2"
          >
            <span>Postular a esta Licitación</span>
            <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetailContent;
