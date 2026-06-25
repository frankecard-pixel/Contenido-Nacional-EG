
import React from 'react';
import HomeHero from '../components/public/home/HomeHero';
import HomeStats from '../components/public/home/HomeStats';
import MinisterialCertification from '../components/public/MinisterialCertification';
import HomeHowItWorks from '../components/public/home/HomeHowItWorks';
import HomeInteractive from '../components/public/home/HomeInteractive';
import HomeNews from '../components/public/home/HomeNews';
import HomeCategories from '../components/public/home/HomeCategories';
import HomeLatestOpportunities from '../components/public/home/HomeLatestOpportunities';
import HomeGallery from '../components/public/home/HomeGallery';
import HomeSuccessStories from '../components/public/home/HomeSuccessStories';
import HomeCTA from '../components/public/home/HomeCTA';
import { PublicAdSpace } from '../components/public/PublicAdSpace';

const Home: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <HomeHero />
      
      <HomeStats />

      <div className="mx-auto px-6 py-4" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <PublicAdSpace format="top_banner" />
      </div>

      <HomeHowItWorks />
      <HomeInteractive />
      <HomeNews />
      <HomeCategories />
      <HomeLatestOpportunities />
      <HomeGallery />
      <HomeSuccessStories />

      <div className="mx-auto px-6 py-8" style={{ maxWidth: 'var(--layout-max-width)' }}>
        <PublicAdSpace format="footer_banner" />
      </div>

      <HomeCTA />
    </div>
  );
};


export default Home;
