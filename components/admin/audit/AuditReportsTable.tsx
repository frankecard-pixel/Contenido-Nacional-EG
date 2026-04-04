import React from 'react';

interface AuditLog {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  entityId: string;
  timestamp: string;
  status: string;
}

interface AuditReportsTableProps {
  filteredLogs: AuditLog[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AuditReportsTable: React.FC<AuditReportsTableProps> = ({ filteredLogs, searchQuery, setSearchQuery }) => {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Log de Actividades</h2>
        <div className="flex flex-wrap gap-4">
          <div className="relative w-full sm:w-64 group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-lg">search</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white" 
              placeholder="Buscar usuario, ID..." 
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Filtros
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                <th className="py-6 px-10">Usuario</th>
                <th className="py-6 px-10">Acción</th>
                <th className="py-6 px-10">Entidad</th>
                <th className="py-6 px-10">Fecha y Hora</th>
                <th className="py-6 px-10 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all cursor-pointer">
                  <td className="py-6 px-10">
                    <div className="flex items-center gap-5">
                      <div className="size-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center font-black text-xs text-slate-500">
                        {log.userName?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">{log.userName}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.userRole}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-10">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 uppercase tracking-tight">{log.action}</p>
                  </td>
                  <td className="py-6 px-10">
                    <span className="inline-flex items-center rounded-xl bg-blue-50 dark:bg-primary/10 px-4 py-1.5 text-[9px] font-black text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-primary/20 uppercase tracking-widest">
                      {log.entityId}
                    </span>
                  </td>
                  <td className="py-6 px-10">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.timestamp}</p>
                  </td>
                  <td className="py-6 px-10 text-right">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      log.status === 'success' ? 'bg-emerald-50 text-emerald-700' : 
                      log.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                    }`}>
                      <span className={`size-1.5 rounded-full ${
                        log.status === 'success' ? 'bg-emerald-500' : 
                        log.status === 'pending' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                      }`}></span>
                      {log.status === 'success' ? 'Exitoso' : log.status === 'pending' ? 'Pendiente' : 'Fallido'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between px-10 py-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-700/20">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Mostrando <span className="text-slate-900 dark:text-white">1</span> de <span className="text-slate-900 dark:text-white">248</span> resultados
          </p>
          <nav className="flex gap-2">
            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button className="size-10 flex items-center justify-center rounded-xl bg-primary text-white font-black text-xs shadow-lg shadow-primary/20">1</button>
            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-50 transition-all shadow-sm font-black text-xs">2</button>
            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-50 transition-all shadow-sm font-black text-xs">3</button>
            <button className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-50 transition-all shadow-sm">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </nav>
        </div>
      </div>
    </section>
  );
};

export default AuditReportsTable;
