import React from 'react';
import StatCard from '../../StatCard';

interface CommunityStatsProps {
  totalInvestment: number;
  activeProjects: number;
}

const CommunityStats: React.FC<CommunityStatsProps> = ({ totalInvestment, activeProjects }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
      <StatCard label="Inversión Social Total" value={`$${(totalInvestment / 1000000).toFixed(1)}M`} />
      <StatCard label="Proyectos en Curso" value={activeProjects.toString()} />
      <StatCard label="Beneficiarios Directos" value="15k+" />
      <StatCard label="Cobertura Nacional" value="100%" color="bg-emerald-600" textColor="text-white" />
    </div>
  );
};

export default CommunityStats;
