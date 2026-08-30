
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InteractiveMap from '../components/InteractiveMap';
import { getCompanies } from '../services/supabaseApi';
import { Company } from '../types';
import DirectoryFilters from '../components/public/directory/DirectoryFilters';
import DirectoryGrid from '../components/public/directory/DirectoryGrid';
import RequireAuthModal from '../components/public/RequireAuthModal';
import { useAuth } from '../contexts/AuthContext';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';

const Directory: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState<'grid' | 'map'>(searchParams.get('view') === 'map' ? 'map' : 'grid');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Sync view state with URL search param
  useEffect(() => {
    const vParam = searchParams.get('view');
    if (vParam === 'map' || vParam === 'grid') {
      setView(vParam);
    }
  }, [searchParams]);

  const handleSetView = (newView: 'grid' | 'map') => {
    setView(newView);
    setSearchParams(prev => {
      prev.set('view', newView);
      return prev;
    });
  };

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanies();
        setCompanies(data as any);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const sectors = ['all', 'Gas & Energía', 'Ingeniería', 'Logística', 'Mantenimiento', 'Catering', 'Seguridad', 'Construcción'];

  const filtered = filter === 'all' 
    ? companies 
    : companies.filter(c => c.sector?.includes(filter));

  const mapPoints = filtered.map(c => ({
    id: c.id,
    lat: c.lat || 0,
    lng: c.lng || 0,
    title: c.name,
    type: 'company' as const
  }));

  const handleViewProfile = (companyId: string) => {
    if (user) {
      // Navigate to the company profile page (we need to create this route)
      navigate(`/company-profile/${companyId}`);
    } else {
      setShowAuthModal(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <div className="pb-24 bg-slate-50 min-h-screen">
        <PublicBanner 
          title="Directorio de Empresas" 
          subtitle="Consulte el registro oficial de empresas certificadas en el sector de hidrocarburos y minería."
          category="Certificación"
          image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
        />
        <div className="mx-auto px-6 relative z-50 -mt-16 mb-12" style={{ maxWidth: 'var(--layout-max-width)' }}>
          <MinisterialCertification />
        </div>
        <div className="mx-auto px-6 mt-20" style={{ maxWidth: 'var(--layout-max-width)' }}>
          <DirectoryFilters 
            sectors={sectors} 
            filter={filter} 
            setFilter={setFilter} 
            view={view}
            setView={handleSetView}
          />

          {view === 'map' ? (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <InteractiveMap points={mapPoints} height="700px" />
            </div>
          ) : filtered.length > 0 ? (
            <DirectoryGrid filtered={filtered} onViewProfile={handleViewProfile} />
          ) : (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
              <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">business_center</span>
              <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest">No se encontraron empresas</h3>
              <p className="text-slate-400 font-medium mt-2 uppercase text-[10px] tracking-widest">Intente con otro sector o criterio de búsqueda</p>
            </div>
          )}
        </div>
      </div>
      <RequireAuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Directory;
