
import React, { useState, useEffect } from 'react';
import { getWebBanners } from '../../services/supabaseApi';

interface PublicBannerProps {
  title: string;
  subtitle?: string;
  category?: string;
  image?: string;
  pageKey?: string;
}

const PublicBanner: React.FC<PublicBannerProps> = ({ 
  title, 
  subtitle, 
  category, 
  image = "https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop",
  pageKey
}) => {
  const [bannerImage, setBannerImage] = useState(image);

  useEffect(() => {
    if (!pageKey) {
      setBannerImage(image);
      return;
    }
    const fetchBanner = async () => {
      try {
        const data = await getWebBanners();
        const found = data.find(b => b.page_key === pageKey);
        if (found) {
          setBannerImage(found.image_url);
        } else {
          setBannerImage(image);
        }
      } catch (error) {
        console.error("Error fetching banner for", pageKey, error);
        setBannerImage(image);
      }
    };
    fetchBanner();
  }, [pageKey, image]);

  return (
    <div className="relative w-full h-[400px] flex items-center overflow-hidden bg-slate-900">
      {/* Background Image with strong overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bannerImage} 
          className="w-full h-full object-cover opacity-50 scale-105" 
          alt="Banner Background" 
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent"></div>
      </div>


      <div className="max-w-[var(--layout-max-width)] mx-auto px-6 relative z-10 w-full">
        <div className="max-w-3xl space-y-4">
          {category && (
            <span className="inline-block px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/30 backdrop-blur-sm">
              {category}
            </span>
          )}
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-slate-400 font-medium max-w-xl leading-relaxed italic">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-100 dark:from-slate-950 to-transparent z-20"></div>
    </div>
  );
};

export default PublicBanner;
