import React from 'react';

interface DirectoryHeaderProps {
  view: 'grid' | 'map';
  setView: (view: 'grid' | 'map') => void;
}

const DirectoryHeader: React.FC<DirectoryHeaderProps> = ({ view, setView }) => {
  return (
    <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div>
         <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Directorio de Empresas</h1>
         <p className="text-lg text-slate-500">Base de datos oficial de empresas con certificación de Contenido Nacional vigente.</p>
      </div>
      <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex space-x-2">
         <button 
           onClick={() => setView('grid')}
           className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
         >
           Lista
         </button>
         <button 
           onClick={() => setView('map')}
           className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'map' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'}`}
         >
           Mapa
         </button>
      </div>
    </header>
  );
};

export default DirectoryHeader;
