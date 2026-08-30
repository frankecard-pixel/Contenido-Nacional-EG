import React, { useState } from 'react';
import { Language } from '../../../types';
import { toast } from 'sonner';
import { ImageCropper } from '../../ImageCropper';
import { DEFAULT_BANNERS } from '../../../services/supabaseApi';

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
  onBannerUpload: (id: string, pageKey: string, bannerKey: string, file?: File) => Promise<void> | void;
  onBannerUpdateUrl?: (id: string, pageKey: string, bannerKey: string, url: string, title?: string) => Promise<void> | void;
  onAddGalleryImage: (img: Omit<GalleryImageItem, 'id'>) => Promise<any>;
  onDeleteGalleryImage: (id: string) => Promise<any>;
  onUploadGalleryImage: (file: File) => Promise<string>;
}

// Curated high quality presets for petroleum & gas portal
const CURATED_PRESETS = [
  {
    name: 'Plataforma Offshore de Perforación',
    url: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop',
    tag: 'Offshore'
  },
  {
    name: 'Refinería y Complejo Petroquímico',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop',
    tag: 'Industrial'
  },
  {
    name: 'Torres Industriales de Punta Europa',
    url: 'https://images.unsplash.com/photo-1535730143503-a26507397bb6?q=80&w=2070&auto=format&fit=crop',
    tag: 'Refinería'
  },
  {
    name: 'Terminal de Gas Nocturno / Antorcha',
    url: 'https://images.unsplash.com/photo-1513828583815-c4550fa574bf?q=80&w=2070&auto=format&fit=crop',
    tag: 'Gas & Energía'
  },
  {
    name: 'Plataforma Petrolífera en Alta Mar',
    url: 'https://images.unsplash.com/photo-1544333346-645472894670?q=80&w=2070&auto=format&fit=crop',
    tag: 'Alta Mar'
  },
  {
    name: 'Ingeniería y Operaciones Mineras',
    url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop',
    tag: 'Técnico'
  },
  {
    name: 'Complejo de Almacenamiento y Tanques',
    url: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=2070&auto=format&fit=crop',
    tag: 'Logística'
  },
  {
    name: 'Energía y Desarrollo Sostenible',
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?q=80&w=2070&auto=format&fit=crop',
    tag: 'Renovables'
  }
];

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop';

