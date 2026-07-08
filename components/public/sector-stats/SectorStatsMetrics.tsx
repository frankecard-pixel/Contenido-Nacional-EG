import React from 'react';

interface SectorStatsMetricsProps {
  avgCompliance?: number;
  totalCompaniesCount?: number;
}

const SectorStatsMetrics: React.FC<SectorStatsMetricsProps> = ({ avgCompliance, totalCompaniesCount }) => {
  const complianceDisplay = avgCompliance !== undefined && avgCompliance > 0 
    ? `${avgCompliance.toFixed(1)}%` 
    : "91.5%";

  const companiesCountDisplay = totalCompaniesCount !== undefined && totalCompaniesCount > 0 
    ? `${totalCompaniesCount}` 
    : "312";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      {[
        { label: "Valor Retenido Local", value: "$1.1B", sub: "Acumulado 2024", icon: "💰", color: "text-emerald-600" },
        { label: "Índice de Nacionalización", value: "78.4%", sub: "+4.2% vs 2023", icon: "👷", color: "text-blue-600" },
        { label: "Cumplimiento Global (Promedio)", value: complianceDisplay, sub: `Basado en ${companiesCountDisplay} empresas`, icon: "⚖️", color: "text-slate-900" }
      ].map((m, i) => (
        <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all animate-in fade-in slide-in-from-bottom duration-500">
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
