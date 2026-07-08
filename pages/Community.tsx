
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getSocialProjects } from '../services/supabaseApi';
import { SocialProject } from '../types';
import CommunityStats from '../components/public/community/CommunityStats';
import CommunityMap from '../components/public/community/CommunityMap';
import CommunityProjects from '../components/public/community/CommunityProjects';
import CommunityTransparency from '../components/public/community/CommunityTransparency';
import PanoramicTourViewer from '../components/public/community/PanoramicTourViewer';
import CommunityAnalytics from '../components/public/community/CommunityAnalytics';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';
import { 
  Building2, MapPin, Award, Compass, BarChart3, ListCollapse, 
  Terminal, Calendar, User, Eye, ArrowRight, Share2, HelpCircle, Heart, Copy, Check 
} from 'lucide-react';
import { toast } from 'sonner';

interface MinisterialAct {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  imageUrl: string;
  impactArea: string;
}

const MOCK_MINISTERIAL_ACTS: MinisterialAct[] = [
  {
    id: 'act-1',
    title: 'Inauguración Oficial del Proyecto Solar en Annobón',
    description: 'El Ministro de Hidrocarburos junto a autoridades locales inauguró la nueva planta fotovoltaica que proveerá energía libre de emisiones a escuelas y centros de salud de la isla las 24 horas del día.',
    location: 'San Antonio de Palea, Annobón',
    date: '15 Jun 2026',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop',
    impactArea: 'Educación y Salud'
  },
  {
    id: 'act-2',
    title: 'Firma de Acuerdo de Responsabilidad Social Corporativa con Operadores',
    description: 'Firma del decreto marco anual que regula los fondos de inversión social obligatorios (FSO) con las principales petroleras del país, reorientando el 35% de los fondos a proyectos de agua potable rural.',
    location: 'Sipopo, Malabo',
    date: '28 May 2026',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
    impactArea: 'Gobernanza y Transparencia'
  },
  {
    id: 'act-3',
    title: 'Entrega de Becas de Capacitación Técnica en Bata',
    description: 'Acto de entrega de 150 becas financiadas por el sector petrolero para jóvenes de comunidades locales para cursar estudios técnicos en el Instituto de Hidrocarburos de Bata.',
    location: 'Bata, Litoral',
    date: '10 Abr 2026',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop',
    impactArea: 'Capacitación Nacional'
  }
];

