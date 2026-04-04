
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getDocuments } from '../services/supabaseApi';
import { CompanyDocument } from '../types';
import DocumentManagementHeader from '../components/public/document-management/DocumentManagementHeader';
import DocumentManagementStats from '../components/public/document-management/DocumentManagementStats';
import DocumentManagementToolbar from '../components/public/document-management/DocumentManagementToolbar';
import DocumentManagementTable from '../components/public/document-management/DocumentManagementTable';

const DocumentManagement: React.FC = () => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await getDocuments();
        setDocuments(data as any[]);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const categories = ['Todos', 'Legal', 'Financiero', 'Técnico', 'Seguros'];
  const statuses = ['Todos', 'Aprobado', 'Pendiente', 'Rechazado', 'Expirado'];

  const stats = useMemo(() => ({
    approved: documents.filter(d => d.status === 'approved').length,
    pending: documents.filter(d => d.status === 'pending').length,
    rejected: documents.filter(d => d.status === 'rejected').length,
    expired: documents.filter(d => d.status === 'expired').length,
    complianceScore: 85
  }), [documents]);

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const catMatch = filter === 'Todos' || doc.category === filter;
      const statusMatch = statusFilter === 'Todos' || 
        (statusFilter === 'Aprobado' && doc.status === 'approved') ||
        (statusFilter === 'Pendiente' && doc.status === 'pending') ||
        (statusFilter === 'Rechazado' && doc.status === 'rejected') ||
        (statusFilter === 'Expirado' && doc.status === 'expired');
      return catMatch && statusMatch;
    });
  }, [filter, statusFilter, documents]);

  const getStatusBadge = (status: CompanyDocument['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30">
            <span className="size-1.5 rounded-full bg-emerald-500"></span>
            Aprobado
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/30">
            <span className="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Pendiente
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-700 border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30">
            <span className="size-1.5 rounded-full bg-red-500"></span>
            Rechazado
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700">
            <span className="size-1.5 rounded-full bg-slate-500"></span>
            Expirado
          </span>
        );
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      <DocumentManagementHeader />

      <DocumentManagementStats stats={stats} />

      <DocumentManagementToolbar 
        categories={categories}
        filter={filter}
        setFilter={setFilter}
        statuses={statuses}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <DocumentManagementTable 
        filteredDocs={filteredDocs}
        totalDocs={documents.length}
        getStatusBadge={getStatusBadge}
      />

      {/* Info Footer */}
      <footer className="text-center py-10 opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">Sistema de Gestión de Cumplimiento Normativo • MMH</p>
      </footer>
    </div>
  );
};

export default DocumentManagement;
