import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts';
import { SocialProject } from '../../../types';
import { Building2, DollarSign, Target, HeartHandshake, Award } from 'lucide-react';

interface CommunityAnalyticsProps {
  projects: SocialProject[];
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#3b82f6'];

const CommunityAnalytics: React.FC<CommunityAnalyticsProps> = ({ projects }) => {
  // 1. Data for Investment by Category
  const categoryData = React.useMemo(() => {
    const categories: Record<string, number> = {};
    projects.forEach(p => {
      const cat = p.category || 'Educación';
      categories[cat] = (categories[cat] || 0) + (p.budget || 0);
    });
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: Math.round(value / 1000) // in thousands
    }));
  }, [projects]);

  // 2. Data for Projects by Status
  const statusData = React.useMemo(() => {
    const statuses: Record<string, number> = {
      'En Curso': 0,
      'Completado': 0,
      'Propuesto': 0
    };
    projects.forEach(p => {
      if (p.status === 'active' || p.status === 'in-progress') statuses['En Curso']++;
      else if (p.status === 'completed') statuses['Completado']++;
      else statuses['Propuesto']++;
    });
    return Object.entries(statuses).map(([name, value]) => ({
      name,
      value
    }));
  }, [projects]);

  // 3. Data for Investments by Operator/Investor
  const investorData = React.useMemo(() => {
    const investors: Record<string, number> = {};
    projects.forEach(p => {
      const inv = p.investor || 'Noble Energy';
      investors[inv] = (investors[inv] || 0) + (p.budget || 0);
    });
    return Object.entries(investors).map(([name, value]) => ({
      name,
      value: Math.round(value / 1000) // in thousands
    })).sort((a, b) => b.value - a.value).slice(0, 5);
  }, [projects]);

  const totalBudget = projects.reduce((acc, curr) => acc + (curr.budget || 0), 0);
  const totalBeneficiaries = projects.reduce((acc, curr) => acc + (curr.beneficiaries || 1500), 0);

  return (
    <div className="space-y-8" id="analytics-section">
      {/* Title */}
      <div className="flex justify-between items-end">
        <div>
          <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
            <Award size={12} /> Análisis de Transparencia Comunitaria
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Gráficos e Indicadores de Rendimiento
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Métricas de auditoría social y distribución del capital regulado en infraestructura pública.
          </p>
        </div>
      </div>

      {/* Grid containing charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Investment by Category */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Building2 className="text-blue-600" size={16} />
              Inversión por Sector ($ Miles)
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase">AUDITADO</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold', fontSize: '11px' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Bar dataKey="value" name="Presupuesto" fill="#2563eb" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Projects by Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Target className="text-blue-600" size={16} />
              Distribución por Estado
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase">Proyectos</span>
          </div>
          <div className="h-64 w-full flex flex-col md:flex-row items-center justify-around gap-4">
            <div className="h-full w-full max-w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Completado' ? '#10b981' : entry.name === 'En Curso' ? '#2563eb' : '#f59e0b'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                    itemStyle={{ fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4 shrink-0 min-w-[150px]">
              {statusData.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 border-b border-slate-100 dark:border-slate-800/60 pb-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.name === 'Completado' ? '#10b981' : item.name === 'En Curso' ? '#2563eb' : '#f59e0b' }}
                  />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{item.name}</p>
                    <p className="text-base font-black text-slate-800 dark:text-white">{item.value} Obras</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 3: Investment by Operator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="text-blue-600" size={16} />
              Inversión por Operadora / Empresa Financiera ($ Miles)
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase">Top 5</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={investorData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold', fontSize: '11px' }}
                  itemStyle={{ fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="value" name="Presupuesto" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommunityAnalytics;
