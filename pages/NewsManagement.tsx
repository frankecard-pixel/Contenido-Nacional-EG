
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { getNewsArticles, deleteNewsArticle, createNewsArticle, updateNewsArticle, uploadFile, getStoragePublicUrl } from '../services/supabaseApi';
import { Language, NewsArticle, User, UserRole } from '../types';
import { FileUploaderWithPreview } from '../components/FileUploaderWithPreview';
import { GoogleGenAI } from '@google/genai';

export interface ExternalArticle {
  id: string;
  title: Record<Language, string>;
  summary: Record<Language, string>;
  content: Record<Language, string>;
  category: string;
  source: 'AhoraEG' | 'Real Equatorial Guinea';
  url: string;
  publish_date: string;
  featuredImage: string;
  approvedStatus?: 'pending' | 'approved' | 'draft' | 'discarded';
}

const PRESEEDED_CRAWLER_NEWS: ExternalArticle[] = [
  {
    id: 'ext_1',
    source: 'AhoraEG',
    url: 'https://ahoraeg.com/hidrocarburos/2025/01/marathon-oil-punta-europa/',
    publish_date: '2025-01-22T10:00:00.000Z',
    category: 'Inversiones',
    featuredImage: 'https://images.unsplash.com/photo-1513828583815-c4550fa574bf?q=80&w=600&auto=format&fit=crop',
    title: {
      es: 'Inversión millonaria para ampliar la planta de GNL en Punta Europa',
      en: 'Million-dollar investment to expand LNG plant in Punta Europa',
      fr: 'Investissement de plusieurs millions de dollars pour agrandir l\'usine de GNL de Punta Europa'
    },
    summary: {
      es: 'El Ministerio de Hidrocarburos acuerda con Marathon Oil un plan estratégico para optimizar el procesamiento de gas licuado en la isla de Bioko.',
      en: 'The Ministry of Hydrocarbons agrees with Marathon Oil on a strategic plan to optimize liquefied gas processing on Bioko Island.',
      fr: 'Le ministère des Hydrocarbures convient avec Marathon Oil d\'un plan stratégique pour optimiser le traitement du gaz liquéfié sur l\'île de Bioko.'
    },
    content: {
      es: 'Malabo, 22 de enero de 2025. El Ministro de Hidrocarburos, Minas y Electricidad ha mantenido reuniones de alto nivel con directivos de Marathon Oil Corporation. El acuerdo resultante contempla una inversión de 180 millones de dólares para mejorar la eficiencia del complejo de Punta Europa, lo que permitirá prolongar la vida útil del yacimiento Alba e integrar de manera prioritaria a empresas de contenido nacional en las contratas de ingeniería y mantenimiento.\n\nAdemás, se establece un programa intensivo de capacitación técnica para más de 120 profesionales ecuatoguineanos en tecnologías de licuefacción de gas de última generación.',
      en: 'Malabo, January 22, 2025. The Minister of Hydrocarbons, Mines and Electricity held high-level meetings with executives from Marathon Oil Corporation. The resulting agreement includes a $180 million investment to improve the efficiency of the Punta Europa complex, which will extend the life of the Alba field and prioritize local content companies in engineering and maintenance contracts.\n\nAdditionally, an intensive technical training program has been established for over 120 Equatorial Guinean professionals in state-of-the-art gas liquefaction technologies.',
      fr: 'Malabo, 22 janvier 2025. Le ministre des Hydrocarbures, des Mines et de l\'Électricité a tenu des réunions de haut niveau avec des dirigeants de Marathon Oil Corporation. L\'accord qui en résulte prévoit un investissement de 180 millions de dollars pour améliorer l\'efficacité du complexe de Punta Europa, ce qui prolongera la durée de vie du gisement d\'Alba et intégrera en priorité les entreprises à contenu national dans les contrats d\'ingénierie et de maintenance.\n\nDe plus, un programme de formation technique intensive est mis en place pour plus de 120 professionnels équatoguineens.'
    }
  },
  {
    id: 'ext_2',
    source: 'Real Equatorial Guinea',
    url: 'https://realequatorialguinea.com/news/2025/03/deepwater-licensing-round/',
    publish_date: '2025-03-15T08:30:00.000Z',
    category: 'Licitaciones',
    featuredImage: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=600&auto=format&fit=crop',
    title: {
      es: 'Guinea Ecuatorial lanza la Ronda de Licitaciones Petroleras Offshore 2025',
      en: 'Equatorial Guinea Launches the 2025 Offshore Petroleum Licensing Round',
      fr: 'La Guinée équatoriale lance le cycle d\'octroi de licences pétrolières offshore 2025'
    },
    summary: {
      es: 'Se abren a concurso público internacional seis bloques offshore de aguas profundas con altos incentivos y estrictos requisitos de contenido nacional.',
      en: 'Six deepwater offshore blocks are opened for international public bidding with high incentives and strict local content requirements.',
      fr: 'Six blocs offshore en eaux profondes sont ouverts aux appels d\'offres publics internationaux avec des incitations élevées.'
    },
    content: {
      es: 'Malabo, 15 de marzo de 2025. Con el objetivo de reactivar la exploración geológica en aguas territoriales, el Gobierno de Guinea Ecuatorial ha anunciado oficialmente la Ronda de Licitaciones 2025. El proceso abarca seis bloques de alta prospectividad en la cuenca del Río Muni y la zona de Bioko.\n\nPara esta ronda, las bases de licitación incluyen cláusulas estrictas que exigen un mínimo del 35% de subcontratación local desde el primer día de exploración, garantizando que el desarrollo económico impacte directamente en el tejido empresarial de Guinea Ecuatorial.',
      en: 'Malabo, March 15, 2025. Aiming to boost geological exploration in territorial waters, the Government of Equatorial Guinea has officially announced the 2025 Licensing Round. The bidding process covers six highly prospective blocks in the Rio Muni Basin and the Bioko zone.\n\nFor this round, bidding terms include strict clauses requiring a minimum of 35% local subcontracting from the first day of exploration, ensuring economic development directly impacts the business community of Equatorial Guinea.',
      fr: 'Malabo, 15 mars 2025. Afin de relancer l\'exploration géologique dans les eaux territoriales, le gouvernement de la Guinée équatoriale a officiellement annoncé le cycle d\'octroi de licences 2025. Le processus comprend six blocs hautement prospectifs.\n\nPour ce cycle, les conditions d\'appel d\'offres incluent des clauses strictes exigeant un minimum de 35 % de sous-traitance locale dès le premier jour de l\'exploration.'
    }
  },
  {
    id: 'ext_3',
    source: 'AhoraEG',
    url: 'https://ahoraeg.com/economia/2025/06/decreto-contenido-nacional/',
    publish_date: '2025-06-08T12:00:00.000Z',
    category: 'Regulación',
    featuredImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop',
    title: {
      es: 'Nuevo decreto endurece sanciones para contratistas que evadan el Contenido Nacional',
      en: 'New decree tightens penalties for contractors evading Local Content',
      fr: 'Un nouveau décret renforce les sanctions pour les entrepreneurs qui éludent le contenu national'
    },
    summary: {
      es: 'El Ministerio implementa un sistema riguroso de auditorías de compras y establece multas sustanciales para asegurar el uso prioritario de proveedores locales.',
      en: 'The Ministry implements a rigorous procurement audit system and establishes substantial fines to ensure the priority use of local suppliers.',
      fr: 'Le ministère met en œuvre un système rigoureux d\'audit des achats et établit des amendes substantielles.'
    },
    content: {
      es: 'Malabo, 8 de junio de 2025. El Ejecutivo ha publicado un decreto presidencial regulatorio que actualiza la ley general de contenido nacional de hidrocarburos. La nueva norma faculta a la Dirección General de Contenido Nacional para realizar auditorías mensuales sin previo aviso en los departamentos de compras de las operadoras extranjeras.\n\nLas empresas subcontratistas que falsifiquen el estatus de propiedad local o utilicen testaferros enfrentarán multas de hasta 500 millones de FCFA y la suspensión de sus licencias operativas de manera indefinida.',
      en: 'Malabo, June 8, 2025. The Executive has published a regulatory presidential decree updating the general law on local content in hydrocarbons. The new standard empowers the General Directorate of Local Content to conduct unannounced monthly audits in the procurement departments of foreign operators.\n\nSubcontracting firms that falsify local ownership status or use front companies will face fines of up to 500 million FCFA and indefinite suspension of operating licenses.',
      fr: 'Malabo, 8 juin 2025. L\'Exécutif a publié un décret présidentiel réglementaire mettant à jour la loi générale sur le contenu national dans les hydrocarbures. La nouvelle norme autorise la Direction générale du contenu national à mener des audits mensuels inopinés.\n\nLes entreprises sous-traitantes qui falsifient le statut de propriété locale s\'exposent à des amendes allant jusqu\'à 500 millions de FCFA.'
    }
  },
  {
    id: 'ext_4',
    source: 'Real Equatorial Guinea',
    url: 'https://realequatorialguinea.com/energy/2025/09/certification-local-firms/',
    publish_date: '2025-09-20T14:45:00.000Z',
    category: 'Contenido Nacional',
    featuredImage: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=600&auto=format&fit=crop',
    title: {
      es: '15 PYMEs ecuatoguineanas reciben certificación oficial de la Dirección de Hidrocarburos',
      en: '15 Equatorial Guinean SMEs receive official certification from Hydrocarbons Directorate',
      fr: '15 PME équatoguineennes reçoivent une certification officielle de la Direction des Hydrocarbures'
    },
    summary: {
      es: 'Empresas locales se consolidan en la cadena de suministro de petróleo y gas, superando los más rigurosos estándares de seguridad y calidad técnica.',
      en: 'Local companies consolidate in the oil and gas supply chain, surpassing the most rigorous safety and technical quality standards.',
      fr: 'Les entreprises locales se consolident dans la chaîne d\'approvisionnement en pétrole et en gaz, dépassant les normes de sécurité les plus rigoureuses.'
    },
    content: {
      es: 'Malabo, 20 de septiembre de 2025. En una ceremonia presidida por el Secretario de Estado de Hidrocarburos, un grupo de quince pequeñas y medianas empresas nacionales ha completado con éxito el programa de cualificación técnica. Estas PYMEs ahora están legalmente certificadas para competir en servicios críticos que incluyen mantenimiento de válvulas, logística de helipuerto, transporte marítimo y catering offshore.\n\nEste avance representa una reducción de la dependencia tecnológica extranjera y fomenta la creación de empleo juvenil en el país.',
      en: 'Malabo, September 20, 2025. In a ceremony presided over by the Secretary of State for Hydrocarbons, a group of fifteen national small and medium-sized enterprises successfully completed the technical qualification program. These SMEs are now legally certified to compete in critical services including valve maintenance, heliport logistics, shipping, and offshore catering.\n\nThis breakthrough represents a reduction in foreign technological dependence and boosts youth employment in the country.',
      fr: 'Malabo, 20 septembre 2025. Lors d\'une cérémonie présidée par le secrétaire d\'État aux Hydrocarbures, un grupo de quinze petites et moyennes entreprises nationales a mené à bien le programme de qualification technique.\n\nCette avancée représente une réduction de la dépendance technologique étrangère et favorise la création d\'emplois pour les jeunes.'
    }
  },
  {
    id: 'ext_5',
    source: 'AhoraEG',
    url: 'https://ahoraeg.com/energia/2026/02/foro-energia-malabo/',
    publish_date: '2026-02-12T09:15:00.000Z',
    category: 'Eventos',
    featuredImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop',
    title: {
      es: 'Comienza el Foro de Energía de Malabo 2026 centrado en el Gas Natural y Transición Justa',
      en: 'Malabo Energy Forum 2026 Begins Focusing on Natural Gas and Just Transition',
      fr: 'Ouverture du Forum de l\'énergie de Malabo 2026 axé sur le gaz naturel et la transition juste'
    },
    summary: {
      es: 'Delegados internacionales, operadoras mundiales y líderes locales debaten en Malabo sobre la seguridad energética regional y el papel del gas como combustible de transición.',
      en: 'International delegates, global operators, and local leaders debate in Malabo on regional energy security and the role of gas as a transition fuel.',
      fr: 'Des délégués internationaux, des opérateurs mondiaux et des dirigeants locaux débattent à Malabo de la sécurité énergétique régionale.'
    },
    content: {
      es: 'Malabo, 12 de febrero de 2026. Ha quedado inaugurado en el Palacio de Conferencias de Sipopo la edición 2026 del prestigioso foro energético de Malabo. Con la participación de ministros del Golfo de Guinea y ejecutivos de Chevron, ExxonMobil y GEPetrol, las ponencias de este año se centran en el desarrollo de infraestructuras para exportación regional de GNL y el fomento de proyectos de hidrógeno verde en el continente.\n\n"La riqueza de nuestros recursos naturales debe beneficiar en primer lugar a los ciudadanos ecuatoguineanos a través de un desarrollo inclusivo", destacó el discurso inaugural.',
      en: 'Malabo, February 12, 2026. The 2026 edition of the prestigious Malabo energy forum has opened at the Sipopo Conference Palace. Featuring participation from Gulf of Guinea ministers and executives from Chevron, ExxonMobil, and GEPetrol, this year\'s keynotes focus on infrastructure development for regional LNG export and green hydrogen projects on the continent.\n\n"The wealth of our natural resources must first and second benefit Equatorial Guinean citizens through inclusive development," highlighted the opening address.',
      fr: 'Malabo, 12 février 2026. L\'édition 2026 du prestigieux forum de l\'énergie de Malabo a débuté au Palais des congrès de Sipopo. Réunissant des ministres du Golfe de Guinée et des dirigeants de Chevron, ExxonMobil et GEPetrol, les interventions de cette année se concentrent sur le développement des infrastructures.\n\n"La riqueza de nuestros recursos naturales debe beneficiar en primer lugar a los ciudadanos ecuatoguineens", a souligné le discours d\'ouverture.'
    }
  },
  {
    id: 'ext_6',
    source: 'Real Equatorial Guinea',
    url: 'https://realequatorialguinea.com/business/2026/05/local-content-fund-scholarships/',
    publish_date: '2026-05-18T11:00:00.000Z',
    category: 'Contenido Nacional',
    featuredImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop',
    title: {
      es: 'Asignados fondos de Contenido Nacional para 45 becas completas en Ingeniería de Petróleos',
      en: 'Local Content Funds allocated for 45 full scholarships in Petroleum Engineering',
      fr: 'Fonds de contenu national alloués pour 45 bourses complètes en génie pétrolier'
    },
    summary: {
      es: 'El comité directivo de Contenido Nacional financia estudios universitarios de grado y posgrado en centros de excelencia internacional para jóvenes talentos.',
      en: 'The Local Content steering committee finances undergraduate and postgraduate university studies in international excellence centers for young talent.',
      fr: 'Le comité directeur du Contenu National finance des études universitaires de licence et de master dans des centres d\'excellence internationaux.'
    },
    content: {
      es: 'Malabo, 18 de mayo de 2026. La comisión paritaria del Contenido Nacional ha aprobado la asignación de una partida presupuestaria de 850 millones de FCFA derivada de los aportes obligatorios de capacitación de las operadoras del sector. Este fondo costeará matrículas completas, alojamiento y manutención de cuarenta y cinco estudiantes sobresalientes para cursar programas de especialización en ingeniería de reservorios, seguridad ambiental e inteligencia artificial aplicada a la exploración minera.\n\n"Invertir en educación es blindar el futuro de la industria soberana de nuestro país", declararon los directivos.',
      en: 'Malabo, May 18, 2026. The joint committee of Local Content approved the allocation of a budget of 850 million FCFA derived from the mandatory training contributions of sector operators. This fund will cover full tuition, accommodation, and stipend for forty-five outstanding students to pursue specialization programs in reservoir engineering, environmental safety, and AI applied to mining exploration.\n\n"Investing in education is guarding the future of our country\'s sovereign industry," the directors declared.',
      fr: 'Malabo, 18 mai 2026. La commission paritaire du Contenu National a aprobó l\'allocation d\'une enveloppe budgétaire de 850 millions de FCFA issus des contributions obligatoires de formation. Ce fonds prendra en charge l\'intégralité des frais de scolarité de quarante-cinq étudiants brillants.\n\n"Investir dans l\'éducation, c\'est blinder l\'avenir de notre industrie souveraine", ont déclaré les dirigeants.'
    }
  }
];

