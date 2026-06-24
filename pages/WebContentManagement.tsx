
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getWebCategories, getWebBanners, updateWebBanner, uploadBannerImage } from '../services/supabaseApi';
import { WebCategory, Language } from '../types';

interface WebContentManagementProps {
  user?: any;
}

const WebContentManagement: React.FC<WebContentManagementProps> = ({ user }) => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<WebCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Categorías');
  const [editingCategory, setEditingCategory] = useState<WebCategory | null>(null);
  const [selectedLang, setSelectedLang] = useState<Language>('es');
  const [dbBanners, setDbBanners] = useState<any[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const isSuperAdmin = user?.role === 'super_admin';

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [catsData, bannersData] = await Promise.all([
          getWebCategories(),
          getWebBanners()
        ]);
        setCategories(catsData as any[]);
        setDbBanners(bannersData);
      } catch (error) {
        console.error("Error fetching web categories & banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleBannerUpload = async (id: string, pageKey: string, bannerKey: string) => {
    if (!isSuperAdmin) {
      setNotification({ text: 'Acceso Denegado: Solo los Super Administradores pueden subir banners.', type: 'error' });
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
      setNotification(null);

      try {
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = reader.result as string;
          try {
            // Renombrar dinámicamente y subir al storage
            const imageUrl = await uploadBannerImage(pageKey, bannerKey, base64Data, fileExtension);
            
            // Actualizar la referencia en base de datos
            await updateWebBanner(id, pageKey, bannerKey, imageUrl, id.replace(/_/g, ' ').toUpperCase());

            // Actualizar estado local
            setDbBanners(prev => prev.map(b => b.id === id ? { ...b, image_url: imageUrl } : b));
            setNotification({ text: '¡Imagen de banner subida y guardada correctamente!', type: 'success' });
          } catch (error) {
            console.error("Error al subir el banner:", error);
            setNotification({ text: 'No se pudo subir la imagen. Intente nuevamente.', type: 'error' });
          } finally {
            setUploadingId(null);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error leyendo archivo:", error);
        setNotification({ text: 'Error procesando el archivo.', type: 'error' });
        setUploadingId(null);
      }
    };
    input.click();
  };

  const tabs = ['Categorías', 'FAQ', 'Contadores', 'Imágenes', 'Normativas', 'Guías', 'Testimonios'];
  
  const [stats, setStats] = useState([
    { id: 'stat-1', label: "Empresas", val: "1,240+", desc: "Locales Registradas", icon: "domain" },
    { id: 'stat-2', label: "Oportunidades", val: "45", desc: "Licitaciones Activas", icon: "work" },
    { id: 'stat-3', label: "Contratos", val: "342", desc: "Adjudicados este año", icon: "contract" },
    { id: 'stat-4', label: "Valor Local", val: "$45.2M", desc: "Retención Económica", icon: "payments" }
  ]);

  const getStatusBadge = (status: WebCategory['status']) => {
    if (status === 'published') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30">
          <span className="size-1.5 rounded-full bg-emerald-500"></span>
          Publicado
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-500 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
        <span className="size-1.5 rounded-full bg-slate-400"></span>
        Borrador
      </span>
    );
  };

  const LangChip = ({ code, isAvailable }: { code: string, isAvailable: boolean }) => (
    <span className={`inline-flex items-center justify-center size-8 rounded-lg text-[10px] font-black border transition-all ${
      isAvailable 
        ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-400' 
        : 'bg-slate-50 text-slate-300 border-slate-100 opacity-40'
    }`}>
      {code.toUpperCase()}
    </span>
  );


  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden animate-in fade-in duration-700 relative">
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-12 space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>Admin</span>
              <span className="material-symbols-outlined text-base">chevron_right</span>
              <span className="text-primary">Gestión de Contenido Web</span>
            </nav>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Gestión del Portal Público</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium italic max-w-2xl">Administre las categorías, leyes y guías visibles en el frontend. Soporte multi-idioma nativo.</p>
          </div>
          <button className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-sm transition-all">
            <span className="material-symbols-outlined text-xl">visibility</span>
            Vista Previa del Portal
          </button>
        </header>

        {/* Tabs */}
        <nav className="flex space-x-1 border-b border-slate-100 dark:border-slate-800 overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => (
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

        {/* Toolbar */}
        {activeTab === 'Categorías' && (
          <section className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative w-full max-w-md group">
              <span className="absolute inset-y-0 left-5 flex items-center text-slate-400 group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined">search</span>
              </span>
              <input 
                type="text" 
                placeholder={`Buscar en ${activeTab}...`}
                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary shadow-sm dark:text-white"
              />
            </div>
            <div className="flex gap-3">
               <button className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-primary shadow-sm"><span className="material-symbols-outlined">filter_list</span></button>
               <button className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                 <span className="material-symbols-outlined text-lg">add</span>
                 Nueva {activeTab.slice(0,-1)}
               </button>
            </div>
          </section>
        )}

        {/* Table View / Content Area */}
        {activeTab === 'Categorías' && (
          <section className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
                    <th className="py-6 px-10">Elemento</th>
                    <th className="py-6 px-10">Descripción Resumen</th>
                    <th className="py-6 px-10 text-center">Idiomas Activos</th>
                    <th className="py-6 px-10">Estado</th>
                    <th className="py-6 px-10 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-all cursor-pointer" onClick={() => setEditingCategory(cat)}>
                      <td className="py-8 px-10">
                        <div className="flex items-center gap-6">
                          <div className="size-12 rounded-2xl bg-blue-50 dark:bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                            <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
                          </div>
                          <div>
                            <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{(cat.name as any).es || cat.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {cat.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-8 px-10 max-w-[300px]">
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate uppercase tracking-tight">{(cat.description as any).es || cat.description}</p>
                      </td>
                      <td className="py-8 px-10">
                        <div className="flex justify-center gap-2">
                          <LangChip code="ES" isAvailable={true} />
                          <LangChip code="EN" isAvailable={cat.available_languages?.includes('en') || false} />
                          <LangChip code="FR" isAvailable={cat.available_languages?.includes('fr') || false} />
                        </div>
                      </td>
                      <td className="py-8 px-10">
                        {getStatusBadge(cat.status)}
                      </td>
                      <td className="py-8 px-10 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"><span className="material-symbols-outlined">edit</span></button>
                           <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"><span className="material-symbols-outlined">delete</span></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-10 border-t border-slate-50 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-700/20 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mostrando {categories.length} categorías de servicios públicos</p>
            </div>
          </section>
        )}

        {activeTab === 'Contadores' && (
          <section className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stats.map((stat, idx) => (
                <div key={stat.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-slate-900 dark:text-white font-black uppercase text-xs tracking-widest">{stat.label}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contador Público #{idx + 1}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valor a Mostrar</label>
                      <input 
                        type="text" 
                        value={stat.val} 
                        onChange={(e) => {
                          const newStats = [...stats];
                          newStats[idx].val = e.target.value;
                          setStats(newStats);
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-black dark:text-white focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción</label>
                      <input 
                        type="text" 
                        value={stat.desc} 
                        onChange={(e) => {
                          const newStats = [...stats];
                          newStats[idx].desc = e.target.value;
                          setStats(newStats);
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold dark:text-white focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button className="px-10 py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all">
                Guardar Todos los Contadores
              </button>
            </div>
          </section>
        )}

        {activeTab === 'Imágenes' && (
          <section className="space-y-12 animate-in fade-in duration-500">
            {/* Permisos Header */}
            <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Módulo de Banners Dinámicos</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                  Permisos Actuales: {isSuperAdmin ? (
                    <span className="text-emerald-500 font-black">SUPER ADMINISTRADOR (ACCESO TOTAL)</span>
                  ) : (
                    <span className="text-amber-500 font-black">SOLO LECTURA (MODIFICACIONES RESERVADAS PARA SUPER ADMIN)</span>
                  )}
                </p>
              </div>
              {isSuperAdmin ? (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-xl">
                  <span className="material-symbols-outlined text-sm animate-pulse">lock_open</span>
                  Sincronizado con Storage
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-4 py-2 rounded-xl">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Banners Protegidos
                </div>
              )}
            </div>

            {/* Banners de Home (Carrusel) */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight animate-in slide-in-from-left duration-300">Banner de Inicio (Home Hero Carousel)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">Imágenes rotativas de la página de inicio. Resolución recomendada 1920x1080 o superior.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {dbBanners.filter(b => b.page_key === 'home').map((banner, idx) => (
                  <div key={banner.id} className="group relative aspect-video rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-800">
                    <img 
                      src={banner.image_url} 
                      className={`w-full h-full object-cover transition-transform duration-700 ${uploadingId === banner.id ? 'opacity-40' : 'group-hover:scale-110'}`} 
                      alt={banner.title} 
                    />
                    
                    {/* Overlay de acciones */}
                    <div className="absolute inset-0 bg-slate-950/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 z-30">
                      {isSuperAdmin ? (
                        <button 
                          onClick={() => handleBannerUpload(banner.id, banner.page_key, banner.banner_key)}
                          disabled={uploadingId !== null}
                          className="px-6 py-3 rounded-xl bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">upload</span>
                          Cambiar Banner
                        </button>
                      ) : (
                        <span className="text-white text-[9px] font-black uppercase tracking-widest bg-slate-900/80 px-4 py-2 rounded-xl">Solo Lectura</span>
                      )}
                    </div>

                    {/* Loader de subida */}
                    {uploadingId === banner.id && (
                      <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center gap-3 z-40">
                        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-white text-[9px] font-black uppercase tracking-widest animate-pulse">Subiendo...</span>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-lg z-20">
                      <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Slider #{idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Banners de Landing Page */}
            <div className="space-y-6 pt-12 border-t border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Banner de Bienvenida (Landing Page Carousel)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">Imágenes rotativas para la landing page principal.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                {dbBanners.filter(b => b.page_key === 'landing').map((banner, idx) => (
                  <div key={banner.id} className="group relative aspect-video rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-800">
                    <img 
                      src={banner.image_url} 
                      className={`w-full h-full object-cover transition-transform duration-700 ${uploadingId === banner.id ? 'opacity-40' : 'group-hover:scale-110'}`} 
                      alt={banner.title} 
                    />
                    
                    {/* Overlay de acciones */}
                    <div className="absolute inset-0 bg-slate-950/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 z-30">
                      {isSuperAdmin ? (
                        <button 
                          onClick={() => handleBannerUpload(banner.id, banner.page_key, banner.banner_key)}
                          disabled={uploadingId !== null}
                          className="px-4 py-3 rounded-xl bg-white text-slate-900 font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">upload</span>
                          Cambiar
                        </button>
                      ) : (
                        <span className="text-white text-[9px] font-black uppercase tracking-widest bg-slate-900/80 px-4 py-2 rounded-xl">Solo Lectura</span>
                      )}
                    </div>

                    {/* Loader de subida */}
                    {uploadingId === banner.id && (
                      <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center gap-3 z-40">
                        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-white text-[9px] font-black uppercase tracking-widest animate-pulse">Subiendo...</span>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-lg z-20">
                      <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Slider #{idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Banners Estáticos de Páginas */}
            <div className="space-y-6 pt-12 border-t border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Banners de Secciones del Portal</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">Imágenes de cabecera para las subpáginas del portal de Contenido Nacional.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {dbBanners.filter(b => !['home', 'landing'].includes(b.page_key)).map((banner) => (
                  <div key={banner.id} className="group relative h-48 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm bg-slate-100 dark:bg-slate-800">
                    <img 
                      src={banner.image_url} 
                      className={`w-full h-full object-cover transition-transform duration-700 ${uploadingId === banner.id ? 'opacity-40' : 'group-hover:scale-110'}`} 
                      alt={banner.title} 
                    />
                    
                    {/* Overlay de acciones */}
                    <div className="absolute inset-0 bg-slate-950/55 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 z-30">
                      {isSuperAdmin ? (
                        <button 
                          onClick={() => handleBannerUpload(banner.id, banner.page_key, banner.banner_key)}
                          disabled={uploadingId !== null}
                          className="px-6 py-3 rounded-xl bg-white text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">upload</span>
                          Subir Nuevo Banner
                        </button>
                      ) : (
                        <span className="text-white text-[9px] font-black uppercase tracking-widest bg-slate-900/80 px-4 py-2 rounded-xl">Solo Lectura</span>
                      )}
                    </div>

                    {/* Loader de subida */}
                    {uploadingId === banner.id && (
                      <div className="absolute inset-0 bg-slate-950/60 flex flex-col items-center justify-center gap-3 z-40">
                        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-white text-[9px] font-black uppercase tracking-widest animate-pulse">Subiendo...</span>
                      </div>
                    )}

                    <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-lg z-20">
                      <span className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest">{banner.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Edit Drawer Overlay */}
      {editingCategory && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setEditingCategory(null)}></div>
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
            <header className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <div>
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Editar Categoría</h2>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{editingCategory.id}</p>
               </div>
               <button onClick={() => setEditingCategory(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><span className="material-symbols-outlined">close</span></button>
            </header>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              {/* Language Switcher for Fields */}
              <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex">
                {(['es', 'en', 'fr'] as Language[]).map(lang => (
                  <button 
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      selectedLang === lang ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {lang === 'es' ? 'Español' : lang === 'en' ? 'English' : 'Français'}
                  </button>
                ))}
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre de la Categoría ({selectedLang.toUpperCase()})</label>
                  <input 
                    type="text" 
                    value={editingCategory.name[selectedLang] || ''} 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-primary dark:text-white"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción ({selectedLang.toUpperCase()})</label>
                  <div className="rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-inner bg-slate-50 dark:bg-slate-800/50">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex gap-2">
                       <button className="p-2 text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-lg">format_bold</span></button>
                       <button className="p-2 text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-lg">format_italic</span></button>
                       <button className="p-2 text-slate-400 hover:text-primary"><span className="material-symbols-outlined text-lg">link</span></button>
                    </div>
                    <textarea 
                      rows={5}
                      className="w-full bg-transparent border-none p-6 text-sm font-medium leading-relaxed dark:text-slate-300 resize-none focus:ring-0"
                      value={editingCategory.description[selectedLang] || ''}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-700">
                  <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Estado de Publicación</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Visible para el público general</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked={editingCategory.status === 'published'} className="peer sr-only" />
                    <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-6"></div>
                  </label>
                </div>
              </div>
            </div>

            <footer className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex gap-4">
              <button onClick={() => setEditingCategory(null)} className="flex-1 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 rounded-2xl hover:bg-slate-50 transition-all">Cancelar</button>
              <button className="flex-1 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all">Guardar Cambios</button>
            </footer>
          </div>
        </div>
      )}

      {/* Notificación flotante de subida de banner */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-bounce ${
          notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <span className="material-symbols-outlined">{notification.type === 'success' ? 'check_circle' : 'error'}</span>
          <span className="text-xs font-black uppercase tracking-widest">{notification.text}</span>
          <button onClick={() => setNotification(null)} className="ml-4 hover:opacity-80 cursor-pointer">
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default WebContentManagement;
