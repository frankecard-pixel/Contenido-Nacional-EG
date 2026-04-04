
import React from 'react';
import ContactForm from '../components/public/contact/ContactForm';
import ContactSidebar from '../components/public/contact/ContactSidebar';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';

const Contact: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen pb-32 animate-in fade-in duration-700">
      <PublicBanner 
        title="Atención al Ciudadano" 
        subtitle="Estamos a su disposición para resolver cualquier duda sobre el Contenido Nacional y sus procesos."
        category="Contacto"
        image="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2070&auto=format&fit=crop"
      />
      <div className="max-w-[var(--layout-max-width)] mx-auto px-6 lg:px-10 relative z-50 -mt-16 mb-12">
        <MinisterialCertification />
      </div>
      <div className="max-w-[var(--layout-max-width)] mx-auto px-6 lg:px-10 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <ContactForm />
          <ContactSidebar />
        </div>

        {/* Bottom Logo Info */}
        <div className="mt-32 pt-16 border-t border-slate-100 dark:border-slate-800 text-center opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">
            Dirección General de Contenido Nacional • MMH Guinea Ecuatorial
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