// Helper to optimize large images from phones or folders before storing
const optimizeImageFile = (file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const ImagesTab: React.FC<ImagesTabProps> = ({
  banners,
  galleryImages,
  isSuperAdmin,
  uploadingId,
  onBannerUpload,
  onBannerUpdateUrl,
  onAddGalleryImage,
  onDeleteGalleryImage,
  onUploadGalleryImage,
}) => {
  const [subSection, setSubSection] = useState<'banners' | 'authorities' | 'gallery'>('banners');
  const [bannerPageFilter, setBannerPageFilter] = useState<string>('all');
  
  // Per-banner local edit states (for typing URLs directly)
  const [editingBannerUrls, setEditingBannerUrls] = useState<Record<string, string>>({});
  const [activePresetBannerId, setActivePresetBannerId] = useState<string | null>(null);

  // Gallery Form State
  const [showAddImage, setShowAddImage] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [activeLang, setActiveLang] = useState<Language>('es');
  const [newImage, setNewImage] = useState<Partial<GalleryImageItem>>({
    url: '',
    title: { es: '', en: '', fr: '' },
    group_name: 'Instalaciones',
  });

  // Authorities State
  const [ministerPhoto, setMinisterPhoto] = useState(
    localStorage.getItem('minister_photo_url') || 'https://www.adipec.com/media/hcpphzh1/antonio.jpg'
  );
  const [delegateMinisterPhoto, setDelegateMinisterPhoto] = useState(
    localStorage.getItem('minister_delegado_photo_url') || '/images/domingo_mba_esono.jpg'
  );
  const [directorPhoto, setDirectorPhoto] = useState(
    localStorage.getItem('director_photo_url') || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop'
  );

  const [isUploadingMinister, setIsUploadingMinister] = useState(false);
  const [isUploadingDelegateMinister, setIsUploadingDelegateMinister] = useState(false);
  const [isUploadingDirector, setIsUploadingDirector] = useState(false);

  // Cropper State
  const [cropperImage, setCropperImage] = useState<string | null>(null);
  const [cropperAspect, setCropperAspect] = useState(16 / 9);

  // Get current editing URL or existing banner URL
  const getBannerCurrentUrl = (banner: BannerItem) => {
    return editingBannerUrls[banner.id] !== undefined ? editingBannerUrls[banner.id] : banner.image_url;
  };

  // Handle URL typing for a banner
  const handleBannerUrlInputChange = (id: string, value: string) => {
    setEditingBannerUrls(prev => ({ ...prev, [id]: value }));
  };

  // Apply typed or selected URL to banner
  const handleSaveBannerUrl = async (banner: BannerItem) => {
    const urlToSave = editingBannerUrls[banner.id] || banner.image_url;
    if (!urlToSave.trim()) {
      toast.error('Ingrese una URL válida o seleccione una foto');
      return;
    }

    if (onBannerUpdateUrl) {
      await onBannerUpdateUrl(banner.id, banner.page_key, banner.banner_key, urlToSave.trim(), banner.title);
    } else {
      onBannerUpload(banner.id, banner.page_key, banner.banner_key);
    }
  };

  // Handle direct file selection from local device / folder for a specific banner
  const handleBannerFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>, banner: BannerItem) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast.loading('Optimizando y aplicando imagen...', { id: `upload-${banner.id}` });
      const optimizedBase64 = await optimizeImageFile(file);
      
      if (onBannerUpdateUrl) {
        await onBannerUpdateUrl(banner.id, banner.page_key, banner.banner_key, optimizedBase64, banner.title);
      } else {
        await onBannerUpload(banner.id, banner.page_key, banner.banner_key, file);
      }
      
      setEditingBannerUrls(prev => ({ ...prev, [banner.id]: optimizedBase64 }));
      toast.success('¡Imagen actualizada en el portal con éxito!', { id: `upload-${banner.id}` });
    } catch (err) {
      console.error("Error processing banner image file:", err);
      toast.error('Error al procesar el archivo seleccionado.', { id: `upload-${banner.id}` });
    }
  };

  // Reset banner to original default
  const handleResetBanner = async (banner: BannerItem) => {
    const defaultFound = DEFAULT_BANNERS.find(b => b.id === banner.id);
    const defaultUrl = defaultFound ? defaultFound.image_url : FALLBACK_IMAGE;
    
    if (onBannerUpdateUrl) {
      await onBannerUpdateUrl(banner.id, banner.page_key, banner.banner_key, defaultUrl, banner.title);
    }
    setEditingBannerUrls(prev => ({ ...prev, [banner.id]: defaultUrl }));
    toast.success('Banner restablecido a la imagen original');
  };

  // Select a preset for a banner
  const handleSelectPresetForBanner = async (banner: BannerItem, presetUrl: string) => {
    setEditingBannerUrls(prev => ({ ...prev, [banner.id]: presetUrl }));
    if (onBannerUpdateUrl) {
      await onBannerUpdateUrl(banner.id, banner.page_key, banner.banner_key, presetUrl, banner.title);
    }
    setActivePresetBannerId(null);
    toast.success('Preset aplicado al banner');
  };

  // Authorities Handlers
  const handleMinisterFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingMinister(true);
      toast.loading('Procesando foto del Ministro...', { id: 'minister-photo' });
      const optimized = await optimizeImageFile(file, 800, 800);
      setMinisterPhoto(optimized);
      localStorage.setItem('minister_photo_url', optimized);
      toast.success('Foto del Ministro actualizada', { id: 'minister-photo' });
    } catch (err) {
      console.error(err);
      toast.error('Error al subir la foto del Ministro', { id: 'minister-photo' });
    } finally {
      setIsUploadingMinister(false);
    }
  };

  const handleDelegateMinisterFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingDelegateMinister(true);
      toast.loading('Procesando foto del Ministro Delegado...', { id: 'delegate-photo' });
      const optimized = await optimizeImageFile(file, 800, 800);
      setDelegateMinisterPhoto(optimized);
      localStorage.setItem('minister_delegado_photo_url', optimized);
      toast.success('Foto del Ministro Delegado actualizada', { id: 'delegate-photo' });
    } catch (err) {
      console.error(err);
      toast.error('Error al subir la foto del Ministro Delegado', { id: 'delegate-photo' });
    } finally {
      setIsUploadingDelegateMinister(false);
    }
  };

  const handleDirectorFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingDirector(true);
      toast.loading('Procesando foto del Director...', { id: 'director-photo' });
      const optimized = await optimizeImageFile(file, 800, 800);
      setDirectorPhoto(optimized);
      localStorage.setItem('director_photo_url', optimized);
      toast.success('Foto del Director General actualizada', { id: 'director-photo' });
    } catch (err) {
      console.error(err);
      toast.error('Error al subir la foto del Director', { id: 'director-photo' });
    } finally {
      setIsUploadingDirector(false);
    }
  };

  // Gallery File Select with fallback
  const handleGalleryFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingGallery(true);
      toast.loading('Cargando imagen...', { id: 'gallery-img-load' });
      const optimized = await optimizeImageFile(file, 1600, 1000);
      setNewImage(prev => ({ ...prev, url: optimized }));
      toast.success('Imagen lista para guardar en la galería', { id: 'gallery-img-load' });
    } catch (err) {
      console.error(err);
      toast.error('Error al procesar archivo');
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleAddGalleryImageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.url || !newImage.title?.es || !newImage.group_name) {
      toast.error('La URL o archivo de la imagen, el título en Español y la sección son obligatorios');
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
      toast.error('Error al añadir la imagen a la galería');
    }
  };

  // Filter banners according to page selector
  const filteredBanners = banners.filter(b => {
    if (bannerPageFilter === 'all') return true;
    return b.page_key === bannerPageFilter;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* Sub-navigation tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSubSection('banners')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
              subSection === 'banners'
                ? 'bg-primary text-white shadow-lg shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">view_carousel</span>
            Banners y Cabeceras ({banners.length})
          </button>

          <button
            type="button"
            onClick={() => setSubSection('authorities')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
              subSection === 'authorities'
                ? 'bg-primary text-white shadow-lg shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">badge</span>
            Fotos de Autoridades
          </button>

          <button
            type="button"
            onClick={() => setSubSection('gallery')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all ${
              subSection === 'gallery'
                ? 'bg-primary text-white shadow-lg shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span className="material-symbols-outlined text-lg">photo_library</span>
            Galería del Portal ({galleryImages.length})
          </button>
        </div>

        {/* Global info badge */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <span className="material-symbols-outlined text-sm">bolt</span>
          Subida Directa & URLs Activas
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 1: BANNERS Y CABECERAS DINÁMICAS                       */}
      {/* ============================================================== */}
      {subSection === 'banners' && (
        <div className="space-y-8">
          {/* Header & Page Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-200/80 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Personalización de Imágenes del Portal Público
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Puede <strong>subir cualquier imagen desde su carpeta/ordenador</strong>, <strong>pegar una URL directa</strong> o <strong>seleccionar un preset oficial</strong> para cada sección.
              </p>
            </div>

            {/* Filter by section */}
            <div className="flex items-center gap-2 shrink-0">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filtrar por Página:</label>
              <select
                value={bannerPageFilter}
                onChange={(e) => setBannerPageFilter(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider focus:ring-2 focus:ring-primary shadow-sm"
              >
                <option value="all">Todas las Páginas ({banners.length})</option>
                <option value="home">Página de Inicio (Home)</option>
                <option value="landing">Landing Promocional</option>
                <option value="opportunities">Licitaciones</option>
                <option value="news">Noticias</option>
                <option value="laws">Leyes y Normativas</option>
                <option value="about">Sobre Nosotros</option>
              </select>
            </div>
          </div>

          {/* Banners Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredBanners.map((banner) => {
              const currentUrl = getBannerCurrentUrl(banner);
              const isUploading = uploadingId === banner.id;
              const showPresets = activePresetBannerId === banner.id;

              return (
                <div
                  key={banner.id}
                  id={`banner-card-${banner.id}`}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm flex flex-col gap-5 hover:border-primary/40 transition-colors"
                >
                  {/* Banner Title & Page Tag */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-blue-50 dark:bg-blue-950/60 text-primary text-[10px] font-black uppercase tracking-widest rounded-lg mb-1.5 border border-blue-200 dark:border-blue-800">
                        {banner.page_key.toUpperCase()} • {banner.banner_key.toUpperCase()}
                      </span>
                      <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        {banner.title || banner.id.replace(/_/g, ' ')}
                      </h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleResetBanner(banner)}
                      title="Restablecer imagen por defecto"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">restart_alt</span>
                      Restablecer
                    </button>
                  </div>

                  {/* Image Preview Box */}
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner group">
                    <img
                      src={currentUrl || FALLBACK_IMAGE}
                      alt={banner.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e: any) => {
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />

                    {isUploading && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-20">
                        <div className="size-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-white text-[10px] font-black uppercase tracking-widest">Guardando Imagen...</span>
                      </div>
                    )}
                  </div>

                  {/* Upload and URL Controls */}
                  <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    {/* Method 1: Upload File from Folder / Device */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                        Opción 1: Subir Archivo desde tu Carpeta / Dispositivo
                      </label>
                      <label className="flex items-center justify-center gap-3 w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer border border-dashed border-slate-300 dark:border-slate-700 transition-all shadow-sm">
                        <span className="material-symbols-outlined text-xl text-primary">drive_folder_upload</span>
                        <span>Examinar archivo local (JPG, PNG, WebP)</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleBannerFileInputChange(e, banner)}
                          disabled={isUploading}
                        />
                      </label>
                    </div>

                    {/* Method 2: Direct URL Input */}
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">
                        Opción 2: Pegar URL Directa de Internet
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-base text-slate-400">link</span>
                          <input
                            type="url"
                            value={editingBannerUrls[banner.id] ?? banner.image_url}
                            onChange={(e) => handleBannerUrlInputChange(banner.id, e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-xs font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-primary shadow-inner"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleSaveBannerUrl(banner)}
                          disabled={isUploading}
                          className="px-4 py-2.5 bg-primary hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shrink-0 transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-sm">save</span>
                          Guardar
                        </button>
                      </div>
                    </div>

                    {/* Method 3: Curated Presets Library */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setActivePresetBannerId(showPresets ? null : banner.id)}
                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-blue-700 flex items-center gap-1.5 mt-1"
                      >
                        <span className="material-symbols-outlined text-base">
                          {showPresets ? 'expand_less' : 'photo_library'}
                        </span>
                        {showPresets ? 'Ocultar Galería de Presets' : 'Elegir de la Biblioteca de Presets Oficiales (Punta Europa, Offshore...)'}
                      </button>

                      {showPresets && (
                        <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800/70 rounded-2xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in slide-in-from-top-2">
                          {CURATED_PRESETS.map((preset, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => handleSelectPresetForBanner(banner, preset.url)}
                              className="group text-left flex flex-col gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary transition-all overflow-hidden"
                            >
                              <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800">
                                <img
                                  src={preset.url}
                                  alt={preset.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                              <span className="text-[9px] font-black text-slate-800 dark:text-slate-200 uppercase line-clamp-1">
                                {preset.name}
                              </span>
                              <span className="text-[8px] font-bold text-primary uppercase">
                                {preset.tag}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 2: FOTOS DE AUTORIDADES                                */}
      {/* ============================================================== */}
      {subSection === 'authorities' && (
        <div className="space-y-8">
          <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-200/80 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Fotografías Oficiales de las Autoridades del MMIE
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              Actualice las fotos del Excmo. Sr. Ministro, Ministro Delegado y Director General que se presentan en la sección pública «Sobre Nosotros».
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Ministro */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col gap-5 shadow-sm">
              <div className="w-full h-56 rounded-2xl overflow-hidden shadow-md shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                <img
                  src={ministerPhoto || FALLBACK_IMAGE}
                  alt="Ministro"
                  className="w-full h-full object-cover object-top"
                  onError={(e: any) => { e.target.src = FALLBACK_IMAGE; }}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Ministro de Hidrocarburos y Desarrollo Minero</span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase mt-0.5">Excmo. Sr. Antonio Oburu Ondo</h4>
                </div>

                {/* Subir archivo */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Subir Archivo Local</label>
                  <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer border border-slate-200 dark:border-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-base text-primary">upload</span>
                    <span>Seleccionar Foto</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleMinisterFileSelect} disabled={isUploadingMinister} />
                  </label>
                </div>

                {/* Pegar URL */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">O Pegar URL de Foto</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={ministerPhoto}
                      onChange={(e) => {
                        setMinisterPhoto(e.target.value);
                        localStorage.setItem('minister_photo_url', e.target.value);
                      }}
                      placeholder="https://..."
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold dark:text-white focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Ministro Delegado */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-blue-500/30 rounded-[2.5rem] flex flex-col gap-5 shadow-sm">
              <div className="w-full h-56 rounded-2xl overflow-hidden shadow-md shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                <img
                  src={delegateMinisterPhoto || FALLBACK_IMAGE}
                  alt="Ministro Delegado"
                  className="w-full h-full object-cover object-top"
                  onError={(e: any) => { e.target.src = FALLBACK_IMAGE; }}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 block">Ministro Delegado - Contenido Nacional</span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase mt-0.5">Excmo. Sr. Domingo Mba Esono</h4>
                </div>

                {/* Subir archivo */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Subir Archivo Local</label>
                  <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer border border-slate-200 dark:border-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-base text-primary">upload</span>
                    <span>Seleccionar Foto</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleDelegateMinisterFileSelect} disabled={isUploadingDelegateMinister} />
                  </label>
                </div>

                {/* Pegar URL */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">O Pegar URL de Foto</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={delegateMinisterPhoto}
                      onChange={(e) => {
                        setDelegateMinisterPhoto(e.target.value);
                        localStorage.setItem('minister_delegado_photo_url', e.target.value);
                      }}
                      placeholder="https://..."
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold dark:text-white focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Director General */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] flex flex-col gap-5 shadow-sm">
              <div className="w-full h-56 rounded-2xl overflow-hidden shadow-md shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                <img
                  src={directorPhoto || FALLBACK_IMAGE}
                  alt="Director General"
                  className="w-full h-full object-cover object-top"
                  onError={(e: any) => { e.target.src = FALLBACK_IMAGE; }}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Director General de Contenido Nacional</span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase mt-0.5">Dirección General</h4>
                </div>

                {/* Subir archivo */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Subir Archivo Local</label>
                  <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer border border-slate-200 dark:border-slate-700 transition-colors">
                    <span className="material-symbols-outlined text-base text-primary">upload</span>
                    <span>Seleccionar Foto</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleDirectorFileSelect} disabled={isUploadingDirector} />
                  </label>
                </div>

                {/* Pegar URL */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">O Pegar URL de Foto</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={directorPhoto}
                      onChange={(e) => {
                        setDirectorPhoto(e.target.value);
                        localStorage.setItem('director_photo_url', e.target.value);
                      }}
                      placeholder="https://..."
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold dark:text-white focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 3: GALERÍA DE FOTOS DEL PORTAL                         */}
      {/* ============================================================== */}
      {subSection === 'gallery' && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60 p-6 rounded-[2rem] border border-slate-200/80 dark:border-slate-800">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Galería Multimedia del Portal Público
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                Imágenes que se exhiben en el carrusel de inicio y galerías temáticas de Guinea Ecuatorial.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddImage(!showAddImage)}
              className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-lg">add_a_photo</span>
              {showAddImage ? 'Cerrar Formulario' : 'Subir Nueva Foto a la Galería'}
            </button>
          </div>

          {showAddImage && (
            <form onSubmit={handleAddGalleryImageSubmit} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 space-y-6 max-w-3xl shadow-sm animate-in slide-in-from-top duration-300">
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Nueva Fotografía para la Galería
              </h4>

              {/* Language switcher */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 pb-3 w-fit gap-2">
                {(['es', 'en', 'fr'] as Language[]).map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setActiveLang(lang)}
                    className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
                      activeLang === lang 
                        ? 'bg-primary text-white shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {lang === 'es' ? 'Español' : lang === 'en' ? 'English' : 'Français'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Upload or URL */}
                <div className="space-y-3 sm:col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                    Seleccionar Foto o Pegar URL
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* File upload */}
                    <label className="flex flex-col items-center justify-center gap-2 p-5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 cursor-pointer transition-all text-center">
                      <span className="material-symbols-outlined text-2xl text-primary">drive_folder_upload</span>
                      <span className="text-xs font-black text-slate-800 dark:text-white uppercase">Subir desde mi Carpeta</span>
                      <span className="text-[9px] text-slate-400 font-medium">Archivos JPG, PNG de cualquier tamaño</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleGalleryFileSelect} disabled={isUploadingGallery} />
                    </label>

                    {/* Direct URL */}
                    <div className="flex flex-col justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <label className="text-[9px] font-black text-slate-400 uppercase">O Pegar URL de Internet</label>
                      <input
                        type="url"
                        value={newImage.url || ''}
                        onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-medium text-slate-800 dark:text-white focus:ring-2 focus:ring-primary mt-2"
                      />
                    </div>
                  </div>

                  {newImage.url && (
                    <div className="aspect-video w-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shadow-sm mt-3">
                      <img src={newImage.url} alt="Vista previa" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Section / Category Group */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Grupo Temático</label>
                  <select
                    value={newImage.group_name || 'Instalaciones'}
                    onChange={(e) => setNewImage({ ...newImage, group_name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs font-black dark:text-white focus:ring-2 focus:ring-primary uppercase tracking-widest"
                  >
                    <option value="Instalaciones">Instalaciones Punta Europa</option>
                    <option value="Capacitación">Capacitación y Cursos</option>
                    <option value="Eventos">Eventos Ministeriales</option>
                    <option value="Comunidad">Obras Sociales / Comunidad</option>
                    <option value="Offshore">Operaciones Offshore</option>
                  </select>
                </div>

                {/* Title in Active Language */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                    Título de la Foto ({activeLang.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    required
                    value={newImage.title?.[activeLang] || ''}
                    onChange={(e) => setNewImage({
                      ...newImage,
                      title: { ...newImage.title, [activeLang]: e.target.value } as Record<Language, string>
                    })}
                    placeholder="Ej: Planta de Procesamiento de Gas Punta Europa"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 text-xs font-bold dark:text-white focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddImage(false)}
                  className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-md transition-all active:scale-95"
                >
                  Guardar Foto en la Galería
                </button>
              </div>
            </form>
          )}

          {/* Gallery Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {galleryImages.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-square rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-100 dark:bg-slate-900"
              >
                <img
                  src={img.url || FALLBACK_IMAGE}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={img.title?.es || 'Foto Galería'}
                  onError={(e: any) => { e.target.src = FALLBACK_IMAGE; }}
                />
                
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-slate-950/80 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                    {img.group_name}
                  </span>
                </div>

                <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 z-20">
                  <p className="text-white text-xs font-black uppercase tracking-tight mb-3 line-clamp-2">
                    {img.title?.es || 'Fotografía Institucional'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('¿Está seguro de eliminar esta foto de la galería?')) {
                        onDeleteGalleryImage(img.id);
                        toast.success('Foto eliminada de la galería');
                      }
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Eliminar Foto
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cropperImage && (
        <ImageCropper
          image={cropperImage}
          aspect={cropperAspect}
          onCropComplete={async (croppedBase64) => {
            setCropperImage(null);
            setNewImage(prev => ({ ...prev, url: croppedBase64 }));
          }}
          onCancel={() => setCropperImage(null)}
        />
      )}
    </div>
  );
};
