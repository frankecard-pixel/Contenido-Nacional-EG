import React from 'react';
import { 
  FolderKanban, 
  Sparkles, 
  Clock, 
  Users, 
  ArrowUpRight,
  Filter
} from 'lucide-react';

interface OpportunityStatsProps {
  stats: {
    total: number;
    active: number;
    drafts?: number;
    applicants: number;
  };
  activeFilter?: string;
  onSelectFilter?: (status: string) => void;
}

const OpportunityStats: React.FC<OpportunityStatsProps> = ({ 
  stats, 
  activeFilter = 'Todas', 
  onSelectFilter 
}) => {
  const cards = [
    { 
      id: 'Todas',
      label: "Total Licitaciones", 
      val: stats.total, 
      icon: FolderKanban, 
      color: "text-blue-600 dark:text-blue-400", 
      bg: "bg-blue-50 dark:bg-blue-950/50", 
      borderActive: "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/40 dark:bg-blue-950/30",
      badge: "Catálogo", 
      trend: "+12%" 
    },
    { 
      id: 'Abiertas',
      label: "Convocatorias Abiertas", 
      val: stats.active, 
      icon: Sparkles, 
      color: "text-emerald-600 dark:text-emerald-400", 
      bg: "bg-emerald-50 dark:bg-emerald-950/50", 
      borderActive: "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/30",
      badge: "Activas", 
      trend: "En plazo" 
    },
    { 
      id: 'Borradores',
      label: "En Evaluación", 
      val: stats.drafts !== undefined ? stats.drafts : (stats.total - stats.active), 
      icon: Clock, 
      color: "text-amber-600 dark:text-amber-400", 
      bg: "bg-amber-50 dark:bg-amber-950/50", 
      borderActive: "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/40 dark:bg-amber-950/30",
      badge: "Revisión", 
      trend: "Pendientes" 
    },
    { 
      id: 'Aplicantes',
      label: "Postulaciones Recibidas", 
      val: stats.applicants, 
      icon: Users, 
      color: "text-purple-600 dark:text-purple-400", 
      bg: "bg-purple-50 dark:bg-purple-950/50", 
      borderActive: "border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/40 dark:bg-purple-950/30",
      badge: "Empresas", 
      trend: "+18%" 
    }
  ];

  const handleCardClick = (id: string) => {
    if (!onSelectFilter) return;
    if (id === 'Aplicantes') {
      onSelectFilter('Todas');
    } else {
      onSelectFilter(id);
    }
  };

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
      {cards.map((s) => {
        const IconComponent = s.icon;
        const isSelected = activeFilter === s.id;

        return (
          <button
            key={s.id}
            type="button"
            onClick={() => handleCardClick(s.id)}
            className={`text-left p-3.5 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-200 flex flex-col justify-between group relative overflow-hidden active:scale-[0.98] ${
              isSelected
                ? s.borderActive
                : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-md'
            }`}
          >
            {/* Header del Cuarto: Icono y Badge */}
            <div className="flex items-center justify-between w-full mb-2 sm:mb-4">
              <div className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl ${s.bg} ${s.color} transition-transform group-hover:scale-105 shrink-0`}>
                <IconComponent className="size-4 sm:size-5" />
              </div>
              <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                isSelected 
                  ? 'bg-primary text-white' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'
              }`}>
                {isSelected ? 'Filtrado' : s.badge}
              </span>
            </div>

            {/* Valor Numérico Principal */}
            <div className="my-0.5 sm:my-1">
              <span className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none block">
                {s.val}
              </span>
            </div>

            {/* Pie del Cuarto: Etiqueta y Tendencia */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-1 mt-1 sm:mt-2 w-full pt-1 sm:pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight truncate">
                {s.label}
              </span>
              <span className={`text-[9px] font-black uppercase tracking-wider hidden xs:inline ${
                s.trend.includes('+') 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-slate-400 dark:text-slate-500'
              }`}>
                {s.trend}
              </span>
            </div>

            {/* Indicador de interactividad en hover */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <ArrowUpRight className="size-3 text-slate-400" />
            </div>
          </button>
        );
      })}
    </section>
  );
};

export default OpportunityStats;