const Community: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [socialProjects, setSocialProjects] = useState<SocialProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'works' | 'tour' | 'charts' | 'acts' | 'sql'>('works');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsData = await getSocialProjects();
        
        // Ensure some robust mock data fallbacks in case of empty DB
        const finalData = projectsData && projectsData.length > 0 ? projectsData : [
          {
            id: '1',
            title: { es: 'Electrificación Escolar Annobón', en: 'Annobon School Electrification', fr: 'Électrification de l\'école d\'Annobón' },
            description: { es: 'Instalación de paneles solares fotovoltaicos con banco de baterías de litio de última generación para abastecer de energía limpia continua a 5 centros educativos.', en: 'Installation of high-efficiency solar panels and batteries.', fr: '' },
            impact: '500 Estudiantes',
            location: 'San Antonio de Palea, Annobón',
            image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop',
            petroleraId: 'u-4',
            status: 'active',
            budget: 450000,
            progress: 65,
            endDate: '2025-04-15',
            investor: 'Noble Energy',
            lat: -1.43,
            lng: 5.63,
            category: 'Educación',
            beneficiaries: 1500
          },
          {
            id: '2',
            title: { es: 'Centro de Salud Comunitario Cogo', en: 'Cogo Community Health Center', fr: 'Centre de santé communautaire de Cogo' },
            description: { es: 'Ampliación y equipamiento técnico del centro médico rural para la atención de urgencias y ginecología de la comunidad.', en: 'Expansion of local medical center.', fr: '' },
            impact: '3,000 Habitantes',
            location: 'Cogo, Litoral',
            image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
            petroleraId: 'u-4',
            status: 'completed',
            budget: 620000,
            progress: 100,
            endDate: '2024-11-20',
            investor: 'Marathon Oil',
            lat: 1.08,
            lng: 9.69,
            category: 'Salud',
            beneficiaries: 3000
          },
          {
            id: '3',
            title: { es: 'Red Potabilizadora Rebola', en: 'Rebola Water Purification Network', fr: 'Réseau d\'eau potable de Rebola' },
            description: { es: 'Construcción de estación potabilizadora por filtración de gravedad y extensión de red de suministro a todo el municipio.', en: 'Water filtration system construction.', fr: '' },
            impact: '3,500 Habitantes',
            location: 'Rebola, Bioko Norte',
            image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=2070&auto=format&fit=crop',
            petroleraId: 'u-4',
            status: 'active',
            budget: 380000,
            progress: 85,
            endDate: '2025-02-10',
            investor: 'Chevron',
            lat: 3.73,
            lng: 8.84,
            category: 'Infraestructura',
            beneficiaries: 3500
          }
        ];

        setSocialProjects(finalData as any);
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

  const totalInvestment = socialProjects.reduce((acc, curr) => acc + (curr.budget || 0), 0);
  const activeProjectsCount = socialProjects.filter(p => p.status === 'active' || p.status === 'in-progress').length;

  const mapPoints = socialProjects.map(p => ({
    id: p.id,
    lat: p.lat || 0,
    lng: p.lng || 0,
    title: getTranslatedText(p.title),
    type: 'project' as const
  }));

  const copySqlToClipboard = () => {
    const sqlText = `-- ========================================================
-- TABLA DE OBRAS SOCIALES (social_projects)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.social_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title JSONB NOT NULL,               -- {"es": "...", "en": "..."}
    description JSONB NOT NULL,         -- {"es": "...", "en": "..."}
    impact TEXT,
    location TEXT,
    image TEXT,
    petrolera_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'proposed',     -- 'proposed', 'active', 'completed', 'delayed'
    budget NUMERIC DEFAULT 0,
    progress INTEGER DEFAULT 0,
    end_date DATE,
    investor TEXT,
    lat NUMERIC,
    lng NUMERIC,
    category TEXT DEFAULT 'Educación',  -- 'Educación', 'Salud', 'Infraestructura', etc.
    beneficiaries INTEGER DEFAULT 0,
    tour_360_url TEXT,                  -- URL de photosphere
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================================
-- TABLA DE ACTOS SOCIALES DEL MINISTERIO (ministerial_social_acts)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.ministerial_social_acts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    act_date DATE DEFAULT CURRENT_DATE,
    location TEXT,
    author TEXT DEFAULT 'Prensa MMH',
    impact_area TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================================
-- POLÍTICAS DE ACCESO RLS (Row Level Security)
-- ========================================================
ALTER TABLE public.social_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministerial_social_acts ENABLE ROW LEVEL SECURITY;

-- Cualquiera puede leer la información pública de transparencia
CREATE POLICY "View social projects" ON public.social_projects 
    FOR SELECT USING (true);

CREATE POLICY "View public ministerial acts" ON public.ministerial_social_acts 
    FOR SELECT USING (true);

-- Sólo usuarios autenticados con rol administrativo pueden escribir o modificar
CREATE POLICY "Manage social projects" ON public.social_projects 
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Manage ministerial acts" ON public.ministerial_social_acts 
    FOR ALL USING (auth.role() = 'authenticated');
`;

    navigator.clipboard.writeText(sqlText);
    setCopied(true);
    toast.success('Esquema SQL copiado al portapapeles.');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24 font-sans">
      <PublicBanner 
        title="Transparencia e Impacto Social" 
        subtitle="Rendición de cuentas oficial, ficha técnica de obras comunitarias e inspección interactiva 360°."
        category="Transparencia Institucional"
        image="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop"
      />

      {/* Ministerial Certification float banner */}
      <div className="mx-auto px-6 relative z-40 -mt-16 mb-12" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <MinisterialCertification />
      </div>

      <div className="mx-auto px-6 mt-16 max-w-7xl">
        
        {/* Navigation Tabs Center */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-slate-200 dark:border-slate-800 pb-6">
          <button
            onClick={() => setActiveTab('works')}
            className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'works'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <ListCollapse size={16} />
            <span>Obras y Avances</span>
          </button>
          
          <button
            onClick={() => setActiveTab('tour')}
            className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'tour'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Compass size={16} />
            <span>Tour Virtual 360°</span>
          </button>

          <button
            onClick={() => setActiveTab('charts')}
            className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'charts'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <BarChart3 size={16} />
            <span>Gráficos y Métricas</span>
          </button>

          <button
            onClick={() => setActiveTab('acts')}
            className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'acts'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Heart size={16} />
            <span>Actos Sociales del MMH</span>
          </button>

          <button
            onClick={() => setActiveTab('sql')}
            className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'sql'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <Terminal size={16} />
            <span>Código Supabase (SQL)</span>
          </button>
        </div>

        {/* TAB 1: WORKS AND INTERACTIVE MAP */}
        {activeTab === 'works' && (
          <div className="space-y-16 animate-in fade-in duration-500">
            <CommunityStats totalInvestment={totalInvestment} activeProjects={activeProjectsCount} />
            <CommunityMap mapPoints={mapPoints} />
            <CommunityProjects projects={socialProjects} getTranslatedText={getTranslatedText} />
            <CommunityTransparency />
          </div>
        )}

        {/* TAB 2: IMMERSIVE 360 TOUR */}
        {activeTab === 'tour' && (
          <div className="animate-in slide-in-from-bottom duration-500">
            <PanoramicTourViewer />
          </div>
        )}

        {/* TAB 3: CHARTS & ANALYTICS */}
        {activeTab === 'charts' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-[2.5rem] p-8 lg:p-12 shadow-sm">
              <CommunityAnalytics projects={socialProjects} />
            </div>
          </div>
        )}

        {/* TAB 4: MINISTERIAL SOCIAL ACTS */}
        {activeTab === 'acts' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
                  <Heart size={12} /> Prensa y Desarrollo
                </span>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Actos Sociales e Inauguraciones del Ministerio
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Boletín oficial de actividades institucionales e inauguración de obras de desarrollo.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {MOCK_MINISTERIAL_ACTS.map((act) => (
                <div 
                  key={act.id} 
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-lg transition-all flex flex-col h-full"
                >
                  <div className="h-48 relative overflow-hidden shrink-0">
                    <img 
                      src={act.imageUrl} 
                      alt={act.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 bg-red-600 text-white font-black uppercase tracking-widest text-[9px] px-2.5 py-1 rounded-full">
                      {act.impactArea}
                    </span>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        <Calendar size={12} className="text-blue-500" />
                        <span>{act.date}</span>
                        <span>•</span>
                        <MapPin size={12} className="text-emerald-500" />
                        <span>{act.location}</span>
                      </div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">
                        {act.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                        {act.description}
                      </p>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4 mt-6 flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <span>Ministerio MMH</span>
                      <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        Prensa Oficial <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DATABASE SCHEMAS (SUPABASE) */}
        {activeTab === 'sql' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
                    <Terminal size={12} /> Esquema de Base de Datos
                  </span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Estructura Supabase Base (DCN-GE)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Ejecute este script SQL en el editor de consultas SQL de su panel de Supabase para estructurar las tablas de proyectos y actos oficiales.
                  </p>
                </div>
                <button
                  onClick={copySqlToClipboard}
                  className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 self-start"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? '¡Copiado!' : 'Copiar Código SQL'}</span>
                </button>
              </div>

              {/* Code Panel */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 p-6 border border-slate-800">
                <pre className="text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre leading-relaxed scrollbar-thin">
{`-- ========================================================
-- TABLA DE OBRAS SOCIALES (social_projects)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.social_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title JSONB NOT NULL,               -- {"es": "...", "en": "..."}
    description JSONB NOT NULL,         -- {"es": "...", "en": "..."}
    impact TEXT,
    location TEXT,
    image TEXT,
    petrolera_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'proposed',     -- 'proposed', 'active', 'completed', 'delayed'
    budget NUMERIC DEFAULT 0,
    progress INTEGER DEFAULT 0,
    end_date DATE,
    investor TEXT,
    lat NUMERIC,
    lng NUMERIC,
    category TEXT DEFAULT 'Educación',  -- 'Educación', 'Salud', 'Infraestructura'
    beneficiaries INTEGER DEFAULT 0,
    tour_360_url TEXT,                  -- Enlace interactivo o assets
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ========================================================
-- TABLA DE ACTOS SOCIALES DEL MINISTERIO (ministerial_social_acts)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.ministerial_social_acts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    act_date DATE DEFAULT CURRENT_DATE,
    location TEXT,
    author TEXT DEFAULT 'Prensa MMH',
    impact_area TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar seguridad RLS
ALTER TABLE public.social_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministerial_social_acts ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública
CREATE POLICY "View social projects" ON public.social_projects FOR SELECT USING (true);
CREATE POLICY "View public acts" ON public.ministerial_social_acts FOR SELECT USING (true);`}
                </pre>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Community;

