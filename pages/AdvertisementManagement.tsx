import React, { useState, useEffect, useRef } from 'react';
import { getAdvertisements, createAdvertisement, updateAdvertisement, deleteAdvertisement, uploadFile, getStoragePublicUrl } from '../services/supabaseApi';
import { Plus, Trash2, Edit2, CheckCircle, Image as ImageIcon, Loader2, X, Upload, DollarSign, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { ImageCropper } from '../components/ImageCropper';

export const AdvertisementManagement = () => {
  const { user } = useAuth();
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
    format: 'top_banner',
    budget: 0
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cropper State
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [cropperAspect, setCropperAspect] = useState(16 / 9);

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
        await updateAdvertisement(editingAd.id, newAd, user?.role);
        alert(newAd.budget > (editingAd.budget || 0) && user?.role !== UserRole.SUPER_ADMIN 
          ? "Publicidad actualizada. El incremento de inversión requiere validación de un Super Admin." 
          : "Publicidad actualizada con éxito");
      } else {
        await createAdvertisement(newAd, user?.id);
        alert("Publicidad creada con éxito");
      }
      setNewAd({ title: '', description: '', link: '', image_url: '', status: 'active', format: 'top_banner', budget: 0 });
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
      format: ad.format,
      budget: ad.budget || 0
    });
    setShowModal(true);
  };

  const handleApprove = async (ad: any) => {
    try {
      await updateAdvertisement(ad.id, { 
        budget: ad.pending_budget || ad.budget,
        pending_budget: null,
        validation_status: 'approved'
      }, UserRole.SUPER_ADMIN);
      fetchAds();
    } catch (error) {
      console.error("Error approving budget:", error);
      alert("Error al aprobar la inversión");
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropperImage(reader.result as string);
        // Set aspect ratio based on format
        if (newAd.format === 'sidebar_banner') {
          setCropperAspect(1 / 1.5); // Portrait for sidebar
        } else if (newAd.format === 'top_banner' || newAd.format === 'footer_banner') {
          setCropperAspect(16 / 5); // Wide for banners
        } else {
          setCropperAspect(16 / 9); // Normal for cards
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedBase64: string) => {
    setIsSaving(true);
    try {
      const fileName = `ad_${Date.now()}.jpg`;
      const bucket = 'web-assets';
      const path = `advertisements/${fileName}`;
      
      await uploadFile(bucket, path, croppedBase64, 'image/jpeg');
      const publicUrl = getStoragePublicUrl(bucket, path);
      
      setNewAd({ ...newAd, image_url: publicUrl });
      setCropperImage(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <div className="p-10 space-y-10">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-black uppercase tracking-tighter">Gestión de Publicidad</h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setEditingAd(null); setNewAd({ title: '', description: '', link: '', image_url: '', status: 'active', format: 'top_banner', budget: 0 }); setShowModal(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm"
          >
            <Plus size={18} /> Nuevo Anuncio
          </button>
        </div>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inversión (USD)</label>
                  <div className="relative">
                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="number" 
                      value={newAd.budget}
                      onChange={(e) => setNewAd({ ...newAd, budget: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 pl-10 font-bold"
                      placeholder="0.00"
                    />
                  </div>
                  {editingAd && newAd.budget > (editingAd.budget || 0) && user?.role !== UserRole.SUPER_ADMIN && (
                    <p className="text-[10px] text-amber-500 font-bold flex items-center gap-1 mt-1">
                      <AlertCircle size={12} /> Requiere validación de Super Admin
                    </p>
                  )}
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
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*" />
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
              <th className="px-10 py-6">Inversión</th>
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
                  <div className="font-bold flex items-center gap-2">
                    {ad.title}
                    {ad.validation_status === 'pending_validation' && (
                      <span className="text-[8px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded font-black uppercase">Pendiente Validación</span>
                    )}
                  </div>
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
                <td className="px-10 py-6">
                  <div className="font-black text-slate-900 dark:text-white">
                    ${(ad.budget || 0).toLocaleString()}
                  </div>
                  {ad.pending_budget && (
                    <div className="text-[10px] text-amber-500 font-bold mt-1">
                      Pendiente: ${(ad.pending_budget).toLocaleString()}
                    </div>
                  )}
                </td>
                <td className="px-10 py-6 text-right">
                  <div className="flex justify-end gap-3">
                    {((ad.status === 'pending') || (ad.validation_status === 'pending_validation' && user?.role === UserRole.SUPER_ADMIN)) && (
                      <button onClick={() => handleApprove(ad)} className="text-green-500" title="Aprobar Inversión"><CheckCircle size={18} /></button>
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
      {cropperImage && (
        <ImageCropper
          image={cropperImage}
          aspect={cropperAspect}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropperImage(null)}
        />
      )}
    </div>
  );
};
