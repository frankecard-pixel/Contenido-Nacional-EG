import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle, Search, Filter } from 'lucide-react';
import { getHelpRequests } from '../../services/supabaseApi';
import { HelpRequest } from '../../types';

const CitizenFeedbackManagement: React.FC = () => {
  const { t } = useTranslation();
  const [feedbacks, setFeedbacks] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const data = await getHelpRequests();
        setFeedbacks(data as any[]);
      } catch (error) {
        console.error("Error fetching help requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const stats = useMemo(() => {
    return {
      total: feedbacks.length,
      pending: feedbacks.filter(f => f.status === 'pending').length,
      resolved: feedbacks.filter(f => f.status === 'resolved' || f.status === 'completed').length,
      satisfaction: 88, // Mock satisfaction for now
    };
  }, [feedbacks]);

  const filteredFeedbacks = useMemo(() => 
    feedbacks.filter(f => 
      (f.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.category || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  , [searchQuery, feedbacks]);

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Portal de Participación Ciudadana
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Gestión de quejas, sugerencias y consultas de la ciudadanía.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Recibidos</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.total}</p>
            <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 p-2 rounded-xl">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pendientes</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.pending}</p>
            <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 p-2 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Resueltos</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.resolved}</p>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 p-2 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Satisfacción</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats.satisfaction}%</p>
            <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-600 p-2 rounded-xl">
              <ThumbsUp className="w-5 h-5" />
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
              placeholder="Buscar por título, contenido o categoría..." 
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

        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
            {filteredFeedbacks.length === 0 ? (
              <div className="col-span-full p-12 text-center opacity-50">
                <p className="text-sm font-black uppercase tracking-widest">No se encontraron feedbacks</p>
              </div>
            ) : (
              filteredFeedbacks.map((fb) => (
                <div key={fb.id} className="p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:border-blue-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 font-black text-xs shadow-sm">
                        {(fb.companyName || fb.company?.name || 'Ciudadano').substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">{fb.companyName || fb.company?.name || 'Ciudadano'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                          {fb.created_at ? new Date(fb.created_at).toLocaleDateString() : fb.date || 'Reciente'}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      fb.category === 'Queja' ? 'bg-rose-100 text-rose-700' : 
                      fb.category === 'Sugerencia' ? 'bg-blue-100 text-blue-700' : 
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {fb.category}
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 dark:text-white uppercase text-sm mb-2 tracking-tight">{fb.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                    {fb.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      fb.status === 'resolved' || fb.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                      fb.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      <span className={`size-1.5 rounded-full ${
                        fb.status === 'resolved' || fb.status === 'completed' ? 'bg-emerald-500' : 
                        fb.status === 'in-progress' ? 'bg-blue-500' : 
                        'bg-amber-500'
                      }`}></span>
                      {fb.status === 'resolved' || fb.status === 'completed' ? 'Resuelto' : fb.status === 'in-progress' ? 'En Proceso' : 'Pendiente'}
                    </span>
                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                      Responder
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenFeedbackManagement;
