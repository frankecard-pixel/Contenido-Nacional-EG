import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getNewsletterSubscribers, getNewsletterCampaigns, createNewsletterCampaign, deleteNewsletterSubscriber } from '../services/supabaseApi';
import { toast } from 'sonner';
import { X, Send, Users, Mail, Plus } from 'lucide-react';

const NewsletterManagement: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('Campañas');
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newStatus, setNewStatus] = useState('sent'); // 'sent' or 'draft'
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [subsData, campsData] = await Promise.all([
        getNewsletterSubscribers(),
        getNewsletterCampaigns()
      ]);
      setSubscribers(subsData);
      setCampaigns(campsData);
    } catch (error) {
      console.error("Error loading newsletter data:", error);
      toast.error("Error al cargar datos de newsletter");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) {
      toast.error("Por favor rellena el título y el contenido");
      return;
    }

    try {
      setSubmitting(true);
      const campData = {
        title: newTitle,
        content: newContent,
        status: newStatus,
        recipients: newStatus === 'sent' ? subscribers.length : 0,
        open_rate: newStatus === 'sent' ? '100%' : '-',
        sent_at: newStatus === 'sent' ? new Date().toISOString() : null,
      };

      await createNewsletterCampaign(campData);
      toast.success(newStatus === 'sent' ? "¡Campaña enviada con éxito!" : "Campaña guardada como borrador");
      setIsModalOpen(false);
      setNewTitle('');
      setNewContent('');
      setNewStatus('sent');
      loadData(); // Reload list
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Error al crear campaña");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este suscriptor?")) return;
    try {
      await deleteNewsletterSubscriber(id);
      toast.success("Suscriptor eliminado");
      loadData();
    } catch (error) {
      console.error("Error deleting subscriber:", error);
      toast.error("Error al eliminar suscriptor");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100">Enviado</span>;
      case 'scheduled':
        return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100">Programado</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">Borrador</span>;
    }
  };

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Admin</span>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <span className="text-primary">Newsletter</span>
          </nav>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Gestión de Newsletter</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic max-w-2xl">Cree campañas de comunicación, gestione suscriptores y analice el impacto de sus boletines.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-xl">send</span>
          Nueva Campaña
        </button>
      </header>

      <nav className="flex space-x-1 border-b border-slate-100 dark:border-slate-800 overflow-x-auto custom-scrollbar">
        {['Campañas', 'Suscriptores', 'Plantillas', 'Estadísticas'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-3 px-8 py-5 text-[10px] font-black uppercase tracking-widest transition-all border-b-4 ${
              activeTab === tab 
                ? 'border-primary text-primary' 
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {activeTab === 'Campañas' && (
            <section className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                      <th className="py-6 px-10">Campaña</th>
                      <th className="py-6 px-10">Estado</th>
                      <th className="py-6 px-10 text-center">Destinatarios</th>
                      <th className="py-6 px-10 text-center">Tasa Apertura</th>
                      <th className="py-6 px-10">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {campaigns.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 px-10 text-center text-slate-400 font-medium italic">
                          No hay campañas creadas aún. ¡Crea una nueva!
                        </td>
                      </tr>
                    ) : (
                      campaigns.map((cam) => (
                        <tr key={cam.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                          <td className="py-8 px-10">
                            <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{cam.title}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {cam.id}</p>
                          </td>
                          <td className="py-8 px-10">{getStatusBadge(cam.status)}</td>
                          <td className="py-8 px-10 text-center font-bold text-slate-700 dark:text-slate-300">{cam.recipients}</td>
                          <td className="py-8 px-10 text-center">
                            <span className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-primary text-[10px] font-black">{cam.open_rate}</span>
                          </td>
                          <td className="py-8 px-10 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            {cam.sent_at ? new Date(cam.sent_at).toLocaleDateString() : cam.created_at ? new Date(cam.created_at).toLocaleDateString() : 'Borrador'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'Suscriptores' && (
            <section className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                      <th className="py-6 px-10">Suscriptor</th>
                      <th className="py-6 px-10">Email</th>
                      <th className="py-6 px-10">Tipo</th>
                      <th className="py-6 px-10">Fecha Registro</th>
                      <th className="py-6 px-10 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {subscribers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 px-10 text-center text-slate-400 font-medium italic">
                          No hay suscriptores registrados aún.
                        </td>
                      </tr>
                    ) : (
                      subscribers.map((sub) => (
                        <tr key={sub.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                          <td className="py-8 px-10">
                            <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{sub.name || 'Sin Nombre'}</p>
                          </td>
                          <td className="py-8 px-10 text-sm font-medium text-slate-500">{sub.email}</td>
                          <td className="py-8 px-10">
                            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">{sub.type}</span>
                          </td>
                          <td className="py-8 px-10 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            {new Date(sub.subscribed_at || sub.created_at || Date.now()).toLocaleDateString()}
                          </td>
                          <td className="py-8 px-10 text-right">
                            <button 
                              onClick={() => handleDeleteSubscriber(sub.id)}
                              className="p-2 text-slate-400 hover:text-red-500 transition-all"
                            >
                              <span className="material-symbols-outlined">person_remove</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === 'Plantillas' && (
            <div className="bg-white dark:bg-slate-800 p-12 rounded-[3rem] text-center opacity-70 border border-slate-100 dark:border-slate-700">
              <Mail className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-sm font-black uppercase tracking-widest">Módulo de Plantillas de Boletín</p>
              <p className="text-xs text-slate-400 mt-1">Crea y edita las estructuras base para tus boletines informativos.</p>
            </div>
          )}

          {activeTab === 'Estadísticas' && (
            <div className="bg-white dark:bg-slate-800 p-12 rounded-[3rem] text-center opacity-70 border border-slate-100 dark:border-slate-700">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-sm font-black uppercase tracking-widest">Módulo de Estadísticas y Análisis</p>
              <p className="text-xs text-slate-400 mt-1">Analiza las tasas de entrega, clics y desuscripciones de tus envíos.</p>
            </div>
          )}
        </>
      )}

      {/* Nueva Campaña Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] w-full max-w-xl overflow-hidden border border-slate-100 dark:border-slate-700 shadow-2xl animate-in fade-in zoom-in duration-300">
            <header className="px-8 py-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">Crear Nueva Campaña</h2>
                <p className="text-xs text-slate-400 font-medium">Diseña y distribuye un boletín informativo oficial.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <form onSubmit={handleCreateCampaign} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Título del Boletín / Campaña *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Boletín Informativo de Junio - Actualización de Contenido Nacional"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Contenido del Boletín (Markdown / Texto) *</label>
                <textarea 
                  required
                  rows={6}
                  placeholder="Escribe el cuerpo del correo o boletín que se enviará a los suscriptores..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Estado de Envío</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setNewStatus('sent')}
                    className={`p-4 rounded-2xl border text-center font-black text-[10px] uppercase tracking-widest transition-all ${
                      newStatus === 'sent'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-100 bg-slate-50 text-slate-500 dark:bg-slate-900 dark:border-slate-800'
                    }`}
                  >
                    Enviar de inmediato ({subscribers.length} destinatarios)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewStatus('draft')}
                    className={`p-4 rounded-2xl border text-center font-black text-[10px] uppercase tracking-widest transition-all ${
                      newStatus === 'draft'
                        ? 'border-primary bg-blue-50 text-primary'
                        : 'border-slate-100 bg-slate-50 text-slate-500 dark:bg-slate-900 dark:border-slate-800'
                    }`}
                  >
                    Guardar Borrador
                  </button>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-50 dark:border-slate-700">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="px-6 py-3.5 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Procesando...' : newStatus === 'sent' ? 'Enviar Boletín' : 'Guardar Borrador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterManagement;
