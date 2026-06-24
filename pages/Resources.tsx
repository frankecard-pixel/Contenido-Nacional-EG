
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResourcesFilters from '../components/public/resources/ResourcesFilters';
import ResourcesLegal from '../components/public/resources/ResourcesLegal';
import ResourcesVideos from '../components/public/resources/ResourcesVideos';
import ResourcesAgenda from '../components/public/resources/ResourcesAgenda';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';

const Resources: React.FC = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState('Todo');

  const filters = ['Todo', 'Marco Legal', 'Guías de Usuario', 'Video Academy', 'Agenda'];

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark pb-24 animate-in fade-in duration-700">
      <PublicBanner 
        title="Centro de Recursos" 
        subtitle="Acceda a la base documental, marco legal y material multimedia del Contenido Nacional."
        category="Biblioteca"
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop"
      />
      <div className="max-w-[var(--layout-max-width)] mx-auto px-6 lg:px-10 relative z-50 -mt-16 mb-12">
        <MinisterialCertification />
      </div>
      <div className="max-w-[var(--layout-max-width)] mx-auto flex flex-col gap-10 mt-20 px-6 lg:px-10">
        <ResourcesFilters 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter} 
          filters={filters} 
        />

        {(activeFilter === 'Todo' || activeFilter === 'Marco Legal') && (
          <ResourcesLegal />
        )}

        {(activeFilter === 'Todo' || activeFilter === 'Video Academy') && (
          <ResourcesVideos />
        )}

        {(activeFilter === 'Todo' || activeFilter === 'Agenda') && (
          <ResourcesAgenda />
        )}

        {/* Bottom CTA / Footer Placeholder */}
        <section className="mt-10 py-16 border-t border-slate-100 dark:border-slate-800 text-center opacity-40">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
            © 2024 Ministerio de Hidrocarburos, Minas y Electricidad de Guinea Ecuatorial
          </p>
        </section>
      </div>
    </div>
  );
};

export default Resources;
