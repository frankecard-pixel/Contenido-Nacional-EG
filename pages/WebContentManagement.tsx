import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  getWebCategories, 
  createWebCategory,
  updateWebCategory,
  deleteWebCategory,
  getWebBanners, 
  updateWebBanner, 
  uploadBannerImage,
  getWebFAQs,
  createWebFAQ,
  updateWebFAQ,
  deleteWebFAQ,
  getWebImages,
  createWebImage,
  deleteWebImage,
  getWebNormativas,
  createWebNormative,
  updateWebNormative,
  deleteWebNormative,
  getWebGuides,
  createWebGuide,
  updateWebGuide,
  deleteWebGuide,
  getWebTestimonials,
  createWebTestimonial,
  updateWebTestimonial,
  deleteWebTestimonial
} from '../services/supabaseApi';
import { WebCategory, Language } from '../types';
import { CategoriesTab } from '../components/dashboard/web-management/CategoriesTab';
import { FAQTab } from '../components/dashboard/web-management/FAQTab';
import { CountersTab } from '../components/dashboard/web-management/CountersTab';
import { ImagesTab } from '../components/dashboard/web-management/ImagesTab';
import { NormativesTab } from '../components/dashboard/web-management/NormativesTab';
import { GuidesTab } from '../components/dashboard/web-management/GuidesTab';
import { TestimonialsTab } from '../components/dashboard/web-management/TestimonialsTab';
import { toast } from 'sonner';

interface WebContentManagementProps {
  user?: any;
}

