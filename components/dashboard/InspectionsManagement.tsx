import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Plus, MapPin, Calendar, ClipboardCheck, AlertCircle } from 'lucide-react';
import { getInspections } from '../../services/supabaseApi';
import { InspectionExt } from '../../types';

const InspectionsManagement: React.FC = () => {
  const { t } = useTranslation();
  const [inspections, setInspections] = useState<InspectionExt[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchInspections = async () => {
      try {
        const data = await getInspections();
        setInspections(data as any[]);
      } catch (error) {
        console.error("Error fetching inspections:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInspections();
  }, []);

  const stats = useMemo(() => {
    return {
      pending: inspections.filter(i => i.status === 'pending').length,
      completed: inspections.filter(i => i.status === 'completed').length,
      critical: inspections.filter(i => i.priority === 'high').length,
    };
  }, [inspections]);

  const filteredInspections = useMemo(() => 
    inspections.filter(i => 
      (i.company?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.site || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.type || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  , [searchQuery, inspections]);

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Inspecciones en Terreno
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Gestión y seguimiento de auditorías técnicas y de campo.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Inspección
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 p-3 rounded-2xl">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pendientes</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 p-3 rounded-2xl">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completadas</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.completed}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 p-3 rounded-2xl">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alertas Críticas</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.critical}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar inspecciones..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          {loading ? (
            <div className="p-12 flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-700/30 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                  <th className="px-8 py-5">ID / Tipo</th>
                  <th className="px-8 py-5">Empresa / Sitio</th>
                  <th className="px-8 py-5">Fecha</th>
                  <th className="px-8 py-5">Prioridad</th>
                  <th className="px-8 py-5">Estado</th>
                  <th className="px-8 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50 dark:divide-slate-700">
                {filteredInspections.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-12 text-center opacity-50">
                      No se encontraron inspecciones.
                    </td>
                  </tr>
                ) : (
                  filteredInspections.map((ins) => (
                    <tr key={ins.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                      <td className="px-8 py-6">
                        <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">{ins.id.substring(0, 8)}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{ins.type}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-black text-[10px]">
                            {(ins.company?.name || '??').substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">{ins.company?.name || 'Empresa Desconocida'}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {ins.site}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        {ins.date}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          ins.priority === 'high' ? 'bg-rose-100 text-rose-700' : 
                          ins.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {ins.priority === 'high' ? 'Alta' : ins.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          ins.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                          ins.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 
                          'bg-amber-100 text-amber-700'
                        }`}>
                          <span className={`size-1.5 rounded-full ${
                            ins.status === 'completed' ? 'bg-emerald-500' : 
                            ins.status === 'scheduled' ? 'bg-blue-500' : 
                            'bg-amber-500'
                          }`}></span>
                          {ins.status === 'completed' ? 'Completada' : ins.status === 'scheduled' ? 'Programada' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="text-slate-400 hover:text-blue-600 transition-all p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl">
                          <ClipboardCheck className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default InspectionsManagement;
