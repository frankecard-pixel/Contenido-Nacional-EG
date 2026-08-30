
import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  label?: string;
  title?: string;
  value: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  textColor?: string;
  to?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  title, 
  value, 
  icon, 
  trend, 
  color = 'bg-white',
  textColor = 'text-slate-900',
  to,
  onClick
}) => {
  const displayTitle = title || label;
  
  // If it's the advanced version (has icon or trend)
  if (icon || trend) {
    const colorClasses: Record<string, string> = {
      blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
      emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
      purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600',
      amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
      rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600',
    };

    const iconBg = colorClasses[color] || 'bg-slate-50 dark:bg-slate-900/50 text-slate-600';

    const cardContent = (
      <div className={`bg-white dark:bg-slate-800 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 group flex flex-col justify-between ${to || onClick ? 'cursor-pointer active:scale-[0.98]' : ''}`}>
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${iconBg}`}>
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
              trend.isPositive 
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400' 
                : 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400'
            }`}>
              {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend.value}%
            </div>
          )}
        </div>
        <div>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>{displayTitle}</span>
            {to && <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-primary transition-all">arrow_forward</span>}
          </p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
        </div>
      </div>
    );

    if (to) {
      return <Link to={to} className="block no-underline">{cardContent}</Link>;
    }
    if (onClick) {
      return <div onClick={onClick} className="block">{cardContent}</div>;
    }
    return cardContent;
  }

  const isDark = color === "bg-blue-700";
  
  // Simple version for backward compatibility
  const simpleCard = (
    <div className={`${color} p-6 md:p-8 rounded-xl md:rounded-2xl shadow-lg border ${isDark ? 'border-blue-600' : 'border-slate-100'} flex flex-col justify-center transform hover:-translate-y-1 transition-all duration-300 ${to || onClick ? 'cursor-pointer' : ''}`}>
      <p className={`text-[9px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-blue-200' : 'text-slate-400'}`}>
        {displayTitle}
      </p>
      <div className="flex items-baseline space-x-1">
        <p className={`text-4xl font-black tracking-tighter ${textColor}`}>
          {value}
        </p>
        <span className={`text-sm font-bold ${isDark ? 'text-blue-300' : 'text-slate-300'}`}>+</span>
      </div>
    </div>
  );

  if (to) {
    return <Link to={to} className="block no-underline">{simpleCard}</Link>;
  }
  if (onClick) {
    return <div onClick={onClick}>{simpleCard}</div>;
  }
  return simpleCard;
};

export default StatCard;
