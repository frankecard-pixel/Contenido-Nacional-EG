
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getOpportunities, getCompanies, getApplications } from '../services/supabaseApi';
import { OpportunityExt, Company, Application } from '../types';
import OpportunityStats from '../components/opportunities/OpportunityStats';
import OpportunityFilters from '../components/opportunities/OpportunityFilters';
import OpportunityList from '../components/opportunities/OpportunityList';

const OpportunityManagement: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState<OpportunityExt[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todas');
  const [activeSector, setActiveSector] = useState('');
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [oppsData, companiesData, appsData] = await Promise.all([
          getOpportunities(),
          getCompanies(),
          getApplications()
        ]);
        setOpportunities(oppsData as any);
        setCompanies(companiesData as any);
        setApplications(appsData as any);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
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

  // Estadísticas calculadas
  const stats = {
    total: opportunities.length,
    active: opportunities.filter(o => o.status === 'published').length,
    applicants: applications.length
  };

  const filteredOpps = useMemo(() => {
    return opportunities.filter(opp => {
      const matchesSearch = getTranslatedText(opp.title).toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (opp.ref || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'Todas' || 
                           (statusFilter === 'Abiertas' && opp.status === 'published') ||
                           (statusFilter === 'Cerradas' && opp.status === 'closed') ||
                           (statusFilter === 'Borradores' && opp.status === 'under_review');
      const matchesSector = !activeSector || opp.category === activeSector;
      
      return matchesSearch && matchesStatus && matchesSector;
    });
  }, [searchQuery, statusFilter, activeSector, i18n.language, opportunities]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            Abierta
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-400">
            <span className="size-1.5 rounded-full bg-red-500 mr-2"></span>
            Cerrada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-700 dark:text-slate-300">
            <span className="size-1.5 rounded-full bg-slate-400 mr-2"></span>
            Borrador
          </span>
        );
    }
  };

  const getSectorIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'mantenimiento': return 'handyman';
      case 'logística': return 'local_shipping';
      case 'ingeniería': return 'engineering';
      case 'catering': return 'restaurant';
      case 'seguridad': return 'security';
      default: return 'work';
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-2">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Inicio</span>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <span className="text-primary">Oportunidades</span>
          </nav>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Gestión de Oportunidades</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic max-w-2xl">Supervise las licitaciones, gestione convocatorias activas y revise las aplicaciones de empresas.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowCSVModal(true)}
            className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">upload_file</span>
            Carga Masiva (CSV)
          </button>
          <button 
            onClick={() => navigate('/dashboard/company/opportunities/new')}
            className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">add_circle</span>
            Crear Oportunidad
          </button>
        </div>
      </header>

      {/* CSV Upload Modal */}
      {showCSVModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={() => setShowCSVModal(false)}></div>
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <header className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Carga Masiva de Oportunidades</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Sube múltiples licitaciones mediante un archivo CSV</p>
              </div>
              <button onClick={() => setShowCSVModal(false)} className="size-12 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>

            <div className="p-10 space-y-10">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-3xl border border-blue-100 dark:border-blue-800 flex items-start gap-6">
                <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                  <span className="material-symbols-outlined">download</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Descargar Plantilla</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">Utiliza nuestra plantilla oficial para asegurar que los datos se importen correctamente. Incluye campos para ES, EN y FR.</p>
                  <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline mt-2 flex items-center gap-2">
                    Descargar template_oportunidades.csv
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seleccionar Archivo CSV</label>
                <div className="relative group">
                  <input 
                    type="file" 
                    accept=".csv"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setCsvFile(file);
                    }}
                  />
                  <div className={`w-full border-2 border-dashed rounded-[2.5rem] p-12 text-center transition-all ${
                    csvFile ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-700 group-hover:border-primary group-hover:bg-slate-50 dark:group-hover:bg-slate-800/50'
                  }`}>
                    <span className={`material-symbols-outlined text-5xl mb-4 ${csvFile ? 'text-emerald-500' : 'text-slate-300'}`}>
                      {csvFile ? 'check_circle' : 'cloud_upload'}
                    </span>
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                      {csvFile ? csvFile.name : 'Arrastra tu archivo aquí o haz clic'}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Formatos aceptados: .csv (Máx 10MB)</p>
                  </div>
                </div>
              </div>

              {csvFile && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-emerald-500">description</span>
                    <div>
                      <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{csvFile.name}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{(csvFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button onClick={() => setCsvFile(null)} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-xl transition-all">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              )}
            </div>

            <footer className="p-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex gap-4">
              <button onClick={() => setShowCSVModal(false)} className="flex-1 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 rounded-2xl hover:bg-slate-50 transition-all">Cancelar</button>
              <button 
                disabled={!csvFile}
                className={`flex-1 py-5 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all active:scale-95 ${
                  csvFile ? 'bg-primary text-white shadow-blue-500/20 hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Procesar e Importar
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <OpportunityStats stats={stats} />

      {/* Filters Section */}
      <OpportunityFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        activeSector={activeSector}
        setActiveSector={setActiveSector}
      />

      {/* Main List */}
      <OpportunityList 
        filteredOpps={filteredOpps}
        getStatusBadge={getStatusBadge}
        getSectorIcon={getSectorIcon}
        companies={companies}
      />

      {/* Admin Tip */}
      <div className="bg-blue-900 rounded-[2.5rem] p-10 text-white flex items-start gap-8 relative overflow-hidden shadow-2xl">
        <div className="size-16 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center shrink-0 border border-white/20">
          <span className="material-symbols-outlined text-3xl">lightbulb</span>
        </div>
        <div className="space-y-3 relative z-10">
          <h4 className="text-xl font-black uppercase tracking-tight">Consejo de Administrador</h4>
          <p className="text-blue-100 text-sm font-medium leading-relaxed uppercase tracking-wide italic">
            Recuerda que todos los campos de texto para nuevas oportunidades soportan entrada multi-idioma. Usa las pestañas ES/EN/FR en el formulario de creación para asegurar el alcance a proveedores internacionales y cumplir con el decreto de transparencia.
          </p>
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mb-32"></div>
      </div>

      <footer className="text-center opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Ministerio de Hidrocarburos y Desarrollo Minero • Dirección de Contenido Nacional • 2024</p>
      </footer>
    </div>
  );
};

export default OpportunityManagement;