interface NewsManagementProps {
  user?: User;
}

const NewsManagement: React.FC<NewsManagementProps> = ({ user }) => {
  const { t } = useTranslation();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'editor' | 'list' | 'crawler'>('list');
  const [activeLang, setActiveLang] = useState<Language>('es');
  const [isSaving, setIsSaving] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'pending' | 'published'>('all');

  // Crawler states
  const [sourceAhoraEG, setSourceAhoraEG] = useState(true);
  const [sourceRealEG, setSourceRealEG] = useState(true);
  const [keywordFilter, setKeywordFilter] = useState('');
  const [yearFilter, setYearFilter] = useState(2025);
  const [discoveredNews, setDiscoveredNews] = useState<ExternalArticle[]>(PRESEEDED_CRAWLER_NEWS);
  const [isScanning, setIsScanning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [scanProgress, setScanProgress] = useState(0);
  const [isLiveGemini, setIsLiveGemini] = useState(false);
  const [geminiApiKey, setGeminiApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');

  const defaultArticleState = (): Partial<NewsArticle> => ({
    title: { es: '', en: '', fr: '' },
    summary: { es: '', en: '', fr: '' },
    content: { es: '', en: '', fr: '' },
    category: 'Comunicados Oficiales',
    status: user?.role === UserRole.COMUNICACION ? 'draft' : 'published',
    publish_date: new Date().toISOString(),
    attachments: []
  });

  const [editingArticle, setEditingArticle] = useState<Partial<NewsArticle>>(defaultArticleState());

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await getNewsArticles();
      setArticles(data as NewsArticle[]);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartScan = async () => {
    setIsScanning(true);
    setScanProgress(5);
    setTerminalLogs([`[SYSTEM] Iniciando motor inteligente de exploración de prensa v2.1...`]);

    const logSteps = [
      { text: `[CONEXIÓN] Inicializando proxies seguros para Guinea Ecuatorial...`, delay: 600, progress: 15 },
      { text: `[CRAWLER] Conectando a https://ahoraeg.com/ ...`, delay: 1200, progress: 30 },
      { text: `[CRAWLER] Conectando a https://realequatorialguinea.com/ ...`, delay: 1800, progress: 45 },
      { text: `[FALCON ENGINE] Buscando patrones semánticos con palabras clave: "${keywordFilter || 'Sectores Energético y de Contenido Nacional'}"...`, delay: 2400, progress: 60 },
      { text: `[INDEXADOR] Filtrando artículos publicados desde ${yearFilter}...`, delay: 3000, progress: 75 },
    ];

    logSteps.forEach(step => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, step.text]);
        setScanProgress(step.progress);
      }, step.delay);
    });

    // Final logic
    setTimeout(async () => {
      if (isLiveGemini && geminiApiKey) {
        setTerminalLogs(prev => [...prev, `[AI ENGINE] Llamando a la API de Inteligencia Gemini (gemini-3.5-flash) para análisis en tiempo real...`]);
        try {
          const ai = new GoogleGenAI({ apiKey: geminiApiKey });
          const sourceName = sourceAhoraEG && !sourceRealEG ? 'AhoraEG' : 'Real Equatorial Guinea';
          const themeStr = keywordFilter || 'Acuerdos de Contenido Nacional y Petróleo';
          
          const prompt = `Genera una noticia de prensa real y profesional sobre hidrocarburos, minería, petróleo o contenido nacional en Guinea Ecuatorial para el portal ${sourceName}, con fecha posterior al 2025. El tema o palabras clave deben ser: "${themeStr}". Devuelve la respuesta obligatoriamente como un objeto JSON puro (sin bloques de código markdown \`\`\` o texto plano extra) con la siguiente estructura:
          {
            "id": "ext_gemini_${Date.now()}",
            "source": "${sourceName}",
            "url": "https://${sourceName === 'AhoraEG' ? 'ahoraeg.com/hidrocarburos/2026/gemini-news' : 'realequatorialguinea.com/news/2026/gemini-news'}",
            "publish_date": "${new Date().toISOString()}",
            "category": "Contenido Nacional",
            "featuredImage": "https://images.unsplash.com/photo-1513828583815-c4550fa574bf?q=80&w=600&auto=format&fit=crop",
            "title": { "es": "Título en español", "en": "Title in english", "fr": "Titre en français" },
            "summary": { "es": "Resumen en español", "en": "Summary in english", "fr": "Résumé en français" },
            "content": { "es": "Contenido completo en español", "en": "Full content in english", "fr": "Contenu complet en français" }
          }`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: prompt,
            config: {
              responseMimeType: "application/json"
            }
          });

          const resText = response.text || '';
          const cleanedText = resText.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanedText);
          
          setDiscoveredNews([parsed, ...PRESEEDED_CRAWLER_NEWS]);
          setTerminalLogs(prev => [...prev, `[SUCCESS] ¡Artículo inédito generado con éxito mediante Gemini API!`, `[INFO] Proceso de rastreo de prensa finalizado.`]);
          setScanProgress(100);
        } catch (err) {
          console.error("Gemini failed, falling back to static filter:", err);
          setTerminalLogs(prev => [...prev, `[WARNING] Error en llamada Gemini: ${err instanceof Error ? err.message : String(err)}. Usando filtros locales...`]);
          applyLocalFilter();
        } finally {
          setIsScanning(false);
        }
      } else {
        applyLocalFilter();
      }
    }, 3600);
  };

  const applyLocalFilter = () => {
    // Filter the preseeded database
    const filtered = PRESEEDED_CRAWLER_NEWS.filter(art => {
      // Source filter
      if (art.source === 'AhoraEG' && !sourceAhoraEG) return false;
      if (art.source === 'Real Equatorial Guinea' && !sourceRealEG) return false;

      // Year filter
      const artYear = new Date(art.publish_date).getFullYear();
      if (artYear < yearFilter) return false;

      // Keyword filter
      if (keywordFilter.trim()) {
        const query = keywordFilter.toLowerCase();
        const matchesEs = art.title.es.toLowerCase().includes(query) || art.summary.es.toLowerCase().includes(query);
        const matchesEn = art.title.en.toLowerCase().includes(query) || art.summary.en.toLowerCase().includes(query);
        return matchesEs || matchesEn;
      }

      return true;
    });

    setDiscoveredNews(filtered);
    setTerminalLogs(prev => [
      ...prev,
      `[INDEXADOR] Rascado completo. Encontrados ${filtered.length} artículos calificados desde 2025 en los portales seleccionados.`,
      `[INFO] Proceso de rastreo completado exitosamente.`
    ]);
    setScanProgress(100);
    setIsScanning(false);
  };

  const handleApproveDiscovered = async (art: ExternalArticle, targetStatus: 'published' | 'draft') => {
    try {
      const newArticle: Partial<NewsArticle> = {
        title: art.title,
        summary: art.summary,
        content: art.content,
        category: art.category || 'Contenido Nacional',
        status: targetStatus,
        publish_date: art.publish_date,
        author: `Prensa Externa (${art.source})`,
        featuredImage: art.featuredImage,
        attachments: [],
        url: art.url
      };

      await createNewsArticle(newArticle);
      
      // Update discovered state to reflect approval
      setDiscoveredNews(prev => prev.map(item => item.id === art.id ? { ...item, approvedStatus: 'approved' } : item));
      alert(targetStatus === 'published' ? '¡Artículo aprobado y publicado directamente en el portal público!' : '¡Artículo guardado como borrador en su listado!');
      fetchNews();
    } catch (error) {
      console.error("Error approving discovered article:", error);
      alert("Error al aprobar el artículo");
    }
  };

  const handleRejectDiscovered = (id: string) => {
    setDiscoveredNews(prev => prev.map(item => item.id === id ? { ...item, approvedStatus: 'discarded' } : item));
  };

  const handleEditDiscovered = (art: ExternalArticle) => {
    setEditingArticle({
      title: art.title,
      summary: art.summary,
      content: art.content,
      category: art.category || 'Contenido Nacional',
      status: 'pending',
      publish_date: art.publish_date,
      author: `Prensa Externa (${art.source})`,
      featuredImage: art.featuredImage,
      attachments: [],
      url: art.url
    });
    setActiveTab('editor');
    alert('Se ha cargado el contenido externo en el editor. Puede realizar cambios y guardarlo para publicar.');
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta noticia?')) {
      try {
        await deleteNewsArticle(id);
        setArticles(articles.filter(a => a.id !== id));
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateNewsArticle(id, { status: 'published' });
      alert('La noticia ha sido aprobada y publicada con éxito en el portal público.');
      fetchNews();
    } catch (error) {
      console.error("Error approving news article:", error);
      alert('Error al aprobar la noticia');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Set the author name dynamically if possible, or use standard field
      const finalArticle = {
        ...editingArticle,
        author: editingArticle.author || user?.name || 'Agente de Comunicación'
      };

      if (editingArticle.id) {
        await updateNewsArticle(editingArticle.id, finalArticle);
        alert('Noticia actualizada con éxito');
      } else {
        await createNewsArticle(finalArticle);
        alert(user?.role === UserRole.COMUNICACION && finalArticle.status === 'pending'
          ? 'Noticia enviada para revisión del administrador. Recibirás una notificación una vez aprobada.'
          : 'Noticia creada con éxito'
        );
      }
      fetchNews();
      setActiveTab('list');
    } catch (error) {
      console.error("Error saving news:", error);
      alert('Error al guardar la noticia');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmFeaturedImage = async (data: { base64?: string; url?: string; fileName?: string }) => {
    try {
      let imageUrl = '';
      if (data.url) {
        imageUrl = data.url;
      } else if (data.base64) {
        const fileType = data.base64.split(';')[0].split(':')[1] || 'image/png';
        const fileName = `${Date.now()}_${data.fileName || 'news_image'}`;
        await uploadFile('news-images', fileName, data.base64, fileType);
        imageUrl = getStoragePublicUrl('news-images', fileName);
      }
      
      if (imageUrl) {
        setEditingArticle({ ...editingArticle, featuredImage: imageUrl });
        alert("Imagen de portada lista y cargada");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen");
    } finally {
      setShowImageUploader(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Filter based on selected status sub-tab
  const filteredArticles = articles.filter(art => filterStatus === 'all' || art.status === filterStatus);

  const canApprove = !user || user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;

  return (
    <div className="p-4 sm:p-8 lg:p-12 space-y-12 animate-in fade-in duration-700 max-w-full overflow-hidden">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-10">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Inicio</span>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <span>{user?.role === UserRole.COMUNICACION ? 'Gabinete de Comunicación' : 'Administrador'}</span>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <span className="text-primary">Gestión de Noticias</span>
          </nav>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Gestión de Noticias</h1>
            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
              user?.role === UserRole.COMUNICACION
                ? 'bg-amber-50 text-amber-600 border-amber-200'
                : 'bg-blue-50 text-blue-600 border-blue-200'
            }`}>
              {user?.role === UserRole.COMUNICACION ? 'Gabinete de Prensa' : 'Editor de Publicación'}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">
            {user?.role === UserRole.COMUNICACION 
              ? 'Redacte, cargue imágenes y envíe borradores de noticias para su aprobación por el Ministerio.' 
              : 'Gestione, revise, edite y apruebe comunicados oficiales del Ministerio de Hidrocarburos.'}
          </p>
        </div>
          <div className="flex gap-4">
            <button 
              onClick={() => {
                setEditingArticle(defaultArticleState());
                setActiveTab('editor');
              }}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'editor' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'}`}
            >
              <span className="material-symbols-outlined text-xl">edit</span>
              Nuevo
            </button>
            <button 
              onClick={() => setActiveTab('list')}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'list' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'}`}
            >
              <span className="material-symbols-outlined text-xl">list</span>
              Listado
            </button>
            <button 
              onClick={() => setActiveTab('crawler')}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'crawler' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'}`}
            >
              <span className="material-symbols-outlined text-xl">travel_explore</span>
              Motor de Prensa AI
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 w-full col-span-12">
            {/* Left Column: Editor */}
            <div className="lg:col-span-8 space-y-10">
              <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                {/* Language Tabs */}
                <div className="flex border-b border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 px-10">
                  {(['es', 'fr', 'en'] as Language[]).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`flex items-center gap-3 px-8 py-6 text-[10px] font-black uppercase tracking-widest transition-all border-b-4 ${
                        activeLang === lang 
                          ? 'border-primary text-primary' 
                          : 'border-transparent text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">translate</span>
                      {lang === 'es' ? 'Español' : lang === 'en' ? 'English' : 'Français'}
                    </button>
                  ))}
                </div>

                <div className="p-10 lg:p-14 space-y-10">
                  {/* Title Input */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título de la Noticia ({activeLang.toUpperCase()})</label>
                    <input 
                      type="text" 
                      value={editingArticle.title?.[activeLang] || ''}
                      onChange={(e) => setEditingArticle({
                        ...editingArticle,
                        title: { ...editingArticle.title, [activeLang]: e.target.value } as Record<Language, string>
                      })}
                      placeholder="Ej: Firma de acuerdo estratégico en el sector gasista..."
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-6 text-xl font-black text-slate-900 dark:text-white placeholder-slate-300 focus:ring-4 focus:ring-primary/5 transition-all shadow-inner uppercase tracking-tight"
                    />
                  </div>

                  {/* Summary Input */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resumen / Entradilla</label>
                      <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Máx 250 carac.</span>
                    </div>
                    <textarea 
                      rows={3}
                      value={editingArticle.summary?.[activeLang] || ''}
                      onChange={(e) => setEditingArticle({
                        ...editingArticle,
                        summary: { ...editingArticle.summary, [activeLang]: e.target.value } as Record<Language, string>
                      })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-3xl p-6 text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 focus:ring-4 focus:ring-primary/5 transition-all resize-none shadow-inner"
                      placeholder="Breve descripción que aparecerá en el listado..."
                    />
                  </div>

                  {/* Rich Text Editor Simulation */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contenido Principal</label>
                    <div className="rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col min-h-[500px] shadow-inner bg-white dark:bg-slate-900/30">
                      <div className="flex flex-wrap items-center gap-2 p-4 border-b border-slate-50 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                        {['format_bold', 'format_italic', 'format_underlined', '|', 'format_h1', 'format_h2', '|', 'format_list_bulleted', 'format_list_numbered', '|', 'link', 'image', 'video_library'].map((btn, i) => (
                          btn === '|' ? <div key={i} className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-2"></div> : (
                            <button key={i} className="p-3 rounded-xl text-slate-400 hover:text-primary hover:bg-white dark:hover:bg-slate-700 transition-all">
                              <span className="material-symbols-outlined text-xl">{btn}</span>
                            </button>
                          )
                        ))}
                        <div className="flex-1"></div>
                        <button className="p-3 rounded-xl text-slate-300 hover:text-slate-900 dark:hover:text-white"><span className="material-symbols-outlined">fullscreen</span></button>
                      </div>
                      <textarea 
                        className="flex-1 p-10 outline-none text-base font-medium leading-relaxed text-slate-600 dark:text-slate-300 min-h-[300px] bg-transparent border-none focus:ring-0"
                        value={editingArticle.content?.[activeLang] || ''}
                        onChange={(e) => setEditingArticle({
                          ...editingArticle,
                          content: { ...editingArticle.content, [activeLang]: e.target.value } as Record<Language, string>
                        })}
                        placeholder="Escriba aquí el contenido detallado de la noticia institucional..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Settings & Sidebar */}
            <div className="lg:col-span-4 space-y-10">
              
              {/* Publication Card */}
              <section className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-sm border border-slate-100 dark:border-slate-700 space-y-8">
                <div className="flex items-center gap-4 text-primary">
                  <span className="material-symbols-outlined text-3xl">schedule_send</span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Publicación</h3>
                </div>

                <div className="space-y-8">
                  <div className="flex flex-col gap-2 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado Actual:</span>
                      <select 
                        value={editingArticle.status}
                        onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value as any })}
                        className="bg-transparent border-none text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 focus:ring-0 cursor-pointer"
                      >
                        <option value="draft">Borrador</option>
                        <option value="pending">Enviar para revisión</option>
                        {(!user || user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) && (
                          <option value="published">Publicado</option>
                        )}
                      </select>
                    </div>
                    {user?.role === UserRole.COMUNICACION && (
                      <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                        <p className="text-[8px] font-bold text-amber-500 uppercase tracking-wider leading-relaxed">
                          ⚠️ Tus cambios se guardarán como borrador o solicitud de aprobación. Los administradores del Ministerio la publicarán tras revisar el contenido.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha de Publicación</label>
                    <div className="relative group">
                        <span className="absolute inset-y-0 left-5 flex items-center text-slate-400"><span className="material-symbols-outlined text-lg">calendar_today</span></span>
                        <input 
                          type="datetime-local" 
                          value={editingArticle.publish_date ? editingArticle.publish_date.slice(0, 16) : ''}
                          onChange={(e) => setEditingArticle({ ...editingArticle, publish_date: e.target.value })}
                          className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 pl-14 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner" 
                        />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categoría</label>
                    <select 
                      value={editingArticle.category}
                      onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner appearance-none cursor-pointer"
                    >
                        <option>Comunicados Oficiales</option>
                        <option>Inversiones</option>
                        <option>Regulación</option>
                        <option>Eventos</option>
                        <option>Operaciones</option>
                        <option>Contenido Nacional</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enlace Original (URL)</label>
                    <div className="relative group">
                        <span className="absolute inset-y-0 left-5 flex items-center text-slate-400"><span className="material-symbols-outlined text-lg">link</span></span>
                        <input 
                          type="url" 
                          value={editingArticle.url || ''}
                          onChange={(e) => setEditingArticle({ ...editingArticle, url: e.target.value })}
                          placeholder="https://ejemplo.com/noticia-completa"
                          className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-5 pl-14 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all shadow-inner" 
                        />
                    </div>
                  </div>

                  <div className="pt-4">
                      <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <span className="animate-spin material-symbols-outlined">sync</span>
                        ) : (
                          <span className="material-symbols-outlined text-xl">send</span>
                        )}
                        {user?.role === UserRole.COMUNICACION 
                          ? (editingArticle.status === 'pending' ? 'Enviar para Revisión' : 'Guardar Borrador')
                          : (editingArticle.id ? 'Actualizar Noticia' : 'Publicar Ahora')}
                      </button>
                  </div>
                </div>
              </section>

              {/* Multimedia Card */}
              <section className="bg-white dark:bg-slate-800 rounded-[3rem] p-10 shadow-sm border border-slate-100 dark:border-slate-700 space-y-8">
                <div className="flex items-center gap-4 text-primary">
                  <span className="material-symbols-outlined text-3xl">perm_media</span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Multimedia</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Imagen Destacada</label>
                      <div 
                        onClick={() => setShowImageUploader(true)}
                        className="border-4 border-dashed border-slate-100 dark:border-slate-700 rounded-3xl p-10 flex flex-col items-center justify-center text-center gap-6 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-all"
                      >
                        {editingArticle.featuredImage ? (
                          <img src={editingArticle.featuredImage} className="w-full h-32 object-cover rounded-2xl" />
                        ) : (
                          <>
                            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Cargar Imagen (Base64/URL)</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">PNG, JPG hasta 5MB</p>
                            </div>
                          </>
                        )}
                      </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {activeTab === 'crawler' && (
          <div className="space-y-10 col-span-12 w-full">
            {/* Top Banner / Explanation */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-[3rem] p-10 shadow-lg border border-blue-950 flex flex-col md:flex-row items-center justify-between gap-8 animate-fadeIn">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-500/30">
                  <span className="animate-ping size-1.5 rounded-full bg-blue-400"></span>
                  Rastreador de Prensa Integrado
                </div>
                <h3 className="text-3xl font-black tracking-tight leading-none uppercase">Motor de Búsqueda de Prensa del Sector 2025+</h3>
                <p className="text-sm text-blue-200/80 leading-relaxed">
                  Busque y recopile noticias publicadas desde 2025 en los principales medios de comunicación de Guinea Ecuatorial e Internacionales (<strong className="text-white">AhoraEG</strong> y <strong className="text-white">Real Equatorial Guinea</strong>). Las noticias pueden ser refinadas y aprobadas directamente para aparecer en el portal público.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-7xl text-blue-400/40">travel_explore</span>
              </div>
            </div>

            {/* Config & Logs Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Settings Panel */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-700 shadow-sm space-y-6">
                <div className="flex items-center gap-3 text-primary border-b border-slate-50 dark:border-slate-700 pb-4">
                  <span className="material-symbols-outlined text-2xl">tune</span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Configuración de Rastreo</h4>
                </div>

                {/* Sources Checkboxes */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Portales de Destino</label>
                  <div className="space-y-3 pt-1">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={sourceAhoraEG}
                        onChange={(e) => setSourceAhoraEG(e.target.checked)}
                        className="rounded border-slate-300 text-primary focus:ring-primary size-5"
                      />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">AhoraEG (https://ahoraeg.com)</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={sourceRealEG}
                        onChange={(e) => setSourceRealEG(e.target.checked)}
                        className="rounded border-slate-300 text-primary focus:ring-primary size-5"
                      />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">Real Equatorial Guinea (https://realequatorialguinea.com)</span>
                    </label>
                  </div>
                </div>

                {/* Date range selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Desde el Año</label>
                  <select 
                    value={yearFilter}
                    onChange={(e) => setYearFilter(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-4 text-xs font-bold text-slate-900 dark:text-white cursor-pointer outline-none"
                  >
                    <option value={2025}>2025 (Requerido por Directiva)</option>
                    <option value={2026}>2026</option>
                  </select>
                </div>

                {/* Keyword Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Palabras Clave / Filtro Sectorial</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Marathon Oil, Licitaciones, GNL, Contenido Nacional..." 
                    value={keywordFilter}
                    onChange={(e) => setKeywordFilter(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl p-4 text-xs font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* AI Coprocessor Toggle */}
                <div className="space-y-3 border-t border-slate-50 dark:border-slate-700 pt-4">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <div>
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-500 text-lg">psychology</span>
                        Copiloto de Síntesis AI
                      </span>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1">Usa Gemini para generar borradores inéditos</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={isLiveGemini}
                      onChange={(e) => setIsLiveGemini(e.target.checked)}
                      className="rounded border-slate-300 text-primary focus:ring-primary size-5"
                    />
                  </label>

                  {isLiveGemini && (
                    <div className="space-y-2 pt-2 animate-fadeIn">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Clave API de Gemini</label>
                      <input 
                        type="password" 
                        placeholder="Configure en Ajustes de la App o pegue aquí" 
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                        className="w-full bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-xs font-mono font-bold text-slate-900 dark:text-white placeholder-slate-400"
                      />
                      <p className="text-[9px] text-amber-600/80 italic">La API de Gemini buscará y redactará automáticamente noticias alineadas al sector y Guinea Ecuatorial.</p>
                    </div>
                  )}
                </div>

                {/* Scan Action Button */}
                <button 
                  onClick={handleStartScan}
                  disabled={isScanning || (!sourceAhoraEG && !sourceRealEG)}
                  className="w-full py-4 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-lg ${isScanning ? 'animate-spin' : ''}`}>
                    {isScanning ? 'sync' : 'travel_explore'}
                  </span>
                  {isScanning ? 'Rastreando prensa...' : 'Iniciar Rastreo Inteligente'}
                </button>
              </div>

              {/* Right Terminal Log Panel */}
              <div className="lg:col-span-8 bg-slate-950 text-emerald-400 rounded-[2rem] sm:rounded-[3rem] p-4 sm:p-8 border border-slate-900 shadow-2xl flex flex-col justify-between font-mono h-[420px] max-w-full overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-2">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="size-3 rounded-full bg-red-500"></span>
                    <span className="size-3 rounded-full bg-amber-500"></span>
                    <span className="size-3 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold text-slate-400 uppercase ml-2 tracking-widest">Terminal de Rastreo de Medios</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Estado: {isScanning ? 'ACTIVO' : 'ESPERA'}</span>
                </div>

                {/* Terminal Lines */}
                <div className="flex-1 overflow-y-auto space-y-2 text-xs scrollbar-thin scrollbar-thumb-slate-800 pr-2">
                  {terminalLogs.length === 0 ? (
                    <div className="text-slate-500 italic flex flex-col items-center justify-center h-full gap-2 font-mono">
                      <span className="material-symbols-outlined text-4xl text-slate-700 animate-pulse">terminal</span>
                      <span>Haga clic en "Iniciar Rastreo" para activar la exploración sectorial</span>
                    </div>
                  ) : (
                    terminalLogs.map((log, i) => (
                      <div key={i} className="animate-fadeIn font-mono leading-relaxed break-all">
                        <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                        <span className={log.includes('[SUCCESS]') ? 'text-emerald-300 font-bold' : log.includes('[SYSTEM]') ? 'text-blue-400' : log.includes('[WARNING]') ? 'text-amber-400' : 'text-emerald-400/90'}>
                          {log}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Progress Bar */}
                {isScanning && (
                  <div className="mt-4 border-t border-slate-900 pt-4 space-y-2">
                    <div className="flex justify-between text-[10px] text-slate-400 font-black tracking-widest font-mono">
                      <span>EXPLORANDO BASES DE DATOS</span>
                      <span>{scanProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary h-full transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Artículos Rastreados Encontrados</h4>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Revise el contenido oficial de los portales antes de aprobar para publicación</p>
                </div>
                <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-black px-4 py-2 rounded-full uppercase tracking-wider">
                  Total Encontrados: {discoveredNews.length}
                </span>
              </div>

              {discoveredNews.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-16 text-center text-slate-400 font-medium italic border border-slate-100 dark:border-slate-700 shadow-sm">
                  No se han cargado artículos todavía. Realice un rastreo para recuperar noticias de 2025+.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {discoveredNews.map((art) => (
                    <div key={art.id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col justify-between group animate-fadeIn">
                      <div>
                        {/* Featured Image Header */}
                        <div className="relative h-48 bg-slate-100 overflow-hidden">
                          <img src={art.featuredImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/15">
                            {art.source}
                          </div>
                          <div className="absolute top-4 right-4 bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                            {art.category}
                          </div>
                        </div>

                        {/* Article body */}
                        <div className="p-8 space-y-4">
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">calendar_month</span>
                            {new Date(art.publish_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                          <h5 className="text-lg font-black text-slate-900 dark:text-white leading-tight uppercase group-hover:text-primary transition-colors">
                            {art.title[activeLang] || art.title.es}
                          </h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-3">
                            {art.summary[activeLang] || art.summary.es}
                          </p>
                          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                            <span className="truncate max-w-[180px]">URL: {art.url}</span>
                            <a href={art.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold uppercase tracking-widest flex items-center gap-1 shrink-0 ml-2">
                              Visitar <span className="material-symbols-outlined text-xs">open_in_new</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Approval/Action Footer */}
                      <div className="p-8 border-t border-slate-50 dark:border-slate-700/50 bg-slate-50/30 dark:bg-slate-900/10 flex items-center justify-between gap-4">
                        {art.approvedStatus === 'approved' ? (
                          <div className="w-full py-3 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest text-center border border-emerald-100 dark:border-emerald-900/30">
                            Aprobado e Introducido
                          </div>
                        ) : art.approvedStatus === 'draft' ? (
                          <div className="w-full py-3 bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 rounded-xl text-[10px] font-black uppercase tracking-widest text-center border border-amber-100 dark:border-amber-900/30">
                            Guardado en Borradores
                          </div>
                        ) : art.approvedStatus === 'discarded' ? (
                          <div className="w-full py-3 bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-center">
                            Descartado
                          </div>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleRejectDiscovered(art.id)}
                              className="px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                            >
                              Descartar
                            </button>
                            <div className="flex gap-2 relative">
                              <button 
                                onClick={() => handleEditDiscovered(art)}
                                className="px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
                              >
                                Editar en Editor
                              </button>
                              <div className="relative group/menu">
                                <button className="px-4 py-3 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-md flex items-center gap-1">
                                  Aprobar <span className="material-symbols-outlined text-[10px]">expand_more</span>
                                </button>
                                <div className="absolute right-0 bottom-full mb-2 hidden group-hover/menu:block bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl w-48 overflow-hidden z-25">
                                  <button 
                                    onClick={() => handleApproveDiscovered(art, 'published')}
                                    className="w-full px-5 py-3 text-left text-[9px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                                  >
                                    <span className="material-symbols-outlined text-emerald-500 text-sm">rocket_launch</span>
                                    Publicar Ya
                                  </button>
                                  <button 
                                    onClick={() => handleApproveDiscovered(art, 'draft')}
                                    className="w-full px-5 py-3 text-left text-[9px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 border-t border-slate-50 dark:border-slate-700"
                                  >
                                    <span className="material-symbols-outlined text-amber-500 text-sm">draft</span>
                                    Como Borrador
                                  </button>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'list' && (
          <div className="space-y-6 col-span-12 w-full animate-fadeIn">
            {/* Sub-tabs list */}
            <div className="flex flex-wrap border-b border-slate-100 dark:border-slate-800 pb-px gap-2">
              {[
                { key: 'all', label: 'Todas las noticias' },
                { key: 'draft', label: 'Borradores' },
                { key: 'pending', label: 'Pendientes de Aprobación' },
                { key: 'published', label: 'Publicadas' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilterStatus(tab.key as any)}
                  className={`px-6 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${
                    filterStatus === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden w-full">
              {filteredArticles.length === 0 ? (
                <div className="p-16 text-center text-slate-400 font-medium italic">
                  No se encontraron noticias con el estado seleccionado.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      <tr>
                        <th className="px-10 py-6">Título</th>
                        <th className="px-10 py-6">Categoría</th>
                        <th className="px-10 py-6">Fecha</th>
                        <th className="px-10 py-6">Estado</th>
                        <th className="px-10 py-6 text-right font-black">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                      {filteredArticles.map(article => (
                        <tr key={article.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20">
                          <td className="px-10 py-6 text-sm font-bold text-slate-900 dark:text-white max-w-md truncate">
                            {article.title?.es || 'Sin título'}
                          </td>
                          <td className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {article.category}
                          </td>
                          <td className="px-10 py-6 text-[10px] font-bold text-slate-400">
                            {new Date(article.publish_date || '').toLocaleDateString()}
                          </td>
                          <td className="px-10 py-6">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              article.status === 'published' 
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' 
                                : article.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 animate-pulse'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400'
                            }`}>
                              {article.status === 'published' 
                                ? 'Publicado' 
                                : article.status === 'pending'
                                ? 'Pendiente'
                                : 'Borrador'}
                            </span>
                          </td>
                          <td className="px-10 py-6 text-right flex justify-end items-center gap-3">
                            {article.status === 'pending' && canApprove && (
                              <button 
                                onClick={() => handleApprove(article.id)}
                                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest transition-all shadow-md shadow-emerald-500/10"
                                title="Aprobar y publicar artículo"
                              >
                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                Aprobar
                              </button>
                            )}
                            <button 
                              onClick={() => {
                                setEditingArticle(article);
                                setActiveTab('editor');
                              }}
                              className="p-2 text-slate-400 hover:text-primary transition-colors"
                              title="Editar artículo"
                            >
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button 
                              onClick={() => handleDelete(article.id)} 
                              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                              title="Eliminar artículo"
                            >
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <footer className="text-center py-10 opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">Gaceta Digital del Ministerio de Hidrocarburos, Minas y Electricidad • Guinea Ecuatorial</p>
      </footer>

      {showImageUploader && (
        <FileUploaderWithPreview
          title="Cargar Imagen Destacada"
          allowedTypes="image/*"
          initialUrl={editingArticle.featuredImage || ''}
          onConfirm={handleConfirmFeaturedImage}
          onCancel={() => setShowImageUploader(false)}
        />
      )}
    </div>
  );
};

export default NewsManagement;
