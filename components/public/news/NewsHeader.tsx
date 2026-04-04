import React from 'react';

const NewsHeader: React.FC = () => {
  return (
    <header className="mb-20 text-center">
      <span className="text-blue-700 font-bold text-[10px] uppercase tracking-widest mb-4 block">Gaceta Informativa</span>
      <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Últimas Actualizaciones</h1>
    </header>
  );
};

export default NewsHeader;
