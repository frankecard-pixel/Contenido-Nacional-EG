import React, { useState } from 'react';
import { Language } from '../../../types';
import { toast } from 'sonner';
import { ImageCropper } from '../../ImageCropper';

interface BannerItem {
  id: string;
  page_key: string;
  banner_key: string;
  image_url: string;
  title: string;
}

interface GalleryImageItem {
  id: string;
  url: string;
  title: Record<Language, string>;
  group_name: string;
  created_at?: string;
}

interface ImagesTabProps {
  banners: BannerItem[];
  galleryImages: GalleryImageItem[];
  isSuperAdmin: boolean;
  uploadingId: string | null;
  onBannerUpload: (id: string, pageKey: string, bannerKey: string) => void;
  onAddGalleryImage: (img: Omit<GalleryImageItem, 'id'>) => Promise<any>;
  onDeleteGalleryImage: (id: string) => Promise<any>;
  onUploadGalleryImage: (file: File) => Promise<string>;
}

export const ImagesTab: React.FC<ImagesTabProps> = ({
  banners,
  galleryImages,
  isSuperAdmin,
  uploadingId,
  onBannerUpload,
  onAddGalleryImage,
  onDeleteGalleryImage,
  onUploadGalleryImage,
}) => {
  const [showAddImage, setShowAddImage] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [activeLang, setActiveLang] = useState<Language>('es');
  const [newImage, setNewImage] = useState<Partial<GalleryImageItem>>({
    url: '',
    title: { es: '', en: '', fr: '' },
    group_name: 'Instalaciones',
  });

  // Cropper State
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [cropperAspect, setCropperAspect] = useState(16 / 9);

  const handleGalleryFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropperImage(reader.result as string);
      setCropperAspect(16 / 9);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBase64: string) => {
    try {
      setIsUploadingGallery(true);
      setCropperImage(null);
      
      const res = await fetch(croppedBase64);
      const blob = await res.blob();
      const file = new File([blob], "gallery_img.jpg", { type: "image/jpeg" });
      
      const url = await onUploadGalleryImage(file);
      setNewImage(prev => ({ ...prev, url }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleAddGalleryImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.url || !newImage.title?.es || !newImage.group_name) {
      toast.error('La URL de la imagen, el título en Español y el grupo son obligatorios');
      return;
    }

    try {
      await onAddGalleryImage({
        url: newImage.url,
        title: newImage.title as Record<Language, string>,
        group_name: newImage.group_name,
      });
      toast.success('Imagen añadida a la galería con éxito');
      setNewImage({
        url: '',
        title: { es: '', en: '', fr: '' },
        group_name: 'Instalaciones',
      });
      setShowAddImage(false);
    } catch (err) {
      toast.error('Error al añadir la imagen');
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Super Admin Info */}
      <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Módulo de Imágenes y Banners Dinámicos</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Permisos de Edición: {isSuperAdmin ? (
              <span className="text-emerald-500 font-black">SUPER ADMINISTRADOR (ACCESO TOTAL)</span>
            ) : (
              <span className="text-amber-500 font-black">SOLO LECTURA (MODIFICACIONES RESERVADAS PARA SUPER ADMIN)</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-xl">
          <span className="material-symbols-outlined text-sm">cloud_done</span>
          Sincronizado con Storage
        </div>
      </div>

      {/* 1. SECTION: BANNERS DINAMICOS */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Personalización de Cabeceras (Banners de Páginas)</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">Imágenes principales de cabecera en el portal público.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="group relative aspect-video rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-800">
              <img 
                src={banner.image_url} 
                className={`w-full h-full object-cover transition-transform duration-700 ${uploadingId === banner.id ? 'opacity-40' : 'group-hover:scale-110'}`} 
                alt={banner.title} 
              />
              
              <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 z-30">
                <span className="text-white text-xs font-black uppercase tracking-widest px-4 text-center">{banner.title}</span>
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">{banner.page_key.toUpperCase()} - {banner.banner_key.toUpperCase()}</p>
                {isSuperAdmin && (
                  <button 
                    onClick={() => onBannerUpload(banner.id, banner.page_key, banner.banner_key)}
                    disabled={uploadingId !== null}
                    className="px-6 py-3 rounded-xl bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">upload</span>
                    Cambiar Imagen
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. SECTION: GALERIA DE IMAGENES PORTAL PUBLICO */}
      <div className="space-y-6 border-t border-slate-100 dark:border-slate-800 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Galería de Fotos del Portal</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">Imágenes mostradas en el carrusel de la página de inicio agrupadas por secciones.</p>
          </div>
          <button
            onClick={() => setShowAddImage(!showAddImage)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-lg active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add_a_photo</span>
            {showAddImage ? 'Cerrar Formulario' : 'Subir Nueva Foto'}
          </button>
        </div>

        {showAddImage && (
          <form onSubmit={handleAddGalleryImageSubmit} className="bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 space-y-6 max-w-3xl animate-in slide-in-from-top duration-300">
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Subir Foto a la Galería</h4>
            
            <div className="flex border-b border-slate-200 dark:border-slate-800 pb-3 w-fit gap-2">
              {(['es', 'en', 'fr'] as Language[]).map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLang(lang)}
                  className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${
                    activeLang === lang 
                      ? 'bg-primary text-white' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {lang === 'es' ? 'Español' : lang === 'en' ? 'English' : 'Français'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Imagen de la Galería</label>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input 
                      type="url"
                      required
                      value={newImage.url || ''}
                      onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 bg-white dark:bg-slate-800 border-none rounded-xl p-4 text-xs font-medium dark:text-white focus:ring-2 focus:ring-primary"
                    />
                    <label className="flex items-center justify-center px-4 bg-slate-200 dark:bg-slate-700 rounded-xl cursor-pointer hover:bg-slate-300 transition-colors">
                      <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleGalleryFileSelect} disabled={isUploadingGallery} />
                    </label>
                  </div>
                  {isUploadingGallery && (
                    <div className="flex items-center gap-2 text-[9px] font-bold text-primary animate-pulse">
                      <div className="size-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      SUBIENDO ARCHIVO...
                    </div>
                  )}
                  {newImage.url && (
                    <div className="aspect-video w-32 rounded-xl overflow-hidden border border-slate-200">
                      <img src={newImage.url} alt="Vista previa" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Grupo / Sección</label>
                <select
                  value={newImage.group_name || 'Instalaciones'}
                  onChange={(e) => setNewImage({ ...newImage, group_name: e.target.value })}
                  className="w-full bg-white dark:bg-slate-800 border-none rounded-xl p-4 text-xs font-black dark:text-white focus:ring-2 focus:ring-primary uppercase tracking-widest"
                >
                  <option value="Instalaciones">Instalaciones Punta Europa</option>
                  <option value="Capacitación">Capacitación y Cursos</option>
                  <option value="Eventos">Eventos Ministeriales</option>
                  <option value="Comunidad">Obras Sociales / Comunidad</option>
                </select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título de la Foto ({activeLang.toUpperCase()})</label>
                <input 
                  type="text"
                  required
                  value={newImage.title?.[activeLang] || ''}
                  onChange={(e) => setNewImage({
                    ...newImage,
                    title: { ...newImage.title, [activeLang]: e.target.value } as Record<Language, string>
                  })}
                  placeholder="Ej: Firma de convenio de becas nacionales..."
                  className="w-full bg-white dark:bg-slate-800 border-none rounded-xl p-4 text-xs font-bold dark:text-white focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddImage(false)}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black text-[9px] uppercase tracking-widest rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white font-black text-[9px] uppercase tracking-widest rounded-lg hover:bg-blue-700 shadow-md"
              >
                Guardar Foto en la Galería
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {galleryImages.map((img) => (
            <div key={img.id} className="group relative aspect-square rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-800">
              <img src={img.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={img.title?.es} />
              <div className="absolute top-4 left-4">
                <span className="bg-slate-900/80 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm">
                  {img.group_name}
                </span>
              </div>
              
              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 z-30">
                <p className="text-white text-xs font-black uppercase tracking-tight mb-4">{img.title?.es}</p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('¿Está seguro de eliminar esta foto?')) {
                      onDeleteGalleryImage(img.id);
                      toast.success('Foto eliminada de la galería');
                    }
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2 bg-red-600 hover:bg-red-700 text-white font-black text-[8px] uppercase tracking-widest rounded-xl transition-all"
                >
                  <span className="material-symbols-outlined text-xs">delete</span>
                  Eliminar Foto
                </button>
              </div>
            </div>
          ))}
        </div>
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
