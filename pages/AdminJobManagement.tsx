import React, { useState, useEffect } from 'react';
import { getJobOffers, getCompanies, createJobOffer, updateJobOffer, deleteJobOffer } from '../services/supabaseApi';
import { JobOffer, Company } from '../types';
import { Briefcase, Search, Plus, Edit2, Trash2, Filter, Eye, Building, MapPin, DollarSign, Tag, CheckCircle, Clock, XCircle, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

const AdminJobManagement: React.FC = () => {
  console.log("AdminJobManagement rendering");
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
    
    const matchesStatus = selectedStatus === 'all' || job.status === selectedStatus;
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
    <div className="p-8 space-y-10 animate-in fade-in duration-500">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            Panel de Control
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mt-2">
            Gestión Global de Empleos
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
            Administre, audite y publique vacantes laborales para todas las operadoras y PYMEs del sector.
          </p>
        </div>
        <button 
          onClick={handleOpenCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 transition-all flex items-center gap-3 active:scale-95"
        >
          <Plus size={16} /> Publicar Vacante
        </button>
      </div>

      {/* Bento Grid Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-sm">
          <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Briefcase size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Vacantes</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{totalJobs}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-sm">
          <div className="size-12 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Activas / Publicadas</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{activeJobs}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-sm">
          <div className="size-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">En Borrador</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{draftJobs}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 shadow-sm">
          <div className="size-12 rounded-2xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <XCircle size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cerradas / Archivadas</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{closedJobs}</p>
          </div>
        </div>
      </div>

      {/* Filters and search block */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por puesto, empresa o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none"
          />
        </div>

        <div className="flex gap-4 w-full md:w-auto shrink-0">
          <div className="flex-1 md:flex-none">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              <option value="all">TODOS LOS ESTADOS</option>
              <option value="published">PUBLICADOS</option>
              <option value="draft">BORRADORES</option>
              <option value="closed">CERRADOS</option>
            </select>
          </div>

          <div className="flex-1 md:flex-none">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500/20 transition-all"
            >
              <option value="all">TODAS LAS CATEGORÍAS</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.toUpperCase()}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table listing */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col justify-center items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Cargando Empleos...</span>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">Oferta / Vacante</th>
                  <th className="px-8 py-5">Empresa</th>
                  <th className="px-8 py-5">Ubicación y Salario</th>
                  <th className="px-8 py-5">Categoría</th>
                  <th className="px-8 py-5">Estado</th>
                  <th className="px-8 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredJobs.map((job) => {
                  const jobTitle = typeof job.title === 'object' ? (job.title.es || job.title.en) : job.title;
                  const companyName = (job as any).company?.name || 'Portal de Contenido Nacional';
                  return (
                    <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-tight">
                            {jobTitle}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-2">
                            <span>ID: {job.id.slice(0, 8)}</span>
                            {job.tags && job.tags.length > 0 && (
                              <span className="flex gap-1">
                                • {job.tags.slice(0, 2).map((t, i) => (
                                  <span key={i} className="bg-slate-100 dark:bg-slate-800 text-[9px] px-1.5 py-0.5 rounded text-slate-500">
                                    {t}
                                  </span>
                                ))}
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                          <Building size={14} className="text-slate-400" />
                          <span className="text-xs font-bold uppercase">{companyName}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                            <MapPin size={12} />
                            <span>{job.location}</span>
                          </div>
                          {job.salary && (
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                              <DollarSign size={10} />
                              <span>{job.salary}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 rounded">
                          {job.category || 'General'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          job.status === 'published' || job.status === 'active'
                            ? 'bg-green-50 text-green-700 border border-green-200/50' 
                            : job.status === 'draft'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                            : 'bg-slate-50 text-slate-600 border border-slate-200/50'
                        }`}>
                          <span className={`size-1.5 rounded-full ${
                            job.status === 'published' || job.status === 'active'
                              ? 'bg-green-500'
                              : job.status === 'draft'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}></span>
                          {job.status === 'published' || job.status === 'active' ? 'Publicado' : job.status === 'draft' ? 'Borrador' : 'Cerrado'}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleOpenEditModal(job)}
                            className="size-8 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-500 hover:text-blue-600 flex items-center justify-center transition-all"
                            title="Editar vacante"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button 
                            onClick={() => handleDeleteJob(job.id)}
                            className="size-8 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-all"
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
        ) : (
          <div className="p-20 text-center text-slate-400 font-bold italic">
            No se encontraron vacantes con los filtros seleccionados.
          </div>
        )}
      </div>

      {/* CREATE & EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            {/* Modal header */}
            <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {editingJob ? 'Editar Vacante Laboral' : 'Publicar Nueva Vacante'}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  Rellene los detalles para publicar la oferta de empleo en el portal público.
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-colors"
              >
                <XCircle size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveJob} className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6">
              {/* Row 1: Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título del Puesto (Español) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formState.title_es}
                    onChange={(e) => setFormState({ ...formState, title_es: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                    placeholder="Ej: Ingeniero de Perforación Sr."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título del Puesto (Inglés)</label>
                  <input
                    type="text"
                    value={formState.title_en}
                    onChange={(e) => setFormState({ ...formState, title_en: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                    placeholder="Ej: Sr. Drilling Engineer"
                  />
                </div>
              </div>

              {/* Row 2: Company selection and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Asignar a Empresa <span className="text-red-500">*</span></label>
                  <select
                    value={formState.companyId}
                    onChange={(e) => setFormState({ ...formState, companyId: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                  >
                    <option value="">-- Seleccione una Empresa --</option>
                    {companies.map(comp => (
                      <option key={comp.id} value={comp.id}>{comp.name.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ubicación <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formState.location}
                    onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                    placeholder="Ej: Malabo (Offshore) o Bata"
                  />
                </div>
              </div>

              {/* Row 3: Salary and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Salario / Compensación (Opcional)</label>
                  <input
                    type="text"
                    value={formState.salary}
                    onChange={(e) => setFormState({ ...formState, salary: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                    placeholder="Ej: A convenir o 1,500,000 XAF"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Categoría <span className="text-red-500">*</span></label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Status and Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estado de Publicación</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                  >
                    <option value="published">Publicado / Activo</option>
                    <option value="draft">Borrador</option>
                    <option value="closed">Cerrado</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tags / Etiquetas (Separados por coma)</label>
                  <input
                    type="text"
                    value={formState.tagsRaw}
                    onChange={(e) => setFormState({ ...formState, tagsRaw: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
                    placeholder="Ej: Senior, Rotación 28/28, Inglés"
                  />
                </div>
              </div>

              {/* Row 5: Descriptions */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descripción (Español) <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={4}
                  value={formState.description_es}
                  onChange={(e) => setFormState({ ...formState, description_es: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                  placeholder="Describa el puesto, requisitos y responsabilidades..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Descripción (Inglés)</label>
                <textarea
                  rows={4}
                  value={formState.description_en}
                  onChange={(e) => setFormState({ ...formState, description_en: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 text-xs font-bold focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
                  placeholder="Job description, requirements and responsibilities in English..."
                />
              </div>

              {/* Form buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-8 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all"
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
