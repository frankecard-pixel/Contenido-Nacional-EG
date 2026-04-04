import React from 'react';
import { useTranslation } from 'react-i18next';
import { JobOffer } from '../../../types';

interface JobDetailContentProps {
  job: JobOffer;
}

const JobDetailContent: React.FC<JobDetailContentProps> = ({ job }) => {
  const { i18n } = useTranslation();

  return (
    <section className="space-y-12">
      <div>
        <h3 className="text-xl font-black mb-4">Descripción del Puesto</h3>
        <p className="text-slate-600 leading-relaxed text-lg">
          {job.description[i18n.language as any] || job.description.es}
        </p>
      </div>

      <div className="bg-blue-50 p-10 rounded-[2.5rem] border border-blue-100">
         <h4 className="font-black text-blue-900 mb-4 uppercase tracking-widest text-sm">Reserva de Empleo Local</h4>
         <p className="text-blue-800 text-sm leading-relaxed">
           Este puesto está reservado exclusivamente para ciudadanos de la República de Guinea Ecuatorial en estricto cumplimiento con la Ley de Contenido Nacional y el Reglamento de Hidrocarburos vigente.
         </p>
      </div>

      <div className="pt-8">
        <button className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-blue-500/30 hover:bg-blue-500 transition-all">
          Postular y Enviar mi CV
        </button>
      </div>
    </section>
  );
};

export default JobDetailContent;
