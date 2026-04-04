import React from 'react';
import { MOCK_VIDEOS } from '../../../services/mockService';

const ResourcesVideos: React.FC = () => {
  return (
    <section className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-[#0d121b] dark:text-white flex items-center gap-3 uppercase tracking-tighter">
          <span className="material-symbols-outlined text-primary text-3xl">play_circle</span>
          Video Academy
        </h3>
        <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Explorar Biblioteca</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {MOCK_VIDEOS.map((video) => (
          <div key={video.id} className="group cursor-pointer">
            <div className="relative aspect-video rounded-[2rem] overflow-hidden mb-5 bg-slate-200 dark:bg-slate-800 shadow-sm">
              <img 
                src={video.thumbnail} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                alt={video.title} 
              />
              <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                <div className="size-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-all shadow-2xl border border-white/20">
                  <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </div>
              </div>
              <span className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-[9px] px-3 py-1.5 rounded-lg font-black uppercase tracking-widest">
                {video.duration}
              </span>
            </div>
            <h4 className="text-base font-black text-[#0d121b] dark:text-white leading-tight mb-2 group-hover:text-primary transition-colors uppercase tracking-tight">
              {video.title}
            </h4>
            <p className="text-[10px] font-bold text-[#4c669a] dark:text-gray-400 uppercase tracking-widest flex items-center gap-2">
              {video.label} <span className="size-1 bg-slate-300 rounded-full"></span> {video.language}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResourcesVideos;
