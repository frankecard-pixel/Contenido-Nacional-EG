import React from 'react';
import { MOCK_EVENTS } from '../../../services/mockService';

const ResourcesAgenda: React.FC = () => {
  return (
    <section className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-[#0d121b] dark:text-white flex items-center gap-3 uppercase tracking-tighter">
          <span className="material-symbols-outlined text-primary text-3xl">calendar_month</span>
          Agenda del Sector
        </h3>
        <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline">Ver Calendario Completo</button>
      </div>
      <div className="bg-white dark:bg-[#1a202c] rounded-[3rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
        {MOCK_EVENTS.map((event, idx) => (
          <div 
            key={event.id} 
            className={`flex flex-col md:flex-row p-8 lg:p-10 gap-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border-b border-slate-50 dark:border-slate-800 last:border-none group`}
          >
            <div className={`flex flex-row md:flex-col items-center justify-center rounded-[2rem] min-w-[100px] h-[100px] md:h-[120px] p-4 gap-4 md:gap-1 shadow-inner ${
              event.color === 'primary' ? 'bg-blue-50 text-primary' : 'bg-purple-50 text-purple-700'
            }`}>
              <span className="text-xs font-black uppercase tracking-[0.2em]">{event.month}</span>
              <span className="text-4xl font-black tracking-tighter">{event.day}</span>
            </div>
            <div className="flex flex-col flex-1 gap-3">
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest ${
                  event.type === 'Presencial' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {event.type}
                </span>
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                  {event.location}
                </span>
              </div>
              <h4 className="text-2xl font-black text-[#0d121b] dark:text-white uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">
                {event.title}
              </h4>
              <p className="text-sm text-[#4c669a] dark:text-gray-400 font-medium leading-relaxed max-w-3xl">
                {event.description}
              </p>
              <div className="flex items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">schedule</span> {event.time}
                </span>
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">
                    {event.type === 'Webinar' ? 'videocam' : 'location_on'}
                  </span> 
                  {event.venue}
                </span>
              </div>
            </div>
            <div className="flex items-center md:self-center">
              <button className={`w-full md:w-auto px-10 py-4 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl transition-all shadow-xl active:scale-95 ${
                event.color === 'primary' 
                  ? 'bg-primary text-white hover:bg-blue-700 shadow-blue-500/20' 
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-white border border-slate-100 dark:border-slate-600 hover:bg-slate-50'
              }`}>
                {event.color === 'primary' ? 'Inscribirse Ahora' : 'Más Información'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ResourcesAgenda;
