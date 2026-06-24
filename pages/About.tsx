
import React from 'react';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';
import AboutMinisterProfile from '../components/public/about/AboutMinisterProfile';
import AboutFramework from '../components/public/about/AboutFramework';
import AboutDirectorProfile from '../components/public/about/AboutDirectorProfile';
import AboutMinistryCommitment from '../components/public/about/AboutMinistryCommitment';

const About: React.FC = () => {
  return (
    <div className="pb-24 bg-white overflow-x-hidden w-full">
      <PublicBanner 
        title="Sobre el Contenido Nacional" 
        subtitle="Conozca nuestra misión, visión y el marco institucional que rige el desarrollo del sector en Guinea Ecuatorial."
        category="Institución"
        image="https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070&auto=format&fit=crop"
        pageKey="about"
      />
      <div className="mx-auto px-4 md:px-6 relative z-50 -mt-16 mb-12" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <MinisterialCertification />
      </div>
      <div className="mx-auto px-4 md:px-6 mt-12 md:mt-20" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <AboutMinisterProfile />
        <AboutFramework />
        <AboutDirectorProfile />
        <AboutMinistryCommitment />
      </div>
    </div>
  );
};

export default About;
