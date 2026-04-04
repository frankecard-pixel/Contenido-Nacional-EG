
import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getApplications } from '../services/supabaseApi';
import { ApplicationExt } from '../types';
import ApplicationsTrackingHeader from '../components/public/applications-tracking/ApplicationsTrackingHeader';
import ApplicationsTrackingStats from '../components/public/applications-tracking/ApplicationsTrackingStats';
import ApplicationsTrackingFilters from '../components/public/applications-tracking/ApplicationsTrackingFilters';
import ApplicationsTrackingItem from '../components/public/applications-tracking/ApplicationsTrackingItem';

const ApplicationsTracking: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [applications, setApplications] = useState<ApplicationExt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await getApplications();
        const mappedApps: ApplicationExt[] = (data as any[]).map(app => ({
          ...app,
          projectName: app.opportunity ? (app.opportunity.title[i18n.language] || app.opportunity.title.es || app.opportunity.title) : 'Proyecto Desconocido',
          submittedAt: new Date(app.submitted_at).toLocaleDateString(),
          actionRequired: app.status === 'action_required',
          step: app.step || 1,
          ministerComment: app.minister_comment
        }));
        setApplications(mappedApps);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [i18n.language]);

  const stats = {
    total: applications.length,
    review: applications.filter(a => a.status === 'under_review').length,
    action: applications.filter(a => a.actionRequired).length,
    awarded: applications.filter(a => a.status === 'awarded').length,
  };

  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const matchesFilter = 
        filter === 'all' || 
        (filter === 'review' && app.status === 'under_review') ||
        (filter === 'action' && app.actionRequired) ||
        (filter === 'awarded' && app.status === 'awarded');
      
      const matchesSearch = app.projectName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (app.ref || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery, applications]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 space-y-12 animate-in fade-in duration-700">
      <ApplicationsTrackingHeader />

      <ApplicationsTrackingStats stats={stats} />

      <ApplicationsTrackingFilters 
        filter={filter} 
        setFilter={setFilter} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      <section className="flex flex-col gap-10">
        {filteredApps.map((app) => (
          <ApplicationsTrackingItem key={app.id} app={app} />
        ))}
      </section>

      {/* Footer Info */}
      <footer className="text-center py-10 opacity-40">
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-slate-400">Dirección General de Contenido Nacional • Guinea Ecuatorial</p>
      </footer>
    </div>
  );
};

export default ApplicationsTracking;
