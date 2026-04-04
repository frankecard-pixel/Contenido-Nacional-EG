
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getAuditLogs, getCompanies, getOpportunities } from '../services/supabaseApi';
import AuditReportsHeader from '../components/admin/audit/AuditReportsHeader';
import AuditReportsStats from '../components/admin/audit/AuditReportsStats';
import AuditReportsCharts from '../components/admin/audit/AuditReportsCharts';
import AuditReportsTable from '../components/admin/audit/AuditReportsTable';

const AuditReports: React.FC = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [companiesCount, setCompaniesCount] = useState(0);
  const [oppsCount, setOppsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsData, companiesData, oppsData] = await Promise.all([
          getAuditLogs(),
          getCompanies(),
          getOpportunities()
        ]);
        setLogs(logsData as any[]);
        setCompaniesCount(companiesData.length);
        setOppsCount(oppsData.length);
      } catch (error) {
        console.error("Error fetching audit data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: "Empresas Registradas", val: companiesCount.toLocaleString(), icon: "domain", trend: "+12% vs mes anterior", trendColor: "text-green-600" },
    { label: "Oportunidades Activas", val: oppsCount.toLocaleString(), icon: "work", trend: "+5% esta semana", trendColor: "text-green-600" },
    { label: "Tasa de Cumplimiento", val: "92%", icon: "verified_user", trend: "+2% mejora anual", trendColor: "text-green-600" },
    { label: "Acciones Pendientes", val: logs.filter(l => l.status === 'pending').length.toString(), icon: "pending_actions", trend: "Requieren atención", trendColor: "text-red-500" }
  ];

  const chartData = [
    { name: 'Ene', value: 40 }, { name: 'Feb', value: 55 }, { name: 'Mar', value: 30 },
    { name: 'Abr', value: 70 }, { name: 'May', value: 85 }, { name: 'Jun', value: 120 },
    { name: 'Jul', value: 65 }, { name: 'Ago', value: 75 }, { name: 'Sep', value: 45 },
    { name: 'Oct', value: 95 }, { name: 'Nov', value: 60 }, { name: 'Dic', value: 80 }
  ];

  const categoryData = [
    { label: "Logística", val: 45, color: "bg-blue-600" },
    { label: "Ingeniería", val: 28, color: "bg-indigo-400" },
    { label: "Recursos Humanos", val: 15, color: "bg-sky-400" },
    { label: "Tecnología IT", val: 12, color: "bg-slate-300" }
  ];

  const filteredLogs = useMemo(() => {
    return logs.map(log => ({
      id: log.id,
      userName: log.user?.name || 'Sistema',
      userRole: log.user?.role || 'System',
      action: log.action,
      entityId: log.entity_id || log.entityId || '-',
      timestamp: new Date(log.timestamp).toLocaleString(),
      status: log.status
    })).filter(log => 
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, logs]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      <AuditReportsHeader />
      <AuditReportsStats stats={stats} />
      <AuditReportsCharts chartData={chartData} categoryData={categoryData} />
      <AuditReportsTable 
        filteredLogs={filteredLogs} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {/* Footer Info */}
      <footer className="text-center py-10 opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">Sistema Central de Inteligencia y Auditoría • MMH Guinea Ecuatorial</p>
      </footer>
    </div>
  );
};

export default AuditReports;
