import React from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SectorStatsChartsProps {
  investmentData: any[];
  complianceData: any[];
}

const SectorStatsCharts: React.FC<SectorStatsChartsProps> = ({ investmentData, complianceData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
      {/* Gráfico de Inversión */}
      <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black tracking-tighter uppercase mb-10 flex items-center">
          <span className="w-2 h-8 bg-blue-600 rounded-full mr-4"></span>
          Evolución de Retención de Valor
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={investmentData}>
              <defs>
                <linearGradient id="colorLocal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}} />
              <Tooltip 
                contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)'}}
              />
              <Area type="monotone" dataKey="total" name="Inversión Total" stroke="#e2e8f0" fill="transparent" strokeWidth={2} />
              <Area type="monotone" dataKey="local" name="Retención Local" stroke="#2563eb" fillOpacity={1} fill="url(#colorLocal)" strokeWidth={4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Cumplimiento de Operadoras */}
      <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm">
        <h3 className="text-xl font-black tracking-tighter uppercase mb-10 flex items-center">
          <span className="w-2 h-8 bg-emerald-500 rounded-full mr-4"></span>
          Auditoría de Cumplimiento por Operadora
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={complianceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 'black'}} width={120} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}}
              />
              <Bar dataKey="score" name="Puntuación %" fill="#10b981" radius={[0, 10, 10, 0]} barSize={25} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6 text-center italic">
          * Datos basados en el Reglamento 1/2014 de Contenido Nacional.
        </p>
      </div>
    </div>
  );
};

export default SectorStatsCharts;
