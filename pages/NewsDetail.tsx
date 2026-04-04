import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_NEWS, MOCK_NEWS_ARTICLES } from '../services/mockService';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';
import { Calendar, User, ArrowLeft, Share2, Download } from 'lucide-react';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // Try to find in both mock lists
  const newsItem = MOCK_NEWS.find(n => n.id === id) || 
                   MOCK_NEWS_ARTICLES.find(n => n.id === id);

  if (!newsItem) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-black mb-4">Noticia no encontrada</h2>
        <Link to="/news" className="text-blue-600 font-bold hover:underline flex items-center gap-2">
          <ArrowLeft className="size-4" /> Volver a noticias
        </Link>
      </div>
    );
  }

  // Normalize data for display
  const title = typeof newsItem.title === 'string' ? newsItem.title : newsItem.title.es;
  const image = 'image' in newsItem ? newsItem.image : newsItem.featuredImage;
  const date = 'date' in newsItem ? newsItem.date : newsItem.publishDate;
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
              <p className="text-sm font-bold text-slate-900 dark:text-white">Ministerio de Hidrocarburos</p>
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
