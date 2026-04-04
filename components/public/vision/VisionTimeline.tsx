import React from 'react';

const VisionTimeline: React.FC = () => {
  return (
    <section className="bg-slate-950 text-white rounded-[4rem] p-16 relative overflow-hidden text-center">
      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="text-4xl font-black mb-12">Compromiso Gubernamental</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { year: "2024", task: "Censo Industrial" },
            { year: "2026", task: "Escuela Luba" },
            { year: "2030", task: "Hub Regional" },
            { year: "2035", task: "Total Soberanía" }
          ].map((step, i) => (
            <div key={i} className="group">
              <div className="w-16 h-16 bg-blue-700 rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-6 group-hover:scale-110 transition-transform">{step.year}</div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{step.task}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
    </section>
  );
};

export default VisionTimeline;
