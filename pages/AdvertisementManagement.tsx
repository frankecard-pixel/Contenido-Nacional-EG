import React, { useState, useEffect, useRef } from 'react';
import { getAdvertisements, createAdvertisement, updateAdvertisement, deleteAdvertisement, uploadFile, getStoragePublicUrl } from '../services/supabaseApi';
import { Plus, Trash2, Edit2, CheckCircle, Image as ImageIcon, Loader2, X, Upload } from 'lucide-react';

export const AdvertisementManagement = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAd, setEditingAd] = useState<any | null>(null);
  const [newAd, setNewAd] = useState({
    title: '',
    description: '',
    link: '',
    image_url: '',
    status: 'active',
    format: 'top_banner'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const data = await getAdvertisements();
      setAds(data || []);
    } catch (error) {
      console.error("Error fetching ads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este anuncio?')) {
      await deleteAdvertisement(id);
      fetchAds();
    }
  };

  const handleSave = async () => {
    if (!newAd.title || !newAd.image_url) {
      alert("Por favor, completa el título y sube una imagen.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingAd) {
        await updateAdvertisement(editingAd.id, newAd);
        alert("Publicidad actualizada con éxito");
      } else {
        await createAdvertisement(newAd);
        alert("Publicidad creada con éxito");
      }
      setNewAd({ title: '', description: '', link: '', image_url: '', status: 'active', format: 'top_banner' });
      setEditingAd(null);
      setShowModal(false);
      fetchAds();
    } catch (error) {
      console.error("Error saving ad:", error);
      alert("Error al guardar la publicidad");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (ad: any) => {
    setEditingAd(ad);
    setNewAd({
      title: ad.title,
      description: ad.description || '',
      link: ad.link_url || ad.link || '',
      image_url: ad.image_url,
      status: ad.status,
      format: ad.format
    });
    setShowModal(true);
  };

  const handleApprove = async (ad: any) => {
    await updateAdvertisement(ad.id, { ...ad, status: 'active' });
    fetchAds();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      try {
        const fileName = `ad_${Date.now()}_${file.name}`;
        await uploadFile('advertisements', fileName, base64Data, file.type);
        const imageUrl = getStoragePublicUrl('advertisements', fileName);
        setNewAd({ ...newAd, image_url: imageUrl });
        alert("Imagen subida con éxito");
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error al subir la imagen");
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <div className="p-10 space-y-10">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Gestión de Publicidad</h1>
        <button 
          onClick={() => { setEditingAd(null); setNewAd({ title: '', description: '', link: '', image_url: '', status: 'active', format: 'top_banner' }); setShowModal(true); }}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm"
        >
          <Plus size={18} /> Nuevo Anuncio
        </button>
      </header>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] w-full max-w-xl p-10 shadow-2xl space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black uppercase tracking-tight">{editingAd ? 'Editar Anuncio' : 'Nuevo Anuncio'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título del Anuncio</label>
                <input 
                  type="text" 
                  value={newAd.title}
                  onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 font-bold"
                  placeholder="Ej: Nueva Convocatoria 2024"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enlace (URL)</label>
                <input 
                  type="text" 
                  value={newAd.link}
                  onChange={(e) => setNewAd({ ...newAd, link: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 font-bold"
                  placeholder="https://ejemplo.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descripción Corta</label>
                  <input 
                    type="text" 
                    value={newAd.description}
                    onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 font-bold"
                    placeholder="Descripción para mostrar en el banner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Espacio / Formato</label>
                  <select
                    value={newAd.format}
                    onChange={(e) => setNewAd({ ...newAd, format: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 font-bold"
                  >
                    <option value="top_banner">Banner Principal Superior</option>
                    <option value="sidebar_banner">Banner Lateral Derecho</option>
                    <option value="in_feed_card">Tarjeta Integrada (In-Feed)</option>
                    <option value="footer_banner">Banner de Cierre de Página</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Imagen Publicitaria</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all"
                >
                  {newAd.image_url ? (
                    <img src={newAd.image_url} className="w-full h-32 object-cover rounded-2xl" />
                  ) : (
                    <>
                      <Upload size={32} className="text-primary" />
                      <p className="text-xs font-bold uppercase tracking-tight">Subir Imagen</p>
                    </>
                  )}
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>
              </div>

              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" /> : editingAd ? <Edit2 size={20} /> : <Plus size={20} />}
                {editingAd ? 'Guardar Cambios' : 'Crear Anuncio'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <tr>
              <th className="px-10 py-6">Imagen</th>
              <th className="px-10 py-6">Título</th>
              <th className="px-10 py-6">Espacio Publicitario</th>
              <th className="px-10 py-6">Enlace</th>
              <th className="px-10 py-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
            {ads.map(ad => (
              <tr key={ad.id}>
                <td className="px-10 py-6">
                  {ad.image_url ? (
                    <img src={ad.image_url} className="size-12 object-cover rounded-lg" />
                  ) : (
                    <ImageIcon className="text-slate-300" />
                  )}
                </td>
                <td className="px-10 py-6">
                  <div className="font-bold">{ad.title}</div>
                  {ad.description && <div className="text-[10px] text-slate-400 mt-1 max-w-xs truncate">{ad.description}</div>}
                </td>
                <td className="px-10 py-6">
                  <span className="text-[9px] font-black bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-2.5 py-1 rounded uppercase tracking-wider">
                    {ad.format === 'top_banner' ? 'Banner Superior' :
                     ad.format === 'sidebar_banner' ? 'Banner Lateral' :
                     ad.format === 'in_feed_card' ? 'Tarjeta Integrada' :
                     ad.format === 'footer_banner' ? 'Banner Inferior' : ad.format || 'Banner Superior'}
                  </span>
                </td>
                <td className="px-10 py-6 text-primary underline truncate max-w-[200px]">{ad.link_url || ad.link}</td>
                <td className="px-10 py-6 text-right">
                  <div className="flex justify-end gap-3">
                    {ad.status === 'pending' && (
                      <button onClick={() => handleApprove(ad)} className="text-green-500" title="Aprobar"><CheckCircle size={18} /></button>
                    )}
                    <button onClick={() => handleEdit(ad)} className="text-blue-500" title="Editar"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(ad.id)} className="text-red-500" title="Eliminar"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
