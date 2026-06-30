import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompanyById } from '../services/supabaseApi';
import { Company } from '../types';
import { useAuth } from '../contexts/AuthContext';
import InteractiveMap from '../components/InteractiveMap';

const CompanyProfileView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviews, setReviews] = useState([
    { id: '1', user: 'Juan Pérez', rating: 5, text: 'Excelente servicio y profesionalismo.', date: '2024-03-15' },
    { id: '2', user: 'María García', rating: 4, text: 'Muy buena experiencia trabajando con ellos.', date: '2024-02-28' }
  ]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCompany = async () => {
      if (!id) return;
      try {
        const data = await getCompanyById(id);
        setCompany(data as any);
      } catch (error) {
        console.error("Error fetching company:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, [id, user, navigate]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    const newReview = {
      id: Math.random().toString(),
      user: user?.user_metadata?.full_name || 'Usuario',
      rating,
      text: comment,
      date: new Date().toISOString().split('T')[0]
    };
    
    setReviews([newReview, ...reviews]);
    setRating(0);
    setComment('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!company) {
    return <div className="p-20 text-center">Empresa no encontrada.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6 space-y-12 w-full">
        
        {/* Header */}
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-5xl font-black text-blue-700 dark:text-blue-500 border border-slate-100 dark:border-slate-700 shrink-0">
              {company.name?.charAt(0) || '?'}
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{company.name}</h1>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  company.certificationLevel === 'elite' ? 'bg-indigo-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {company.certificationLevel}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">NIF: {company.taxId}</p>
              <div className="flex flex-wrap gap-2">
                {company.sector.map(s => (
                  <span key={s} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[9px] font-bold uppercase">{s}</span>
                ))}
              </div>
            </div>
            <div className="text-center bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl min-w-[150px]">
              <div className="text-4xl font-black text-slate-900 dark:text-white mb-2">{company.rating}</div>
              <div className="flex justify-center space-x-1 mb-2">
                {[1,2,3,4,5].map(star => (
                  <span key={star} className={`text-sm ${star <= Math.round(company.rating) ? 'text-orange-400' : 'text-slate-200 dark:text-slate-700'}`}>★</span>
                ))}
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{reviews.length} Reseñas</div>
            </div>
          </div>

          {/* Location Map Section */}
          {company.lat && company.lng && (
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Ubicación de la Sede</h2>
                  <p className="text-xs text-slate-500 mt-1">{company.address || 'Sede oficial registrada en Guinea Ecuatorial'}</p>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OpenStreetMap</span>
              </div>
              <InteractiveMap 
                points={[{
                  id: company.id,
                  lat: Number(company.lat),
                  lng: Number(company.lng),
                  title: company.name,
                  type: 'company'
                }]} 
                center={[Number(company.lat), Number(company.lng)]} 
                zoom={11} 
                height="350px" 
              />
            </div>
          )}

          {/* Reviews Section */}
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 shadow-xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-8">Calificaciones y Comentarios</h2>
            
            {/* Add Review Form */}
            <form onSubmit={handleSubmitReview} className="mb-12 bg-slate-50 dark:bg-slate-800/50 p-8 rounded-3xl border border-slate-100 dark:border-slate-700">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest mb-4">Dejar una reseña</h3>
              <div className="flex items-center space-x-2 mb-6">
                {[1,2,3,4,5].map(star => (
                  <button 
                    key={star} 
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl transition-colors ${star <= rating ? 'text-orange-400' : 'text-slate-200 dark:text-slate-600 hover:text-orange-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comparta su experiencia trabajando con esta empresa..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all resize-none mb-4"
                rows={4}
                required
              />
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={rating === 0}
                  className="px-8 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Publicar Reseña
                </button>
              </div>
            </form>

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.map(review => (
                <div key={review.id} className="border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-black text-slate-600 dark:text-slate-300">
                        {review.user?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white">{review.user}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{review.date}</div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {[1,2,3,4,5].map(star => (
                        <span key={star} className={`text-xs ${star <= review.rating ? 'text-orange-400' : 'text-slate-200 dark:text-slate-700'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">{review.text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
    </div>
  );
};

export default CompanyProfileView;
