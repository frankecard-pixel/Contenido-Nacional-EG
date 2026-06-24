import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Megaphone, Plus, Search, Filter, Eye, MousePointerClick, TrendingUp, MoreVertical, X, Upload, Loader2, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { getAdvertisements, createAdvertisement, deleteAdvertisement, uploadFile, updateAdvertisement } from '../../services/supabaseApi';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { FileUploaderWithPreview } from '../FileUploaderWithPreview';

const CampaignManagement: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    image_url: '',
    link_url: '',
    status: 'active',
    budget: 0
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const data = await getAdvertisements();
      setCampaigns(data || []);
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImage = async (data: { base64?: string; url?: string; fileName?: string }) => {
    try {
      let imageUrl = '';
      if (data.url) {
        imageUrl = data.url;
      } else if (data.base64) {
        const fileType = data.base64.split(';')[0].split(':')[1] || 'image/png';
        const fileName = `ad_${Date.now()}_${data.fileName || 'banner'}`;
        await uploadFile('advertisements', fileName, data.base64, fileType);
        imageUrl = `${process.env.VITE_SUPABASE_URL || 'https://vsp-supabase.co'}/storage/v1/object/public/advertisements/${fileName}`;
      }
      
      if (imageUrl) {
        setNewAd({ ...newAd, image_url: imageUrl });
        alert("Imagen de banner lista y cargada");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen");
    } finally {
      setShowUploader(false);
    }
  };

  const handleCreateAd = async () => {
    if (!newAd.title || !newAd.image_url) {
      alert("Por favor complete el título y suba una imagen");
      return;
    }
    setIsSaving(true);
    try {
      await createAdvertisement(newAd);
      alert("Anuncio creado con éxito");
      setShowCreateModal(false);
      fetchAds();
    } catch (error) {
      console.error("Error creating ad:", error);
      alert("Error al crear el anuncio");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este anuncio?')) {
      try {
        await deleteAdvertisement(id);
        fetchAds();
      } catch (error) {
        console.error("Error deleting ad:", error);
      }
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await updateAdvertisement(id, { status });
      alert(`Anuncio ${status === 'active' ? 'aprobado' : 'rechazado'} con éxito`);
      fetchAds();
    } catch (error) {
      console.error("Error updating ad status:", error);
      alert("Error al actualizar el estado del anuncio");
    }
  };

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN || user?.role === 'admin';

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            {isSuperAdmin ? 'Gestión Global de Publicidad' : 'Mis Campañas Publicitarias'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {isSuperAdmin ? 'Supervisión, aprobación y control de todos los anuncios del portal.' : 'Gestión de anuncios y banners publicitarios en el portal oficial.'}
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Campaña
        </button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] w-full max-w-2xl p-10 shadow-2xl space-y-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase tracking-tight">Nueva Publicidad</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Imagen del Anuncio</label>
                <div 
                  onClick={() => setShowUploader(true)}
                  className="border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-6 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all"
                >
                  {newAd.image_url ? (
                    <img src={newAd.image_url} className="w-full h-48 object-cover rounded-2xl" />
                  ) : (
                    <>
                      <div className="size-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Upload size={32} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Cargar Banner (Base64/URL)</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Recomendado: 1200x400px</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título de la Campaña</label>
                  <input 
                    type="text" 
                    value={newAd.title}
                    onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 font-bold"
                    placeholder="Ej: Servicios Offshore Q3"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Presupuesto (USD)</label>
                  <input 
                    type="number" 
                    value={newAd.budget}
                    onChange={(e) => setNewAd({ ...newAd, budget: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enlace de Destino (URL)</label>
                <input 
                  type="text" 
                  value={newAd.link_url}
                  onChange={(e) => setNewAd({ ...newAd, link_url: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 font-bold"
                  placeholder="https://su-empresa.com/oferta"
                />
              </div>

              <button 
                onClick={handleCreateAd}
                disabled={isSaving}
                className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                Crear Campaña
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 dark:border-slate-700 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar campañas..." 
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
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-700/30 text-slate-400 text-[10px] uppercase font-black tracking-widest">
                <th className="px-8 py-5">Campaña / ID</th>
                <th className="px-8 py-5">Estado</th>
                <th className="px-8 py-5">Impresiones</th>
                <th className="px-8 py-5">Clics</th>
                <th className="px-8 py-5">CTR</th>
                <th className="px-8 py-5">Gasto / Presupuesto</th>
                <th className="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-50 dark:divide-slate-700">
              {campaigns.map((cam) => (
                <tr key={cam.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`size-10 rounded-xl flex items-center justify-center ${
                        cam.status === 'active' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
                      }`}>
                        {cam.image_url ? (
                          <img src={cam.image_url} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <Megaphone className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">{cam.title}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">ID: {cam.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      cam.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                      cam.status === 'pending' ? 'bg-amber-100 text-amber-700' : 
                      'bg-slate-100 text-slate-500'
                    }`}>
                      <span className={`size-1.5 rounded-full ${
                        cam.status === 'active' ? 'bg-emerald-500' : 
                        cam.status === 'pending' ? 'bg-amber-500' : 
                        'bg-slate-500'
                      }`}></span>
                      {cam.status === 'active' ? 'Activa' : cam.status === 'pending' ? 'En Revisión' : 'Pausada'}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">
                    {cam.impressions || 0}
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">
                    {cam.clicks || 0}
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">
                    {cam.ctr || '0%'}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <p className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">${cam.spend || 0} / ${cam.budget}</p>
                      <div className="w-24 bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full" style={{ width: cam.budget > 0 ? `${Math.min(100, ((cam.spend || 0) / cam.budget) * 100)}%` : '0%' }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      {isSuperAdmin && cam.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(cam.id, 'active')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-all"
                            title="Aprobar"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(cam.id, 'rejected')}
                            className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                            title="Rechazar"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDeleteAd(cam.id)}
                        className="text-slate-400 hover:text-red-600 transition-all p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showUploader && (
        <FileUploaderWithPreview
          title="Cargar Banner Publicitario"
          allowedTypes="image/*"
          initialUrl={newAd.image_url}
          onConfirm={handleConfirmImage}
          onCancel={() => setShowUploader(false)}
        />
      )}
    </div>
  );
};

export default CampaignManagement;
