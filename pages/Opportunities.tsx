
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getOpportunities } from '../services/supabaseApi';
import { OpportunityExt } from '../types';
import OpportunitiesDashboardView from '../components/dashboard/opportunities/OpportunitiesDashboardView';
import OpportunitiesPublicView from '../components/public/opportunities/OpportunitiesPublicView';
import RequireAuthModal from '../components/public/RequireAuthModal';

interface OpportunitiesProps {
  isDashboard?: boolean;
}

const Opportunities: React.FC<OpportunitiesProps> = ({ isDashboard = false }) => {
  const { t, i18n } = useTranslation();
  const [opportunities, setOpportunities] = useState<OpportunityExt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const data = await getOpportunities();
        setOpportunities(data as any);
        if (data && data.length > 0) {
          setSelectedOppId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching opportunities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  const selectedOpp = useMemo(() => 
    opportunities.find(o => o.id === selectedOppId) || opportunities[0]
  , [selectedOppId, opportunities]);

  const getTranslatedText = (obj: any) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[i18n.language as any] || obj.es || '';
  };

  const filteredOpps = useMemo(() => {
    return opportunities.filter(opp => {
      const matchesSearch = getTranslatedText(opp.title).toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || opp.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, opportunities]);

  const categories = ['all', 'Mantenimiento', 'Logística', 'Ingeniería', 'Catering', 'Seguridad', 'Suministros', 'Consultoría', 'Tecnología'];

  const getOperatorLogo = (id: string) => {
    const logos: Record<string, string> = {
      'u-4': 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9ZE7o0OcQvO43bnOfYgxVGKapLOFUasxlP4_LZJaOsqe8ne9uW8tim5gjYvPGG1dIomlvQt3Posin2MS8iR3HqGmmXX3Wq7wIsXnDSWWJ60Aq2yxaPdmq4tFZprfJlZEkrFgiPIIbAcXnVUsonwoOZURrhhlGp2NysA1n3NP1cUDtITnFr_Y8UW9_HRqIu6xLoKg1iOFkEIUiWtZ7a6nThttc3zX7Ac1Aau7O9Y9iApWJ8b2gsVs--ADj1cMVeI4Xk1dxJl4iCA',
      'default': 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGeb0bap-FhAqo4oAwNT5iR82CoK1xvhe8rnISsg6bqis3s6zmnGUlb-jUkvho1375L-IXObugvI2CJXhNE0vjODmdpjHENwWvKYtS2QAVFZ--YUYjCTw6qbnGEKm-cOn3VIsqYTglCxcOv5GBQHhv3WHJWHa8PcKU4CWm1k0qbcwdsjiq_P3w8-FgEgVpFcM1Bf95S8bwumAOlyvjghjSN6rGWnXWPEmtL9krp-OoQd1TrER1781MtEl2UQBfgwiYSXvTICC43g'
    };
    return logos[id] || logos.default;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isDashboard) {
    return (
      <OpportunitiesDashboardView 
        filteredOpps={filteredOpps}
        selectedOpp={selectedOpp}
        selectedOppId={selectedOppId}
        setSelectedOppId={setSelectedOppId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        showSavedOnly={showSavedOnly}
        setShowSavedOnly={setShowSavedOnly}
        categories={categories}
        getOperatorLogo={getOperatorLogo}
        getTranslatedText={getTranslatedText}
      />
    );
  }

  return (
    <>
      <OpportunitiesPublicView 
        filteredOpps={filteredOpps}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setActiveCategory={setActiveCategory}
        getTranslatedText={getTranslatedText}
        onRequireAuth={() => setShowAuthModal(true)}
      />
      <RequireAuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
};

export default Opportunities;
