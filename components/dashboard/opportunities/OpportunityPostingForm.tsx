import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createOpportunity, createProject } from '../../../services/supabaseApi';
import { Project, Language } from '../../../types';
import { Loader2, Plus, X } from 'lucide-react';

const OpportunityPostingForm: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [formData, setFormData] = useState({
    title: { es: '', en: '', fr: '' },
    description: { es: '', en: '', fr: '' },
    category: 'Mantenimiento y Operaciones',
    budget: 0,
    deadline: '',
    projectId: '',
    scopeOfWork: '',
    awardedAmount: 0,
    location: '',
    ref: `OPP-${Date.now().toString().slice(-6)}`,
    tag: 'Nacional',
    requirements: [] as string[]
  });

  const [newRequirement, setNewRequirement] = useState('');

  const categories = [
    'Servicios de Ingeniería',
    'Suministros Industriales',
    'Mantenimiento y Operaciones',
    'Logística y Transporte',
    'Seguridad y Medio Ambiente',
    'Construcción y Obras Civiles',
    'Consultoría y Auditoría',
    'Tecnología y Digitalización',
    'Catering y Servicios de Hostelería',
    'Gestión de Residuos',
    'Recursos Humanos y Formación',
    'Exploración y Producción',
    'Refino y Petroquímica',
    'Energías Renovables',
    'Servicios Jurídicos y Legales',
    'Telecomunicaciones',
    'Servicios Médicos y Salud'
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data as Project[]);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await createOpportunity(formData as any);
      alert("Oportunidad creada con éxito");
      navigate(-1);
    } catch (error) {
      console.error("Error creating opportunity:", error);
      alert("Error al crear la oportunidad");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      alert("El nombre del proyecto es obligatorio");
      return;
    }
    setIsCreatingProject(true);
    try {
      const created = await createProject({
        name: newProjectName.trim(),
        description: newProjectDesc.trim(),
        status: 'active'
      });
      if (created) {
        setProjects(prev => [created, ...prev]);
        setFormData(prev => ({ ...prev, projectId: created.id }));
        setIsProjectModalOpen(false);
        setNewProjectName('');
        setNewProjectDesc('');
        alert("¡Proyecto creado y seleccionado automáticamente!");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("No se pudo crear el proyecto");
    } finally {
      setIsCreatingProject(false);
    }
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, newRequirement.trim()]
      });
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index)
    });
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-10 animate-in fade-in duration-500">
      <div className="pb-8 border-b border-slate-100 dark:border-slate-700">
        <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Crear Nueva Oportunidad de Negocio</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Complete los detalles para publicar una nueva licitación o oportunidad de negocio vinculada a un proyecto.</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Título de la Oportunidad (ES) <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={formData.title.es}
              onChange={(e) => setFormData({ ...formData, title: { ...formData.title, es: e.target.value } })}
              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all" 
            />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Proyecto Relacionado <span className="text-red-500">*</span></label>
              <button 
                type="button"
                onClick={() => setIsProjectModalOpen(true)}
                className="text-[10px] font-black text-primary hover:text-blue-700 uppercase tracking-widest flex items-center gap-1 cursor-pointer"
              >
                <Plus size={12} />
                Nuevo Proyecto
              </button>
            </div>
            <select 
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="">Seleccionar Proyecto...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Categoría/Sector <span className="text-red-500">*</span></label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Monto Adjudicado (USD) <span className="text-slate-400 font-medium">(Opcional)</span></label>
            <input 
              type="number" 
              value={formData.awardedAmount}
              onChange={(e) => setFormData({ ...formData, awardedAmount: Number(e.target.value) })}
              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all" 
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Referencia <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={formData.ref}
              onChange={(e) => setFormData({ ...formData, ref: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all" 
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Localización <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all" 
              placeholder="Ej: Malabo, Bata, Offshore..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Etiqueta / Tipo</label>
            <select 
              value={formData.tag}
              onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="Nacional">Nacional</option>
              <option value="Internacional">Internacional</option>
              <option value="Mixto">Mixto</option>
              <option value="PYME">Solo PYMES</option>
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Fecha Límite <span className="text-red-500">*</span></label>
            <input 
              type="date" 
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all" 
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Alcance del Trabajo (Scope of Work) <span className="text-red-500">*</span></label>
          <textarea 
            rows={4} 
            value={formData.scopeOfWork}
            onChange={(e) => setFormData({ ...formData, scopeOfWork: e.target.value })}
            className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-3xl p-6 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all resize-none" 
            placeholder="Describa detalladamente el alcance técnico y operativo..."
          />
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Requisitos Clave</label>
          <div className="flex gap-3">
            <input 
              type="text" 
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
              className="flex-1 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all" 
              placeholder="Ej: Certificación ISO 9001..."
            />
            <button 
              onClick={addRequirement}
              className="px-6 bg-slate-100 dark:bg-slate-800 rounded-2xl text-primary hover:bg-primary hover:text-white transition-all"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {formData.requirements.map((req, i) => (
              <span key={i} className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                {req}
                <button onClick={() => removeRequirement(i)}><X size={12} /></button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-10 border-t border-slate-100 dark:border-slate-700">
          <button onClick={() => navigate(-1)} className="px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Cancelar</button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            Publicar Oportunidad
          </button>
        </div>
      </div>

      {/* DIALOG FOR QUICK PROJECT CREATION */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-lg p-10 border border-slate-100 dark:border-slate-700/60 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
              <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">folder</span>
                Nuevo Proyecto Relacionado
              </h4>
              <button 
                type="button" 
                onClick={() => setIsProjectModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Nombre del Proyecto <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all" 
                  placeholder="Ej: Ampliación de Planta Turbogás..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Descripción <span className="text-slate-400 font-medium">(Opcional)</span></label>
                <textarea 
                  rows={3} 
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary transition-all resize-none" 
                  placeholder="Escriba los detalles generales del proyecto..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button 
                type="button" 
                onClick={() => setIsProjectModalOpen(false)}
                className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={handleCreateProject}
                disabled={isCreatingProject}
                className="px-6 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isCreatingProject ? <Loader2 className="animate-spin" size={14} /> : null}
                Crear Proyecto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpportunityPostingForm;
