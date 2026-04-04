import React from 'react';

const ContractManagementStats: React.FC = () => {
  const stats = [
    { label: "Contratos Activos", val: "12", trend: "+2", icon: "description", color: "text-primary", bg: "bg-blue-50" },
    { label: "Valor Adjudicado", val: "$4.5M", trend: "+15%", icon: "monetization_on", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Hitos Pendientes", val: "3", trend: "Próximos 7d", icon: "schedule", color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Cumplimiento Local", val: "85%", trend: "Meta: 80%", icon: "handshake", color: "text-indigo-600", bg: "bg-indigo-50" }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col group relative overflow-hidden transition-all hover:shadow-md">
          <div className={`p-4 ${s.bg} dark:bg-opacity-10 rounded-2xl ${s.color} w-fit mb-6`}>
            <span className="material-symbols-outlined text-2xl">{s.icon}</span>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{s.val}</span>
            <span className={`text-[9px] font-black uppercase tracking-widest ${s.color} bg-opacity-10 px-2 py-1 rounded-lg`}>{s.trend}</span>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ContractManagementStats;
