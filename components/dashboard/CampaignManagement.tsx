import React from 'react';
import { useTranslation } from 'react-i18next';
import { Megaphone, Plus, Search, Filter, Eye, MousePointerClick, TrendingUp, MoreVertical } from 'lucide-react';

const CampaignManagement: React.FC = () => {
  const { t } = useTranslation();

  const campaigns = [
    { id: 'CAM-001', name: 'Campaña Servicios Offshore', status: 'active', impressions: '450K', clicks: '12K', ctr: '2.6%', spend: '$1,200', budget: '$2,000' },
    { id: 'CAM-002', name: 'Promoción Equipos de Perforación', status: 'active', impressions: '320K', clicks: '8.5K', ctr: '2.6%', spend: '$850', budget: '$1,500' },
    { id: 'CAM-003', name: 'Webinar Seguridad Industrial', status: 'pending', impressions: '-', clicks: '-', ctr: '-', spend: '-', budget: '$500' },
    { id: 'CAM-004', name: 'Logística Marítima Q2', status: 'paused', impressions: '120K', clicks: '3.2K', ctr: '2.6%', spend: '$450', budget: '$1,000' },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Mis Campañas Publicitarias
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Gestión de anuncios y banners publicitarios en el portal oficial.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Campaña
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar campañas..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button className="p-3 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-100 transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-700/30 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                <th className="px-8 py-5">Campaña / ID</th>
                <th className="px-8 py-5">Estado</th>
                <th className="px-8 py-5">Impresiones</th>
                <th className="px-8 py-5">Clics</th>
                <th className="px-8 py-5">CTR</th>
                <th className="px-8 py-5">Gasto / Presupuesto</th>
                <th className="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50 dark:divide-slate-700">
              {campaigns.map((cam) => (
                <tr key={cam.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-xl flex items-center justify-center ${
                        cam.status === 'active' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                      }`}>
                        <Megaphone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">{cam.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">ID: {cam.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      cam.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                      cam.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      'bg-slate-100 text-slate-500'
                    }`}>
                      <span className={`size-1.5 rounded-full ${
                        cam.status === 'active' ? 'bg-emerald-500' : 
                        cam.status === 'pending' ? 'bg-amber-500' : 
                        'bg-slate-500'
                      }`}></span>
                      {cam.status === 'active' ? 'Activa' : cam.status === 'pending' ? 'En Revisión' : 'Pausada'}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">
                    {cam.impressions}
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">
                    {cam.clicks}
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">
                    {cam.ctr}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">{cam.spend} / {cam.budget}</p>
                      <div className="w-24 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full" style={{ width: cam.status === 'pending' ? '0%' : '60%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-slate-400 hover:text-blue-600 transition-all p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CampaignManagement;
