import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_NEWS, MOCK_NEWS_ARTICLES } from '../services/mockService';
import { getNewsArticleById } from '../services/supabaseApi';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';
import { Calendar, User, ArrowLeft, Share2, Download, Loader2 } from 'lucide-react';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newsItem, setNewsItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        if (!id) return;
        const dbArticle = await getNewsArticleById(id);
        if (dbArticle) {
          setNewsItem(dbArticle);
        } else {
          const localItem = MOCK_NEWS.find(n => n.id === id) || 
                            MOCK_NEWS_ARTICLES.find(n => n.id === id);
          setNewsItem(localItem || null);
        }
      } catch (error) {
        console.error("Error loading news article:", error);
        if (id) {
          const localItem = MOCK_NEWS.find(n => n.id === id) || 
                            MOCK_NEWS_ARTICLES.find(n => n.id === id);
          setNewsItem(localItem || null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-950">
        <h2 className="text-2xl font-black mb-4 dark:text-white">Noticia no encontrada</h2>
        <Link to="/news" className="text-blue-600 font-bold hover:underline flex items-center gap-2">
          <ArrowLeft className="size-4" /> Volver a noticias
        </Link>
      </div>
    );
  }

  // Normalize data for display
  const title = typeof newsItem.title === 'string' ? newsItem.title : newsItem.title.es;
  const image = 'image' in newsItem ? newsItem.image : newsItem.featuredImage;
  const date = 'date' in newsItem ? newsItem.date : newsItem.publish_date;
  const content = 'content' in newsItem ? newsItem.content.es : `<p>${newsItem.excerpt}</p><p>Contenido detallado en desarrollo...</p>`;
  const category = newsItem.category;

  return (
    <div className="pb-24 bg-white dark:bg-slate-950">
      <PublicBanner 
        title={title}
        subtitle={category}
        category="Noticias"
        image={image}
      />
      <div className="mx-auto px-6 relative z-50 -mt-16 mb-12 max-w-4xl">
        <MinisterialCertification />
      </div>
      <div className="mx-auto px-6 mt-12 md:mt-20 max-w-4xl">
        <Link 
          to="/news" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-12"
        >
          <ArrowLeft className="size-4" />
          Volver a la Gaceta
        </Link>

        <div className="flex flex-wrap items-center gap-8 mb-12 py-8 border-y border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <Calendar className="size-4 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha de Publicación</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <User className="size-4 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Autor</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Ministerio de Hidrocarburos, Minas y Electricidad</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <button className="size-10 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Share2 className="size-4" />
            </button>
          </div>
        </div>

        <article className="prose prose-slate dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content }} className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed space-y-6" />
        </article>

        {newsItem.url && (
          <div className="mt-12 p-8 bg-blue-50/40 dark:bg-primary/5 rounded-[2.5rem] border border-blue-100/60 dark:border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Fuente Original de la Noticia</h4>
              <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">Esta noticia fue recopilada mediante el rastreador de prensa oficial sectorial.</p>
            </div>
            <a 
              href={newsItem.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-4 bg-primary hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2 shrink-0"
            >
              <span className="material-symbols-outlined text-base">open_in_new</span>
              Leer Noticia Original
            </a>
          </div>
        )}

        {'attachments' in newsItem && newsItem.attachments && newsItem.attachments.length > 0 && (
          <div className="mt-20 p-8 md:p-12 bg-slate-50 dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tight">Documentos Adjuntos</h3>
            <div className="space-y-4">
              {newsItem.attachments.map((att: any) => (
                <div key={att.id} className="flex items-center justify-between p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:border-blue-600 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                      <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase">{att.format}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{att.name}</p>
                      <p className="text-xs text-slate-400">{att.size}</p>
                    </div>
                  </div>
                  <button className="size-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center hover:scale-110 transition-transform">
                    <Download className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDetail;
