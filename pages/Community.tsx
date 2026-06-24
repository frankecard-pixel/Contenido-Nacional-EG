
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSocialProjects } from '../services/supabaseApi';
import { SocialProject } from '../types';
import CommunityStats from '../components/public/community/CommunityStats';
import CommunityMap from '../components/public/community/CommunityMap';
import CommunityProjects from '../components/public/community/CommunityProjects';
import CommunityTransparency from '../components/public/community/CommunityTransparency';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';

const Community: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [socialProjects, setSocialProjects] = useState<SocialProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsData = await getSocialProjects();
        setSocialProjects(projectsData as any);
      } catch (error) {
        console.error("Error fetching social projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getTranslatedText = (obj: any) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[i18n.language as any] || obj.es || '';
  };

  const totalInvestment = socialProjects.reduce((acc, curr) => acc + curr.budget, 0);
  const activeProjects = socialProjects.filter(p => p.status === 'active').length;

  const mapPoints = socialProjects.map(p => ({
    id: p.id,
    lat: p.lat || 0,
    lng: p.lng || 0,
    title: getTranslatedText(p.title),
    type: 'project' as const
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      <PublicBanner 
        title="Impacto Comunitario" 
        subtitle="Proyectos de desarrollo social y sostenibilidad financiados por la industria de hidrocarburos."
        category="Responsabilidad Social"
        image="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop"
      />
      <div className="mx-auto px-6 relative z-50 -mt-16 mb-12" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <MinisterialCertification />
      </div>
      <div className="mx-auto px-6 mt-20 animate-in fade-in duration-700" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <CommunityStats totalInvestment={totalInvestment} activeProjects={activeProjects} />
        <CommunityMap mapPoints={mapPoints} />
        <CommunityProjects projects={socialProjects} getTranslatedText={getTranslatedText} />
        <CommunityTransparency />
      </div>
    </div>
  );
};

export default Community;
