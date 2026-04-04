import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getContracts } from '../services/supabaseApi';
import { Contract } from '../types';
import ContractManagementHeader from '../components/public/contract-management/ContractManagementHeader';
import ContractManagementStats from '../components/public/contract-management/ContractManagementStats';
import ContractManagementSidebar from '../components/public/contract-management/ContractManagementSidebar';
import ContractManagementDetail from '../components/public/contract-management/ContractManagementDetail';
import ContractManagementGeneralTab from '../components/public/contract-management/ContractManagementGeneralTab';

const ContractManagement: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('General');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const data = await getContracts();
        setContracts(data as any[]);
        if (data && data.length > 0) {
          setSelectedId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching contracts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  const selectedContract = useMemo(() => 
    contracts.find(c => c.id === selectedId) || contracts[0]
  , [selectedId, contracts]);

  const filteredContracts = useMemo(() => 
    contracts.filter(c => 
      (c.title?.es || c.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (c.ref || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.company?.name || c.awardedTo || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  , [searchQuery, contracts]);

  const tabs = ['General', 'Documentos', 'Hitos y Pagos', 'Cumplimiento'];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'execution': return 'bg-green-100 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getMilestoneStyle = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700';
      case 'pending': return 'bg-yellow-50 text-yellow-700';
      case 'overdue': return 'bg-red-50 text-red-700';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!selectedContract) {
    return (
      <div className="p-8 text-center opacity-50">
        <p>No se encontraron contratos registrados.</p>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <ContractManagementHeader />
        <button 
          onClick={() => navigate('/dashboard/super_admin/contracts/new')}
          className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-xl">add_circle</span>
          Registrar Contrato
        </button>
      </header>
      <ContractManagementStats />

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <ContractManagementSidebar 
          contracts={filteredContracts}
          selectedId={selectedId}
          onSelect={setSelectedId}
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />

        <ContractManagementDetail
          selectedContract={selectedContract}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
          getStatusStyle={getStatusStyle}
        >
          {activeTab === 'General' ? (
            <ContractManagementGeneralTab 
              selectedContract={selectedContract}
              getMilestoneStyle={getMilestoneStyle}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-32 opacity-30 grayscale animate-in fade-in duration-500">
              <span className="material-symbols-outlined text-8xl mb-6">construction</span>
              <p className="text-sm font-medium uppercase tracking-[0.3em]">Sección en desarrollo administrativo</p>
            </div>
          )}
        </ContractManagementDetail>
      </section>

      <footer className="text-center py-10 opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">Dirección de Contenido Nacional de Guinea Ecuatorial o DCN-GE • Ministerio de Hidrocarburos y Desarrollo Minero</p>
      </footer>
    </div>
  );
};

export default ContractManagement;