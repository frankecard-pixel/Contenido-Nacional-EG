import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Lock, ShieldAlert, CheckCircle2, UserCheck, ArrowRight, Building } from 'lucide-react';

const OpportunityDetailRestricted: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      {/* Tarjeta Principal de Restricción Institucional */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 p-6 sm:p-10 md:p-12 text-white shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div className="inline-flex size-14 sm:size-18 md:size-20 items-center justify-center rounded-2xl sm:rounded-3xl bg-blue-600/20 text-blue-400 border border-blue-500/30 mb-4 sm:mb-6 shadow-inner">
            <Lock className="size-7 sm:size-9 md:size-10 text-blue-400 animate-pulse" />
          </div>

          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-3 sm:mb-4">
            <ShieldAlert className="size-3 sm:size-3.5" />
            Acceso Exclusivo para Proveedores Homologados
          </div>

          <h3 className="text-xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-3 sm:mb-4 leading-tight">
            Pliego y Ficha Técnica Reservados
          </h3>

          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed font-medium mb-6 sm:mb-8 max-w-2xl mx-auto">
            Por disposición del <strong className="text-white">Ministerio de Hidrocarburos, Minas y Electricidad</strong>, las especificaciones técnicas completas, el desglose presupuestario y los pliegos de contratación están reservados exclusivamente a empresas y profesionales registrados y validados en el <strong className="text-white">Portal de Contenido Nacional (RUGE)</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
            <Link 
              to="/login" 
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 sm:py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <UserCheck className="size-4" />
              <span>Iniciar Sesión</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link 
              to="/register" 
              className="w-full sm:w-auto bg-white/10 hover:bg-white/15 border border-white/20 text-white px-8 py-3.5 sm:py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2"
            >
              <Building className="size-4" />
              <span>Registrar Empresa en RUGE</span>
            </Link>
          </div>

          {/* Cuadrícula de Beneficios de la Cuenta */}
          <div className="border-t border-white/10 pt-6 sm:pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-left">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="size-4 sm:size-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">Pliegos Completos</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Descarga inmediata de especificaciones y cuadro de precios.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="size-4 sm:size-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">Postulación Digital</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Presentación directa de ofertas técnicas y económicas online.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="size-4 sm:size-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-white">Validación Oficial</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Certificado de Contenido Nacional y seguimiento en tiempo real.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetailRestricted;
