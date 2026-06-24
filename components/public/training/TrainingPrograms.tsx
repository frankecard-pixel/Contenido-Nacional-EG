import React from 'react';

const TrainingPrograms: React.FC = () => {
  return (
    <section className="py-24 border-t border-slate-100">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Programas de Becas Ministeriales</h2>
        <p className="text-slate-500 leading-relaxed mb-12">
          Anualmente, el Ministerio de Hidrocarburos, Minas y Electricidad otorga becas de especialización para los técnicos con mejor desempeño en los centros nacionales para estancias en centros internacionales de alta tecnología.
        </p>
        <div className="bg-blue-50 p-12 rounded-[3rem] border border-blue-100">
           <h4 className="text-blue-900 font-black text-xl mb-4 italic">¿Deseas registrarte como formador?</h4>
           <p className="text-blue-800 text-sm mb-8">Si eres una institución educativa con capacidades técnicas, puedes solicitar tu certificación como Centro de Formación Oficial.</p>
           <button className="bg-blue-700 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-blue-500/20">Iniciar Proceso de Acreditación</button>
        </div>
      </div>
    </section>
  );
};

export default TrainingPrograms;