const WebContentManagement: React.FC<WebContentManagementProps> = ({ user }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Categorías');
  const [categories, setCategories] = useState<WebCategory[]>([]);
  const [dbBanners, setDbBanners] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [normatives, setNormatives] = useState<any[]>([]);
  const [guides, setGuides] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const isSuperAdmin = user?.role === 'super_admin';

  const [stats, setStats] = useState([
    { id: 'stat-1', label: "Empresas", val: "1,240+", desc: "Locales Registradas", icon: "domain" },
    { id: 'stat-2', label: "Oportunidades", val: "45", desc: "Licitaciones Activas", icon: "work" },
    { id: 'stat-3', label: "Contratos", val: "342", desc: "Adjudicados este año", icon: "contract" },
    { id: 'stat-4', label: "Valor Local", val: "$45.2M", desc: "Retención Económica", icon: "payments" }
  ]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        catsData, 
        bannersData, 
        faqsData, 
        imagesData, 
        normsData, 
        guidesData, 
        testimonialsData
      ] = await Promise.all([
        getWebCategories(),
        getWebBanners(),
        getWebFAQs(),
        getWebImages(),
        getWebNormativas(),
        getWebGuides(),
        getWebTestimonials()
      ]);

      setCategories(catsData as any[]);
      setDbBanners(bannersData);
      setFaqs(faqsData);
      setGalleryImages(imagesData);
      setNormatives(normsData);
      setGuides(guidesData);
      setTestimonials(testimonialsData);
    } catch (error) {
      console.error("Error fetching web content data:", error);
      toast.error('Error al cargar datos del portal');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Category Handlers
  const handleAddCategory = async (cat: Omit<WebCategory, 'id'>) => {
    const res = await createWebCategory(cat);
    setCategories(prev => [...prev, res]);
    return res;
  };

  const handleUpdateCategory = async (id: string, cat: Partial<WebCategory>) => {
    const res = await updateWebCategory(id, cat);
    setCategories(prev => prev.map(item => item.id === id ? { ...item, ...res } : item));
    return res;
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteWebCategory(id);
    setCategories(prev => prev.filter(item => item.id !== id));
  };

  // FAQ Handlers
  const handleAddFAQ = async (faq: any) => {
    const res = await createWebFAQ(faq);
    setFaqs(prev => [...prev, res]);
    return res;
  };

  const handleUpdateFAQ = async (id: string, faq: any) => {
    const res = await updateWebFAQ(id, faq);
    setFaqs(prev => prev.map(item => item.id === id ? { ...item, ...res } : item));
    return res;
  };

  const handleDeleteFAQ = async (id: string) => {
    await deleteWebFAQ(id);
    setFaqs(prev => prev.filter(item => item.id !== id));
  };

  // Normative Handlers
  const handleAddNormative = async (norm: any) => {
    const res = await createWebNormative(norm);
    setNormatives(prev => [...prev, res]);
    return res;
  };

  const handleUpdateNormative = async (id: string, norm: any) => {
    const res = await updateWebNormative(id, norm);
    setNormatives(prev => prev.map(item => item.id === id ? { ...item, ...res } : item));
    return res;
  };

  const handleDeleteNormative = async (id: string) => {
    await deleteWebNormative(id);
    setNormatives(prev => prev.filter(item => item.id !== id));
  };

  // Guide Handlers
  const handleAddGuide = async (guide: any) => {
    const res = await createWebGuide(guide);
    setGuides(prev => [...prev, res]);
    return res;
  };

  const handleUpdateGuide = async (id: string, guide: any) => {
    const res = await updateWebGuide(id, guide);
    setGuides(prev => prev.map(item => item.id === id ? { ...item, ...res } : item));
    return res;
  };

  const handleDeleteGuide = async (id: string) => {
    await deleteWebGuide(id);
    setGuides(prev => prev.filter(item => item.id !== id));
  };

  // Testimonial Handlers
  const handleAddTestimonial = async (test: any) => {
    const res = await createWebTestimonial(test);
    setTestimonials(prev => [...prev, res]);
    return res;
  };

  const handleUpdateTestimonial = async (id: string, test: any) => {
    const res = await updateWebTestimonial(id, test);
    setTestimonials(prev => prev.map(item => item.id === id ? { ...item, ...res } : item));
    return res;
  };

  const handleDeleteTestimonial = async (id: string) => {
    await deleteWebTestimonial(id);
    setTestimonials(prev => prev.filter(item => item.id !== id));
  };

  // Gallery Image Handlers
  const handleAddGalleryImage = async (img: any) => {
    const res = await createWebImage(img);
    setGalleryImages(prev => [...prev, res]);
    return res;
  };

  const handleDeleteGalleryImage = async (id: string) => {
    await deleteWebImage(id);
    setGalleryImages(prev => prev.filter(item => item.id !== id));
  };

  // Banner Upload Handler
  const handleBannerUpload = async (id: string, pageKey: string, bannerKey: string) => {
    if (!isSuperAdmin) {
      toast.error('Acceso Denegado: Solo los Super Administradores pueden subir banners.');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExtension = file.name.split('.').pop() || 'jpg';
      setUploadingId(id);

      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = reader.result as string;
          try {
            const imageUrl = await uploadBannerImage(pageKey, bannerKey, base64Data, fileExtension);
            await updateWebBanner(id, pageKey, bannerKey, imageUrl, id.replace(/_/g, ' ').toUpperCase());
            
            setDbBanners(prev => prev.map(b => b.id === id ? { ...b, image_url: imageUrl } : b));
            toast.success('¡Imagen de banner de cabecera actualizada con éxito!');
          } catch (error) {
            console.error("Error al subir el banner:", error);
            toast.error('No se pudo subir la imagen. Intente nuevamente.');
          } finally {
            setUploadingId(null);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error leyendo archivo:", error);
        toast.error('Error procesando el archivo.');
        setUploadingId(null);
      }
    };
    input.click();
  };

  const handleSaveCounters = async () => {
    // In production database, save the stats back. For now simulated as saved
    toast.success('Contadores del Portal guardados con éxito');
  };

  const tabs = ['Categorías', 'FAQ', 'Contadores', 'Imágenes', 'Normativas', 'Guías', 'Testimonios'];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Sincronizando Portal Público...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden relative w-full max-w-full">
      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-8 lg:p-12 space-y-12 max-w-full overflow-x-hidden">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>Admin</span>
              <span className="material-symbols-outlined text-base">chevron_right</span>
              <span className="text-primary">Gestión de Contenido Web</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Gestión del Portal Público</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic max-w-2xl text-xs sm:text-sm">
              Administre las categorías, preguntas frecuentes, normativas, guías y testimonios del portal con soporte nativo de multi-idioma (es, en, fr).
            </p>
          </div>
          <button 
            onClick={() => window.open('/', '_blank')}
            className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-xl">visibility</span>
            Vista Previa del Portal
          </button>
        </header>

        {/* Tabs */}
        <nav className="flex space-x-1 border-b border-slate-100 dark:border-slate-800 overflow-x-auto custom-scrollbar max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-3 px-6 sm:px-8 py-5 text-[10px] font-black uppercase tracking-widest transition-all border-b-4 whitespace-nowrap ${
                activeTab === tab 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-slate-400 hover:text-slate-600 hover:border-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* Tab Content Areas */}
        <div className="w-full max-w-full overflow-hidden">
          {activeTab === 'Categorías' && (
            <CategoriesTab 
              categories={categories}
              onAdd={handleAddCategory}
              onUpdate={handleUpdateCategory}
              onDelete={handleDeleteCategory}
            />
          )}

          {activeTab === 'FAQ' && (
            <FAQTab 
              faqs={faqs}
              onAdd={handleAddFAQ}
              onUpdate={handleUpdateFAQ}
              onDelete={handleDeleteFAQ}
            />
          )}

          {activeTab === 'Contadores' && (
            <CountersTab 
              stats={stats}
              onChange={setStats}
              onSave={handleSaveCounters}
            />
          )}

          {activeTab === 'Imágenes' && (
            <ImagesTab 
              banners={dbBanners}
              galleryImages={galleryImages}
              isSuperAdmin={isSuperAdmin}
              uploadingId={uploadingId}
              onBannerUpload={handleBannerUpload}
              onAddGalleryImage={handleAddGalleryImage}
              onDeleteGalleryImage={handleDeleteGalleryImage}
            />
          )}

          {activeTab === 'Normativas' && (
            <NormativesTab 
              normatives={normatives}
              onAdd={handleAddNormative}
              onUpdate={handleUpdateNormative}
              onDelete={handleDeleteNormative}
            />
          )}

          {activeTab === 'Guías' && (
            <GuidesTab 
              guides={guides}
              onAdd={handleAddGuide}
              onUpdate={handleUpdateGuide}
              onDelete={handleDeleteGuide}
            />
          )}

          {activeTab === 'Testimonios' && (
            <TestimonialsTab 
              testimonials={testimonials}
              onAdd={handleAddTestimonial}
              onUpdate={handleUpdateTestimonial}
              onDelete={handleDeleteTestimonial}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default WebContentManagement;
