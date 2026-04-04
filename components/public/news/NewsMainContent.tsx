import React from 'react';
import { Link } from 'react-router-dom';
import { NewsArticle } from '../../../types';

interface NewsMainContentProps {
  newsItems: NewsArticle[];
}

const NewsMainContent: React.FC<NewsMainContentProps> = ({ newsItems }) => {
  if (!newsItems || newsItems.length === 0) return null;

  const featuredNews = newsItems[0];
  const otherNews = newsItems.slice(1);

  return (
    <div className="lg:col-span-8">
      {/* Noticia Principal */}
      <Link to={`/news/${featuredNews.id}`} className="block relative rounded-[3rem] overflow-hidden shadow-2xl h-[500px] mb-12 group">
        <img src={featuredNews.featuredImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Featured News" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
        <div className="absolute bottom-12 left-12 right-12">
          <span className="bg-blue-700 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 inline-block">{featuredNews.category}</span>
          <h2 className="text-4xl font-black text-white mb-4 tracking-tight leading-none">{featuredNews.title.es}</h2>
          <p className="text-slate-300 text-lg line-clamp-2">{featuredNews.summary.es}</p>
        </div>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {otherNews.map(news => (
          <div key={news.id} className="bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 group">
            <div className="h-56 overflow-hidden">
              <img src={news.featuredImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={news.title.es} />
            </div>
            <div className="p-10">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">{news.category}</span>
                <span className="text-[10px] font-bold text-slate-400">{news.publishDate}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{news.title.es}</h3>
              <p className="text-slate-500 text-sm line-clamp-3 mb-8">{news.summary.es}</p>
              <Link to={`/news/${news.id}`} className="text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-blue-700 transition-colors">Leer más →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsMainContent;
