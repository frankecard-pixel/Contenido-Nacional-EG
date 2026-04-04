
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const NewsletterManagement: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Campañas');
  
  const campaigns = [
    { id: 'cam-1', title: 'Boletín Mensual - Marzo 2024', status: 'sent', recipients: 1240, openRate: '68%', date: '2024-03-15' },
    { id: 'cam-2', title: 'Nuevas Normativas de Minería', status: 'draft', recipients: 0, openRate: '-', date: '-' },
    { id: 'cam-3', title: 'Convocatoria Licitación Offshore', status: 'scheduled', recipients: 850, openRate: '-', date: '2024-04-10' },
  ];

  const subscribers = [
    { id: 'sub-1', email: 'empresa1@example.com', name: 'Empresa Petrolera A', type: 'Empresa', date: '2024-01-10' },
    { id: 'sub-2', email: 'juan.perez@gmail.com', name: 'Juan Pérez', type: 'Persona', date: '2024-02-15' },
    { id: 'sub-3', email: 'mining_co@eg.com', name: 'Mining Co. EG', type: 'Empresa', date: '2024-03-01' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100">Enviado</span>;
      case 'scheduled':
        return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100">Programado</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">Borrador</span>;
    }
  };

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Admin</span>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <span className="text-primary">Newsletter</span>
          </nav>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Gestión de Newsletter</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic max-w-2xl">Cree campañas de comunicación, gestione suscriptores y analice el impacto de sus boletines.</p>
        </div>
        <button className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95">
          <span className="material-symbols-outlined text-xl">send</span>
          Nueva Campaña
        </button>
      </header>

      <nav className="flex space-x-1 border-b border-slate-100 dark:border-slate-800 overflow-x-auto custom-scrollbar">
        {['Campañas', 'Suscriptores', 'Plantillas', 'Estadísticas'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-3 px-8 py-5 text-[10px] font-black uppercase tracking-widest transition-all border-b-4 ${
              activeTab === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {activeTab === 'Campañas' && (
        <section className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                  <th className="py-6 px-10">Campaña</th>
                  <th className="py-6 px-10">Estado</th>
                  <th className="py-6 px-10 text-center">Destinatarios</th>
                  <th className="py-6 px-10 text-center">Tasa Apertura</th>
                  <th className="py-6 px-10">Fecha</th>
                  <th className="py-6 px-10 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {campaigns.map((cam) => (
                  <tr key={cam.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                    <td className="py-8 px-10">
                      <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{cam.title}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {cam.id}</p>
                    </td>
                    <td className="py-8 px-10">{getStatusBadge(cam.status)}</td>
                    <td className="py-8 px-10 text-center font-bold text-slate-700 dark:text-slate-300">{cam.recipients}</td>
                    <td className="py-8 px-10 text-center">
                      <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary text-[10px] font-black">{cam.openRate}</span>
                    </td>
                    <td className="py-8 px-10 text-xs font-bold text-slate-500 uppercase tracking-widest">{cam.date}</td>
                    <td className="py-8 px-10 text-right">
                      <button className="p-2 text-slate-400 hover:text-primary transition-all"><span className="material-symbols-outlined">more_vert</span></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'Suscriptores' && (
        <section className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                  <th className="py-6 px-10">Suscriptor</th>
                  <th className="py-6 px-10">Email</th>
                  <th className="py-6 px-10">Tipo</th>
                  <th className="py-6 px-10">Fecha Registro</th>
                  <th className="py-6 px-10 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                    <td className="py-8 px-10">
                      <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{sub.name}</p>
                    </td>
                    <td className="py-8 px-10 text-sm font-medium text-slate-500">{sub.email}</td>
                    <td className="py-8 px-10">
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200">{sub.type}</span>
                    </td>
                    <td className="py-8 px-10 text-xs font-bold text-slate-500 uppercase tracking-widest">{sub.date}</td>
                    <td className="py-8 px-10 text-right">
                      <button className="p-2 text-slate-400 hover:text-red-500 transition-all"><span className="material-symbols-outlined">person_remove</span></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
};

export default NewsletterManagement;
