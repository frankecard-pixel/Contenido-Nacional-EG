
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { FileText, Plus, Edit, Trash2, Save, X, Loader2 } from 'lucide-react';

const ContractTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from('contract_templates').select('*');
    if (data) setTemplates(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!supabase || !editingTemplate) return;
    setSaving(true);
    
    const { error } = editingTemplate.id 
      ? await supabase.from('contract_templates').update(editingTemplate).eq('id', editingTemplate.id)
      : await supabase.from('contract_templates').insert([editingTemplate]);
    
    if (!error) {
      setEditingTemplate(null);
      await fetchTemplates();
    }
    setSaving(false);
  };

  const deleteTemplate = async (id: string) => {
    if (!supabase || !window.confirm('¿Eliminar este template?')) return;
    await supabase.from('contract_templates').delete().eq('id', id);
    await fetchTemplates();
  };

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Templates de Contratos</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Gestión de modelos para firma electrónica</p>
        </div>
        <button 
          onClick={() => setEditingTemplate({ name: '', content: '', type: 'registration' })}
          className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Nuevo Template
        </button>
      </header>

      {editingTemplate ? (
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-10 space-y-8 animate-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {editingTemplate.id ? 'Editar Template' : 'Nuevo Template'}
            </h3>
            <button onClick={() => setEditingTemplate(null)} className="text-slate-400 hover:text-rose-500 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Nombre del Template</label>
              <input
                type="text"
                value={editingTemplate.title || editingTemplate.name || ''}
                onChange={e => setEditingTemplate({ ...editingTemplate, title: e.target.value, name: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white"
                placeholder="Contrato de Registro de Empresa"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Contenido (HTML/Markdown)</label>
              <textarea
                value={editingTemplate.content}
                onChange={e => setEditingTemplate({ ...editingTemplate, content: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all dark:text-white h-96 resize-none"
                placeholder="Use {{company_name}}, {{tax_id}}, {{date}} como variables..."
              />
            </div>

            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setEditingTemplate(null)}
                className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/30 flex items-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar Template
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full py-20 flex justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
          ) : templates.length === 0 ? (
            <div className="col-span-full py-20 text-center opacity-50 italic uppercase text-[10px] font-black tracking-widest">No hay templates configurados</div>
          ) : (
            templates.map(t => (
              <div key={t.id} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group">
                <div className="size-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">{t.title || t.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 line-clamp-2">{t.content}</p>
                <div className="flex justify-between items-center pt-6 border-t border-slate-50 dark:border-slate-700">
                  <button onClick={() => setEditingTemplate(t)} className="text-primary hover:text-blue-700 p-2 transition-colors">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => deleteTemplate(t.id)} className="text-rose-400 hover:text-rose-600 p-2 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ContractTemplates;
