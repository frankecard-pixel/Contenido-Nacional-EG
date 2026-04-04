
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getOpportunityById } from '../services/supabaseApi';
import { OpportunityExt } from '../types';
import OpportunityDetailContent from '../components/public/opportunity-detail/OpportunityDetailContent';
import OpportunityDetailRestricted from '../components/public/opportunity-detail/OpportunityDetailRestricted';

const OpportunityDetail: React.FC = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [opp, setOpp] = useState<OpportunityExt | null>(null);
  const [loading, setLoading] = useState(true);
  
  const isLoggedIn = !!localStorage.getItem('user_session'); 

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!id) return;
      try {
        const data = await getOpportunityById(id);
        setOpp(data as any);
      } catch (error) {
        console.error("Error fetching opportunity:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunity();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!opp) return <div className="p-20 text-center font-black">Licitación no encontrada.</div>;

  const getTranslatedText = (obj: any) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[i18n.language as any] || obj.es || '';
  };

  return (
    <div className="mx-auto px-6 py-32 animate-in fade-in duration-700" style={{ maxWidth: 'var(--layout-max-width)' }}>
      <Link to="/opportunities" className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-12 inline-flex items-center hover:translate-x-[-4px] transition-transform">
        ← Volver a Licitaciones
      </Link>
      
      <div className="bg-slate-50 rounded-[3rem] p-3 border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-white rounded-[2.5rem] p-12 md:p-20 shadow-sm">
          <header className="mb-12 border-b border-slate-50 pb-12">
            <div className="flex items-center space-x-3 mb-6">
              <span className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em]">
                {opp.category.toUpperCase()}
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tighter">
              {getTranslatedText(opp.title)}
            </h1>
            <p className="text-lg text-slate-400 font-black uppercase tracking-widest leading-none">
              {opp.location}
            </p>
          </header>

          {isLoggedIn ? (
            <OpportunityDetailContent opp={opp} getTranslatedText={getTranslatedText} />
          ) : (
            <OpportunityDetailRestricted />
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;
