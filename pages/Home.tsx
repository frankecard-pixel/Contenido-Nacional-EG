
import React from 'react';
import HomeHero from '../components/public/home/HomeHero';
import HomeStats from '../components/public/home/HomeStats';
import MinisterialCertification from '../components/public/MinisterialCertification';
import HomeHowItWorks from '../components/public/home/HomeHowItWorks';
import HomeInteractive from '../components/public/home/HomeInteractive';
import HomeNews from '../components/public/home/HomeNews';
import HomeCategories from '../components/public/home/HomeCategories';
import HomeLatestOpportunities from '../components/public/home/HomeLatestOpportunities';
import HomeSuccessStories from '../components/public/home/HomeSuccessStories';
import HomeCTA from '../components/public/home/HomeCTA';

const Home: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <HomeHero />
      
      <HomeStats />
      <HomeHowItWorks />
      <HomeInteractive />
      <HomeNews />
      <HomeCategories />
      <HomeLatestOpportunities />
      <HomeSuccessStories />
      <HomeCTA />
    </div>
  );
};

export default Home;
