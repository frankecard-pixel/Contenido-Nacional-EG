
import React from 'react';
import { MOCK_NEWS_ARTICLES } from '../services/mockService';
import NewsMainContent from '../components/public/news/NewsMainContent';
import NewsSidebar from '../components/public/news/NewsSidebar';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';

const News: React.FC = () => {
  return (
    <div className="pb-24 bg-white">
      <PublicBanner 
        title="Gaceta de Hidrocarburos" 
        subtitle="Manténgase informado sobre las últimas noticias, comunicados oficiales y eventos del sector."
        category="Transparencia"
        image="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop"
      />
      <div className="mx-auto px-6 relative z-50 -mt-16 mb-12" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <MinisterialCertification />
      </div>
      <div className="mx-auto px-6 mt-20" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Noticia Principal */}
          <NewsMainContent newsItems={MOCK_NEWS_ARTICLES} />

          {/* Sidebar de Boletines */}
          <NewsSidebar />
        </div>
      </div>
    </div>
  );
};

export default News;
