import React from 'react';

const CompanyMetricsRow: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[
        { label: "Aplicaciones", val: "12", trend: "+2 este mes", icon: "send", color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Ganados", val: "2", trend: "Total histórico", icon: "trophy", color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Oportunidades", val: "8", trend: "3 nuevas", icon: "visibility", color: "text-orange-600", bg: "bg-orange-50" },
        { label: "Cumplimiento", val: "A-", trend: "Score General", icon: "verified", color: "text-teal-600", bg: "bg-teal-50" }
      ].map((metric, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all group">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-3 ${metric.bg} dark:bg-opacity-10 rounded-2xl ${metric.color}`}>
              <span className="material-symbols-outlined text-2xl">{metric.icon}</span>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{metric.val}</span>
            <span className={`text-[9px] font-black uppercase tracking-widest ${metric.trend.includes('+') ? 'text-green-600 bg-green-50 px-2 py-1 rounded-lg' : 'text-slate-400'}`}>
              {metric.trend}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompanyMetricsRow;
