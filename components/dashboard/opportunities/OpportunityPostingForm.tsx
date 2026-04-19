import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjects, createOpportunity } from '../../../services/supabaseApi';
import { Project, Language } from '../../../types';
import { Loader2, Plus, X } from 'lucide-react';

const OpportunityPostingForm: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">Proyecto Relacionado <span className="text-red-500">*</span></label>
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
    </div>
  );
};

export default OpportunityPostingForm;
