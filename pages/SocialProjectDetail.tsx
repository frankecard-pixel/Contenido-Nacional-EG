
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getSocialProjectById } from '../services/supabaseApi';
import { SocialProject } from '../types';
import SocialProjectDetailHeader from '../components/public/social-project-detail/SocialProjectDetailHeader';
import SocialProjectDetailContent from '../components/public/social-project-detail/SocialProjectDetailContent';
import InteractiveMap from '../components/InteractiveMap';

const SocialProjectDetail: React.FC = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [project, setProject] = useState<SocialProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const data = await getSocialProjectById(id);
        setProject(data as any);
      } catch (error) {
        console.error("Error fetching social project:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) return <div className="p-20 text-center">Proyecto no encontrado.</div>;

  const getTranslatedText = (obj: any) => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[i18n.language as any] || obj.es || '';
  };

  return (
    <div className="max-w-[var(--layout-max-width)] mx-auto px-6 py-32">
      <Link to="/community" className="text-blue-600 font-bold text-sm mb-8 inline-flex items-center">
        ← Volver a Impacto Social
      </Link>
      
      <div className="bg-white rounded-[4rem] overflow-hidden shadow-2xl border border-slate-100">
        <SocialProjectDetailHeader 
          image={project.image} 
          title={getTranslatedText(project.title)} 
        />
        <SocialProjectDetailContent 
          description={getTranslatedText(project.description)}
          location={project.location}
          impact={project.impact}
        />
      </div>

      {project.lat && project.lng && (
        <div className="mt-12 bg-white dark:bg-slate-900 rounded-[4rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Ubicación del Proyecto Social</h3>
              <p className="text-xs text-slate-500 mt-1">{project.location}</p>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OpenStreetMap</span>
          </div>
          <InteractiveMap 
            points={[{
              id: project.id,
              lat: Number(project.lat),
              lng: Number(project.lng),
              title: getTranslatedText(project.title),
              type: 'project'
            }]} 
            center={[Number(project.lat), Number(project.lng)]} 
            zoom={10} 
            height="380px" 
          />
        </div>
      )}
    </div>
  );
};

export default SocialProjectDetail;
