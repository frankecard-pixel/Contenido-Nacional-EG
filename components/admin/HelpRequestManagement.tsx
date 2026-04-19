import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, MessageSquare, AlertTriangle, CheckCircle, Search, Filter, MoreVertical, X, Loader2, User, Mail, Clock } from 'lucide-react';
import { getHelpRequests, updateHelpRequest } from '../../services/supabaseApi';
import { HelpRequest } from '../../types';

const HelpRequestManagement: React.FC = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getHelpRequests();
      setRequests(data as any[]);
    } catch (error) {
      console.error("Error fetching help requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: any) => {
    setIsUpdating(id);
    try {
      await updateHelpRequest(id, { status: newStatus });
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (error) {
      console.error("Error updating help request status:", error);
      alert("Error al actualizar el estado");
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const matchesSearch = (r.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (r.user_email || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      resolved: requests.filter(r => r.status === 'resolved' || r.status === 'completed').length,
      open: requests.filter(r => r.status === 'open').length,
    };
  }, [requests]);

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Gestión de Solicitudes y Feedback
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Administre las consultas técnicas y el feedback ciudadano recibido.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total", val: stats.total, icon: <MessageSquare />, color: "blue" },
          { label: "Pendientes", val: stats.pending, icon: <AlertTriangle />, color: "amber" },
          { label: "Abiertos", val: stats.open, icon: <Clock />, color: "indigo" },
          { label: "Resueltos", val: stats.resolved, icon: <CheckCircle />, color: "emerald" }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600`}>
                {stat.icon}
              </div>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Buscar por título, descripción o email..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm focus:ring-2 focus:ring-primary transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'open', 'resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === status 
                    ? 'bg-primary text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-slate-600'
                }`}
              >
                {status === 'all' ? 'Todos' : status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-700/30 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                <th className="px-8 py-5">Usuario / Fecha</th>
                <th className="px-8 py-5">Asunto / Categoría</th>
                <th className="px-8 py-5">Estado</th>
                <th className="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50 dark:divide-slate-700">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">{req.user_email || 'Anónimo'}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{new Date(req.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">{req.title}</p>
                      <p className="text-[10px] font-bold text-primary uppercase mt-1">{req.category || 'General'}</p>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        req.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' :
                        req.status === 'open' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400' :
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        {req.status !== 'resolved' && (
                          <button 
                            onClick={() => handleStatusChange(req.id, 'resolved')}
                            disabled={isUpdating === req.id}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"
                            title="Marcar como resuelto"
                          >
                            {isUpdating === req.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                          </button>
                        )}
                        {req.status === 'pending' && (
                          <button 
                            onClick={() => handleStatusChange(req.id, 'open')}
                            disabled={isUpdating === req.id}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                            title="Abrir ticket"
                          >
                            {isUpdating === req.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Clock className="w-5 h-5" />}
                          </button>
                        )}
                        <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl transition-all">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center opacity-50">
                    <p className="text-sm font-black uppercase tracking-widest">No se encontraron solicitudes</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HelpRequestManagement;
