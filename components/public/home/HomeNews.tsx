import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { getNewsArticles } from '../../../services/supabaseApi';
import { NewsArticle } from '../../../types';
import { ArrowRight, Calendar, Loader2 } from 'lucide-react';

const HomeNews: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const data = await getNewsArticles();
        // Filter published articles and get latest 3
        const published = (data as NewsArticle[]).filter(art => art.status === 'published');
        setArticles(published.slice(0, 3));
      } catch (error) {
        console.error("Error fetching latest news for home:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatestNews();
  }, []);

  const getTranslation = (field: any, lang: string = 'es'): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return field[lang] || field['es'] || '';
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('es-GQ', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-[var(--layout-max-width)] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-blue-200 dark:border-blue-800">
              Gaceta de Hidrocarburos
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
              Últimas <span className="text-blue-600 italic">Novedades</span> del Sector
            </h2>
          </div>
          <Link 
            to="/news" 
            className="group flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Ver todas las noticias
            <div className="size-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <ArrowRight className="size-4" />
            </div>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={36} />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
            <p className="text-slate-400 font-medium italic">No hay novedades publicadas en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {articles.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white dark:bg-slate-900 rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-row md:flex-col h-auto md:h-full"
              >
                {/* Image Container */}
                <div className="relative aspect-square w-28 shrink-0 md:w-full md:aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img 
                    src={news.featuredImage || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000'} 
                    alt={getTranslation(news.title)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 md:top-6 md:left-6">
                    <span className="px-2 md:px-4 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-900 dark:text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest shadow-sm">
                      {news.category}
                    </span>
                  </div>
                </div>
                
                {/* Content Container */}
                <div className="p-4 md:p-8 flex flex-col flex-grow min-w-0">
                  <div className="flex items-center gap-4 text-slate-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mb-2 md:mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3 text-blue-600" />
                      {formatDate(news.publish_date)}
                    </div>
                  </div>
                  
                  <h3 className="text-sm md:text-xl font-black text-slate-900 dark:text-white mb-2 md:mb-4 leading-tight uppercase tracking-tight group-hover:text-blue-600 transition-colors line-clamp-2 md:line-clamp-none">
                    {getTranslation(news.title)}
                  </h3>
                  
                  <p className="hidden md:block text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 line-clamp-2">
                    {getTranslation(news.summary)}
                  </p>
                  
                  <div className="mt-auto pt-3 md:pt-6 border-t border-slate-50 dark:border-slate-800">
                    <Link 
                      to={`/news/${news.id}`}
                      className="flex items-center justify-between text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white group/btn"
                    >
                      <span className="hidden md:inline">Leer Artículo</span>
                      <span className="md:hidden">Ver más</span>
                      <ArrowRight className="size-3 md:size-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeNews;
