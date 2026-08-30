import React, { useState, useEffect } from 'react';
import { getJobOffers, getCompanies, createJobOffer, updateJobOffer, deleteJobOffer } from '../services/supabaseApi';
import { JobOffer, Company } from '../types';
import { Briefcase, Search, Plus, Edit2, Trash2, Filter, Eye, Building, MapPin, DollarSign, Tag, CheckCircle, Clock, XCircle, ChevronDown, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';

const AdminJobManagement: React.FC = () => {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOffer | null>(null);
  const [formState, setFormState] = useState({
    title_es: '',
    title_en: '',
    companyId: '',
    location: '',
    salary: '',
    category: '',
    status: 'published' as 'published' | 'draft' | 'closed',
    tagsRaw: '',
    description_es: '',
    description_en: ''
  });

  const categories = [
    'Petróleo y Gas',
    'Ingeniería',
    'Logística',
    'Administración',
    'Finanzas y Contabilidad',
    'Seguridad y Medio Ambiente',
    'Tecnología y Sistemas',
    'Operaciones de Campo',
    'Mantenimiento'
  ];

  const fetchJobsAndCompanies = async () => {
    try {
      setLoading(true);
      const [jobsData, companiesData] = await Promise.all([
        getJobOffers(),
        getCompanies()
      ]);
      setJobs(jobsData as any[]);
      setCompanies(companiesData as any[]);
    } catch (error) {
      console.error('Error fetching admin jobs data:', error);
      toast.error('No se pudieron cargar los datos de empleos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndCompanies();
  }, []);

  // Filtered jobs logic
  const filteredJobs = jobs.filter((job) => {
    const jobTitle = typeof job.title === 'object' ? (job.title.es || job.title.en || '') : (job.title || '');
    const companyName = (job as any).company?.name || '';
    const matchesSearch = 
      jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus || (selectedStatus === 'published' && job.status === 'active');
    const matchesCategory = selectedCategory === 'all' || job.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Stats calculations
  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status === 'published' || j.status === 'active').length;
  const draftJobs = jobs.filter(j => j.status === 'draft').length;
  const closedJobs = jobs.filter(j => j.status === 'closed').length;

  const handleOpenCreateModal = () => {
    setEditingJob(null);
    setFormState({
      title_es: '',
      title_en: '',
      companyId: companies[0]?.id || '',
      location: '',
      salary: '',
      category: categories[0],
      status: 'published',
      tagsRaw: '',
      description_es: '',
      description_en: ''
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (job: JobOffer) => {
    setEditingJob(job);
    const titleObj = typeof job.title === 'object' ? job.title : { es: job.title || '', en: job.title || '' };
    const descObj = typeof job.description === 'object' ? job.description : { es: job.description || '', en: job.description || '' };
    
    setFormState({
      title_es: titleObj.es || '',
      title_en: titleObj.en || '',
      companyId: job.companyId || (job as any).company_id || '',
      location: job.location || '',
      salary: job.salary || '',
      category: job.category || categories[0],
      status: (job.status === 'active' ? 'published' : job.status) as any || 'published',
      tagsRaw: Array.isArray(job.tags) ? job.tags.join(', ') : '',
      description_es: descObj.es || '',
      description_en: descObj.en || ''
    });
    setShowModal(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title_es || !formState.description_es || !formState.location) {
      toast.warning('Por favor rellene todos los campos requeridos en español');
      return;
    }

    const payload = {
      title: {
        es: formState.title_es,
        en: formState.title_en || formState.title_es
      },
      description: {
        es: formState.description_es,
        en: formState.description_en || formState.description_es
      },
      companyId: formState.companyId,
      location: formState.location,
      salary: formState.salary,
      category: formState.category,
      status: formState.status,
      tags: formState.tagsRaw.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    try {
      if (editingJob) {
        await updateJobOffer(editingJob.id, payload);
        toast.success('Oferta de empleo actualizada con éxito');
      } else {
        await createJobOffer(payload);
        toast.success('Nueva oferta de empleo publicada con éxito');
      }
      setShowModal(false);
      fetchJobsAndCompanies();
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Hubo un error al guardar la oferta de empleo');
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta vacante de forma permanente?')) {
      try {
        await deleteJobOffer(id);
        toast.success('Vacante eliminada correctamente');
        fetchJobsAndCompanies();
      } catch (error) {
        console.error('Error deleting job:', error);
        toast.error('Error al eliminar la vacante');
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full inline-block">
            Panel de Control
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            Gestión Global de Empleos
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
            Administre, audite y publique vacantes laborales para todas las operadoras y PYMEs del sector.
          </p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 sm:px-7 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2.5 active:scale-95 shrink-0"
        >
          <Plus className="size-4" /> 
          <span>Publicar Vacante</span>
        </button>
      </div>

      {/* Aesthetic Bento Grid Analytics (2 per row on mobile, 4 on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
        <div 
          onClick={() => setSelectedStatus('all')}
          className={`cursor-pointer p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-200 hover:scale-[1.01] ${
            selectedStatus === 'all' 
              ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 shadow-md ring-2 ring-blue-500/20' 
              : 'bg-white dark:bg-slate-800/90 border-slate-100 dark:border-slate-700/80 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Total Vacantes
            </span>
            <div className="size-7 sm:size-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Briefcase className="size-3.5 sm:size-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {totalJobs}
          </p>
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 block mt-1">
            Ofertas en sistema
          </span>
        </div>

        <div 
          onClick={() => setSelectedStatus('published')}
          className={`cursor-pointer p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-200 hover:scale-[1.01] ${
            selectedStatus === 'published' 
              ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 shadow-md ring-2 ring-emerald-500/20' 
              : 'bg-white dark:bg-slate-800/90 border-slate-100 dark:border-slate-700/80 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Activas / Publicadas
            </span>
            <div className="size-7 sm:size-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle className="size-3.5 sm:size-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            {activeJobs}
          </p>
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 block mt-1">
            Visibles al público
          </span>
        </div>

        <div 
          onClick={() => setSelectedStatus('draft')}
          className={`cursor-pointer p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-200 hover:scale-[1.01] ${
            selectedStatus === 'draft' 
              ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 shadow-md ring-2 ring-amber-500/20' 
              : 'bg-white dark:bg-slate-800/90 border-slate-100 dark:border-slate-700/80 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider">
              En Borrador
            </span>
            <div className="size-7 sm:size-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="size-3.5 sm:size-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
            {draftJobs}
          </p>
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 block mt-1">
            En preparación
          </span>
        </div>

        <div 
          onClick={() => setSelectedStatus('closed')}
          className={`cursor-pointer p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all duration-200 hover:scale-[1.01] ${
            selectedStatus === 'closed' 
              ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700 shadow-md ring-2 ring-rose-500/20' 
              : 'bg-white dark:bg-slate-800/90 border-slate-100 dark:border-slate-700/80 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Cerradas / Archivadas
            </span>
            <div className="size-7 sm:size-9 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <XCircle className="size-3.5 sm:size-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
            {closedJobs}
          </p>
          <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 block mt-1">
            Proceso finalizado
          </span>
        </div>
      </div>

      {/* Filters and search block - Fully Responsive */}
      <div className="bg-white dark:bg-slate-800/90 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-700/80 shadow-xs space-y-3">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Buscar por puesto, empresa o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/60 rounded-xl sm:rounded-2xl pl-10 pr-9 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-3.5 text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none cursor-pointer"
            >
              <option value="all">TODOS LOS ESTADOS</option>
              <option value="published">PUBLICADOS / ACTIVOS</option>
              <option value="draft">BORRADORES</option>
              <option value="closed">CERRADOS</option>
            </select>
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/60 rounded-xl py-2.5 px-3.5 text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none cursor-pointer"
            >
              <option value="all">TODAS LAS CATEGORÍAS</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Jobs Listing Container */}
      {loading ? (
        <div className="py-16 flex flex-col justify-center items-center gap-3">
          <div className="animate-spin rounded-full size-10 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">Cargando Empleos...</span>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-3xl border border-slate-100 dark:border-slate-700 text-center space-y-3">
          <div className="size-14 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400">
            <Briefcase className="size-7" />
          </div>
          <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
            No se encontraron vacantes
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Pruebe modificando los términos de búsqueda o restableciendo los filtros de categoría y estado.
          </p>
          {(searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all') && (
            <button
              onClick={() => { setSearchTerm(''); setSelectedStatus('all'); setSelectedCategory('all'); }}
              className="mt-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              Restablecer Filtros
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile Cards List View (Visible on < md screens) */}
          <div className="grid grid-cols-1 gap-3.5 md:hidden">
            {filteredJobs.map((job) => {
              const jobTitle = typeof job.title === 'object' ? (job.title.es || job.title.en) : job.title;
              const companyName = (job as any).company?.name || 'Portal de Contenido Nacional';
              const isPublished = job.status === 'published' || job.status === 'active';
              const isDraft = job.status === 'draft';

              return (
                <div 
                  key={job.id} 
                  className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded uppercase">
                        {job.category || 'General'}
                      </span>
                      <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight line-clamp-2 mt-1">
                        {jobTitle}
                      </h3>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0 ${
                      isPublished
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' 
                        : isDraft
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {isPublished ? 'Publicado' : isDraft ? 'Borrador' : 'Cerrado'}
                    </span>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl space-y-1.5 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <Building className="size-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{companyName}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3 text-primary shrink-0" /> {job.location}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <DollarSign className="size-3 shrink-0" /> {job.salary}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/60">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      ID: {job.id.slice(0, 8)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => handleOpenEditModal(job)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 hover:bg-blue-100 transition-colors"
                      >
                        <Edit2 className="size-3" />
                        <span>Editar</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleDeleteJob(job.id)}
                        className="px-3 py-1.5 bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 hover:bg-rose-100 transition-colors"
                      >
                        <Trash2 className="size-3" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table View (Visible on >= md screens) */}
          <div className="hidden md:block bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <tr>
                    <th className="px-6 py-4">Oferta / Vacante</th>
                    <th className="px-6 py-4">Empresa</th>
                    <th className="px-6 py-4">Ubicación y Salario</th>
                    <th className="px-6 py-4">Categoría</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {filteredJobs.map((job) => {
                    const jobTitle = typeof job.title === 'object' ? (job.title.es || job.title.en) : job.title;
                    const companyName = (job as any).company?.name || 'Portal de Contenido Nacional';
                    const isPublished = job.status === 'published' || job.status === 'active';
                    const isDraft = job.status === 'draft';

                    return (
                      <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">
                              {jobTitle}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-2">
                              <span>ID: {job.id.slice(0, 8)}</span>
                              {job.tags && job.tags.length > 0 && (
                                <span className="flex gap-1">
                                  • {job.tags.slice(0, 2).map((t, i) => (
                                    <span key={i} className="bg-slate-100 dark:bg-slate-900 text-[9px] px-1.5 py-0.5 rounded text-slate-500">
                                      {t}
                                    </span>
                                  ))}
                                </span>
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                            <Building size={14} className="text-slate-400" />
                            <span className="text-xs font-bold uppercase">{companyName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                              <MapPin size={12} className="text-primary" />
                              <span>{job.location}</span>
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                                <DollarSign size={10} />
                                <span>{job.salary}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded">
                            {job.category || 'General'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            isPublished
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' 
                              : isDraft
                              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}>
                            <span className={`size-1.5 rounded-full ${
                              isPublished ? 'bg-emerald-500' : isDraft ? 'bg-amber-500' : 'bg-slate-400'
                            }`}></span>
                            {isPublished ? 'Publicado' : isDraft ? 'Borrador' : 'Cerrado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleOpenEditModal(job)}
                              className="size-8 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 hover:text-blue-600 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all"
                              title="Editar vacante"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button 
                              onClick={() => handleDeleteJob(job.id)}
                              className="size-8 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 hover:text-rose-600 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-all"
                              title="Eliminar vacante"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* CREATE & EDIT MODAL - FULLY RESPONSIVE */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[2000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl sm:rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal header */}
            <div className="bg-slate-50 dark:bg-slate-800/50 px-5 sm:px-8 py-4 sm:py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {editingJob ? 'Editar Vacante Laboral' : 'Publicar Nueva Vacante'}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400 font-medium mt-0.5">
                  Rellene los detalles para publicar la oferta de empleo en el portal público.
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="size-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-colors shrink-0"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveJob} className="p-5 sm:p-8 overflow-y-auto space-y-4 sm:space-y-6 flex-1 text-xs">
              {/* Row 1: Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título del Puesto (Español) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formState.title_es}
                    onChange={(e) => setFormState({ ...formState, title_es: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white"
                    placeholder="Ej: Ingeniero de Perforación Sr."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título del Puesto (Inglés)</label>
                  <input
                    type="text"
                    value={formState.title_en}
                    onChange={(e) => setFormState({ ...formState, title_en: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white"
                    placeholder="Ej: Sr. Drilling Engineer"
                  />
                </div>
              </div>

              {/* Row 2: Company selection and Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asignar a Empresa <span className="text-red-500">*</span></label>
                  <select
                    value={formState.companyId}
                    onChange={(e) => setFormState({ ...formState, companyId: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white cursor-pointer"
                  >
                    <option value="">-- Seleccione una Empresa --</option>
                    {companies.map(comp => (
                      <option key={comp.id} value={comp.id}>{comp.name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ubicación <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formState.location}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white"
                    placeholder="Ej: Malabo (Offshore) o Bata"
                  />
                </div>
              </div>

              {/* Row 3: Salary and Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Salario / Compensación (Opcional)</label>
                  <input
                    type="text"
                    value={formState.salary}
                    onChange={(e) => setFormState({ ...formState, salary: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white"
                    placeholder="Ej: A convenir o 1,500,000 XAF"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categoría <span className="text-red-500">*</span></label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Status and Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado de Publicación</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white cursor-pointer"
                  >
                    <option value="published">Publicado / Activo</option>
                    <option value="draft">Borrador</option>
                    <option value="closed">Cerrado</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tags / Etiquetas (Separados por coma)</label>
                  <input
                    type="text"
                    value={formState.tagsRaw}
                    onChange={(e) => setFormState({ ...formState, tagsRaw: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white"
                    placeholder="Ej: Senior, Rotación 28/28, Inglés"
                  />
                </div>
              </div>

              {/* Row 5: Descriptions */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descripción (Español) <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={3}
                  value={formState.description_es}
                  onChange={(e) => setFormState({ ...formState, description_es: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 outline-none resize-none dark:text-white"
                  placeholder="Describa el puesto, requisitos y responsabilidades..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descripción (Inglés)</label>
                <textarea
                  rows={3}
                  value={formState.description_en}
                  onChange={(e) => setFormState({ ...formState, description_en: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-xs font-medium focus:ring-2 focus:ring-blue-500/20 outline-none resize-none dark:text-white"
                  placeholder="Job description, requirements and responsibilities in English..."
                />
              </div>

              {/* Form buttons */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-200 transition-colors text-center"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all text-center active:scale-95"
                >
                  {editingJob ? 'Guardar Cambios' : 'Publicar Vacante'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminJobManagement;
