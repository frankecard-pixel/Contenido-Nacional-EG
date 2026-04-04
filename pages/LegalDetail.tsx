
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import LegalDetailArticle from '../components/public/legal-detail/LegalDetailArticle';
import LegalDetailDownload from '../components/public/legal-detail/LegalDetailDownload';

const LegalDetail: React.FC = () => {
  const { t } = useTranslation();

  const articles = [
    { 
      id: "Art. 1", 
      title: "Objetivo y Ámbito de Aplicación", 
      content: "Regular la participación de empresas ecuatoguineanas y de la mano de obra nacional en todas las actividades petroleras." 
    },
    { 
      id: "Art. 5", 
      title: "Preferencia de Suministro", 
      content: "Las operadoras deben dar preferencia a empresas locales si su oferta no supera en más de un 10% el precio de mercado internacional." 
    },
    { 
      id: "Art. 12", 
      title: "Plan Anual de Contenido Nacional", 
      content: "Toda empresa operadora debe presentar antes del 31 de octubre su plan de contratación local para el año siguiente." 
    },
    { 
      id: "Art. 20", 
      title: "Sanciones y Multas", 
      content: "El incumplimiento de las cuotas establecidas acarrea sanciones económicas que pueden llegar al 5% del valor del contrato." 
    }
  ];

  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="max-w-[var(--layout-max-width)] mx-auto px-6">
        <Link to="/resources" className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-10 inline-block">← Volver a Recursos</Link>
        <header className="mb-16">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tighter">Reglamento de Contenido Nacional 2014</h1>
          <p className="text-slate-500 text-lg leading-relaxed font-medium italic">Decreto Ministerial Nº 1/2014 de fecha 26 de septiembre.</p>
        </header>

        <div className="space-y-8">
          {articles.map((art, idx) => (
            <LegalDetailArticle key={idx} id={art.id} title={art.title} content={art.content} />
          ))}
        </div>

        <LegalDetailDownload />
      </div>
    </div>
  );
};

export default LegalDetail;
