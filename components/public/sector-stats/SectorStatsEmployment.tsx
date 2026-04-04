import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SectorStatsEmploymentProps {
  employmentData: any[];
}

const SectorStatsEmployment: React.FC<SectorStatsEmploymentProps> = ({ employmentData }) => {
  return (
    <div className="bg-slate-900 rounded-[5rem] p-16 lg:p-24 text-white relative overflow-hidden">
      <div className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-blue-400 font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">Mercado Laboral</span>
            <h2 className="text-4xl lg:text-5xl font-black mb-8 tracking-tighter uppercase leading-tight">Nacionalización de la Fuerza Laboral</h2>
            <p className="text-slate-400 text-lg mb-12 leading-relaxed font-medium italic">
              Evolución mensual del personal nacional frente a expatriados en puestos técnicos de alta especialización.
            </p>
            <div className="space-y-6">
              {[
                { label: "Puestos Técnicos", val: "84%" },
                { label: "Puestos Directivos", val: "42%" },
                { label: "Servicios Generales", val: "100%" }
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between border-b border-white/10 pb-4">
                  <span className="text-[11px] font-black uppercase tracking-widest">{s.label}</span>
                  <span className="text-2xl font-black text-blue-400">{s.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-10 rounded-[3.5rem] border border-white/10 transition-all duration-300 h-[350px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={employmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{backgroundColor: '#0f172a', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff'}}
                />
                <Line type="monotone" dataKey="nacionals" name="Nacionales" stroke="#3b82f6" strokeWidth={4} dot={{r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff'}} />
                <Line type="monotone" dataKey="expats" name="Expatriados" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-blue-600/10 blur-[150px] rounded-full -mr-80 -mb-80"></div>
    </div>
  );
};

export default SectorStatsEmployment;
