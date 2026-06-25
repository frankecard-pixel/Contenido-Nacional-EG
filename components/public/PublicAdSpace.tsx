import React, { useState, useEffect, useRef } from 'react';
import { getAdvertisements, incrementAdImpressions, incrementAdClicks } from '../../services/supabaseApi';
import { ExternalLink, Megaphone } from 'lucide-react';

interface PublicAdSpaceProps {
  format: 'top_banner' | 'sidebar_banner' | 'in_feed_card' | 'footer_banner';
  className?: string;
}

export const PublicAdSpace: React.FC<PublicAdSpaceProps> = ({ format, className = '' }) => {
  const [ad, setAd] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const tracked = useRef(false);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const ads = await getAdvertisements();
        // Filter for active ads with matching format
        const activeAds = (ads || []).filter(
          (item: any) => item.status === 'active' && item.format === format
        );
        
        if (activeAds.length > 0) {
          // Select a random ad from the matching active ones to keep it dynamic
          const randomIndex = Math.floor(Math.random() * activeAds.length);
          setAd(activeAds[randomIndex]);
        } else {
          setAd(null);
        }
      } catch (err) {
        console.error('Error fetching ad for space:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [format]);

  // Track impression once per mount of a specific ad
  useEffect(() => {
    if (ad && !tracked.current) {
      tracked.current = true;
      incrementAdImpressions(ad.id, ad.impressions || 0).catch((err) =>
        console.error('Error incrementing impression:', err)
      );
    }
  }, [ad]);

  const handleAdClick = async () => {
    if (!ad) return;
    try {
      // Increment click count
      await incrementAdClicks(ad.id, ad.clicks || 0);
    } catch (err) {
      console.error('Error incrementing click:', err);
    }
    
    // Redirect or open link safely
    const targetUrl = ad.link_url || ad.link;
    if (targetUrl) {
      if (targetUrl.startsWith('http')) {
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = targetUrl;
      }
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center p-4 min-h-[100px] ${className}`}>
        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Cargando Espacio Publicitario...</span>
      </div>
    );
  }

  // PLACEHOLDERS: If no active ad is found, show a beautiful slot availability placeholder
  if (!ad) {
    if (format === 'top_banner') {
      return (
        <div className={`w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 rounded-[2rem] p-6 text-center flex flex-col md:flex-row items-center justify-between gap-4 ${className}`}>
          <div className="flex items-center gap-4 text-left">
            <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0">
              <Megaphone size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Espacio Publicitario Disponible</p>
              <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">Banner Principal Superior (Horizontal)</h5>
            </div>
          </div>
          <a
            href="/dashboard/advertiser/campaigns"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-colors shrink-0"
          >
            Anúnciate Aquí
          </a>
        </div>
      );
    }

    if (format === 'footer_banner') {
      return (
        <div className={`w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 rounded-[2rem] p-8 text-center flex flex-col items-center justify-center gap-3 ${className}`}>
          <div className="size-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
            <Megaphone size={18} />
          </div>
          <div className="text-center space-y-1">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Espacio Publicitario Disponible</p>
            <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase">Banner de Cierre de Página</h5>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Llegue a miles de profesionales del sector petrolero en Guinea Ecuatorial</p>
          </div>
          <a
            href="/dashboard/advertiser/campaigns"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-colors mt-2"
          >
            Reservar Espacio
          </a>
        </div>
      );
    }

    if (format === 'sidebar_banner') {
      return (
        <div className={`w-full bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 rounded-[2rem] p-6 text-center space-y-4 ${className}`}>
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Publicidad</span>
            <span className="text-[9px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded uppercase">Disponible</span>
          </div>
          <div className="py-4 flex flex-col items-center gap-2">
            <Megaphone className="text-blue-500 w-8 h-8" />
            <h5 className="text-xs font-black text-slate-900 dark:text-white uppercase">Espacio Lateral</h5>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">Posiciona tu empresa y servicios de forma fija en la gacetilla lateral.</p>
          </div>
          <a
            href="/dashboard/advertiser/campaigns"
            className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-colors text-center"
          >
            Crear Campaña
          </a>
        </div>
      );
    }

    // Default or in_feed_card
    return (
      <div className={`w-full bg-gradient-to-r from-blue-500/5 to-primary/5 dark:from-blue-900/10 dark:to-slate-800/50 border border-dashed border-blue-500/20 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[140px] ${className}`}>
        <div className="absolute top-3 right-3 text-[9px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-2.5 py-1 rounded-full">
          Patrocinado
        </div>
        <div className="space-y-2 max-w-[80%]">
          <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Espacio Nativo Integrado</p>
          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">¿Quieres promocionar tu servicio o producto?</h4>
          <p className="text-xs font-bold text-slate-400 uppercase leading-normal">
            Aparece directamente aquí dentro del flujo de contenido del portal.
          </p>
        </div>
        <div className="mt-4 flex items-center justify-end">
          <a
            href="/dashboard/advertiser/campaigns"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-[9px] uppercase tracking-widest px-4 py-2 rounded-xl transition-all"
          >
            Anunciarse <ExternalLink size={10} />
          </a>
        </div>
      </div>
    );
  }

  // ACTIVE ADS RENDERING:
  const targetUrl = ad.link_url || ad.link;

  if (format === 'top_banner') {
    return (
      <div 
        onClick={handleAdClick}
        className={`w-full group cursor-pointer bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all relative flex flex-col md:flex-row items-stretch min-h-[110px] ${className}`}
      >
        <div className="absolute top-3 right-3 z-10 text-[8px] font-black text-white bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest">
          Patrocinado
        </div>
        <div className="md:w-1/3 relative shrink-0 aspect-[16/9] md:aspect-auto md:h-full bg-slate-100">
          <img 
            src={ad.image_url} 
            alt={ad.title} 
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 absolute inset-0"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-center space-y-1">
          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors">
            {ad.title}
          </h4>
          {ad.description && (
            <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed max-w-xl">
              {ad.description}
            </p>
          )}
          {targetUrl && (
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 mt-2">
              Saber más <ExternalLink size={10} />
            </span>
          )}
        </div>
      </div>
    );
  }

  if (format === 'footer_banner') {
    return (
      <div 
        onClick={handleAdClick}
        className={`w-full group cursor-pointer bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-md hover:shadow-lg transition-all relative min-h-[120px] ${className}`}
      >
        <div className="absolute top-4 right-4 z-10 text-[8px] font-black text-white bg-slate-900/60 backdrop-blur-sm px-3 py-1 rounded-full uppercase tracking-widest">
          Anuncio
        </div>
        <div className="relative w-full h-32 bg-slate-100 dark:bg-slate-800">
          <img 
            src={ad.image_url} 
            alt={ad.title} 
            className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end pointer-events-none">
            <h4 className="text-sm font-black text-white uppercase tracking-tight drop-shadow-md">
              {ad.title}
            </h4>
            {ad.description && (
              <p className="text-[9px] text-slate-200 font-bold uppercase tracking-wide mt-1 max-w-2xl line-clamp-1 drop-shadow-md">
                {ad.description}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (format === 'sidebar_banner') {
    return (
      <div 
        onClick={handleAdClick}
        className={`w-full group cursor-pointer bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all relative flex flex-col ${className}`}
      >
        <div className="absolute top-3 right-3 z-10 text-[8px] font-black text-white bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest">
          Patrocinado
        </div>
        <div className="relative aspect-video w-full bg-slate-100">
          <img 
            src={ad.image_url} 
            alt={ad.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="p-6 space-y-2">
          <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase leading-tight group-hover:text-blue-600 transition-colors">
            {ad.title}
          </h4>
          {ad.description && (
            <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed line-clamp-3">
              {ad.description}
            </p>
          )}
          {targetUrl && (
            <span className="inline-flex items-center gap-1 text-[9px] font-black text-blue-600 uppercase tracking-widest mt-2">
              Visitar sitio <ExternalLink size={10} />
            </span>
          )}
        </div>
      </div>
    );
  }

  // default / in_feed_card
  return (
    <div 
      onClick={handleAdClick}
      className={`w-full group cursor-pointer bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all relative flex flex-col sm:flex-row p-4 gap-4 ${className}`}
    >
      <div className="absolute top-4 right-4 z-10 text-[8px] font-black text-white bg-slate-900/60 backdrop-blur-sm px-2.5 py-1 rounded-full uppercase tracking-widest">
        Patrocinado
      </div>
      <div className="w-full sm:w-40 aspect-video sm:aspect-square relative rounded-2xl overflow-hidden bg-slate-100 shrink-0">
        <img 
          src={ad.image_url} 
          alt={ad.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 absolute inset-0"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between py-1">
        <div className="space-y-1">
          <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Anuncio Recomendado</span>
          <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors">
            {ad.title}
          </h4>
          {ad.description && (
            <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed line-clamp-2">
              {ad.description}
            </p>
          )}
        </div>
        {targetUrl && (
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 mt-2">
            Ver detalles <ExternalLink size={10} />
          </span>
        )}
      </div>
    </div>
  );
};
