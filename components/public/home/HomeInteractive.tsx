import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import InteractiveMap from '../../InteractiveMap';
import { MOCK_NEWS, MOCK_COMPANIES } from '../../../services/mockService';

const HomeInteractive: React.FC = () => {
  const retentionData = [
    { year: '2019', inversion: 400, retencion: 180 },
    { year: '2020', inversion: 300, retencion: 150 },
    { year: '2021', inversion: 600, retencion: 320 },
    { year: '2022', inversion: 850, retencion: 480 },
    { year: '2023', inversion: 920, retencion: 590 },
    { year: '2024', inversion: 1100, retencion: 820 },
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#161d2d] border-y border-slate-100 dark:border-slate-800">
      <div className="max-w-[var(--layout-max-width)] mx-auto px-6 md:px-10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            <div className="lg:col-span-8">
              <div className="flex justify-between items-end mb-10">
                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Geolocalización Industrial</h3>
                <Link to="/directory" className="text-[10px] font-black text-primary uppercase border-b-2 border-primary pb-1 tracking-widest">Ver Directorio Completo</Link>
              </div>
              <InteractiveMap points={MOCK_COMPANIES.map(c => ({ id: c.id, lat: c.lat, lng: c.lng, title: c.name, type: 'company' }))} height="600px" />
            </div>
            <div className="lg:col-span-4 space-y-10">
               <div className="bg-primary p-12 rounded-[4rem] text-white shadow-2xl">
                  <h4 className="text-2xl font-black mb-4 uppercase tracking-tight">Retención de Valor Local</h4>
                  <p className="text-blue-100 text-sm leading-relaxed mb-10 font-medium italic">Monitoreo en tiempo real de la inversión que permanece en la economía nacional a través del sector extractivo.</p>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <BarChart data={retentionData}>
                        <Bar dataKey="retencion" fill="rgba(255,255,255,0.9)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </section>
  );
};

export default HomeInteractive;
