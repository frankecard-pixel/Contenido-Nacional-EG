
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
