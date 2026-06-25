import React from 'react';
import { toast } from 'sonner';

interface StatItem {
  id: string;
  icon: string;
  val: string;
  desc: string;
  label: string;
}

interface CountersTabProps {
  stats: StatItem[];
  onChange: (stats: StatItem[]) => void;
  onSave: () => Promise<void>;
}

export const CountersTab: React.FC<CountersTabProps> = ({
  stats,
  onChange,
  onSave,
}) => {
  const handleUpdateVal = (idx: number, val: string) => {
    const updated = [...stats];
    updated[idx] = { ...updated[idx], val };
    onChange(updated);
  };

  const handleUpdateDesc = (idx: number, desc: string) => {
    const updated = [...stats];
    updated[idx] = { ...updated[idx], desc };
    onChange(updated);
  };

  const handleSaveAll = async () => {
    try {
      await onSave();
      toast.success('Contadores guardados con éxito');
    } catch (e) {
      toast.error('Error al guardar los contadores');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stats.map((stat, idx) => (
          <div key={stat.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white font-black uppercase text-xs tracking-widest">{stat.label}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contador Público #{idx + 1}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor a Mostrar</label>
                <input 
                  type="text" 
                  value={stat.val} 
                  onChange={(e) => handleUpdateVal(idx, e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-black dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción</label>
                <input 
                  type="text" 
                  value={stat.desc} 
                  onChange={(e) => handleUpdateDesc(idx, e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end border-t border-slate-50 dark:border-slate-700 pt-6">
        <button 
          onClick={handleSaveAll}
          className="px-10 py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all"
        >
          Guardar Todos los Contadores
        </button>
      </div>
    </div>
  );
};
