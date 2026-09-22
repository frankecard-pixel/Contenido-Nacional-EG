
import React from 'react';
import { useTranslation } from 'react-i18next';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';

const Requirements: React.FC = () => {
  const { t } = useTranslation();

  const categories = [
    {
      title: 'Registro de Empresa (RUGE)',
      icon: 'domain',
      items: [
        'Copia del Acta de Constitución de la empresa.',
        'Copia del NIF (Número de Identificación Fiscal).',
        'Copia de la Licencia Comercial vigente.',
        'Certificado de Solvencia Fiscal actualizado.',
        'Organigrama de la empresa detallando personal nacional y extranjero.'
      ]
    },
    {
      title: 'Certificación de Contenido Nacional',
      icon: 'verified',
      items: [
        'Plan de formación y transferencia de tecnología.',
        'Listado de proveedores locales utilizados.',
        'Evidencia de contribuciones al desarrollo social.',
        'Declaración jurada de cumplimiento de cuotas de empleo nacional.',
        'Estados financieros auditados del último ejercicio.'
      ]
    },
    {
      title: 'Participación en Licitaciones',
      icon: 'gavel',
      items: [
        'Certificado RUGE vigente.',
        'Certificación de cumplimiento de Contenido Nacional.',
        'Garantía bancaria de licitación (si aplica).',
        'Propuesta técnica alineada con los requisitos del proyecto.',
        'Propuesta económica competitiva.'
      ]
    }
  ];

  return (
    <div className="pb-24 bg-background-light dark:bg-background-dark min-h-screen">
      <PublicBanner 
        title="Requisitos de Certificación" 
        subtitle="Toda empresa que desee operar en el sector de hidrocarburos de Guinea Ecuatorial debe cumplir con los siguientes requisitos legales y técnicos."
        category="Guía de Cumplimiento"
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop"
      />
      <div className="max-w-[var(--layout-max-width)] mx-auto px-6 lg:px-10 relative z-50 -mt-16 mb-12">
        <MinisterialCertification />
      </div>
      <div className="max-w-[var(--layout-max-width)] mx-auto px-6 lg:px-10 mt-20">
        {/* EXPLICACIÓN DEL TÉRMINO R.U.G.E. */}
        <div className="mb-12 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl border border-blue-900/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-black uppercase tracking-widest">
                <span className="size-2 rounded-full bg-blue-400 animate-pulse"></span>
                Definición y Acreditación Oficial
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
                ¿Qué es el R.U.G.E.?
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
                El <strong className="text-white font-bold">R.U.G.E.</strong> (<em className="not-italic text-blue-300 font-semibold">Registro Único de Guinea Ecuatorial / Registro Único de Contenido Nacional</em>) es el censo digital oficial del Ministerio de Hidrocarburos, Minas y Electricidad. Certifica de manera transparente y soberana a las empresas nacionales y al personal técnico cualificado para operar y licitar en el sector extractivo.
              </p>
            </div>
            
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
                  <span className="material-symbols-outlined">badge</span>
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white">Inscripción Obligatoria</h4>
                  <p className="text-[11px] text-slate-300 font-medium">Requisito legal para contratistas, PYMEs y profesionales.</p>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-blue-200 font-bold uppercase tracking-wider">
                <span>Reglamento MMH 2014</span>
                <span className="text-emerald-400">Vigente</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all">
              <div className="size-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8">
                <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">{cat.title}</h3>
              <ul className="space-y-4">
                {cat.items.map((item, i) => (
                  <li key={i} className="flex items-start space-x-3 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    <span className="material-symbols-outlined text-blue-500 text-lg shrink-0">check_circle</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 bg-blue-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-black mb-6 tracking-tight uppercase">¿Necesita asistencia técnica?</h2>
            <p className="text-blue-100 mb-10 font-medium">Nuestro equipo de expertos está disponible para guiarle en el proceso de registro y certificación.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="bg-white text-blue-600 px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-slate-50 transition-all">
                Contactar Soporte
              </button>
              <button className="border-2 border-white text-white px-10 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">
                Descargar Guía PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requirements;
