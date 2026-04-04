import React from 'react';

const SectorStatsMetrics: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {[
        { label: "Valor Retenido Local", value: "$1.1B", sub: "Acumulado 2024", icon: "💰", color: "text-emerald-600" },
        { label: "Índice de Nacionalización", value: "78.4%", sub: "+4.2% vs 2023", icon: "👷", color: "text-blue-600" },
        { label: "Cumplimiento Global", value: "91.5%", sub: "Meta Ministerial: 95%", icon: "⚖️", color: "text-slate-900" }
      ].map((m, i) => (
        <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
          <div className="text-4xl mb-6">{m.icon}</div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{m.label}</p>
          <p className={`text-4xl font-black tracking-tighter ${m.color} mb-2`}>{m.value}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.sub}</p>
        </div>
      ))}
    </div>
  );
};

export default SectorStatsMetrics;
