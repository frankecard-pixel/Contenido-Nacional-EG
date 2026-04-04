import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, Eye, MousePointerClick, TrendingDown, Calendar, Download, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdAnalyticsManagement: React.FC = () => {
  const { t } = useTranslation();

  const performanceData = [
    { name: 'Lun', impressions: 45000, clicks: 1200 },
    { name: 'Mar', impressions: 52000, clicks: 1500 },
    { name: 'Mie', impressions: 48000, clicks: 1300 },
    { name: 'Jue', impressions: 61000, clicks: 1800 },
    { name: 'Vie', impressions: 55000, clicks: 1600 },
    { name: 'Sab', impressions: 42000, clicks: 1100 },
    { name: 'Dom', impressions: 38000, clicks: 900 },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Analíticas de Anuncios
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Reportes detallados de impresiones, clics y rendimiento de campañas.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Últimos 7 días
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar Reporte
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Impresiones", val: "341.2K", trend: "+12.5%", isPositive: true, icon: <Eye className="w-5 h-5" />, color: "blue" },
          { label: "Clics", val: "9.4K", trend: "+8.2%", isPositive: true, icon: <MousePointerClick className="w-5 h-5" />, color: "emerald" },
          { label: "CTR Promedio", val: "2.75%", trend: "-0.4%", isPositive: false, icon: <TrendingUp className="w-5 h-5" />, color: "purple" },
          { label: "CPC Promedio", val: "$0.45", trend: "-2.1%", isPositive: true, icon: <BarChart3 className="w-5 h-5" />, color: "amber" }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${stat.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.trend}
              </span>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Rendimiento Diario</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-blue-600"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Impresiones</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-emerald-500"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clics</span>
              </div>
            </div>
          </div>
          <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}} />
                <YAxis hide />
                <Tooltip contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="impressions" fill="#2563eb" radius={[10, 10, 0, 0]} />
                <Bar dataKey="clicks" fill="#10b981" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 tracking-tight">Top Dispositivos</h3>
          <div className="space-y-8">
            {[
              { device: 'Desktop', percentage: 65, color: 'bg-blue-600' },
              { device: 'Mobile', percentage: 28, color: 'bg-purple-600' },
              { device: 'Tablet', percentage: 7, color: 'bg-amber-500' }
            ].map((item, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-900 dark:text-white">{item.device}</span>
                  <span className="text-slate-400">{item.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full transition-all duration-1000`} style={{ width: `${item.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Insight del Día</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              El tráfico desde dispositivos móviles ha aumentado un 15% en las últimas 24 horas. Considere optimizar sus banners para pantallas pequeñas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdAnalyticsManagement;
