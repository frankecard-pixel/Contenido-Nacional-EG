import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_NEWS, MOCK_NEWS_ARTICLES } from '../services/mockService';
import { getNewsArticleById, createDenuncia } from '../services/supabaseApi';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';
import { Calendar, User, ArrowLeft, Share2, Download, Loader2, Star, MessageSquare, Send, Lock, Check, Flag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { triggerN8nNotification } from '../services/n8nService';
import { supabase } from '../services/supabaseClient';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [newsItem, setNewsItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // States for comments and ratings
  const { user: authUser } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    // Determine login status and user profile
    if (authUser) {
      setIsLoggedIn(true);
      const fetchProfile = async () => {
        try {
          if (supabase) {
            const { data } = await supabase.from('users').select('name, email, role').eq('id', authUser.id).single();
            if (data) {
              setCurrentUser({ id: authUser.id, name: data.name || authUser.email, email: authUser.email, role: data.role });
              return;
            }
          }
          setCurrentUser({ id: authUser.id, name: authUser.user_metadata?.full_name || authUser.email, email: authUser.email, role: 'funcionario' });
        } catch {
          setCurrentUser({ id: authUser.id, name: authUser.email, email: authUser.email, role: 'funcionario' });
        }
      };
      fetchProfile();
    } else {
      const sessionActive = localStorage.getItem('user_session') === 'active';
      const userId = localStorage.getItem('user_id');
      const userRole = localStorage.getItem('user_role');
      if (sessionActive && userId) {
        setIsLoggedIn(true);
        import('../services/mockService').then(({ MOCK_USERS }) => {
          const found = MOCK_USERS.find(u => u.id === userId);
          if (found) {
            setCurrentUser({ id: found.id, name: found.name, email: found.email, role: found.role });
          } else {
            setCurrentUser({ id: userId, name: 'Usuario Registrado', email: '', role: userRole || 'persona' });
          }
        });
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    }
  }, [authUser]);

  useEffect(() => {
    if (!id) return;
    // Load comments from localStorage
    const stored = localStorage.getItem(`news_comments_${id}`);
    if (stored) {
      setComments(JSON.parse(stored));
    } else {
      // Create some default comments for a rich visual layout
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
      localStorage.setItem(`news_comments_${id}`, JSON.stringify(defaultComments));
    }
  }, [id]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !id) return;
    setSubmittingComment(true);

    const commenterName = currentUser?.name || 'Usuario del Portal';
    const commenterRole = currentUser?.role || 'persona';

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
    localStorage.setItem(`news_comments_${id}`, JSON.stringify(updatedComments));
    setCommentText('');

    // Trigger n8n notification for comments
    try {
      const adminPhone = '+240 222-3333';
      await triggerN8nNotification(
        'news_comment',
        adminPhone,
        'Administrador MMH',
        {
          news_id: id,
          news_title: typeof newsItem.title === 'string' ? newsItem.title : (newsItem.title?.es || 'Noticia'),
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

  const handleReportComment = async (comment: any) => {
    const reason = window.prompt("Por favor, indique la razón de la denuncia por abuso:");
    if (reason === null) return; // User cancelled
    if (!reason.trim()) {
      alert("Debe especificar una razón para enviar la denuncia.");
      return;
    }
    
    try {
      await createDenuncia({
        commentId: comment.id,
        commentText: comment.text,
        commentAuthorName: comment.userName,
        commentAuthorRole: comment.userRole || 'persona',
        reportedBy: currentUser?.name || 'Usuario Anónimo',
        reason: reason.trim(),
        newsTitle: newsItem ? (newsItem.title?.es || newsItem.title) : 'Noticia',
        newsId: id
      });
      alert("Denuncia enviada correctamente. El equipo técnico auditará este comentario.");
    } catch (err) {
      console.error("Error creating report:", err);
      alert("Error al enviar la denuncia.");
    }
  };

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

        {/* Comments & Ratings Section */}
        <div className="mt-20 border-t border-slate-100 dark:border-slate-800 pt-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                <MessageSquare className="size-6 text-blue-600" />
                Valoraciones y Comentarios
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                Opiniones institucionales de usuarios registrados
              </p>
            </div>

            {/* Average Rating Display */}
            {comments.length > 0 && (
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-100 dark:border-slate-800 shrink-0">
                <div className="text-center border-r border-slate-200 dark:border-slate-800 pr-4 mr-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {(comments.reduce((acc, c) => acc + c.rating, 0) / comments.length).toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400 font-bold block">de 5</span>
                </div>
                <div>
                  <div className="flex items-center text-amber-400 mb-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`size-4 fill-current ${
                          i < Math.round(comments.reduce((acc, c) => acc + c.rating, 0) / comments.length)
                            ? 'text-amber-400' 
                            : 'text-slate-200 dark:text-slate-800'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {comments.length} {comments.length === 1 ? 'comentario' : 'comentarios'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Comment submission form */}
          {isLoggedIn ? (
            <form onSubmit={handleSubmitComment} className="bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 border border-slate-100 dark:border-slate-800/60 mb-12 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs uppercase">
                    {currentUser?.name?.substring(0, 2) || 'US'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{currentUser?.name}</h4>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 font-black uppercase tracking-widest">
                      {t(`roles.${currentUser?.role || 'persona'}`)}
                    </span>
                  </div>
                </div>

                {/* Rating Stars Selector */}
                <div className="flex items-center gap-1.5 bg-white dark:bg-slate-850 px-4 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Su valoración:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((starValue) => (
                      <button
                        type="button"
                        key={starValue}
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoveredRating(starValue)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-0.5 hover:scale-125 transition-transform"
                        title={`${starValue} de 5 estrellas`}
                      >
                        <Star 
                          className={`size-5 transition-colors ${
                            starValue <= (hoveredRating || rating)
                              ? 'text-amber-400 fill-amber-400' 
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
                  Escriba su comentario institucional o aportación
                </label>
                <textarea
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={4}
                  placeholder="Escriba su opinión técnica, aportación, consulta o comentario sobre esta publicación..."
                  className="w-full px-5 py-4 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary focus:border-transparent transition-all dark:text-white"
                />
              </div>

              <div className="flex justify-between items-center">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wide">
                  * Su comentario será firmado con su cargo y cuenta institucional verifcada.
                </p>
                <button
                  type="submit"
                  disabled={submittingComment || !commentText.trim()}
                  className="px-6 py-3.5 bg-primary hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-500/10 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {submittingComment ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="size-3.5" />
                      Publicar Comentario
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[2.5rem] p-8 md:p-12 text-center mb-12">
              <div className="size-16 rounded-full bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-6">
                <Lock className="size-6 animate-pulse" />
              </div>
              <h4 className="text-lg font-black text-slate-950 dark:text-white uppercase tracking-tight mb-2">
                Sección Restringida a Usuarios Registrados
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto mb-8">
                Para garantizar debates técnicos de alta calidad y la autenticidad de las opiniones sectoriales, debe iniciar sesión con sus credenciales autorizadas del Ministerio o de Empresa Certificada.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-950 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl"
              >
                Identificarse en el Portal
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>
          )}

          {/* List of comments */}
          <div className="space-y-6">
            {comments.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-12 font-medium">
                No hay comentarios en esta noticia aún. ¡Sea el primero en valorar!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="p-6 md:p-8 bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-100 dark:border-slate-800/60 flex items-start gap-4 md:gap-6 animate-in fade-in duration-300">
                  <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-black uppercase tracking-tighter text-sm shrink-0">
                    {comment.userName.substring(0, 2)}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">{comment.userName}</h4>
                          <span className="text-[8px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest">
                            {t(`roles.${comment.userRole || 'persona'}`)}
                          </span>
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

                      {/* Display Rating Stars */}
                      <div className="flex text-amber-400 shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`size-3.5 fill-current ${
                              i < comment.rating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-800'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
