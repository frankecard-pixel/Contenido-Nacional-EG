
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle, Clock, Search, Filter, Download, Eye } from 'lucide-react';

const AdminCertificationManagement: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Pendientes');
  
  const pendingCertifications = [
    { id: 'cert-1', user: 'Juan Pérez', title: 'Técnico en Perforación Offshore', issuer: 'GEPetrol Academy', date: '2024-03-20', status: 'pending' },
    { id: 'cert-2', user: 'Empresa Minera X', title: 'Certificación ISO 14001', issuer: 'SGS', date: '2024-03-25', status: 'pending' },
    { id: 'cert-3', user: 'María Nchama', title: 'Seguridad Industrial Nivel 3', issuer: 'OSHA', date: '2024-04-01', status: 'pending' },
  ];

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Admin</span>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <span className="text-primary">Verificación de Certificados</span>
          </nav>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Validación de Certificaciones</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic max-w-2xl">Revise y valide los certificados subidos por empresas y profesionales para otorgar sellos de confianza.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pendientes</p>
          <p className="text-4xl font-black text-blue-600 tracking-tighter">12</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Validados Hoy</p>
          <p className="text-4xl font-black text-emerald-500 tracking-tighter">45</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rechazados</p>
          <p className="text-4xl font-black text-rose-500 tracking-tighter">3</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Histórico</p>
          <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">1,240</p>
        </div>
      </div>

      <nav className="flex space-x-1 border-b border-slate-100 dark:border-slate-800 overflow-x-auto custom-scrollbar">
        {['Pendientes', 'Validados', 'Rechazados', 'Todos'].map((tab) => (
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

      <section className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                <th className="py-6 px-10">Usuario / Entidad</th>
                <th className="py-6 px-10">Certificación</th>
                <th className="py-6 px-10">Emisor</th>
                <th className="py-6 px-10">Fecha Subida</th>
                <th className="py-6 px-10 text-right">Acciones de Validación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {pendingCertifications.map((cert) => (
                <tr key={cert.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                  <td className="py-8 px-10">
                    <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{cert.user}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {cert.id}</p>
                  </td>
                  <td className="py-8 px-10">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-tight">{cert.title}</p>
                  </td>
                  <td className="py-8 px-10 text-xs font-bold text-slate-500 uppercase tracking-widest">{cert.issuer}</td>
                  <td className="py-8 px-10 text-xs font-bold text-slate-500 uppercase tracking-widest">{cert.date}</td>
                  <td className="py-8 px-10 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button className="size-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-blue-50 hover:text-primary transition-all shadow-sm" title="Ver Documento">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm" title="Validar">
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm" title="Rechazar">
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminCertificationManagement;
