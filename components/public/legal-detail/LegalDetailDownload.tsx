import React from 'react';

const LegalDetailDownload: React.FC = () => {
  return (
    <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between">
      <div>
        <h4 className="text-2xl font-black mb-2">¿Necesita el documento completo?</h4>
        <p className="text-slate-400 text-sm">Descargue la versión oficial en PDF firmada por el Ministerio de Hidrocarburos y Desarrollo Minero.</p>
      </div>
      <button className="mt-8 md:mt-0 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all">Descargar PDF</button>
    </div>
  );
};

export default LegalDetailDownload;
