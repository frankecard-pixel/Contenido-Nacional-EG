import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LandingStats: React.FC = () => {
  const { t } = useTranslation();

  const data = [
    { name: '2019', value: 400 },
    { name: '2020', value: 300 },
    { name: '2021', value: 600 },
    { name: '2022', value: 850 },
    { name: '2023', value: 920 },
    { name: '2024', value: 1100 },
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-[var(--layout-max-width)] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-5">
              <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
                  Crecimiento del Sector Local
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                  Monitoreamos en tiempo real la evolución de las capacidades técnicas nacionales para asegurar un crecimiento sostenible y equitativo.
              </p>
              <div className="space-y-6">
                  {[
                      { label: t('common.stats.companies'), val: '1,240', color: 'bg-blue-600' },
                      { label: t('common.stats.active_opps'), val: '85', color: 'bg-orange-500' },
                      { label: t('common.stats.value'), val: '$45.2M', color: 'bg-green-500' }
                  ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full ${s.color} mr-3`}></div>
                              <span className="font-bold text-slate-700">{s.label}</span>
                          </div>
                          <span className="font-black text-slate-900">{s.val}</span>
                      </div>
                  ))}
              </div>
          </div>
          <div className="lg:col-span-7 bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner">
              <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <BarChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                          <Tooltip 
                              contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                              cursor={{fill: '#f1f5f9'}}
                          />
                          <Bar dataKey="value" fill="#1e40af" radius={[10, 10, 0, 0]} barSize={40} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingStats;
