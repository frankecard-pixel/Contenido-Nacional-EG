
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, Megaphone, CreditCard, Eye, MousePointerClick, TrendingUp } from 'lucide-react';
import StatCard from './StatCard';
import { User } from '../types';

interface AdvertiserDashboardOverviewProps {
  user: User;
}

const AdvertiserDashboardOverview: React.FC<AdvertiserDashboardOverviewProps> = ({ user }) => {
  const { t } = useTranslation();

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Bienvenido, {user.name}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Resumen de rendimiento de sus campañas publicitarias.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
          <Megaphone className="w-4 h-4" />
          Nueva Campaña
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Impresiones Totales"
          value="1.2M"
          icon={<Eye className="w-6 h-6 text-blue-600" />}
          trend={{ value: 12, isPositive: true }}
          color="blue"
        />
        <StatCard
          title="Clics Totales"
          value="45.2K"
          icon={<MousePointerClick className="w-6 h-6 text-emerald-600" />}
          trend={{ value: 8, isPositive: true }}
          color="emerald"
        />
        <StatCard
          title="CTR Promedio"
          value="3.8%"
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          trend={{ value: 2, isPositive: true }}
          color="purple"
        />
        <StatCard
          title="Gasto Mensual"
          value="$4,250"
          icon={<CreditCard className="w-6 h-6 text-amber-600" />}
          trend={{ value: 5, isPositive: false }}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white">Rendimiento de Campañas Activas</h3>
            <button className="text-sm text-blue-600 font-semibold hover:underline">Ver todas</button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Campaña Servicios Offshore', status: 'active', impressions: '450K', clicks: '12K', spend: '$1,200', progress: 75 },
              { name: 'Promoción Equipos de Perforación', status: 'active', impressions: '320K', clicks: '8.5K', spend: '$850', progress: 45 },
              { name: 'Webinar Seguridad Industrial', status: 'pending', impressions: '-', clicks: '-', spend: '-', progress: 0 },
            ].map((campaign, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    campaign.status === 'active' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'
                  }`}>
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{campaign.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        campaign.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400'
                      }`}>
                        {campaign.status === 'active' ? 'Activa' : 'En Revisión'}
                      </span>
                    </div>
                  </div>
                </div>
                {campaign.status === 'active' && (
                  <div className="hidden md:flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Impresiones</p>
                      <p className="font-bold text-slate-900 dark:text-white">{campaign.impressions}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Clics</p>
                      <p className="font-bold text-slate-900 dark:text-white">{campaign.clicks}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Gasto</p>
                      <p className="font-bold text-slate-900 dark:text-white">{campaign.spend}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6">Slots de Publicidad</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-2xl border-2 border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Banner Principal (Home)</h4>
                <span className="text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded-lg">Premium</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Alta visibilidad en la página principal de la plataforma.</p>
              <div className="flex justify-between items-center">
                <span className="font-black text-slate-900 dark:text-white">$500 / mes</span>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700">Reservar</button>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Sidebar Dashboard</h4>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">Estándar</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Visible para usuarios registrados en el panel de control.</p>
              <div className="flex justify-between items-center">
                <span className="font-black text-slate-900 dark:text-white">$250 / mes</span>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700">Reservar</button>
              </div>
            </div>
            
            <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Newsletter Semanal</h4>
                <span className="text-xs font-bold text-slate-600 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">Estándar</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Inclusión en el boletín enviado a todas las empresas.</p>
              <div className="flex justify-between items-center">
                <span className="font-black text-slate-900 dark:text-white">$150 / envío</span>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700">Reservar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvertiserDashboardOverview;
