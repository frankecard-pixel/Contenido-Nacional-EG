
import React from 'react';
import { useTranslation } from 'react-i18next';
import SectorStatsMetrics from '../components/public/sector-stats/SectorStatsMetrics';
import SectorStatsCharts from '../components/public/sector-stats/SectorStatsCharts';
import SectorStatsEmployment from '../components/public/sector-stats/SectorStatsEmployment';
import PublicBanner from '../components/public/PublicBanner';
import MinisterialCertification from '../components/public/MinisterialCertification';

const SectorStats: React.FC = () => {
  const { t } = useTranslation();

  const investmentData = [
    { year: '2019', local: 400, total: 1200 },
    { year: '2020', local: 300, total: 1100 },
    { year: '2021', local: 600, total: 1500 },
    { year: '2022', local: 850, total: 1800 },
    { year: '2023', local: 920, total: 1950 },
    { year: '2024', local: 1100, total: 2200 },
  ];

  const complianceData = [
    { name: 'ExxonMobil', score: 95 },
    { name: 'Marathon', score: 92 },
    { name: 'Chevron', score: 88 },
    { name: 'TotalEnergies', score: 94 },
    { name: 'Noble', score: 85 },
    { name: 'Trident', score: 89 },
  ];

  const employmentData = [
    { month: 'Ene', nacionals: 7200, expats: 2100 },
    { month: 'Mar', nacionals: 7500, expats: 2000 },
    { month: 'May', nacionals: 7800, expats: 1900 },
    { month: 'Jul', nacionals: 8100, expats: 1850 },
    { month: 'Sep', nacionals: 8400, expats: 1800 },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-32">
      <PublicBanner 
        title="Estadísticas del Sector" 
        subtitle="Monitoreo en tiempo real del impacto económico y social del Contenido Nacional en Guinea Ecuatorial."
        category="Transparencia"
        image="https://images.unsplash.com/photo-1551288049-bbbda5366391?q=80&w=2070&auto=format&fit=crop"
      />
      <div className="max-w-[var(--layout-max-width)] mx-auto px-10 relative z-50 -mt-16 mb-12">
        <MinisterialCertification />
      </div>
      <div className="max-w-[var(--layout-max-width)] mx-auto px-10 mt-20">
        <SectorStatsMetrics />
        <SectorStatsCharts investmentData={investmentData} complianceData={complianceData} />
        <SectorStatsEmployment employmentData={employmentData} />
      </div>
    </div>
  );
};

export default SectorStats;
