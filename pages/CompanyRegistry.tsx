
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCompanies, getUsers, updateUser } from '../services/supabaseApi';
import { Company, User } from '../types';
import CompanyRegistryHeader from '../components/admin/CompanyRegistryHeader';
import CompanyRegistryFilters from '../components/admin/CompanyRegistryFilters';
import CompanyRegistryTable from '../components/admin/CompanyRegistryTable';
import CompanyRegistryDetail from '../components/admin/CompanyRegistryDetail';
import CompanyCreateModal from '../components/admin/CompanyCreateModal';

const CompanyRegistry: React.FC = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Perfil');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchRegistryData = async () => {
    try {
      setLoading(true);
      const [companyData, userData] = await Promise.all([
        getCompanies(),
        getUsers()
      ]);
      setCompanies(companyData as any);
      setUsers(userData as any);
    } catch (error) {
      console.error("Error fetching registry data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistryData();
  }, []);

  const handleLinkUser = async (userId: string, companyId: string | null) => {
    try {
      await updateUser(userId, { companyId: companyId || undefined });
      const updatedUsers = await getUsers();
      setUsers(updatedUsers as any);
    } catch (error) {
      console.error("Error linking user to company:", error);
    }
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.rugeId && c.rugeId.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.taxId && c.taxId.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, companies]);

  const selectedCompany = useMemo(() => 
    companies.find(c => c.id === selectedCompanyId) || null
  , [selectedCompanyId, companies]);

  const getStatusBadge = (status: Company['status']) => {
    switch (status) {
      case 'certified':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30">
            <div className="size-1.5 rounded-full bg-emerald-500"></div>
            Activa
          </div>
        );
      case 'pending':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30">
            <div className="size-1.5 rounded-full bg-amber-500 animate-pulse"></div>
            Pendiente
          </div>
        );
      case 'suspended':
      case 'rejected':
        return (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30">
            <div className="size-1.5 rounded-full bg-red-600"></div>
            {status === 'suspended' ? 'Suspendida' : 'Rechazada'}
          </div>
        );
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark overflow-hidden animate-in fade-in duration-700 relative">
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar p-8 lg:p-12 space-y-10 pb-32">
        {/* Page Header */}
        <CompanyRegistryHeader onCreateClick={() => setIsCreateModalOpen(true)} />

        {/* Toolbar */}
        <CompanyRegistryFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Data Table */}
        <CompanyRegistryTable 
          filteredCompanies={filteredCompanies}
          selectedCompanyId={selectedCompanyId}
          setSelectedCompanyId={setSelectedCompanyId}
          getStatusBadge={getStatusBadge}
          totalCompanies={companies.length}
        />

        {/* Footer info */}
        <footer className="text-center opacity-30">
           <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">Ministerio de Hidrocarburos, Minas y Electricidad • Registro RUGE • 2024</p>
        </footer>
      </main>

      {/* Detail Drawer Overlay */}
      {selectedCompany && (
        <CompanyRegistryDetail 
          selectedCompany={selectedCompany}
          setSelectedCompanyId={setSelectedCompanyId}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          getStatusBadge={getStatusBadge}
          users={users}
          onLinkUser={handleLinkUser}
        />
      )}

      {/* Create Modal */}
      <CompanyCreateModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        users={users}
        onCompanyCreated={fetchRegistryData}
      />
    </div>
  );
};

export default CompanyRegistry;
