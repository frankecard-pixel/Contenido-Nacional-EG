
import React from 'react';
import LandingHero from '../components/public/landing/LandingHero';
import LandingStats from '../components/public/landing/LandingStats';
import LandingCategories from '../components/public/landing/LandingCategories';
import LandingFooter from '../components/public/landing/LandingFooter';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <LandingHero />
      <LandingStats />
      <LandingCategories />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
