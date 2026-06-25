import React, { useState, useEffect } from 'react';
import { ExternalLink, Loader2, Image as ImageIcon } from 'lucide-react';
import { getAdvertisements } from '../services/supabaseApi';

interface AdBannerProps {
  type: 'sidebar' | 'main' | 'inline';
  format?: 'top_banner' | 'sidebar' | 'sidebar_banner' | 'inline';
  imageUrl?: string;
  title?: string;
  description?: string;
  sponsor?: string;
  link?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ type, format: propFormat, imageUrl: propImageUrl, title: propTitle, description: propDescription, sponsor: propSponsor, link: propLink }) => {
  const [ad, setAd] = useState<any>(null);
  const [loading, setLoading] = useState(!propTitle);

  useEffect(() => {
    if (!propTitle) {
      const fetchAd = async () => {
        try {
          const ads = await getAdvertisements();
          let activeAds = ads.filter((a: any) => a.status === 'active');
          
          if (propFormat) {
            activeAds = activeAds.filter((a: any) => a.format === propFormat);
          } else if (type === 'sidebar') {
            activeAds = activeAds.filter((a: any) => a.format === 'sidebar' || a.format === 'sidebar_banner');
          } else if (type === 'main') {
            activeAds = activeAds.filter((a: any) => a.format === 'top_banner' || a.format === 'main');
          }

          if (activeAds.length > 0) {
            const selectedAd = activeAds[Math.floor(Math.random() * activeAds.length)];
            setAd(selectedAd);
          }
        } catch (error) {
          console.error("Error fetching ad for banner:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAd();
    }
  }, [propTitle, propFormat, type]);

  const imageUrl = propImageUrl || ad?.image_url;
  const title = propTitle || ad?.title;
  const description = propDescription || ad?.description;
  const sponsor = propSponsor || ad?.sponsor_name || ad?.company_name;
  const link = propLink || ad?.link_url;

  const handleClick = () => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading && !propTitle) {
    return (
      <div className={`w-full rounded-2xl bg-slate-50 dark:bg-slate-900/50 animate-pulse flex items-center justify-center ${type === 'main' ? 'h-32 mb-8' : 'h-24 mt-4'}`}>
        <Loader2 className="w-5 h-5 text-slate-300 animate-spin" />
      </div>
    );
  }


  if (type === 'sidebar') {
    return (
      <div 
        onClick={handleClick}
        className="mt-4 p-4 rounded-2xl bg-slate-900 border border-white/10 relative overflow-hidden group cursor-pointer hover:border-blue-500/50 transition-colors"
      >
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded z-10">
          Publicidad
        </div>
        {imageUrl ? (
          <div className="w-full h-24 bg-slate-100 dark:bg-slate-800 rounded-xl mb-3 overflow-hidden">
            <img src={imageUrl} alt="Ad" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>
        ) : (
          <div className="w-full h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl mb-3 flex items-center justify-center group-hover:from-slate-700 group-hover:to-slate-800 transition-all border border-white/5">
            <div className="flex flex-col items-center gap-1">
              <ImageIcon size={20} className="text-slate-600" />
              <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest">Espacio Publicitario</span>
            </div>
          </div>
        )}
        <h4 className="text-xs font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
          {title || 'Anuncie su empresa aquí'}
        </h4>
        <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
          {description || 'Llegue a miles de profesionales y empresas del sector.'}
        </p>
        {sponsor && (
          <p className="text-[9px] font-bold text-blue-500 mt-2 uppercase tracking-wider">
            Patrocinado por {sponsor}
          </p>
        )}
      </div>
    );
  }

  if (type === 'main') {
    return (
      <div 
        onClick={handleClick}
        className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/50 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden cursor-pointer group mb-8 shadow-sm hover:shadow-md transition-all"
      >
        <div className="absolute top-3 right-3 bg-black/10 dark:bg-black/50 backdrop-blur-md text-slate-600 dark:text-white text-[9px] font-black uppercase px-2 py-1 rounded-lg z-10">
          Publicidad Premium
        </div>
        {imageUrl ? (
          <div className="w-full sm:w-64 h-32 shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
            <img src={imageUrl} alt="Ad" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </div>
        ) : (
          <div className="w-full sm:w-64 h-32 shrink-0 bg-blue-100/50 dark:bg-blue-900/30 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-blue-200 dark:border-blue-800/50">
            <ImageIcon size={32} className="text-blue-300 dark:text-blue-800/50 mb-2" />
            <span className="text-blue-400 dark:text-blue-500 text-[10px] font-black uppercase tracking-widest">Banner Principal</span>
          </div>
        )}
        <div className="flex-1 text-center sm:text-left">
          <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title || 'Destaque su marca en el portal principal'}
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-2xl">
            {description || 'Posicione sus servicios frente a las operadoras petroleras y contratistas más importantes del país.'}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2">
              Saber más <ExternalLink className="w-3 h-3" />
            </button>
            {sponsor && (
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Patrocinado por <span className="text-blue-600 dark:text-blue-400">{sponsor}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AdBanner;
