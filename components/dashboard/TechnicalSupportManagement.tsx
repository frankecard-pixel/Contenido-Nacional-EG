import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, MessageSquare, BookOpen, Video, Phone, Search, Filter } from 'lucide-react';
import { getHelpRequests } from '../../services/supabaseApi';
import { HelpRequest } from '../../types';

const TechnicalSupportManagement: React.FC = () => {
  const { t } = useTranslation();
  const [supportTickets, setSupportTickets] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getHelpRequests();
        // Filter for support related categories if possible, or just show all for now
        setSupportTickets(data as any[]);
      } catch (error) {
        console.error("Error fetching support tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Asistencia Técnica y Soporte
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Recursos y soporte especializado para el crecimiento de PYMEs nacionales.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Nueva Consulta
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
          <div className="size-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center mb-6">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-2 tracking-tight">Base de Conocimientos</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">Acceda a guías detalladas, manuales y tutoriales sobre el cumplimiento de contenido nacional.</p>
          <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Explorar Guías</button>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
          <div className="size-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center mb-6">
            <Video className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-2 tracking-tight">Webinars y Talleres</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">Participe en sesiones en vivo con expertos del sector sobre mejores prácticas y normativas.</p>
          <button className="text-[10px] font-black text-purple-600 uppercase tracking-widest hover:underline">Ver Calendario</button>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
          <div className="size-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center mb-6">
            <Phone className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-2 tracking-tight">Soporte Directo</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">Hable directamente con un asesor técnico para resolver dudas específicas sobre su empresa.</p>
          <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Solicitar Llamada</button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Mis Consultas Recientes</h3>
          <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white">Ver Historial</button>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-slate-700">
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : supportTickets.length === 0 ? (
            <div className="p-12 text-center opacity-50">
              <p className="text-sm font-black uppercase tracking-widest">No hay consultas registradas</p>
            </div>
          ) : (
            supportTickets.map((ticket) => (
              <div key={ticket.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`size-10 rounded-xl flex items-center justify-center ${
                    ticket.status === 'pending' || ticket.status === 'open' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                  }`}>
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{ticket.title}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">ID: {ticket.id.substring(0, 8)} • {new Date(ticket.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    ticket.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                    ticket.status === 'open' || ticket.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {ticket.status === 'pending' ? 'Pendiente' : ticket.status === 'open' || ticket.status === 'in-progress' ? 'En Proceso' : 'Resuelto'}
                  </span>
                  <button className="text-slate-400 hover:text-blue-600 transition-all">
                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalSupportManagement;
