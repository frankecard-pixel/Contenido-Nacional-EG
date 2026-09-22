import React from 'react';
import StatCard from '../../StatCard';

interface CommunityStatsProps {
  totalInvestment: number;
  activeProjects: number;
}

const CommunityStats: React.FC<CommunityStatsProps> = ({ totalInvestment, activeProjects }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-12 md:mb-16">
      <StatCard label="Inversión Social Total" value={`$${(totalInvestment / 1000000).toFixed(1)}M`} />
      <StatCard label="Proyectos en Curso" value={activeProjects.toString()} />
      <StatCard label="Beneficiarios Directos" value="15k+" />
      <StatCard label="Cobertura Nacional" value="100%" color="bg-blue-600 dark:bg-blue-700" textColor="text-white" />
    </div>
  );
};

export default CommunityStats;
