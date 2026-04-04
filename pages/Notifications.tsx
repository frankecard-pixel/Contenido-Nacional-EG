
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getNotifications } from '../services/supabaseApi';
import { Notification, User } from '../types';

interface NotificationsProps {
  user?: User | null;
}

const Notifications: React.FC<NotificationsProps> = ({ user }) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;
      try {
        const data = await getNotifications(user.id);
        setNotifications(data as Notification[]);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user]);

  const filteredNotifications = useMemo(() => 
    filter === 'all' 
      ? notifications 
      : notifications.filter(n => n.category?.toLowerCase().includes(filter.toLowerCase()) || n.type === filter)
  , [filter, notifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'critical': return <span className="material-symbols-outlined text-[24px]">warning</span>;
      case 'opportunity': return <span className="material-symbols-outlined text-[24px]">work</span>;
      case 'application': return <span className="material-symbols-outlined text-[24px]">check_circle</span>;
      case 'message': return <span className="material-symbols-outlined text-[24px]">forum</span>;
      default: return <span className="material-symbols-outlined text-[24px]">dns</span>;
    }
  };

  const getStyle = (type: string, isRead: boolean) => {
    if (type === 'critical') return 'border-l-4 border-l-red-500 bg-white dark:bg-slate-800';
    if (!isRead) return 'border border-slate-100 dark:border-slate-700 bg-primary/5 dark:bg-primary/10';
    return 'border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 opacity-75';
  };

  return (
    <div className="flex-1 w-full max-w-[1000px] mx-auto px-4 py-12 sm:px-6 lg:px-8 animate-in fade-in duration-700 flex flex-col">
      {/* Page Heading */}
      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between shrink-0">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Centro de Notificaciones</h1>
          <p className="mt-3 text-lg text-slate-500 dark:text-slate-400 font-medium">Gestione sus alertas y comunicaciones oficiales del Ministerio de Hidrocarburos y Desarrollo Minero.</p>
        </div>
        <button className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-slate-50 transition-all shadow-sm active:scale-95">
          <span className="material-symbols-outlined text-lg">done_all</span>
          <span>Marcar todas como leídas</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Filters / Chips */}
          <div className="mb-10 overflow-x-auto pb-4 custom-scrollbar shrink-0">
            <div className="flex gap-4 min-w-max">
              {[
                { id: 'all', label: 'Todas', icon: 'notifications', count: notifications.length },
                { id: 'Oportunidades', label: 'Oportunidades', icon: 'work' },
                { id: 'Solicitudes', label: 'Solicitudes', icon: 'assignment' },
                { id: 'Documentos', label: 'Documentos', icon: 'description', dot: notifications.some(n => n.category === 'Documentos' && !n.isRead) },
                { id: 'Mensajes', label: 'Mensajes', icon: 'mail' }
              ].map(chip => (
                <button
                  key={chip.id}
                  onClick={() => setFilter(chip.id)}
                  className={`group flex h-11 items-center gap-3 rounded-xl px-5 transition-all uppercase text-[10px] font-black tracking-widest ${
                    filter === chip.id 
                    ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary/50 hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{chip.icon}</span>
                  <span>{chip.label}</span>
                  {chip.count !== undefined && <span className={`ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[9px] font-black ${filter === chip.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-700'}`}>{chip.count}</span>}
                  {chip.dot && <span className="ml-1 flex size-2 rounded-full bg-red-500 animate-pulse"></span>}
                </button>
              ))}
            </div>
          </div>

          {/* Notification List */}
          <div className="flex flex-col gap-6 flex-1">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center opacity-50 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-sm font-black uppercase tracking-widest">No hay notificaciones para mostrar</p>
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div key={n.id} className={`relative group overflow-hidden rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all ${getStyle(n.type, n.isRead)}`}>
                  <div className="flex gap-6">
                    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] shadow-inner ${
                      n.type === 'critical' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 
                      n.type === 'opportunity' ? 'bg-blue-50 dark:bg-blue-900/20 text-primary' :
                      n.type === 'application' ? 'bg-green-50 dark:bg-green-900/20 text-green-600' :
                      'bg-slate-50 dark:bg-slate-700 text-slate-400'
                    }`}>
                      {getIcon(n.type)}
                    </div>
                    
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className={`text-xl font-black uppercase tracking-tight ${!n.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                          {n.title}
                        </h3>
                        {!n.isRead && <span className="flex size-3 shrink-0 rounded-full bg-primary mt-2 shadow-[0_0_10px_rgba(19,91,236,0.5)]"></span>}
                      </div>
                      
                      <p className="text-[10px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        {n.timestamp}
                      </p>
                      
                      <p className={`mt-2 text-sm leading-relaxed font-medium uppercase tracking-tight ${!n.isRead ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-500'}`}>
                        {n.description}
                      </p>

                      {n.actionLabel && (
                        <div className="mt-6 flex gap-4">
                          <button className={`rounded-xl px-8 py-3 text-[9px] font-black uppercase tracking-widest transition-all shadow-lg ${
                            n.type === 'critical' ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/20' : 'bg-primary text-white hover:bg-blue-700 shadow-primary/20'
                          }`}>
                            {n.actionLabel}
                          </button>
                          {n.type === 'critical' && (
                            <button className="rounded-xl bg-slate-100 dark:bg-slate-700 px-8 py-3 text-[9px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-all">
                              Ver Detalles
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="shrink-0 self-start">
                      <button className="text-slate-300 hover:text-primary transition-all p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="mt-16 flex justify-center pb-20 shrink-0">
            <button className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary transition-all flex items-center gap-3 group">
              <span className="group-hover:translate-y-1 transition-transform">
                <span className="material-symbols-outlined text-lg">expand_more</span>
              </span>
              Cargar notificaciones anteriores
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;
