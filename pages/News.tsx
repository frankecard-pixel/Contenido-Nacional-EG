
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getNewsArticles } from '../services/supabaseApi';
import NewsMainContent from '../components/public/news/NewsMainContent';
import NewsSidebar from '../components/public/news/NewsSidebar';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';
import { NewsArticle } from '../types';
import { Loader2 } from 'lucide-react';

const News: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await getNewsArticles();
        // Only show published articles on the public news page
        const publishedNews = (data as NewsArticle[]).filter(item => item.status === 'published');
        setNews(publishedNews);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = news.filter(item => {
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    const titleMatch = (item.title?.es || '').toLowerCase().includes(term) || 
                       (item.title?.fr || '').toLowerCase().includes(term);
    const summaryMatch = (item.summary?.es || '').toLowerCase().includes(term) || 
                         (item.summary?.fr || '').toLowerCase().includes(term);
    const contentText = typeof item.content === 'string' 
      ? item.content 
      : (item.content?.es || item.content?.fr || item.content?.en || '');
    const contentMatch = contentText.toLowerCase().includes(term);
    const categoryMatch = (item.category || '').toLowerCase().includes(term);
    return titleMatch || summaryMatch || contentMatch || categoryMatch;
  });

  return (
    <div className="pb-24 bg-white">
      <PublicBanner 
        title="Gaceta de Hidrocarburos" 
        subtitle="Manténgase informado sobre las últimas noticias, comunicados oficiales y eventos del sector."
        category="Transparencia"
        image="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop"
        pageKey="news"
      />
      <div className="mx-auto px-6 relative z-50 -mt-16 mb-12" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <MinisterialCertification />
      </div>
      <div className="mx-auto px-6 mt-20" style={{ maxWidth: 'var(--layout-max-width)' }}>
        {searchQuery && (
          <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              Resultados de búsqueda para: <span className="font-bold text-slate-900 dark:text-white">"{searchQuery}"</span> ({filteredNews.length} encontradas)
            </p>
            <button 
              onClick={() => setSearchParams({})}
              className="text-xs font-black text-blue-600 hover:underline uppercase tracking-wider animate-pulse"
            >
              Ver Todas
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Noticia Principal */}
          {loading ? (
            <div className="lg:col-span-8 flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={48} />
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
              <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-700 mb-4 animate-bounce">search_off</span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Sin Resultados</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto mb-6">
                No pudimos encontrar ninguna gaceta o comunicado que coincida con "{searchQuery}". Intente con otros términos generales.
              </p>
              <button 
                onClick={() => setSearchParams({})}
                className="px-6 py-3 bg-slate-950 dark:bg-slate-800 text-white dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all"
              >
                Restablecer Búsqueda
              </button>
            </div>
          ) : (
            <NewsMainContent newsItems={filteredNews} />
          )}

          {/* Sidebar de Boletines */}
          <NewsSidebar />
        </div>
      </div>
    </div>
  );
};

export default News;
