import React from 'react';

const ContactForm: React.FC = () => {
  return (
    <div className="lg:col-span-8 bg-white dark:bg-[#1a2332] rounded-[3.5rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
      <div className="p-10 lg:p-14">
        <h2 className="text-slate-900 dark:text-white text-2xl font-black uppercase tracking-tight mb-10">Envíenos un mensaje</h2>
        <form action="#" className="flex flex-col gap-8" method="POST" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <label className="flex flex-col gap-3">
              <p className="text-slate-900 dark:text-gray-200 text-[10px] font-black uppercase tracking-widest">Nombre Completo <span className="text-red-500">*</span></p>
              <input 
                className="w-full rounded-2xl text-slate-900 dark:text-white border-none bg-slate-50 dark:bg-slate-800 py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                placeholder="Ej. Juan Nsue" 
                required 
                type="text"
              />
            </label>
            <label className="flex flex-col gap-3">
              <p className="text-slate-900 dark:text-gray-200 text-[10px] font-black uppercase tracking-widest">Empresa / Entidad <span className="text-red-500">*</span></p>
              <input 
                className="w-full rounded-2xl text-slate-900 dark:text-white border-none bg-slate-50 dark:bg-slate-800 py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                placeholder="Nombre de su empresa" 
                required 
                type="text"
              />
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <label className="flex flex-col gap-3">
              <p className="text-slate-900 dark:text-gray-200 text-[10px] font-black uppercase tracking-widest">Correo Electrónico Corporativo <span className="text-red-500">*</span></p>
              <input 
                className="w-full rounded-2xl text-slate-900 dark:text-white border-none bg-slate-50 dark:bg-slate-800 py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                placeholder="contacto@empresa.com" 
                required 
                type="email"
              />
            </label>
            <label className="flex flex-col gap-3">
              <p className="text-slate-900 dark:text-gray-200 text-[10px] font-black uppercase tracking-widest">Teléfono</p>
              <input 
                className="w-full rounded-2xl text-slate-900 dark:text-white border-none bg-slate-50 dark:bg-slate-800 py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none" 
                placeholder="+240 ..." 
                type="tel"
              />
            </label>
          </div>

          <label className="flex flex-col gap-3">
            <p className="text-slate-900 dark:text-gray-200 text-[10px] font-black uppercase tracking-widest">Asunto <span className="text-red-500">*</span></p>
            <div className="relative">
              <select 
                className="w-full rounded-2xl text-slate-900 dark:text-white border-none bg-slate-50 dark:bg-slate-800 py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none appearance-none" 
                required
                defaultValue=""
              >
                <option disabled value="">Seleccione el motivo de su consulta</option>
                <option value="registro">Registro de Proveedores</option>
                <option value="normativa">Cumplimiento Normativo</option>
                <option value="soporte">Soporte Técnico</option>
                <option value="oportunidades">Oportunidades de Negocio</option>
                <option value="otros">Otros</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-slate-400">
                <span className="material-symbols-outlined">expand_more</span>
              </div>
            </div>
          </label>

          <label className="flex flex-col gap-3">
            <p className="text-slate-900 dark:text-gray-200 text-[10px] font-black uppercase tracking-widest">Mensaje <span className="text-red-500">*</span></p>
            <textarea 
              className="w-full rounded-2xl text-slate-900 dark:text-white border-none bg-slate-50 dark:bg-slate-800 py-4 px-6 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none min-h-[160px] resize-none" 
              placeholder="Describa su consulta con el mayor detalle posible..." 
              required 
              rows={4}
            ></textarea>
          </label>

          <div className="flex items-center justify-end pt-4">
            <button className="flex items-center justify-center gap-3 rounded-2xl h-16 px-10 bg-primary hover:bg-blue-700 text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-500/20 active:scale-95 group" type="submit">
              <span>Enviar Consulta Oficial</span>
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
