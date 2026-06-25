import React, { useState, useEffect } from 'react';
import { getWebImages } from '../../../services/supabaseApi';

const HomeGallery: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState('Todos');
  const [lightboxImage, setLightboxImage] = useState<any | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const data = await getWebImages();
        setImages(data);
      } catch (e) {
        console.error('Error fetching gallery images:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // Obtener los grupos disponibles para las pestañas de filtro
  const groups = ['Todos', ...Array.from(new Set(images.map((img: any) => img.group_name))).filter(Boolean)];

  const filteredImages = activeGroup === 'Todos' 
    ? images 
    : images.filter((img: any) => img.group_name === activeGroup);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="py-24 px-4 md:px-8 bg-slate-50 dark:bg-[#101622] border-t border-slate-100 dark:border-slate-800">
      <div className="mx-auto max-w-[var(--layout-max-width)] space-y-12">
        
        {/* Title Block */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Galería del Portal Industrial</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto italic">
            Inspeccione de forma interactiva las fotos oficiales de las instalaciones y eventos de Contenido Nacional en Guinea Ecuatorial.
          </p>
        </div>

        {/* Group Filter Buttons */}
        {groups.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-6">
            {groups.map((group: string) => (
              <button
                key={group}
                onClick={() => setActiveGroup(group)}
                className={`px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeGroup === group
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white dark:bg-[#1a2233] text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 hover:bg-slate-100'
                }`}
              >
                {group}
              </button>
            ))}
          </div>
        )}

        {/* Image Grid */}
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((img: any) => (
              <div 
                key={img.id} 
                onClick={() => setLightboxImage(img)}
                className="group relative aspect-square rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm bg-white dark:bg-[#1a2233] cursor-pointer"
              >
                <img 
                  src={img.url} 
                  alt={img.title?.es || img.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                
                {/* Group Tag */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-md text-[8px] font-black uppercase tracking-widest text-white px-3 py-1.5 rounded-full">
                    {img.group_name}
                  </span>
                </div>

                {/* Cover Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-6 z-10">
                  <h4 className="text-white text-xs font-black uppercase tracking-tight mb-2">
                    {img.title?.es || img.title}
                  </h4>
                  <span className="text-primary text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">zoom_in</span>
                    Ver imagen completa
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 font-bold uppercase tracking-widest text-xs">
            No hay imágenes publicadas en este grupo.
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[999] flex flex-col items-center justify-center p-4">
          {/* Close button */}
          <button 
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>
          
          <div className="max-w-5xl max-h-[80vh] flex flex-col items-center gap-4">
            <img 
              src={lightboxImage.url} 
              alt={lightboxImage.title?.es || lightboxImage.title} 
              className="max-w-full max-h-[70vh] rounded-2xl object-contain shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="text-center space-y-2 mt-4 px-6">
              <span className="inline-block bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                {lightboxImage.group_name}
              </span>
              <h3 className="text-white text-lg font-black uppercase tracking-tight">
                {lightboxImage.title?.es || lightboxImage.title}
              </h3>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeGallery;
