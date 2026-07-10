import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getNewsArticles, createDenuncia } from '../../services/supabaseApi';
import { triggerN8nNotification } from '../../services/n8nService';
import { NewsArticle, User } from '../../types';
import { 
  Search, Calendar, User as UserIcon, Download, 
  ArrowLeft, MessageSquare, Star, Send, Loader2, 
  FileText, BookOpen, Share2, Eye, Filter, Newspaper, Flag 
} from 'lucide-react';
import { toast } from 'sonner';

interface PortalNewsViewerProps {
  user: User;
}

const PortalNewsViewer: React.FC<PortalNewsViewerProps> = ({ user }) => {
  const { t, i18n } = useTranslation();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // States for comments inside selected article
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const data = await getNewsArticles();
        // Only show published articles in the dashboard portal viewer
        const published = (data as NewsArticle[]).filter(item => item.status === 'published');
        setArticles(published);
      } catch (error) {
        console.error("Error loading portal news:", error);
        toast.error("Error al cargar las noticias.");
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Helper to extract localized text
  const getLocalizedValue = (val: any) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    return val[i18n.language] || val['es'] || val['en'] || val['fr'] || '';
  };

  // Extract unique categories from articles
  const categories = useMemo(() => {
    const list = new Set<string>();
    articles.forEach(art => {
      if (art.category) list.add(art.category);
    });
    return ['Todos', ...Array.from(list)];
  }, [articles]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter(art => {
      const title = getLocalizedValue(art.title).toLowerCase();
      const summary = getLocalizedValue(art.summary).toLowerCase();
      const textContent = getLocalizedValue(art.content).toLowerCase();
      const cat = (art.category || '').toLowerCase();
      
      const matchesSearch = title.includes(searchQuery.toLowerCase()) || 
                            summary.includes(searchQuery.toLowerCase()) || 
                            textContent.includes(searchQuery.toLowerCase()) ||
                            cat.includes(searchQuery.toLowerCase());
                            
      const matchesCategory = selectedCategory === 'Todos' || art.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchQuery, selectedCategory, i18n.language]);

  // Handle open article and load comments
  const handleSelectArticle = (art: NewsArticle) => {
    setSelectedArticle(art);
    // Load comments
    const stored = localStorage.getItem(`news_comments_${art.id}`);
    if (stored) {
      setComments(JSON.parse(stored));
    } else {
      const defaultComments = [
        {
          id: `comment-def-1`,
          userName: 'Dra. Elvira Ndong',
          userRole: 'cuerpo_tecnico',
          rating: 5,
          text: 'Excelente cobertura. El Ministerio demuestra un compromiso firme con la soberanía energética de Guinea Ecuatorial.',
          date: 'Hace 2 días'
        },
        {
          id: `comment-def-2`,
          userName: 'Ing. Tomás Obiang',
          userRole: 'empresa_local',
          rating: 4,
          text: 'Este tipo de informes transparentes nos facilita mucho el planeamiento y cumplimiento a las empresas de servicios locales.',
          date: 'Hace 4 días'
        }
      ];
      setComments(defaultComments);
      localStorage.setItem(`news_comments_${art.id}`, JSON.stringify(defaultComments));
    }
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
    setCommentText('');
    setRating(5);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedArticle) return;
    setSubmittingComment(true);

    const commenterName = user?.name || 'Usuario del Portal';
    const commenterRole = user?.role || 'persona';

    const newCommentObj = {
      id: `comment-${Date.now()}`,
      userName: commenterName,
      userRole: commenterRole,
      rating,
      text: commentText,
      date: 'Hoy (ahora mismo)'
    };

    const updatedComments = [newCommentObj, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`news_comments_${selectedArticle.id}`, JSON.stringify(updatedComments));
    setCommentText('');
    toast.success('Comentario enviado con éxito.');

    // Trigger n8n notification for comments
    try {
      const adminPhone = '+240 222-3333';
      await triggerN8nNotification(
        'news_comment',
        adminPhone,
        'Administrador MMH',
        {
          news_id: selectedArticle.id,
          news_title: getLocalizedValue(selectedArticle.title),
          commenter_name: commenterName,
          commenter_role: commenterRole,
          rating,
          comment_text: commentText
        }
      );
    } catch (err) {
      console.error('Error triggering n8n for comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const formatPublishDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const handleReportComment = async (comment: any) => {
    const reason = window.prompt("Por favor, indique la razón de la denuncia por abuso:");
    if (reason === null) return; // User cancelled
    if (!reason.trim()) {
      toast.error("Debe especificar una razón para enviar la denuncia.");
      return;
    }
    
    try {
      await createDenuncia({
        commentId: comment.id,
        commentText: comment.text,
        commentAuthorName: comment.userName,
        commentAuthorRole: comment.userRole,
        reportedBy: user?.name || 'Usuario Anónimo',
        reason: reason.trim(),
        newsTitle: selectedArticle ? getLocalizedValue(selectedArticle.title) : 'Noticia',
        newsId: selectedArticle?.id
      });
      toast.success("Denuncia enviada correctamente. El equipo técnico auditará este comentario.");
    } catch (err) {
      console.error("Error creating report:", err);
      toast.error("Error al enviar la denuncia.");
    }
  };

  if (selectedArticle) {
    // Article detail view
    const title = getLocalizedValue(selectedArticle.title);
    const summary = getLocalizedValue(selectedArticle.summary);
    const content = getLocalizedValue(selectedArticle.content);
    const image = selectedArticle.featuredImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop';
    
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto w-full transition-all">
        {/* Navigation / Header */}
        <button 
          onClick={handleBackToList}
          className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-xs uppercase tracking-wider mb-6 group transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Volver a las Noticias</span>
        </button>

        {/* Article Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          {/* Hero Image */}
          <div className="relative h-64 md:h-96 w-full">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              {selectedArticle.category && (
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest inline-block mb-3">
                  {selectedArticle.category}
                </span>
              )}
              <h1 className="text-xl md:text-3xl font-black tracking-tight font-sans">
                {title}
              </h1>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
              <div className="flex items-center space-x-1.5">
                <Calendar size={14} className="text-blue-500" />
                <span>{formatPublishDate(selectedArticle.publish_date)}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <UserIcon size={14} className="text-blue-500" />
                <span>{selectedArticle.author || 'Prensa MMH'}</span>
              </div>
              {selectedArticle.attachments && selectedArticle.attachments.length > 0 && (
                <div className="flex items-center space-x-1 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-md font-bold text-[10px] uppercase">
                  <FileText size={12} />
                  <span>{selectedArticle.attachments.length} Adjuntos</span>
                </div>
              )}
            </div>

            {/* Summary Box */}
            {summary && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-l-4 border-blue-600 rounded-r-xl text-slate-600 dark:text-slate-300 italic text-sm leading-relaxed mb-6">
                {summary}
              </div>
            )}

            {/* Main Rich Content */}
            <div 
              className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-10"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            {/* Attachments Section */}
            {selectedArticle.attachments && selectedArticle.attachments.length > 0 && (
              <div className="bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-10">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-blue-600" />
                  Descargar Documentos de la Gaceta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedArticle.attachments.map((att: any) => (
                    <div 
                      key={att.id} 
                      className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between shadow-sm hover:border-blue-500 transition-all"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="p-2 bg-red-50 dark:bg-red-950/30 text-red-600 rounded-lg shrink-0">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{att.name}</p>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase">{att.size} • {att.format}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toast.success(`Descargando ${att.name}`)}
                        className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Area */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
              <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight mb-6 flex items-center gap-2">
                <MessageSquare size={18} className="text-blue-600" />
                Comentarios y Valoraciones del Sector ({comments.length})
              </h3>

              {/* Comment Input */}
              <form onSubmit={handleSubmitComment} className="mb-8 p-4 md:p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="mb-4">
                  <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Su Valoración</label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="text-amber-400 focus:outline-none transition-transform active:scale-125"
                      >
                        <Star 
                          size={20} 
                          fill={star <= (hoveredRating || rating) ? 'currentColor' : 'none'} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Comentario Técnico</label>
                  <textarea
                    rows={4}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Escriba un comentario o aporte sobre esta publicación oficial..."
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 active:scale-95"
                >
                  {submittingComment ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <Send size={14} />
                  )}
                  <span>Publicar Comentario</span>
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-slate-400 dark:text-slate-500 text-xs italic text-center py-6">No hay comentarios en esta publicación aún.</p>
                ) : (
                  comments.map((comment) => (
                    <div 
                      key={comment.id}
                      className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-xs"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs font-black text-slate-900 dark:text-white">{comment.userName}</p>
                          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">
                            {t(`roles.${comment.userRole}`)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-semibold">{comment.date}</span>
                          <button 
                            onClick={() => handleReportComment(comment)}
                            className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-all"
                            title="Denunciar Abuso"
                          >
                            <Flag size={10} className="fill-current" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-0.5 text-amber-400 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            fill={i < comment.rating ? 'currentColor' : 'none'} 
                          />
                        ))}
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {comment.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Portal News List View
  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
      {/* Title block */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <Newspaper className="text-blue-600" size={24} />
            Noticias y Comunicados del Portal
          </h1>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Gacetas oficiales, regulaciones, inversiones y operaciones en el sector de hidrocarburos de Guinea Ecuatorial.
          </p>
        </div>
      </div>

      {/* Filters & Search Block */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 mb-8 flex flex-col gap-4 shadow-sm">
        {/* Search */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar noticias por título, contenido o palabras clave..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Categories Carousel / Tabs */}
        <div className="flex flex-wrap gap-2 items-center overflow-x-auto no-scrollbar py-1">
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mr-2 flex items-center gap-1">
            <Filter size={12} /> Filtrar por:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Articles */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Cargando boletines oficiales...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center min-h-[300px] shadow-sm">
          <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-700 mb-4 animate-bounce">search_off</span>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">Sin Resultados</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
            No pudimos encontrar comunicados que coincidan con su búsqueda o categoría seleccionada.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => {
            const title = getLocalizedValue(art.title);
            const summary = getLocalizedValue(art.summary);
            const image = art.featuredImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop';
            
            return (
              <div 
                key={art.id}
                onClick={() => handleSelectArticle(art)}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-3xl overflow-hidden hover:shadow-lg hover:border-blue-500/30 cursor-pointer flex flex-col transition-all h-full"
              >
                {/* Image header */}
                <div className="relative h-48 w-full overflow-hidden shrink-0">
                  <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                  {art.category && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur text-slate-900 dark:text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                      {art.category}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                      <Calendar size={12} className="text-blue-500" />
                      <span>{formatPublishDate(art.publish_date)}</span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-2 leading-snug mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium mb-4">
                      {summary}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Por {art.author || 'Prensa MMH'}
                    </span>
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Leer Más <BookOpen size={12} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PortalNewsViewer;
