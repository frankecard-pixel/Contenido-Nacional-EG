import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AuditReportsChartsProps {
  chartData: { name: string; value: number }[];
  categoryData: { label: string; val: number; color: string }[];
}

const AuditReportsCharts: React.FC<AuditReportsChartsProps> = ({ chartData, categoryData }) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Registro de empresas</h3>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Nuevas incorporaciones por mes (Último año)</p>
          </div>
          <span className="text-3xl font-black text-primary tracking-tighter">120</span>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.3)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'black'}} />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: 'rgba(59, 130, 246, 0.05)'}}
                contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '15px'}}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={35} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Por Categoría</h3>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Distribución de servicios activos</p>
        </div>
        <div className="flex flex-col gap-8 mt-10 flex-1">
          {categoryData.map((cat, i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-500 dark:text-slate-400">{cat.label}</span>
                <span className="text-slate-900 dark:text-white">{cat.val}%</span>
              </div>
              <div className="h-2.5 w-full bg-slate-50 dark:bg-slate-700/50 rounded-full overflow-hidden">
                <div className={`h-full ${cat.color} rounded-full transition-all duration-1000`} style={{ width: `${cat.val}%` }}></div>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-10 pt-6 border-t border-slate-50 dark:border-slate-700 text-primary text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group">
          Ver reporte detallado
          <span className="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>
    </section>
  );
};

export default AuditReportsCharts;
